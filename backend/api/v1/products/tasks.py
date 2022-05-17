from Backend.celery import app
from api.v1.products.models import Order
from integrations.unisender.controls import send_email, get_mail_template
from django.template import Context
from constance import config
@app.task
def send_order_status_update_user_notification(email, order_id):
    subject = 'Изменение статуса заказа'
    order = Order.objects.get(id=order_id)
    ctx = Context({
        'status': order.status,
        'order_id': order.id,
        'name': order.user.name,
        'provider': order.provider.name
    })
    # message = get_template('registration_confirmation.html').render(ctx)
    template = get_mail_template(config.UNISENDER_ORDER_OWNER_STATUS_TEMPLATE_ID)
    message = template.render(ctx)
    send_email(email, message, subject)

@app.task
def send_order_status_update_executor_notification(email, order_id):
    subject = 'Изменение статуса заказа'
    order = Order.objects.get(id=order_id)
    ctx = Context({
        'status': order.status,
        'order_id': order.id,
        'name': order.user.name,
        'provider': order.provider.name
    })
    # message = get_template('registration_confirmation.html').render(ctx)
    template = get_mail_template(config.UNISENDER_ORDER_EXECUTOR_STATUS_TEMPLATE_ID)
    message = template.render(ctx)
    send_email(email, message, subject)
