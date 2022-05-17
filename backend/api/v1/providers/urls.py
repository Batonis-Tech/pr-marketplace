from django.urls import path

from api.v1.providers.views import ProviderListView, AnnounsmentTypeListView, PublicationThemeListView, \
    AggregatorListView, ProviderDomainListView, ProviderTypeListView, ProviderThemeListView, MyProvidersView, \
    ProviderView, CreateProviderView, UpdateProviderView

urlpatterns = [
    path('', ProviderListView.as_view()),
    path('create', CreateProviderView.as_view()),
    path('<int:pk>', ProviderView.as_view()),
    path('<int:pk>/edit', UpdateProviderView.as_view()),
    path('my', MyProvidersView.as_view()),
    path('themes', ProviderThemeListView.as_view()),
    path('types', ProviderTypeListView.as_view()),
    path('domains', ProviderDomainListView.as_view()),
    path('aggregators', AggregatorListView.as_view()),
    path('pub_themes', PublicationThemeListView.as_view()),
    path('announcements', AnnounsmentTypeListView.as_view()),
]
