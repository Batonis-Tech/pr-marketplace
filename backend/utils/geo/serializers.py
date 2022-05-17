from rest_framework import serializers

from utils.geo.models import Language, City, State, Country


class LanguageSerializer(serializers.ModelSerializer):

    class Meta:
        model = Language
        fields = "__all__"

class CountrySerializer(serializers.ModelSerializer):

    class Meta:
        model = Country
        fields = "__all__"

class StateSerializer(serializers.ModelSerializer):

    class Meta:
        model = State
        fields = "__all__"

class CitySerializer(serializers.ModelSerializer):

    class Meta:
        model = City
        fields = "__all__"