# Generated by Django 3.1.7 on 2022-04-05 11:02

from django.db import migrations, models
import uuid


class Migration(migrations.Migration):

    dependencies = [
        ('chats', '0007_auto_20220404_1125'),
    ]

    operations = [
        migrations.AlterField(
            model_name='chat',
            name='name',
            field=models.TextField(default=uuid.UUID('af831fa5-f3da-4597-a260-777c77284b67'), unique=True),
        ),
    ]
