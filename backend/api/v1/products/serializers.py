from django.core.validators import MinValueValidator
from drf_writable_nested import WritableNestedModelSerializer
from rest_framework import serializers
from djmoney.contrib.django_rest_framework import MoneyField
from django_quill.drf.fields import QuillHtmlField, QuillPlainField, FieldQuill

from api.v1.images.serializers import ImageSerializer
from api.v1.products.models import ProductType, Product, Order, ProductAdditionalOption, OrderAdditionalItem, CartItem, \
    CartItemAdditionalItem
from api.v1.providers.models import Provider
from api.v1.users.serializers import SimpleUserSerializer
from utils.chats.models import Chat


class ProductTypeSerializer(serializers.ModelSerializer):

    class Meta:
        model = ProductType
        fields = "__all__"


class ProductSerializer(serializers.ModelSerializer):
    type = ProductTypeSerializer()
    price = MoneyField(max_digits=10, decimal_places=2)
    options = serializers.SerializerMethodField()

    def get_options(self, product):
        return ProductAdditionalOptionSerializer(ProductAdditionalOption.objects.filter(product=product, is_active=True), many=True).data


    class Meta:
        model = Product
        fields = "__all__"


class ProductAdditionalOptionSerializer(serializers.ModelSerializer):

    class Meta:
        model = ProductAdditionalOption
        fields = "__all__"


class ControlProductSerializer(serializers.ModelSerializer):
    price = MoneyField(max_digits=10, decimal_places=2)
    options = ProductAdditionalOptionSerializer(many=True)
    class Meta:
        model = Product
        fields = "__all__"

class OptionSerializer(serializers.ModelSerializer):

    option = ProductAdditionalOptionSerializer()
    cost = serializers.SerializerMethodField()

    class Meta:
        model = OrderAdditionalItem
        fields = ('option', 'quantity', 'cost')

    def get_cost(self, item):
        return (item.option.price * item.quantity).amount




class CreateOptionSerializer(serializers.Serializer):
    option = serializers.PrimaryKeyRelatedField(queryset=ProductAdditionalOption.objects.all())
    quantity = serializers.IntegerField(validators=[MinValueValidator(0)])

class CheckCostSerializer(serializers.Serializer):
    # paid = serializers.BooleanField(read_only=True)
    # closed = serializers.BooleanField(read_only=True)
    options = CreateOptionSerializer(many=True)
    product = serializers.PrimaryKeyRelatedField(queryset=Product.objects.all())

class CreateOrderSerializer(serializers.Serializer):
    # paid = serializers.BooleanField(read_only=True)
    # closed = serializers.BooleanField(read_only=True)
    options = CreateOptionSerializer(many=True)
    provider = serializers.PrimaryKeyRelatedField(queryset=Provider.objects.all())
    product = serializers.PrimaryKeyRelatedField(queryset=Product.objects.all())
    quill_task = serializers.CharField(allow_null=True)
    # def get_is_owner(self, obj):
    #     user = None
    #     request = self.context.get("request")
    #     if request and hasattr(request, "user"):
    #         user = request.user
    #     return user == obj.creator


    # def to_representation(self, instance):
    #     data = super(ReviewSerializer, self).to_representation(instance)
    #     data['creator'] = ReviewTwinProfileSerializer(TwinProfile.get_profile_by_user(instance.creator), context=self.context).data
    #     data['images'] = ImageSerializer(many=True, instance=instance.images, context=self.context).data
    #     return data

class SimpleProviderSerializer(serializers.ModelSerializer):
    logo = ImageSerializer()
    products = serializers.SerializerMethodField()

    def get_products(self, provider):
        return ProductSerializer(provider.products.filter(is_active=True), many=True).data

    class Meta:
        model = Provider
        fields = ('logo', 'name', 'url', 'products')

class HyperSimpleProviderSerializer(serializers.ModelSerializer):
    logo = ImageSerializer()

    class Meta:
        model = Provider
        fields = ('logo', 'name', 'url',)


