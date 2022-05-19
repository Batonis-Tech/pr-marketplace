# Generated by Django 3.1.7 on 2022-05-02 16:16

from decimal import Decimal
from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion
import djmoney.models.fields


class Migration(migrations.Migration):

    dependencies = [
        ('providers', '0009_auto_20220428_1041'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('billing', '0011_auto_20220428_1056'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='billingaccount',
            options={'verbose_name': 'Счет', 'verbose_name_plural': 'Счета'},
        ),
        migrations.AlterField(
            model_name='balancechangingrequest',
            name='type',
            field=models.CharField(choices=[('RECIEVE', 'Recieve'), ('WITHDRAW', 'Withdraw')], default='WITHDRAW', max_length=100, verbose_name='Тип'),
        ),
        migrations.AlterField(
            model_name='billingaccount',
            name='balance',
            field=djmoney.models.fields.MoneyField(decimal_places=2, default=Decimal('0'), default_currency='RUB', max_digits=14, verbose_name='Баланс'),
        ),
        migrations.AlterField(
            model_name='billingaccount',
            name='bank_BIC',
            field=models.CharField(blank=True, max_length=1000, null=True, verbose_name='БИК Банка'),
        ),
        migrations.AlterField(
            model_name='billingaccount',
            name='bank_name',
            field=models.CharField(blank=True, max_length=1000, null=True, verbose_name='Название банка'),
        ),
        migrations.AlterField(
            model_name='billingaccount',
            name='checking_account',
            field=models.CharField(blank=True, max_length=1000, null=True, verbose_name='Расчетный счет'),
        ),
        migrations.AlterField(
            model_name='billingaccount',
            name='correspondent_account_number',
            field=models.CharField(blank=True, max_length=1000, null=True, verbose_name='Корреспондентский адрес счета'),
        ),
        migrations.AlterField(
            model_name='billingaccount',
            name='payee_name',
            field=models.CharField(blank=True, max_length=1000, null=True, verbose_name='Имя плательщика'),
        ),
        migrations.AlterField(
            model_name='billingaccount',
            name='provider',
            field=models.OneToOneField(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='billing_account', to='providers.provider', verbose_name='СМИ-владелец счета'),
        ),
        migrations.AlterField(
            model_name='billingaccount',
            name='tax_number',
            field=models.CharField(blank=True, max_length=1000, null=True, verbose_name='ИНН'),
        ),
        migrations.AlterField(
            model_name='billingaccount',
            name='user',
            field=models.OneToOneField(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='billing_account', to=settings.AUTH_USER_MODEL, verbose_name='Пользователь-владелец счета'),
        ),
        migrations.AlterField(
            model_name='transaction',
            name='account',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='transactions', to='billing.billingaccount', verbose_name='Счет'),
        ),
        migrations.AlterField(
            model_name='transaction',
            name='type',
            field=models.CharField(choices=[('', ''), ('Заморожено', 'Заморожено'), ('Разморожено', 'Разморожено'), ('Оплата', 'Оплата'), ('Вывод средств', 'Вывод средств'), ('Начисление средств', 'Начисление средств'), ('Комиссия', 'Комиссия')], default='', max_length=255, verbose_name='Тип'),
        ),
        migrations.AlterField(
            model_name='transactionblock',
            name='transaction',
            field=models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, to='billing.transaction', verbose_name='Транзакция'),
        ),
    ]