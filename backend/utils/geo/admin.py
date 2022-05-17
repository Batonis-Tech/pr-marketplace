from django.contrib import admin

from utils.geo.models import Country, State, City, Language

admin.site.register(Country)
admin.site.register(State)
admin.site.register(City)
admin.site.register(Language)