import uuid
from decimal import Decimal

from django.core.exceptions import ValidationError
from django.db import models
from django.db.models.signals import post_save, pre_save
from django.dispatch import receiver
from django_quill.fields import QuillField
from djmoney.models.fields import MoneyField
from Backend.celery import app
from api.v1.billing.constants import ORDER_PAYMENT, FROZEN
from api.v1.billing.models import BillingAccount, Transaction, TransactionBlock
from api.v1.providers.models import Provider
from api.v1.users.models import User
from stream_chat import StreamChat

from django.utils.translation import gettext_lazy as _

from utils.chats.models import Chat, ChatMember

CURRENCY_CHOICES = (
        # ('EUR', 'EUR'),
        # ('USD', 'USD'),
        ('RUB', 'RUB'),
    )
CURRENCY_DEFAULT = 'RUB'

class ProductType(models.Model):
    name = models.CharField(max_length=1000, verbose_name='Название')

    def __str__(self):
        return f'{self.name}'

    class Meta:
        verbose_name = "Формат публикации"
        verbose_name_plural = "Форматы публикаций"


class Product(models.Model):
    type = models.ForeignKey(ProductType, on_delete=models.CASCADE, verbose_name='Тип')
    provider = models.ForeignKey(Provider, on_delete=models.CASCADE, related_name='products', verbose_name='СМИ')
    price = MoneyField(decimal_places=2, max_digits=8,
                       currency_choices=CURRENCY_CHOICES,
                       default_currency=CURRENCY_DEFAULT, verbose_name='Цена')
    is_active = models.BooleanField(default=True, verbose_name='Активно')

    def __str__(self):
        return f'{self.provider.name} {self.type.name} {self.price}'

    class Meta:
        verbose_name = "Товар"
        verbose_name_plural = "Товары"


class ProductAdditionalOption(models.Model):
    product = models.ForeignKey(Product, related_name='order_items', on_delete=models.CASCADE, verbose_name='Продукт')
    name = models.CharField(max_length=1000, verbose_name='Название')
    price = MoneyField(decimal_places=2, max_digits=8,
                       currency_choices=CURRENCY_CHOICES,
                       default_currency=CURRENCY_DEFAULT, verbose_name='Цена')
    is_active = models.BooleanField(default=True, verbose_name='Активно')

    def __str__(self):
        return f'{self.name}'

    # def get_cost(self):
    #     return self.product.price * self.quantity

    # class Meta:
    #     unique_together = ('order', 'product',)

    # def clean(self):
    #     provider = self.product.provider
    #     other_providers_items = OrderItem.objects.filter(order=self.order).exclude(product__provider=provider)
    #     if other_providers_items:
    #         raise ValidationError(_(f'You cant add product with provider different from {other_providers_items.first().product.provider}'))