class OrderSerializer(serializers.ModelSerializer):
    product = ProductSerializer()
    provider = SimpleProviderSerializer()
    options = serializers.SerializerMethodField()
    total_cost = serializers.SerializerMethodField()
    quill_task = QuillHtmlField()
    quill_solution = QuillHtmlField()
    chat = serializers.SerializerMethodField()
    user = SimpleUserSerializer()

    def get_options(self, order):
        return OptionSerializer(OrderAdditionalItem.objects.filter(order=order), many=True).data

    def get_total_cost(self, order):
        return str(order.total_cost.amount)

    def get_chat(self, order):
        try:
            return Chat.objects.get(order=order).name
        except Chat.DoesNotExist:
            return None

    class Meta:
        model = Order
        fields = "__all__"

class SimpleOrderSerializer(serializers.ModelSerializer):
    provider = HyperSimpleProviderSerializer()
    user = SimpleUserSerializer()

    class Meta:
        model = Order
        fields = ('id', 'provider', 'user')


class OrderExecutorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Order
        fields = ('publication_url', 'quill_solution', )

# class CartItemSerialiser(serializers.Serializer):
#     provider = serializers.PrimaryKeyRelatedField(queryset=Provider.objects.all())
#     # product = serializers.PrimaryKeyRelatedField(queryset=Product.objects.all())
#     product = serializers.IntegerField()
#
#
# class CartSerializer(serializers.Serializer):
#     # providers = serializers.ListField(child=serializers.PrimaryKeyRelatedField(queryset=Provider.objects.all()))
#     items = CartItemSerialiser(many=True)

class CartItemActionsSerialiser(serializers.Serializer):
    items = serializers.ListField(child=serializers.PrimaryKeyRelatedField(
        queryset=CartItem.objects.all()
    ), default=[], write_only=True)


class CartItemAdditionalItemSerialiser(serializers.ModelSerializer):
    option = ProductAdditionalOptionSerializer()
    cost = serializers.SerializerMethodField()

    def get_cost(self, item):
        return (item.option.price * item.quantity).amount

    class Meta:
        model = CartItemAdditionalItem
        fields = "__all__"

class CartItemSerialiser(serializers.ModelSerializer):
    # provider = serializers.PrimaryKeyRelatedField(queryset=Provider.objects.all())
    product = serializers.PrimaryKeyRelatedField(queryset=Product.objects.all(), required=True)
    quill_task = serializers.CharField(required=False)
    options = serializers.ListField(child=serializers.PrimaryKeyRelatedField(queryset=ProductAdditionalOption.objects.all()), default=[], write_only=True)
    # selected_options = serializers.SerializerMethodField(read_only=True)
    user = serializers.HiddenField(default=serializers.CurrentUserDefault())
    total_cost = serializers.SerializerMethodField()
    provider = serializers.SerializerMethodField()

    def get_total_cost(self, obj):
        return obj.total_cost.amount

    def get_provider(self, obj):
        return SimpleProviderSerializer(obj.product.provider, context=self.context).data


    class Meta:
        model = CartItem
        fields = "__all__"

    def create(self, validated_data):
        options = validated_data.pop('options')
        instance = self.Meta.model.objects.create(**validated_data)
        CartItemAdditionalItem.objects.bulk_create([CartItemAdditionalItem(
            cart_item=instance,
            option=option
        ) for option in options])
        return instance

    def update(self, instance, validated_data):
        options = validated_data.pop('options')
        super(CartItemSerialiser, self).update(instance, validated_data)
        CartItemAdditionalItem.objects.filter(cart_item=instance).delete()
        CartItemAdditionalItem.objects.bulk_create([CartItemAdditionalItem(
            cart_item=instance,
            option=option
        ) for option in options])
        instance.save()
        return instance

    def to_representation(self, instance):
        data = super(CartItemSerialiser, self).to_representation(instance)
        data['options'] = CartItemAdditionalItemSerialiser(instance.options, many=True).data
        data['product'] = ProductSerializer(instance.product).data
        data['quill_task'] = instance.quill_task.html
        return data
