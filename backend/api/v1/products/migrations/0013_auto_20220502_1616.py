# Generated by Django 3.1.7 on 2022-05-02 16:16

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion
import django_quill.fields
import djmoney.models.fields


class Migration(migrations.Migration):

    dependencies = [
        ('providers', '0009_auto_20220428_1041'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('products', '0012_order_blocking'),
    ]

    operations = [
        migrations.AlterField(
            model_name='order',
            name='product',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='products.product', verbose_name='Заказано'),
        ),
        migrations.AlterField(
            model_name='order',
            name='provider',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='providers.provider', verbose_name='СМИ'),
        ),
        migrations.AlterField(
            model_name='order',
            name='publication_url',
            field=models.URLField(blank=True, null=True, verbose_name='Ссылка на публикацию'),
        ),
        migrations.AlterField(
            model_name='order',
            name='quill_solution',
            field=django_quill.fields.QuillField(null=True, verbose_name='Текст публикации'),
        ),
        migrations.AlterField(
            model_name='order',
            name='quill_task',
            field=django_quill.fields.QuillField(null=True, verbose_name='Задание'),
        ),
        migrations.AlterField(
            model_name='order',
            name='status',
            field=models.CharField(choices=[('Оплачено', 'Paid'), ('Ожидает оплаты', 'Awaiting Payment'), ('Отменен', 'Canceled'), ('Отклонен', 'Rejected'), ('Принят в работу', 'In Progress'), ('Опубликован', 'Published'), ('Завершен', 'Done'), ('Ожидает согласования', 'Review Waiting'), ('Ожидает публикации', 'Publish Waiting')], default='Ожидает оплаты', max_length=100, verbose_name='Статус'),
        ),
        migrations.AlterField(
            model_name='order',
            name='user',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL, verbose_name='Заказчик'),
        ),
        migrations.AlterField(
            model_name='orderadditionalitem',
            name='option',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='products.productadditionaloption', verbose_name='Доп.услуга'),
        ),
        migrations.AlterField(
            model_name='orderadditionalitem',
            name='order',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='additional_items', to='products.order', verbose_name='Заказ'),
        ),
        migrations.AlterField(
            model_name='orderadditionalitem',
            name='quantity',
            field=models.PositiveIntegerField(default=1, verbose_name='Количество'),
        ),
        migrations.AlterField(
            model_name='product',
            name='price',
            field=djmoney.models.fields.MoneyField(currency_choices=(('RUB', 'RUB'),), decimal_places=2, default_currency='RUB', max_digits=8, verbose_name='Цена'),
        ),
        migrations.AlterField(
            model_name='product',
            name='provider',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='products', to='providers.provider', verbose_name='СМИ'),
        ),
        migrations.AlterField(
            model_name='product',
            name='type',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='products.producttype', verbose_name='Тип'),
        ),
        migrations.AlterField(
            model_name='productadditionaloption',
            name='name',
            field=models.CharField(max_length=1000, verbose_name='Название'),
        ),
        migrations.AlterField(
            model_name='productadditionaloption',
            name='price',
            field=djmoney.models.fields.MoneyField(currency_choices=(('RUB', 'RUB'),), decimal_places=2, default_currency='RUB', max_digits=8, verbose_name='Цена'),
        ),
        migrations.AlterField(
            model_name='productadditionaloption',
            name='product',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='order_items', to='products.product', verbose_name='Продукт'),
        ),
        migrations.AlterField(
            model_name='producttype',
            name='name',
            field=models.CharField(max_length=1000, verbose_name='Название'),
        ),
    ]