class Order(models.Model):

    class Statuses(models.TextChoices):
        PAID = 'Оплачено'
        AWAITING_PAYMENT = 'Ожидает оплаты'
        CANCELED = 'Отменен'
        REJECTED = 'Отклонен'
        IN_PROGRESS = 'Принят в работу'
        PUBLISHED = 'Опубликован'
        DONE = 'Завершен'
        REVIEW_WAITING = 'Ожидает согласования'
        PUBLISH_WAITING = 'Ожидает публикации'

    user = models.ForeignKey(User, on_delete=models.CASCADE, null=False, verbose_name='Заказчик')
    provider = models.ForeignKey(Provider, on_delete=models.CASCADE, null=True, verbose_name='СМИ')
    product = models.ForeignKey(Product, on_delete=models.CASCADE, null=True, blank=False, verbose_name='Заказано')
    created = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)
    payment = models.ForeignKey(Transaction, null=True, blank=True, on_delete=models.SET_NULL)
    blocking = models.ForeignKey(TransactionBlock, null=True, blank=True, on_delete=models.SET_NULL)
    executor_payment = models.ForeignKey(Transaction, null=True, blank=True, on_delete=models.SET_NULL, related_name='executor_payment')
    status = models.CharField(
        max_length=100,
        choices=Statuses.choices,
        default=Statuses.AWAITING_PAYMENT,
        verbose_name='Статус'
    )
    publication_url = models.URLField(null=True, blank=True, verbose_name='Ссылка на публикацию')
    quill_task = QuillField(null=True, verbose_name='Задание')
    quill_solution = QuillField(null=True, verbose_name='Текст публикации')

    class Meta:
        ordering = ('-created',)
        verbose_name = 'Заказ'
        verbose_name_plural = 'Заказы'
        app_label = 'products'

    def __str__(self):
        return 'Order {}'.format(self.id)

    @classmethod
    def get_order_by_transaction(cls, transaction):
        if transaction.type == ORDER_PAYMENT:
            try:
                if transaction.amount.amount > 0:
                    return Order.objects.get(executor_payment=transaction)
                if transaction.amount.amount < 0:
                    return Order.objects.get(payment=transaction)
            except Order.DoesNotExist:
                pass
        if transaction.type == FROZEN:
            try:
                blocking = TransactionBlock.objects.get(transaction=transaction)
                return Order.objects.get(blocking=blocking)
            except Order.DoesNotExist:
                pass
            except TransactionBlock.DoesNotExist:
                pass
        return None

    @property
    def total_cost(self):
        return sum(item.get_cost() for item in self.additional_items.all()) + self.product.price

    def set_status(self, status):
        self.status = status
        self.save()
        app.send_task('api.v1.products.tasks.send_order_status_update_user_notification', args=[
            self.user.email,
            self.id
        ])
        app.send_task('api.v1.products.tasks.send_order_status_update_executor_notification', args=[
            self.provider.user.email,
            self.id
        ])

    def pay(self):
        if self.status == self.Statuses.AWAITING_PAYMENT:
            billing_account = BillingAccount.get_account_by_user(self.user)
            try:
                self.payment = billing_account.withdraw(self.total_cost, FROZEN)
                self.set_status(self.Statuses.PAID)
                self.save()
                self.blocking = TransactionBlock.objects.create(transaction=self.payment)
                self.save()
                return True
            except BillingAccount.BillingException:
                return False

    def cancel(self):
        if self.status in [self.Statuses.PAID, self.Statuses.AWAITING_PAYMENT, ]:
            if self.blocking:
                self.blocking.delete()
                self.save()
            self.set_status(self.Statuses.CANCELED)
            return True
        return False

    def reject(self):
        if self.status in [self.Statuses.PAID, self.Statuses.AWAITING_PAYMENT, self.Statuses.IN_PROGRESS]:
            if self.blocking:
                self.blocking.delete()
                self.save()
            self.set_status(self.Statuses.CANCELED)
            return True
        return False

    def start(self):
        if self.status in [self.Statuses.PAID, self.Statuses.AWAITING_PAYMENT, self.Statuses.REVIEW_WAITING, ]:
            self.set_status(self.Statuses.IN_PROGRESS)
            return True
        return False

    def review(self):
        if self.status in [self.Statuses.REVIEW_WAITING, ]:
            self.set_status(self.Statuses.PUBLISH_WAITING)
            return True
        return False

    def to_check(self):
        if self.status in [self.Statuses.IN_PROGRESS, ]:
            self.set_status(self.Statuses.REVIEW_WAITING)
            self.save()
            return True
        return False

    def close(self):
        if self.status in [self.Statuses.PUBLISHED, ]:
            # if self.provider.user:
            # billing_account = BillingAccount.get_account_by_provider(self.provider)
            self.save()
            amount = self.payment.amount
            self.blocking.delete()
            self.blocking = None
            self.save()
            BillingAccount.get_account_by_user(self.user).withdraw(amount, transaction_type=ORDER_PAYMENT)
            self.executor_payment = BillingAccount.get_account_by_provider(self.provider)\
                .recieve(-amount, transaction_type=ORDER_PAYMENT)
            self.save()
            self.set_status(self.Statuses.DONE)
            self.save()
            return True
        return False

