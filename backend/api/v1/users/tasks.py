from Backend.celery import app
from integrations.unisender.controls import send_email, get_mail_template
from django.template import Context
from constance import config


@app.task
def send_confimation_token(email, name, token_link):
    subject = 'Поодтверждение почты'
    ctx = Context({
        'name': name,
        'link': token_link
    })
    # message = get_template('registration_confirmation.html').render(ctx)
    template = get_mail_template(config.UNISENDER_CONFIRMATION_TEMPLATE_ID)
    message = template.render(ctx)
    send_email(email, message, subject)

@app.task
def send_reset_password_token(email, name, token_link):
    subject = 'Сброс пароля'
    ctx = Context({
        'name': name,
        'link': token_link
    })
    template = get_mail_template(config.UNISENDER_RESET_TEMPLATE_ID)
    message = template.render(ctx)
    send_email(email, message, subject)
