# Generated by Django 3.1.7 on 2022-04-12 18:19

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('billing', '0007_auto_20220412_1142'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='balancechangingrequest',
            options={'verbose_name': 'Запрос на изменение баланса', 'verbose_name_plural': 'Запросы на изменение баланса'},
        ),
        migrations.AlterModelOptions(
            name='transaction',
            options={'verbose_name': 'Транзакция', 'verbose_name_plural': 'Транзакции'},
        ),
    ]
