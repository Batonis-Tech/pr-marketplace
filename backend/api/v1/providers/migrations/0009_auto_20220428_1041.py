# Generated by Django 3.1.7 on 2022-04-28 10:41

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('providers', '0008_auto_20220412_1819'),
    ]

    operations = [
        migrations.AlterField(
            model_name='provider',
            name='is_active',
            field=models.BooleanField(default=False),
        ),
    ]
