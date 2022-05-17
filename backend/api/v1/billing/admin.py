from django.contrib import admin
from django_object_actions import DjangoObjectActions
from django.core.checks import messages
# Register your models here.
from .models import BillingAccount, Transaction, BalanceChangingRequest, TransactionBlock
from Backend.admin import custom_admin_site


class BillingAccountAdmin(admin.ModelAdmin):
    list_display = ('id', 'balance', 'owner')

    # readonly_fields = ('balance',)


class TransactionAdmin(admin.ModelAdmin):
    list_display = ('id', 'account', 'type', 'amount')
    readonly_fields = ('balance_after_transaction',)
    raw_id_fields = ('account', )

class TransactionBlockAdmin(admin.ModelAdmin):
    raw_id_fields = ('transaction',)

admin.site.register(BillingAccount, BillingAccountAdmin)
admin.site.register(Transaction, TransactionAdmin)
admin.site.register(TransactionBlock, TransactionBlockAdmin)


# class RequestAdmin(admin.ModelAdmin):
#     # list_display = ('id', 'account', 'amount')
#     list_filter = ('type', 'is_closed')
#
# admin.site.register(BalanceChangingRequest, RequestAdmin)


class RequestAdmin(DjangoObjectActions, admin.ModelAdmin):
    list_filter = ('type', 'is_closed')
    list_display = ('id', 'type', 'amount', 'billing_account', 'is_closed')


    def get_fields(self, request, obj=None):
        default_fields = ('billing_account', 'type', 'amount', 'is_closed')
        if obj:
            if obj.type == BalanceChangingRequest.Type.RECIEVE:
                return default_fields +\
                       ('file', )

            if obj.type == BalanceChangingRequest.Type.WITHDRAW:
                return default_fields + \
                       ('payee_name', 'checking_account',
                        'bank_BIC', 'bank_name',
                        'correspondent_account_number', 'tax_number')

        return default_fields

    def confirm(self, request, obj):
        result = obj.confirm()
        if result[0]:
            self.message_user(request, result[1], level=messages.INFO)
        else:
            self.message_user(request, result[1], level=messages.ERROR)

    def cancel(self, request, obj):
        result = obj.cancel()
        if result[0]:
            self.message_user(request, result[1], level=messages.INFO)
        else:
            self.message_user(request, result[1], level=messages.ERROR)

    confirm.label = "Подтвердить"
    cancel.label = "Отклонить"

    change_actions = ('confirm', 'cancel' )

custom_admin_site.register(BalanceChangingRequest, RequestAdmin)
admin.site.register(BalanceChangingRequest, RequestAdmin)
