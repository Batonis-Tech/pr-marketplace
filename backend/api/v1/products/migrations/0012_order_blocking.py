# Generated by Django 3.1.7 on 2022-04-28 10:41

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('billing', '0009_auto_20220428_1041'),
        ('products', '0011_auto_20220420_1353'),
    ]

    operations = [
        migrations.AddField(
            model_name='order',
            name='blocking',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to='billing.transactionblock'),
        ),
    ]