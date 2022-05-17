from django.urls import path

from utils.geo.views import LanguageDomainListView, CountryListView, StateThemeListView, CityListView

urlpatterns = [
    path('languages', LanguageDomainListView.as_view()),
    path('countries', CountryListView.as_view()),
    path('states', StateThemeListView.as_view()),
    path('cities', CityListView.as_view()),
]
