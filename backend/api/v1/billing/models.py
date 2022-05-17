from django.db import models
from django.db.models import Sum
from djmoney.models.fields import MoneyField
from .constants import TRANSACTION_TYPE_CHOICES, EMPTY, UNFROZEN, WITHDRAWAL, COMMISSION, DEPOSIT, FROZEN
from ..users.models import User
from Backend.celery import app
from constance import config


class BillingAccount(models.Model):

    user = models.OneToOneField(
        User,
        related_name='billing_account',
        on_delete=models.CASCADE,
        null=True, blank=True, verbose_name='Пользователь-владелец счета'
    )
    provider = models.OneToOneField('providers.Provider', null=True, blank=True, related_name='billing_account',
                                    on_delete=models.CASCADE, verbose_name='СМИ-владелец счета')
    balance = MoneyField(max_digits=14, decimal_places=2, default=0, default_currency='RUB', verbose_name='Баланс')
    created_at = models.DateTimeField(auto_now_add=True)
    payee_name = models.CharField(null=True, blank=True, max_length=1000, verbose_name='Имя плательщика')
    checking_account = models.CharField(null=True, blank=True, max_length=1000, verbose_name='Расчетный счет')
    bank_BIC = models.CharField(null=True, blank=True, max_length=1000, verbose_name='БИК Банка')
    bank_name = models.CharField(null=True, blank=True, max_length=1000, verbose_name='Название банка')
    correspondent_account_number = models.CharField(null=True, blank=True, max_length=1000, verbose_name='Корреспондентский адрес счета')
    tax_number = models.CharField(null=True, blank=True, max_length=1000, verbose_name='ИНН')

    def __str__(self):
        return f"{self.owner}"

    class BillingException(Exception):
        pass

    class Meta:
        verbose_name = 'Счет'
        verbose_name_plural = 'Счета'
        constraints = [
            models.CheckConstraint(
                name="%(app_label)s_%(class)s_thing1_or_thing2",
                check=(
                        models.Q(user__isnull=True, provider__isnull=False)
                        | models.Q(user__isnull=False, provider__isnull=True)
                ),
            )
        ]


    @staticmethod
    def get_account_by_user(user):
        return BillingAccount.objects.get_or_create(user=user)[0]

    @staticmethod
    def get_account_by_provider(provider):
        return BillingAccount.objects.get_or_create(provider=provider)[0]


    @property
    def owner(self):
        if self.user:
            return self.user
        if self.provider:
            return self.provider

    @property
    def user_owner(self):
        if self.user:
            return self.user
        if self.provider:
            return self.provider.user

    def withdraw(self, amount, transaction_type=EMPTY):
        amount = abs(amount)
        if amount <= self.balance:
            return Transaction.objects.create(account=self, amount=(-amount), type=transaction_type)
        else:
            raise self.BillingException('Not enough money')

    def recieve(self, amount, transaction_type=EMPTY):
        return Transaction.objects.create(account=self, amount=amount, type=transaction_type)


class Transaction(models.Model):
    account = models.ForeignKey(
        BillingAccount,
        related_name='transactions',
        on_delete=models.CASCADE, verbose_name='Счет'
    )
    amount = MoneyField(max_digits=14, decimal_places=2, default_currency='RUB')
    balance_after_transaction = MoneyField(max_digits=14, decimal_places=2, default=0, default_currency='RUB')
    type = models.CharField(
        choices=TRANSACTION_TYPE_CHOICES,
        default=EMPTY,
        max_length=255, verbose_name='Тип'
    )
    # data = models.JSONField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    @property
    def string_type(self):
        return self.get_type_display()

    def save(self, *args, **kwargs):
        self.account.balance += self.amount
        self.account.save()
        self.balance_after_transaction = self.account.balance
        super(Transaction, self).save(*args, **kwargs)

    def delete(self, *args, **kwargs):
        self.account.balance -= self.amount
        self.account.save()
        super(Transaction, self).delete(*args, **kwargs)

    def __str__(self):
        return str(self.account.id)

    class Meta:
        verbose_name = 'Транзакция'
        verbose_name_plural = 'Транзакции'


class TransactionBlock(models.Model):
    transaction = models.OneToOneField(Transaction, on_delete=models.CASCADE, verbose_name='Транзакция')
    # data = models.JSONField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)


    def delete(self, *args, **kwargs):
        Transaction.objects.create(
            account=self.transaction.account,
            amount=-1 * self.transaction.amount,
            type=UNFROZEN
        )
        super(TransactionBlock, self).delete(*args, **kwargs)

    def __str__(self):
        return f"{self.transaction}"

    @classmethod
    def get_freezed_sum(cls):
        return cls.objects.aggregate(Sum('transaction__amount'))

    class Meta:
        verbose_name = 'Блокировка'
        verbose_name_plural = 'Блокировки'


