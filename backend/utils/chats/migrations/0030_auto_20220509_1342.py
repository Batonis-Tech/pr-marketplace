# Generated by Django 3.1.7 on 2022-05-09 13:42

from django.db import migrations, models
import uuid


class Migration(migrations.Migration):

    dependencies = [
        ('chats', '0029_auto_20220509_1104'),
    ]

    operations = [
        migrations.AlterField(
            model_name='chat',
            name='name',
            field=models.TextField(default=uuid.UUID('d5543a4b-d322-4be5-a428-447bdf04ca7a'), unique=True, verbose_name='Название'),
        ),
    ]
