# Generated by Django 3.1.7 on 2022-05-08 12:39

from django.db import migrations, models
import uuid


class Migration(migrations.Migration):

    dependencies = [
        ('chats', '0026_auto_20220508_1237'),
    ]

    operations = [
        migrations.AlterField(
            model_name='chat',
            name='name',
            field=models.TextField(default=uuid.UUID('b714d49d-b0d2-4f70-8ca2-c10f57a6dcb1'), unique=True, verbose_name='Название'),
        ),
    ]
