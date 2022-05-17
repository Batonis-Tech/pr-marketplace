import requests
from django.template import Engine

from Backend import settings
from constance import config

#
# url = f"""https://api.unisender.com/ru/api/sendEmail?format=json&api_key={settings.UNISENDER_API_KEY}&email
# =TONAME<EMAILTO>&sender_name={settings.UNISENDER_NAME}&sender_email={settings.UNISENDER_EMAIL}&subject=SUBJECT&body=HTMLBODY"""

def send_email(email, html, subject):
    url = f"https://api.unisender.com/ru/api/sendEmail"
    res = requests.get(url, params={
        'email': email,
        'sender_name': config.UNISENDER_NAME,
        'api_key': config.UNISENDER_API_KEY,
        'sender_email': config.UNISENDER_EMAIL,
        'subject': subject,
        'body': html,
        'list_id': config.UNISENDER_LIST_ID,
        'format': 'json'
    })
    print(res)
    if res:
        return True
    return False

def get_mail_template(template_id):
    url = f'https://api.unisender.com/ru/api/getTemplate?format=json&api_key={config.UNISENDER_API_KEY}&template_id={template_id}'
    res = requests.get(url)
    if res:
        try:
            return Engine().from_string(res.json()['result']['body'])
        except Exception as e:
            pass
    return None

