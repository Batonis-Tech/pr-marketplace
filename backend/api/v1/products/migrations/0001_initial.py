# Generated by Django 3.1.7 on 2022-03-29 14:37

from django.db import migrations, models
import django.db.models.deletion
import djmoney.models.fields


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('providers', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='ProductType',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=1000)),
            ],
        ),
        migrations.CreateModel(
            name='Product',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('price_currency', djmoney.models.fields.CurrencyField(choices=[('EUR', 'EUR'), ('USD', 'USD'), ('RUB', 'RUB')], default='RUB', editable=False, max_length=3)),
                ('price', djmoney.models.fields.MoneyField(currency_choices=(('EUR', 'EUR'), ('USD', 'USD'), ('RUB', 'RUB')), decimal_places=2, default_currency='RUB', max_digits=8)),
                ('provider', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='products', to='providers.provider')),
                ('type', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='products.producttype')),
            ],
        ),
    ]
