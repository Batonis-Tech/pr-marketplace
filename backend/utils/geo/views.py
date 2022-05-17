import django_filters
from django_filters.rest_framework import DjangoFilterBackend

from rest_framework import permissions, generics

from utils.geo.models import Language, Country, State, City
from utils.geo.serializers import LanguageSerializer, CountrySerializer, StateSerializer, CitySerializer
from utils.utils import StandardResultsSetPagination, CharInFilter


class LanguageDomainListView(generics.ListAPIView):
    permission_classes = (permissions.IsAuthenticated,)
    queryset = Language.objects.all()
    serializer_class = LanguageSerializer
    filter_backends = [DjangoFilterBackend]
    pagination_class = StandardResultsSetPagination

class CountryListView(generics.ListAPIView):
    permission_classes = (permissions.IsAuthenticated,)
    queryset = Country.objects.all()
    serializer_class = CountrySerializer
    filter_backends = [DjangoFilterBackend]
    pagination_class = StandardResultsSetPagination

class StateFilter(django_filters.rest_framework.FilterSet):
    country = CharInFilter(field_name='country', lookup_expr='in')
    class Meta:
        model = State
        fields = ['country']

class StateThemeListView(generics.ListAPIView):
    permission_classes = (permissions.IsAuthenticated,)
    queryset = State.objects.all()
    serializer_class = StateSerializer
    filterset_class = StateFilter
    filter_backends = [DjangoFilterBackend]
    pagination_class = StandardResultsSetPagination

class CityFilter(django_filters.rest_framework.FilterSet):
    country = CharInFilter(field_name='country', lookup_expr='in')
    state = CharInFilter(field_name='state', lookup_expr='in')
    class Meta:
        model = City
        fields = ['state', 'country']

class CityListView(generics.ListAPIView):
    permission_classes = (permissions.IsAuthenticated,)
    queryset = City.objects.all()
    serializer_class = CitySerializer
    filterset_class = CityFilter
    filter_backends = [DjangoFilterBackend]
    pagination_class = StandardResultsSetPagination