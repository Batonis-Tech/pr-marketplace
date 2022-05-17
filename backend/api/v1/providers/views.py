from datetime import datetime, timedelta

import django_filters
import pytz
from django.contrib.postgres.search import SearchVector, SearchQuery, SearchRank, TrigramSimilarity
from django.db.models import Aggregate, Min, Max, Q
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import permissions, generics
from rest_framework.generics import GenericAPIView, RetrieveAPIView, RetrieveUpdateDestroyAPIView, \
    RetrieveDestroyAPIView
from rest_framework.mixins import ListModelMixin
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from api.v1.providers.models import Provider, ProviderTheme, ProviderType, ProviderDomain, Aggregator, PublicationTheme, \
    AnnounsmentType, ProviderKeyWord
from api.v1.providers.serializers import ProviderSerializer, ProviderThemeSerializer, ProviderTypeSerializer, \
    ProviderDomainSerializer, AggregatorSerializer, PublicationThemeSerializer, AnnounsmentTypeSerializer, \
    DetailProviderSerializer, ControlProviderSerializer
from utils.utils import parse_int, CharInFilter, StandardResultsSetPagination


class ProviderFilter(django_filters.rest_framework.FilterSet):
    # category = CharInFilter(field_name='category', lookup_expr='in')
    # min_price = django_filters.rest_framework.NumberFilter(field_name="price", lookup_expr='gte')
    # max_price = django_filters.rest_framework.NumberFilter(field_name="price", lookup_expr='lte')
    search = django_filters.rest_framework.CharFilter(method='filter_search')
    month_old = django_filters.rest_framework.NumberFilter(method='filter_month_old')
    price_min = django_filters.rest_framework.NumberFilter(method='filter_price_min')
    price_max = django_filters.rest_framework.NumberFilter(method='filter_price_max')

    index_trust_checktrust_min = django_filters.rest_framework.NumberFilter(field_name="index_trust_checktrust", lookup_expr='gte')
    index_trust_checktrust_max = django_filters.rest_framework.NumberFilter(field_name="index_trust_checktrust", lookup_expr='lte')

    index_domain_donors_min = django_filters.rest_framework.NumberFilter(field_name="index_domain_donors", lookup_expr='gte')
    index_domain_donors_max = django_filters.rest_framework.NumberFilter(field_name="index_domain_donors", lookup_expr='lte')

    index_spam_checktrust_min = django_filters.rest_framework.NumberFilter(field_name="index_spam_checktrust", lookup_expr='gte')
    index_spam_checktrust_max = django_filters.rest_framework.NumberFilter(field_name="index_spam_checktrust", lookup_expr='lte')

    index_IKS_min = django_filters.rest_framework.NumberFilter(field_name="index_IKS", lookup_expr='gte')
    index_IKS_max = django_filters.rest_framework.NumberFilter(field_name="index_IKS", lookup_expr='lte')

    index_organic_traffic_min = django_filters.rest_framework.NumberFilter(field_name="index_organic_traffic", lookup_expr='gte')
    index_organic_traffic_max = django_filters.rest_framework.NumberFilter(field_name="index_organic_traffic", lookup_expr='lte')

    index_traffic_min = django_filters.rest_framework.NumberFilter(field_name="index_traffic",
                                                                           lookup_expr='gte')
    index_traffic_max = django_filters.rest_framework.NumberFilter(field_name="index_traffic",
                                                                           lookup_expr='lte')

    index_CF_min = django_filters.rest_framework.NumberFilter(field_name="index_CF", lookup_expr='gte')
    index_CF_max = django_filters.rest_framework.NumberFilter(field_name="index_CF", lookup_expr='lte')

    index_TF_min = django_filters.rest_framework.NumberFilter(field_name="index_TF", lookup_expr='gte')
    index_TF_max = django_filters.rest_framework.NumberFilter(field_name="index_TF", lookup_expr='lte')

    index_TR_min = django_filters.rest_framework.NumberFilter(field_name="index_TR", lookup_expr='gte')
    index_TR_max = django_filters.rest_framework.NumberFilter(field_name="index_TR", lookup_expr='lte')

    index_DR_min = django_filters.rest_framework.NumberFilter(field_name="index_DR", lookup_expr='gte')
    index_DR_max = django_filters.rest_framework.NumberFilter(field_name="index_DR", lookup_expr='lte')

    index_alexa_rank_min = django_filters.rest_framework.NumberFilter(field_name="index_alexa_rank", lookup_expr='gte')
    index_alexa_rank_max = django_filters.rest_framework.NumberFilter(field_name="index_alexa_rank", lookup_expr='lte')

    index_da_moz_min = django_filters.rest_framework.NumberFilter(field_name="index_da_moz", lookup_expr='gte')
    index_da_moz_max = django_filters.rest_framework.NumberFilter(field_name="index_da_moz", lookup_expr='lte')

    index_a_hrefs_min = django_filters.rest_framework.NumberFilter(field_name="index_a_hrefs", lookup_expr='gte')
    index_a_hrefs_max = django_filters.rest_framework.NumberFilter(field_name="index_a_hrefs", lookup_expr='lte')

    index_backlinks_min = django_filters.rest_framework.NumberFilter(field_name="price", lookup_expr='gte')
    index_backlinks_max = django_filters.rest_framework.NumberFilter(field_name="price", lookup_expr='lte')

    index_yandex_min = django_filters.rest_framework.NumberFilter(field_name="index_yandex", lookup_expr='gte')
    index_yandex_max = django_filters.rest_framework.NumberFilter(field_name="index_yandex", lookup_expr='lte')

    index_google_min = django_filters.rest_framework.NumberFilter(field_name="index_google", lookup_expr='gte')
    index_google_max = django_filters.rest_framework.NumberFilter(field_name="index_google", lookup_expr='lte')

    index_yandex_news_min = django_filters.rest_framework.NumberFilter(field_name="index_yandex_news", lookup_expr='gte')
    index_yandex_news_max = django_filters.rest_framework.NumberFilter(field_name="index_yandex_news", lookup_expr='lte')

    index_google_news_min = django_filters.rest_framework.NumberFilter(field_name="index_google_news", lookup_expr='gte')
    index_google_news_max = django_filters.rest_framework.NumberFilter(field_name="index_google_news", lookup_expr='lte')

    days_to_prod = django_filters.rest_framework.NumberFilter(field_name="days_to_prod", lookup_expr='lte')
    links = django_filters.rest_framework.NumberFilter(field_name="links", lookup_expr='gte')

    country = CharInFilter(field_name='country', lookup_expr='in')
    state = CharInFilter(field_name='state', lookup_expr='in')
    city = CharInFilter(field_name='city', lookup_expr='in')
    languages = CharInFilter(field_name='languages', lookup_expr='in')

    themes = CharInFilter(field_name='themes', lookup_expr='in')
    types = CharInFilter(field_name='types', lookup_expr='in')
    # keywords = CharInFilter(field_name='keywords', lookup_expr='in')
    keywords = CharInFilter(method='filter_keywords')
    domains = CharInFilter(field_name='domains', lookup_expr='in')
    aggregators = CharInFilter(field_name='aggregators', lookup_expr='in')
    allowed_publication_themes = CharInFilter(field_name='allowed_publication_themes', lookup_expr='in')
    pub_format = CharInFilter(field_name='products__type', lookup_expr='in')

    class Meta:
        model = Provider
        fields = ['writing', 'advertising_mark', 'finded_link_exchange',
                  'index_trust_checktrust_min', 'index_trust_checktrust_max',
                  'index_domain_donors_min', 'index_domain_donors_max',
                  'index_spam_checktrust_min', 'index_spam_checktrust_max',
                  'index_IKS_min', 'index_IKS_max',
                  'index_organic_traffic_min', 'index_organic_traffic_max',
                  'index_traffic_min', 'index_traffic_max',
                  'index_CF_min', 'index_CF_max',
                  'index_TF_min', 'index_TF_max',
                  'index_TR_min', 'index_TR_max',
                  'index_DR_min', 'index_DR_max',
                  'index_alexa_rank_max', 'index_alexa_rank_max',
                  'index_da_moz_min', 'index_da_moz_max',
                  'index_a_hrefs_min', 'index_a_hrefs_max',
                  'index_backlinks_min', 'index_backlinks_max',
                  'days_to_prod', 'links',
                  'index_yandex_min', 'index_yandex_max',
                  'index_google_min', 'index_google_max',
                  'index_yandex_news_min', 'index_yandex_news_max',
                  'index_google_news_min', 'index_google_news_max',
                  'country', 'state', 'city', 'languages',
                  'themes', 'types', 'keywords', 'domains', 'aggregators', 'allowed_publication_themes',
                  'announsment', 'pub_format'
                  ]

    # def filter_category(self, queryset, field_name, value):
    #     category = get_object_or_404(Category, pk=value)
    #     categories = category.get_tree(category)
    #     return queryset.filter(category__in=Subquery(categories.values("id")))

    def filter_month_old(self, queryset, field_name, value):
        date = datetime.now() - timedelta(days=30*int(value))
        return queryset.filter(birthday__lte=date)

    def filter_price_min(self, queryset, field_name, value):
        return queryset.annotate(min_price=Min('products__price')).filter(min_price__gte=value)

    def filter_price_max(self, queryset, field_name, value):
        return queryset.annotate(max_price=Max('products__price')).filter(max_price__lte=value)

    def filter_keywords(self, queryset, field_name, value):
        vector = SearchVector('name')
        query = SearchQuery(value)
        search_rank = SearchRank(vector, query)

        # return queryset.annotate(search=vector).filter(search=value).annotate(
        #     rank=SearchRank(vector, query)).order_by('-rank')

        keywords_arr = []

        q_object = ~Q()  # trick: a filter with empty results
        for item in value:
            q_object |= Q(name__icontains=item)

        keywords = ProviderKeyWord.objects.filter(q_object)
        #
        # return queryset.annotate(similarity=TrigramSimilarity('name', str(value)), ) \
        #     .filter(similarity__gt=0.1) \
        #     .order_by('-similarity')
        #
        return queryset.filter(keywords__in=keywords)
        # return queryset

    def filter_search(self, queryset, field_name, value):
        vector = SearchVector('name')
        query = SearchQuery(value)
        search_rank = SearchRank(vector, query)

        # return queryset.annotate(search=vector).filter(search=value).annotate(
        #     rank=SearchRank(vector, query)).order_by('-rank')

        return queryset.annotate(similarity=TrigramSimilarity('name', str(value)), ) \
            .filter(similarity__gt=0.1) \
            .order_by('-similarity')


