# Generated by Django 3.1.7 on 2022-04-11 09:52

from django.db import migrations, models
import uuid


class Migration(migrations.Migration):

    dependencies = [
        ('chats', '0013_auto_20220411_0950'),
    ]

    operations = [
        migrations.AlterField(
            model_name='chat',
            name='name',
            field=models.TextField(default=uuid.UUID('3c72bb86-05c4-4058-ac24-dc46e9b3dd60'), unique=True),
        ),
    ]
