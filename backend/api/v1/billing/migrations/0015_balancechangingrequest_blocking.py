# Generated by Django 3.1.7 on 2022-05-12 11:13

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('billing', '0014_auto_20220511_2110'),
    ]

    operations = [
        migrations.AddField(
            model_name='balancechangingrequest',
            name='blocking',
            field=models.OneToOneField(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='billing.transactionblock'),
        ),
    ]