class ProviderListView(generics.ListAPIView):
    permission_classes = (permissions.IsAuthenticated,)
    queryset = Provider.objects.filter(is_active=True)
    serializer_class = ProviderSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_class = ProviderFilter
    pagination_class = StandardResultsSetPagination


class ProviderView(generics.RetrieveAPIView):
    permission_classes = (permissions.IsAuthenticated,)
    queryset = Provider.objects.filter()
    serializer_class = DetailProviderSerializer


class ProviderThemeListView(generics.ListAPIView):
    permission_classes = (permissions.IsAuthenticated,)
    queryset = ProviderTheme.objects.all()
    serializer_class = ProviderThemeSerializer
    filter_backends = [DjangoFilterBackend]
    pagination_class = StandardResultsSetPagination

class ProviderTypeListView(generics.ListAPIView):
    permission_classes = (permissions.IsAuthenticated,)
    queryset = ProviderType.objects.all()
    serializer_class = ProviderTypeSerializer
    filter_backends = [DjangoFilterBackend]
    pagination_class = StandardResultsSetPagination

class ProviderDomainListView(generics.ListAPIView):
    permission_classes = (permissions.IsAuthenticated,)
    queryset = ProviderDomain.objects.all()
    serializer_class = ProviderDomainSerializer
    filter_backends = [DjangoFilterBackend]
    pagination_class = StandardResultsSetPagination

