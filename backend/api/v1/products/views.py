import django_filters
from django.contrib.postgres.search import TrigramSimilarity
from django.db.models import Q
from django_filters import DateFilter
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import permissions, status, generics
from rest_framework.generics import RetrieveAPIView, ListAPIView, UpdateAPIView, CreateAPIView, \
    RetrieveUpdateDestroyAPIView
from rest_framework.views import APIView
from django.db.models.functions import Length

from api.v1.billing.models import BillingAccount, Transaction
from api.v1.billing.serializers import BillingAccountSerializer, TransactionSerializer
from api.v1.products.models import Order, OrderAdditionalItem, ProductType, Product, CartItem, CartItemAdditionalItem, \
    ProductAdditionalOption
from api.v1.products.serializers import CreateOrderSerializer, OrderSerializer, OrderExecutorSerializer, \
    CheckCostSerializer, ProductSerializer, OptionSerializer, CartItemSerialiser, CartItemActionsSerialiser, \
    ControlProductSerializer, ProductAdditionalOptionSerializer
from api.v1.products.utils import get_cost
from api.v1.providers.serializers import ProviderThemeSerializer, ProviderSerializer
from api.v1.users.models import User
from utils.utils import parse_int, StandardResultsSetPagination
from rest_framework.response import Response
from django.shortcuts import get_object_or_404


class ProductTypeListView(generics.ListAPIView):
    permission_classes = (permissions.IsAuthenticated,)
    queryset = ProductType.objects.all()
    serializer_class = ProviderThemeSerializer
    filter_backends = [DjangoFilterBackend]
    pagination_class = StandardResultsSetPagination


# class CheckCostView(APIView):
#     permission_classes = (permissions.IsAuthenticated,)
#
#     def post(self, request):
#         ser = CheckCostSerializer(data=request.data, many=True)
#         ser.is_valid(raise_exception=True)
#         order = ser.validated_data
#
#         products = []
#         options = []
#         formatted_product_data = []
#         for order in ser.validated_data:
#             print(f"APPENDING {order['product']} TYPE: {type(order['product'])}")
#             products.append(order['product'])
#             for option in order['options']:
#                 options.append(option)
#             formatted_product_data.append({
#                 "product": ProductSerializer(order['product']).data,
#                 "options": OptionSerializer(order['options'], many=True).data,
#                 "cost": get_cost([order['product']], order['options']).amount
#             })
#         total_pre_cost = get_cost(products, options)
#         return Response({
#             "total_cost": total_pre_cost.amount,
#             "data": formatted_product_data
#         }, status.HTTP_200_OK)

