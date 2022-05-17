from django.db.models.signals import pre_save, post_save
from django.dispatch import receiver

from api.v1.billing.models import BillingAccount
from api.v1.users.models import User


# @receiver(pre_save, sender=User)
# def update_balance_account(sender, instance, **kwargs):
#     if instance._state.adding:
#         BillingAccount.objects.create(user=instance)
#     else:
#         pass
#         # trans = Bill.objects.get(id=instance.id)
#         # instance.account.balance -= trans.amount
#         # instance.account.save()