class BalanceChangingRequest(models.Model):
    class Type(models.TextChoices):
        RECIEVE = 'RECIEVE'
        WITHDRAW = 'WITHDRAW'

    billing_account = models.ForeignKey(BillingAccount, on_delete=models.CASCADE,
                                        null=True, blank=True,
                                        verbose_name="Счет")
    type = models.CharField(
        max_length=100,
        choices=Type.choices,
        default=Type.WITHDRAW, verbose_name='Тип'
    )
    amount = MoneyField(max_digits=14, decimal_places=2, default_currency='RUB')
    file = models.FileField(null=True, blank=True, verbose_name="Прикрепленный документ")
    is_closed = models.BooleanField(default=False, verbose_name="Заявка обработана")
    payee_name = models.CharField(null=True, blank=True, max_length=1000, verbose_name='Имя плательщика')
    checking_account = models.CharField(null=True, blank=True, max_length=1000, verbose_name='Расчетный счет')
    bank_BIC = models.CharField(null=True, blank=True, max_length=1000, verbose_name='БИК Банка')
    bank_name = models.CharField(null=True, blank=True, max_length=1000, verbose_name='Название банка')
    correspondent_account_number = models.CharField(null=True, blank=True, max_length=1000,
                                                    verbose_name='Корреспондентский адрес счета')
    tax_number = models.CharField(null=True, blank=True, max_length=1000, verbose_name='ИНН')
    blocking = models.OneToOneField(TransactionBlock, null=True, blank=True, on_delete=models.SET_NULL)

    def __str__(self):
        return f"{self.billing_account} {self.type} {self.amount}"

    def save(self, *args, **kwargs):
        if (self.type == BalanceChangingRequest.Type.RECIEVE and self.amount.amount < 0)\
                or (self.type == BalanceChangingRequest.Type.WITHDRAW and self.amount.amount > 0):
            self.amount = self.amount * -1
        if not self.id:
            print('FIRST CREATION')
            if self.type == BalanceChangingRequest.Type.WITHDRAW:
                frezze_transaction = Transaction.objects.create(
                    account=self.billing_account,
                    amount=self.amount,
                    type=FROZEN
                )
                self.blocking = TransactionBlock.objects.create(transaction=frezze_transaction)
        else:
            print('NOT FIRST CREATION')

        super(BalanceChangingRequest, self).save(*args, **kwargs)

    def confirm(self):
        if not self.is_closed:
            if self.type == BalanceChangingRequest.Type.WITHDRAW:
                amount_to_out = self.amount * (1 - config.COMISSION)
                comission_amount = self.amount - amount_to_out
                blocking = self.blocking
                self.blocking = None
                blocking.delete()
                self.save()
                withdraw_transaction = Transaction.objects.create(account=self.billing_account,
                                                                 amount=amount_to_out,
                                                                 type=WITHDRAWAL)
                comission_transaction = Transaction.objects.create(account=self.billing_account,
                                                                  amount=comission_amount,
                                                                  type=COMMISSION)
                app.send_task('api.v1.billing.tasks.send_withdraw_notification', args=[
                    self.billing_account.user_owner.email,
                    withdraw_transaction.id,
                    comission_transaction.id
                ])
                self.is_closed = True
                self.save()
                return True, "Успешно"

            if self.type == BalanceChangingRequest.Type.RECIEVE:
                transaction = Transaction.objects.create(account=self.billing_account, amount=self.amount, type=DEPOSIT)
                self.is_closed = True
                self.save()
                app.send_task('api.v1.billing.tasks.send_recieve_notification', args=[
                    self.billing_account.user_owner.email,
                    transaction.id
                ])
                return True, "Успешно"
        return False, "Заявка уже закрыта"

    def cancel(self):
        if not self.is_closed:
            self.is_closed = True
            self.save()
            blocking = self.blocking
            self.blocking = None
            blocking.delete()
            self.save()
            return True, "Отменена"
        return False, "Заявка уже закрыта"

    @classmethod
    def get_withdraw_sum(cls):
        return cls.objects.filter(type=cls.Type.WITHDRAW).aggregate(Sum('amount'))

    @classmethod
    def get_recieve_sum(cls):
        return cls.objects.filter(type=cls.Type.RECIEVE).aggregate(Sum('amount'))

    class Meta:
        verbose_name = 'Запрос на изменение баланса'
        verbose_name_plural = 'Запросы на изменение баланса'