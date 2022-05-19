# Generated by Django 3.1.7 on 2022-04-04 11:25

from django.db import migrations, models
import django.db.models.deletion
import uuid


class Migration(migrations.Migration):

    dependencies = [
        ('products', '0008_auto_20220331_1346'),
        ('chats', '0006_auto_20220404_1104'),
    ]

    operations = [
        migrations.AddField(
            model_name='chat',
            name='order',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='products.order'),
        ),
        migrations.AlterField(
            model_name='chat',
            name='name',
            field=models.TextField(default=uuid.UUID('67dd73e4-12dc-4b33-b2a0-10df3d912e94'), unique=True),
        ),
    ]