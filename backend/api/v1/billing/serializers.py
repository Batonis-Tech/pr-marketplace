from django.db.models import Sum, Q
from rest_framework import serializers

from api.v1.billing.constants import ORDER_PAYMENT, COMMISSION, WITHDRAWAL, DEPOSIT
from api.v1.billing.models import BillingAccount, Transaction, BalanceChangingRequest, TransactionBlock
from api.v1.products.models import Order
from api.v1.products.serializers import SimpleOrderSerializer


class BillingAccountSerializer(serializers.ModelSerializer):
    freezed_amount = serializers.SerializerMethodField()
    earned_amount = serializers.SerializerMethodField()
    exported_amount = serializers.SerializerMethodField()
    debited_amount = serializers.SerializerMethodField()
    withdrawed_amount = serializers.SerializerMethodField()


    def get_freezed_amount(self, obj):
        result = TransactionBlock.objects.filter(transaction__account=obj).aggregate(sum=Sum('transaction__amount'))['sum']
        if result == None:
            result = 0
        return abs(result)

    def get_earned_amount(self, obj):
        return Transaction.objects.filter(account=obj, type=ORDER_PAYMENT, amount__gt=0).aggregate(sum=Sum('amount'))['sum']

    def get_exported_amount(self, obj):
        result = Transaction.objects.filter(account=obj, amount__lt=0).filter(
                                          Q(type=WITHDRAWAL) |
                                          Q(type=COMMISSION)
                                          ).aggregate(sum=Sum('amount'))['sum']
        if result == None:
            result = 0
        return abs(result)

    def get_debited_amount(self, obj):
        return Transaction.objects.filter(account=obj, amount__gt=0).filter(
                                          Q(type=DEPOSIT)
                                          ).aggregate(sum=Sum('amount'))['sum']

    def get_withdrawed_amount(self, obj):
        result = Transaction.objects.filter(account=obj, amount__lt=0).filter(
                                          Q(type=WITHDRAWAL) |
                                          Q(type=COMMISSION) |
                                          Q(type=ORDER_PAYMENT)
                                          ).aggregate(sum=Sum('amount'))['sum']
        if result == None:
            result = 0
        return abs(result)

    class Meta:
        model = BillingAccount
        fields = '__all__'


class TransactionSerializer(serializers.ModelSerializer):
    order = serializers.SerializerMethodField()

    def get_order(self, obj):
        return SimpleOrderSerializer(Order.get_order_by_transaction(obj), context=self.context).data

    class Meta:
        model = Transaction
        fields = '__all__'

class BillingRequestSerializer(serializers.ModelSerializer):

    class Meta:
        model = BalanceChangingRequest
        fields = '__all__'

class UpdateBillingAccountSerializer(serializers.ModelSerializer):

    class Meta:
        model = BillingAccount
        fields = ("payee_name", 'checking_account', 'bank_BIC', 'bank_name',
                  'correspondent_account_number', 'tax_number')