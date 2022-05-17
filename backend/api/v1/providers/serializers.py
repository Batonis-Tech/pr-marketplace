from rest_framework import serializers
from djmoney.contrib.django_rest_framework import MoneyField

from api.v1.images.serializers import ImageSerializer
from api.v1.products.models import Product, ProductType, ProductAdditionalOption
from api.v1.products.serializers import ProductSerializer, ControlProductSerializer
from api.v1.providers.constants import AWAITING
from api.v1.providers.models import Provider, ProviderTheme, AnnounsmentType, ProviderKeyWord, PublicationTheme, \
    Aggregator, ProviderDomain, ProviderPublicationFormat, ProviderType
from utils.geo.serializers import LanguageSerializer, CountrySerializer, StateSerializer, CitySerializer
from django_quill.drf.fields import QuillHtmlField, QuillPlainField

class ProviderThemeSerializer(serializers.ModelSerializer):

    class Meta:
        model = ProviderTheme
        fields = "__all__"

class ProviderTypeSerializer(serializers.ModelSerializer):

    class Meta:
        model = ProviderType
        fields = "__all__"

# class ProviderPublicationFormatSerializer(serializers.ModelSerializer):
#
#     class Meta:
#         model = ProviderPublicationFormat
#         fields = "__all__"

class ProviderDomainSerializer(serializers.ModelSerializer):

    class Meta:
        model = ProviderDomain
        fields = "__all__"

class AggregatorSerializer(serializers.ModelSerializer):

    class Meta:
        model = Aggregator
        fields = "__all__"

class PublicationThemeSerializer(serializers.ModelSerializer):

    class Meta:
        model = PublicationTheme
        fields = "__all__"

class ProviderKeyWordSerializer(serializers.ModelSerializer):

    class Meta:
        model = ProviderKeyWord
        fields = "__all__"

class AnnounsmentTypeSerializer(serializers.ModelSerializer):

    class Meta:
        model = AnnounsmentType
        fields = "__all__"

class ProviderSerializer(serializers.ModelSerializer):
    products = serializers.SerializerMethodField()
    languages = LanguageSerializer(many=True)
    country = CountrySerializer(many=True)
    state = StateSerializer(many=True)
    city = CitySerializer(many=True)
    themes = ProviderThemeSerializer(many=True)
    types = ProviderTypeSerializer(many=True)
    keywords = ProviderKeyWordSerializer(many=True)
    domains = ProviderDomainSerializer(many=True)
    aggregators = AggregatorSerializer(many=True)
    allowed_publication_themes = PublicationThemeSerializer(many=True)
    logo = ImageSerializer()

    def get_products(self, provider):
        return ProductSerializer(provider.products.filter(is_active=True), many=True).data

    class Meta:
        model = Provider
        fields = "__all__"



class DetailProviderSerializer(serializers.ModelSerializer):
    products = serializers.SerializerMethodField()
    languages = LanguageSerializer(many=True)
    country = CountrySerializer(many=True)
    state = StateSerializer(many=True)
    city = CitySerializer(many=True)
    themes = ProviderThemeSerializer(many=True)
    types = ProviderTypeSerializer(many=True)
    keywords = ProviderKeyWordSerializer(many=True)
    domains = ProviderDomainSerializer(many=True)
    aggregators = AggregatorSerializer(many=True)
    allowed_publication_themes = PublicationThemeSerializer(many=True)
    logo = ImageSerializer()
    description = QuillHtmlField()

    def get_products(self, provider):
        return ProductSerializer(provider.products.filter(is_active=True), many=True).data

    class Meta:
        model = Provider
        fields = "__all__"



class ControlProviderSerializer(serializers.ModelSerializer):

    class CustomProductSerializer(serializers.Serializer):

        class CustomOptionSerializer(serializers.Serializer):
            price = MoneyField(max_digits=10, decimal_places=2, required=True)
            name = serializers.CharField()

        price = MoneyField(max_digits=10, decimal_places=2, required=True)
        type = serializers.PrimaryKeyRelatedField(queryset=ProductType.objects.all())
        options = CustomOptionSerializer(many=True, write_only=True)

    user = serializers.HiddenField(default=serializers.CurrentUserDefault())
    products = CustomProductSerializer(many=True, write_only=True)

    class Meta:
        model = Provider
        # fields = "__all__"
        exclude = ('is_active', 'created_at', 'finded_link_exchange')

    def create(self, validated_data):
        products = validated_data.pop('products')
        validated_data['is_active'] = False
        validated_data['status'] = AWAITING
        instance = super(ControlProviderSerializer, self).create(validated_data)
        for e in products:
            e['provider'] = instance
            options = e.pop('options')
            product = Product.objects.create(**e)
            for option in options:
                option['product'] = product
                ProductAdditionalOption.objects.create(**option)
        return instance

    def update(self, instance, validated_data):
        for old_product in Product.objects.filter(provider=instance):
            old_product.is_active = False
            old_product.save()
        products = validated_data.pop('products')
        validated_data['is_active'] = False
        validated_data['status'] = AWAITING
        super(ControlProviderSerializer, self).update(instance, validated_data)
        for e in products:
            e['provider'] = instance
            options = e.pop('options')
            product = Product.objects.create(**e)
            for option in options:
                option['product'] = product
                ProductAdditionalOption.objects.create(**option)
        instance.save()
        return instance