# Generated by Django 3.1.7 on 2022-04-04 11:25

from django.db import migrations, models
import uuid


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='user',
            name='uuid',
            field=models.UUIDField(auto_created=True, default=uuid.UUID('b1619bf8-427b-49fd-801b-ee7db00ac7e4')),
        ),
    ]
