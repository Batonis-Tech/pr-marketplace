from Backend.celery import app
from api.v1.billing.models import Transaction
from integrations.unisender.controls import send_email, get_mail_template
from django.template import Context
from constance import config

@app.task
def send_recieve_notification(email, transaction_id):
    transaction = Transaction.objects.get(id=transaction_id)
    subject = 'Зачисление средств Backend'
    ctx = Context({
        'amount': transaction.amount,
        'created_at': transaction.created_at
    })
    # message = get_template('registration_confirmation.html').render(ctx)
    template = get_mail_template(config.UNISENDER_RECIEVE_TEMPLATE_ID)
    message = template.render(ctx)
    send_email(email, message, subject)

@app.task
def send_withdraw_notification(email, withdraw_transaction_id, comission_transaction_id):
    withdraw_transaction = Transaction.objects.get(id=withdraw_transaction_id)
    comission_transaction = Transaction.objects.get(id=comission_transaction_id)
    subject = 'Вывод средств Backend'
    ctx = Context({
        'amount': withdraw_transaction.amount,
        'comission': comission_transaction.amount,
        'created_at': withdraw_transaction.created_at,
        'sum': withdraw_transaction.amount + comission_transaction.amount,
        'bank_name': withdraw_transaction.account.bank_name,
        'payee_name': withdraw_transaction.account.payee_name,
        'checking_account': withdraw_transaction.account.checking_account,
        'provider': withdraw_transaction.account.owner
    })
    # message = get_template('registration_confirmation.html').render(ctx)
    template = get_mail_template(config.UNISENDER_WITHDRAW_TEMPLATE_ID)
    message = template.render(ctx)
    send_email(email, message, subject)
