# Generated by Django 3.1.7 on 2022-04-12 18:19

from django.db import migrations, models
import uuid


class Migration(migrations.Migration):

    dependencies = [
        ('chats', '0016_auto_20220412_1217'),
    ]

    operations = [
        migrations.AlterField(
            model_name='chat',
            name='name',
            field=models.TextField(default=uuid.UUID('36a66144-aa00-4de7-ab8a-2d0a56b60de6'), unique=True),
        ),
    ]