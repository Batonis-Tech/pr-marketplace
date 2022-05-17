import django_filters
from django.db.models import Q
from django.shortcuts import get_object_or_404
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import permissions, status
from rest_framework.generics import RetrieveAPIView, ListAPIView, CreateAPIView, RetrieveUpdateDestroyAPIView, \
    UpdateAPIView
from rest_framework.views import APIView

from api.v1.billing.models import BillingAccount, Transaction
from api.v1.billing.serializers import BillingAccountSerializer, TransactionSerializer, BillingRequestSerializer, \
    UpdateBillingAccountSerializer
from api.v1.providers.models import Provider
from api.v1.users.models import User
from utils.utils import parse_int
from rest_framework.response import Response
from constance import config


class SingleBillingAccountView(RetrieveAPIView):
    permission_classes = (permissions.IsAuthenticated,)
    queryset = BillingAccount.objects.all()
    serializer_class = BillingAccountSerializer


class TransactionsFilter(django_filters.rest_framework.FilterSet):
    start_date = django_filters.rest_framework.DateFilter(field_name="created_at", lookup_expr='gte')
    finish_date = django_filters.rest_framework.DateFilter(field_name="created_at", lookup_expr='lte')


    class Meta:
            model = Transaction
            fields = ['account', 'type', 'start_date', 'finish_date']


class TransactionsListView(ListAPIView):
    permission_classes = (permissions.IsAuthenticated,)
    queryset = Transaction.objects.all()
    serializer_class = TransactionSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_class = TransactionsFilter

    def get_queryset(self):
        return Transaction.objects\
            .filter(Q(account__user=self.request.user) | Q(account__provider__user=self.request.user))\
            .order_by('-id')

class UserBillingAccountView(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def get(self, request):
        init_user = request.user
        user_id = parse_int(s=self.request.query_params.get('user_id'), val=0)
        try:
            user = User.objects.get(id=user_id)
            return Response(BillingAccountSerializer(BillingAccount.get_account_by_user(user)).data,
                            status.HTTP_200_OK)
        except User.DoesNotExist:
            return Response({
                "msg": "User not found"
            }, status.HTTP_404_NOT_FOUND)


class MyBillingAccountView(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def get(self, request):
        user = request.user
        return Response(BillingAccountSerializer(BillingAccount.get_account_by_user(user)).data,
                        status.HTTP_200_OK)


class BillingAccountView(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def get(self, request):
        user = request.user
        provider_id = parse_int(s=self.request.query_params.get('provider_id'), val=None)
        account = None
        if provider_id:
            # account = BillingAccount.objects.get(provider=provider_id, provider__user=user)
            account = get_object_or_404(BillingAccount, provider=provider_id, provider__user=user)
        else:
            account = BillingAccount.get_account_by_user(user)

        return Response(BillingAccountSerializer(account).data,
                        status.HTTP_200_OK)


class BillingRequestView(CreateAPIView):
    permission_classes = (permissions.IsAuthenticated,)
    serializer_class = BillingRequestSerializer

    # def post(self, request):
    #
    #     return Response({}, status.HTTP_200_OK)

class CheckBillingRequestData(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def post(self, request):
        ser = BillingRequestSerializer(data=request.data)
        ser.is_valid(raise_exception=True)

        amount = ser.validated_data['amount']
        amount_to_out = amount * (1 - config.COMISSION)
        comission_amount = amount - amount_to_out


        if ser.validated_data['billing_account'].balance.amount < amount:
            return Response({
                "amount_to_out": amount_to_out,
                "comission_amount": comission_amount,
                "msg": "Недостаточно средств"
            }, status.HTTP_205_RESET_CONTENT)
        else:
            return Response({
                "amount_to_out": amount_to_out,
                "comission_amount": comission_amount,
                "msg": f"Комиссия - {comission_amount} рублей"
            }, status.HTTP_200_OK)



class IsBillingAccountOwner(permissions.BasePermission):

    def has_object_permission(self, request, view, obj):
        owner = obj.owner
        if isinstance(owner, User):
            return owner == request.user
        if isinstance(owner, Provider):
            return owner.user == request.user
        return False


class BillingAccountControlView(UpdateAPIView):
    permission_classes = (permissions.IsAuthenticated, IsBillingAccountOwner)
    serializer_class = UpdateBillingAccountSerializer
    queryset = BillingAccount.objects.all()

