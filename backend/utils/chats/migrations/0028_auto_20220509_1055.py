# Generated by Django 3.1.7 on 2022-05-09 10:55

from django.db import migrations, models
import uuid


class Migration(migrations.Migration):

    dependencies = [
        ('chats', '0027_auto_20220508_1239'),
    ]

    operations = [
        migrations.AlterField(
            model_name='chat',
            name='name',
            field=models.TextField(default=uuid.UUID('5d02c1d3-1c96-4879-9642-0fdbb6409837'), unique=True, verbose_name='Название'),
        ),
    ]