class AggregatorListView(generics.ListAPIView):
    permission_classes = (permissions.IsAuthenticated,)
    queryset = Aggregator.objects.all()
    serializer_class = AggregatorSerializer
    filter_backends = [DjangoFilterBackend]
    pagination_class = StandardResultsSetPagination

class PublicationThemeListView(generics.ListAPIView):
    permission_classes = (permissions.IsAuthenticated,)
    queryset = PublicationTheme.objects.all()
    serializer_class = PublicationThemeSerializer
    filter_backends = [DjangoFilterBackend]
    pagination_class = StandardResultsSetPagination

class AnnounsmentTypeListView(generics.ListAPIView):
    permission_classes = (permissions.IsAuthenticated,)
    queryset = AnnounsmentType.objects.all()
    serializer_class = AnnounsmentTypeSerializer
    filter_backends = [DjangoFilterBackend]
    pagination_class = StandardResultsSetPagination

class MyProvidersView(generics.ListAPIView):
    permission_classes = (permissions.IsAuthenticated,)
    # queryset = Order.objects.all()
    serializer_class = ProviderSerializer
    filter_backends = [DjangoFilterBackend]
    pagination_class = StandardResultsSetPagination

    def get_queryset(self):
        user = self.request.user
        return Provider.objects.filter(user=user)


class CreateProviderView(generics.CreateAPIView):
    permission_classes = (permissions.IsAuthenticated,)
    serializer_class = ControlProviderSerializer



class UpdateProviderView(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = (permissions.IsAuthenticated,)
    serializer_class = ControlProviderSerializer

    def get_queryset(self):
        user = self.request.user
        return Provider.objects.filter(user=user)
