# Generated by Django 3.1.7 on 2022-04-12 12:17

from django.db import migrations, models
import uuid


class Migration(migrations.Migration):

    dependencies = [
        ('chats', '0015_auto_20220412_1142'),
    ]

    operations = [
        migrations.AlterField(
            model_name='chat',
            name='name',
            field=models.TextField(default=uuid.UUID('09618b26-9080-43eb-8dd6-0de89fbb8cbc'), unique=True),
        ),
    ]