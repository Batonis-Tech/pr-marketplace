# Generated by Django 3.1.7 on 2022-03-30 11:25

from django.db import migrations, models
import django.db.models.deletion
import djmoney.models.fields


class Migration(migrations.Migration):

    dependencies = [
        ('products', '0003_auto_20220330_0945'),
    ]

    operations = [
        migrations.CreateModel(
            name='OrderAdditionalItem',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('quantity', models.PositiveIntegerField(default=1)),
            ],
        ),
        migrations.CreateModel(
            name='ProductAdditionalOption',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=1000)),
                ('price_currency', djmoney.models.fields.CurrencyField(choices=[('RUB', 'RUB')], default='RUB', editable=False, max_length=3)),
                ('price', djmoney.models.fields.MoneyField(currency_choices=(('RUB', 'RUB'),), decimal_places=2, default_currency='RUB', max_digits=8)),
                ('product', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='order_items', to='products.product')),
            ],
        ),
        migrations.AddField(
            model_name='order',
            name='closed',
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name='order',
            name='product',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='products.product'),
        ),
        migrations.DeleteModel(
            name='OrderItem',
        ),
        migrations.AddField(
            model_name='orderadditionalitem',
            name='option',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='products.productadditionaloption'),
        ),
        migrations.AddField(
            model_name='orderadditionalitem',
            name='order',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='additional_items', to='products.order'),
        ),
    ]