class CreateOrderView(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def post(self, request):
        ser = CreateOrderSerializer(data=request.data, many=True)
        ser.is_valid(raise_exception=True)
        order = ser.validated_data

        products = []
        options = []
        for order in ser.validated_data:
            products.append(order['product'])
            for option in order['options']:
                options.append(option)
        total_pre_cost = get_cost(products, options)
        user_balance = BillingAccount.get_account_by_user(request.user).balance
        if user_balance < total_pre_cost:
            return Response({
                "msg": "not enough money",
                "need": str((total_pre_cost - user_balance).amount)
            }, status.HTTP_402_PAYMENT_REQUIRED)

        for order in ser.validated_data:
            options = order['options']
            user = request.user
            provider = order['provider']
            product = order['product']
            quill_task = order['quill_task']
            order = Order.objects.create(
                user=user,
                provider=provider,
                product=product,
                quill_task=quill_task
            )
            OrderAdditionalItem.objects.bulk_create(
                [
                    OrderAdditionalItem(order=order,
                                        option=option['option'],
                                        quantity=option['quantity'],
                                        ) for option in options
                ]
            )
            order.pay()
        return Response({}, status.HTTP_200_OK)


class OrderFilter(django_filters.rest_framework.FilterSet):
    start_date = DateFilter(field_name='created', lookup_expr='gte')
    end_date = DateFilter(field_name='created', lookup_expr='lte')
    provider__name = django_filters.rest_framework.CharFilter(method='filter_name_search')

    class Meta:
        model = Order
        fields = ['provider', 'provider__user', 'status', 'user', 'start_date', 'end_date',
                  'product__type', 'product__type__name', 'provider__name']

    def filter_name_search(self, queryset, field_name, value):

        return queryset.annotate(similarity=TrigramSimilarity('provider__name', str(value))
                                            + TrigramSimilarity('user__name', str(value)), ) \
            .filter(similarity__gt=0.1) \
            .order_by('-similarity')

class OrderListView(ListAPIView):
    permission_classes = (permissions.IsAuthenticated,)
    # queryset = Order.objects.all()
    filterset_class = OrderFilter
    serializer_class = OrderSerializer
    filter_backends = [DjangoFilterBackend]
    pagination_class = StandardResultsSetPagination
    ordering_fields = ('created', 'id')

    def get_queryset(self):
        user = self.request.user
        return Order.objects.filter(Q(user=user) | Q(provider__user=user))

class IsOrderMember(permissions.BasePermission):

    def has_object_permission(self, request, view, obj):
        provider_id = parse_int(request.query_params.get('provider_id'), val=None)
        if provider_id:
            return obj.provider.id == provider_id
        return obj.provider.user == request.user or obj.user == request.user

class OrderView(RetrieveAPIView):
    permission_classes = (permissions.IsAuthenticated, IsOrderMember)
    serializer_class = OrderSerializer
    queryset = Order.objects.all()


class IsOrderOwner(permissions.BasePermission):

    def has_object_permission(self, request, view, obj):
        # if request.method == "DELETE" or request.method == "PATCH":
            # check here if the user is owner of the post or comment
        return obj.user == request.user


class IsOrderExecutor(permissions.BasePermission):

    def has_object_permission(self, request, view, obj):
        # if request.method == "DELETE" or request.method == "PATCH":
        #     # check here if the user is owner of the post or comment
        return obj.provider.user == request.user


class OrderExecutorUpdateView(UpdateAPIView):
    permission_classes = (permissions.IsAuthenticated, IsOrderExecutor)
    serializer_class = OrderExecutorSerializer
    queryset = Order.objects.all()


class OrderOwnerActionsView(APIView):
    permission_classes = (permissions.IsAuthenticated, IsOrderOwner)

    def get(self, request, pk):
        order = get_object_or_404(Order, pk=pk)
        self.check_object_permissions(self.request, order)
        action = self.request.query_params.get('action')

        if action == "pay":
            if order.pay():
                return Response({
                    "success": True
                }, status.HTTP_200_OK)
            else:
                return Response({
                    "success": False
                }, status.HTTP_423_LOCKED)

        if action == "cancel":
            if order.cancel():
                return Response({
                    "success": True
                }, status.HTTP_200_OK)
            else:
                return Response({
                    "success": False
                }, status.HTTP_423_LOCKED)

        if action == "review":
            if order.review():
                return Response({
                    "success": True
                }, status.HTTP_200_OK)
            else:
                return Response({
                    "success": False
                }, status.HTTP_423_LOCKED)

        if action == "close":
            if order.close():
                return Response({
                    "success": True
                }, status.HTTP_200_OK)
            else:
                return Response({
                    "success": False
                }, status.HTTP_423_LOCKED)

        return Response({
            "success": False
        }, status.HTTP_405_METHOD_NOT_ALLOWED)


class OrderExecutorActionsView(APIView):
    permission_classes = (permissions.IsAuthenticated, IsOrderExecutor)

    def get(self, request, pk):
        order = get_object_or_404(Order, pk=pk)
        self.check_object_permissions(self.request, order)
        action = self.request.query_params.get('action')

        if action == "start":
            return Response({
                "success": order.start()
            }, status.HTTP_200_OK)
            pass

        if action == "reject":
            return Response({
                "success": order.reject()
            }, status.HTTP_200_OK)
            pass
        
        if action == "to_check":
            if order.to_check():
                return Response({
                    "success": True
                }, status.HTTP_200_OK)
            else:
                return Response({
                    "success": False
                }, status.HTTP_423_LOCKED)


        return Response({
            "success": False
        }, status.HTTP_200_OK)


class CreateCartItemView(CreateAPIView):
    permission_classes = (permissions.IsAuthenticated, )
    serializer_class = CartItemSerialiser


class CartItemView(RetrieveUpdateDestroyAPIView):
    permission_classes = (permissions.IsAuthenticated, )
    serializer_class = CartItemSerialiser
    queryset = CartItem.objects.all()


class CartItemFilter(django_filters.rest_framework.FilterSet):
    provider__name = django_filters.rest_framework.CharFilter(method='filter_name_search')
    task = django_filters.rest_framework.BooleanFilter(method='filter_is_tasked')

    class Meta:
        model = CartItem
        fields = ['user', 'product__type__name', 'product__type', 'provider__name']

    def filter_is_tasked(self, queryset, field_name, value):
        if value:
            # print(queryset.annotate(text_len=Length('quill_task__html')).filter(text_len__gte=1))
            # return queryset.annotate(text_len=Length('quill_task__html')).filter(text_len__gte=1)
            return queryset.exclude(quill_task__contains='html":""')
        else:
            return queryset.filter(quill_task__contains='html":""')

    def filter_name_search(self, queryset, field_name, value):
        return queryset.annotate(similarity=TrigramSimilarity('provider__name', str(value)), ) \
            .filter(similarity__gt=0.2) \
            .order_by('-similarity')

class CartItemListView(ListAPIView):
    permission_classes = (permissions.IsAuthenticated, )
    serializer_class = CartItemSerialiser
    # queryset = CartItem.objects.all()
    filter_backends = [DjangoFilterBackend]
    filterset_class = CartItemFilter
    pagination_class = StandardResultsSetPagination
    ordering_fields = ('created', 'id')

    def get_queryset(self):
        user = self.request.user
        return CartItem.objects.filter(user=user)

class ManyCartItemActions(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def post(self, requset):
        ser = CartItemActionsSerialiser(data=requset.data)
        ser.is_valid(raise_exception=True)
        action = self.request.query_params.get('action')

        if action == "delete":
            items = ser.validated_data['items']
            for x in items:
                x.delete()
            return Response({
                "success": True
            }, status.HTTP_200_OK)

        if action == "order":
            items = ser.validated_data['items']
            if sum(e.total_cost for e in items) <= BillingAccount.get_account_by_user(requset.user).balance:
                for x in items:
                    x.to_order()
                return Response({
                    "success": True
                }, status.HTTP_200_OK)
            return Response({
                "success": False
            }, status.HTTP_402_PAYMENT_REQUIRED)

        if action == "info":
            items = ser.validated_data['items']
            return Response({
                "items": CartItemSerialiser(items, many=True, context={"request": requset}).data,
                "total_cost": sum(x.total_cost.amount for x in items)
            }, status.HTTP_200_OK)

        return Response({
            "success": False
        }, status.HTTP_200_OK)


class ProductFilter(django_filters.rest_framework.FilterSet):

    class Meta:
        model = Product
        fields = ['provider', ]


class ProductListView(generics.ListAPIView):
    permission_classes = (permissions.IsAuthenticated,)
    queryset = Product.objects.filter()
    serializer_class = ProductSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_class = ProductFilter
    pagination_class = StandardResultsSetPagination


class ProductCreateView(generics.CreateAPIView):
    permission_classes = (permissions.IsAuthenticated,)
    serializer_class = ControlProductSerializer

class ProductUpdateView(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = (permissions.IsAuthenticated,)
    queryset = Product.objects.filter()
    serializer_class = ControlProductSerializer


class OptionUpdateView(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = (permissions.IsAuthenticated,)
    queryset = ProductAdditionalOption.objects.filter()
    serializer_class = ProductAdditionalOptionSerializer

class OptionCreateView(generics.CreateAPIView):
    permission_classes = (permissions.IsAuthenticated,)
    serializer_class = ControlProductSerializer
