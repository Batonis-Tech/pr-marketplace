# Generated by Django 3.1.7 on 2022-04-12 11:42

from django.db import migrations, models
import uuid


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0009_auto_20220411_0952'),
    ]

    operations = [
        migrations.AlterField(
            model_name='user',
            name='uuid',
            field=models.UUIDField(auto_created=True, default=uuid.UUID('96dda338-4073-44ce-83df-b08144b6d85a')),
        ),
    ]