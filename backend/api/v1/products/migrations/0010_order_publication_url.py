# Generated by Django 3.1.7 on 2022-04-07 13:41

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('products', '0009_auto_20220405_1244'),
    ]

    operations = [
        migrations.AddField(
            model_name='order',
            name='publication_url',
            field=models.URLField(blank=True, null=True),
        ),
    ]