@receiver(post_save, sender=Order, dispatch_uid="update_order")
def update_chat(sender, instance, **kwargs):
    if not Chat.objects.filter(order=instance).exists():
        chat = Chat.objects.create(order=instance, name=uuid.uuid4())
        ChatMember.objects.create(user=instance.user, chat=chat)
        if not instance.user == instance.provider.user:
            ChatMember.objects.create(user=instance.provider.user, chat=chat)

@receiver(post_save, sender=Order)
def update_statuses(sender, instance, **kwargs):

    # if not instance.quill_solution == None and instance.status == Order.Statuses.IN_PROGRESS:
    #     instance.status = Order.Statuses.REVIEW_WAITING
    #     instance.save()

    if instance.publication_url and instance.status == Order.Statuses.PUBLISH_WAITING:
        instance.set_status(Order.Statuses.PUBLISHED)
        instance.save()

# @receiver(post_save, sender=Order)
# def pay_for_order(sender, instance, **kwargs):
#     instance.pay()



# class OrderItem(models.Model):
#     order = models.ForeignKey(Order, related_name='items', on_delete=models.CASCADE)
#     product = models.ForeignKey(Product, related_name='order_items', on_delete=models.CASCADE)
#     quantity = models.PositiveIntegerField(default=1)
#
#     def __str__(self):
#         return '{}'.format(self.id)
#
#     def get_cost(self):
#         return self.product.price * self.quantity
#
#     class Meta:
#         unique_together = ('order', 'product',)
#
#     def clean(self):
#         provider = self.product.provider
#         other_providers_items = OrderItem.objects.filter(order=self.order).exclude(product__provider=provider)
#         if other_providers_items:
#             raise ValidationError(_(f'You cant add product with provider different from {other_providers_items.first().product.provider}'))

class OrderAdditionalItem(models.Model):
    order = models.ForeignKey(Order, related_name='additional_items', on_delete=models.CASCADE, verbose_name='Заказ')
    option = models.ForeignKey(ProductAdditionalOption, on_delete=models.CASCADE, null=False, blank=False, verbose_name='Доп.услуга')
    quantity = models.PositiveIntegerField(default=1, verbose_name='Количество')

    def __str__(self):
        return f'{self.option}'

    def get_cost(self):
        return self.option.price * self.quantity

    class Meta:
        unique_together = ('order', 'option',)


class CartItem(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=False)
    product = models.ForeignKey(Product, on_delete=models.CASCADE, null=True, blank=False)
    created = models.DateTimeField(auto_now_add=True)
    quill_task = QuillField(null=True, blank=True)

    class Meta:
        ordering = ('-created',)
        app_label = 'products'

    def __str__(self):
        return 'CartItem {}'.format(self.id)

    def to_order(self):
        order = Order.objects.create(
            quill_task=self.quill_task,
            product=self.product,
            user=self.user,
            provider=self.product.provider
        )
        print(self.options.all())
        for e in self.options.all():
            print(e)
            OrderAdditionalItem.objects.create(
                    order=order,
                    option=e.option,
                    quantity=e.quantity
            )
        order.pay()
        self.delete()

    @property
    def total_cost(self):
        return sum(item.get_cost() for item in self.options.all()) + self.product.price


class CartItemAdditionalItem(models.Model):
    cart_item = models.ForeignKey(CartItem, related_name='options', on_delete=models.CASCADE)
    option = models.ForeignKey(ProductAdditionalOption, on_delete=models.CASCADE, null=False, blank=False)
    quantity = models.PositiveIntegerField(default=1)

    def __str__(self):
        return f'{self.option}'

    def get_cost(self):
        return self.option.price * self.quantity

    class Meta:
        unique_together = ('cart_item', 'option',)

