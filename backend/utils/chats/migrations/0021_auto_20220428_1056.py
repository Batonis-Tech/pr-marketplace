# Generated by Django 3.1.7 on 2022-04-28 10:56

from django.db import migrations, models
import uuid


class Migration(migrations.Migration):

    dependencies = [
        ('chats', '0020_auto_20220428_1053'),
    ]

    operations = [
        migrations.AlterField(
            model_name='chat',
            name='name',
            field=models.TextField(default=uuid.UUID('3e4d27df-6008-4b2b-b303-ed1271aa0746'), unique=True),
        ),
    ]
