# Generated by Django 3.1.7 on 2022-04-12 11:42

from django.db import migrations, models
import uuid


class Migration(migrations.Migration):

    dependencies = [
        ('chats', '0014_auto_20220411_0952'),
    ]

    operations = [
        migrations.AlterField(
            model_name='chat',
            name='name',
            field=models.TextField(default=uuid.UUID('4b8fda17-e71f-4165-b10c-a74ff7637a61'), unique=True),
        ),
    ]