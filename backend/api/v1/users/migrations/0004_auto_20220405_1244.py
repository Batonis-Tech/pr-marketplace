# Generated by Django 3.1.7 on 2022-04-05 12:44

from django.db import migrations, models
import uuid


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0003_auto_20220405_1102'),
    ]

    operations = [
        migrations.AlterField(
            model_name='user',
            name='uuid',
            field=models.UUIDField(auto_created=True, default=uuid.UUID('db511412-4a73-4e21-8ff8-692783b35fdb')),
        ),
    ]
