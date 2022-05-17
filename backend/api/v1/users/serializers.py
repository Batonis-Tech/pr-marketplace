from utils.chats.models import Chat
from .models import User, UserToken


from ..images.serializers import ImageSerializer
from django.utils.text import gettext_lazy as _
from rest_framework import serializers
from rest_framework_simplejwt.tokens import RefreshToken, TokenError


class RefreshTokenSerializer(serializers.Serializer):
    refresh = serializers.CharField()

    default_error_messages = {
        'bad_token': _('Token is invalid or expired')
    }

    def validate(self, attrs):
        self.token = attrs['refresh']
        return attrs

    def save(self, **kwargs):
        try:
            RefreshToken(self.token).blacklist()
        except TokenError:
            self.fail('bad_token')


class CreateUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'email', 'password', 'name')
        extra_kwargs = {'password': {'write_only': True}, }

    def create(self, validated_data):
        user = User.objects.create(**validated_data)
        user.save()
        # AuthToken.objects.create(user)
        return user

class TokenSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserToken
        fields = ('id', 'confirmation_token', 'reset_password_token', 'user', 'phone_auth_code')

    def create(self, validated_data):
        token = UserToken.objects.create(**validated_data)
        token.save()
        return token


class EmailConfSerializer(serializers.Serializer):
    email = serializers.EmailField(required=True)


class UserCreationSerializer(serializers.Serializer):
    # Check request for values

    email = serializers.EmailField(required=True)
    name = serializers.CharField(required=True)
    password = serializers.CharField(required=True)

class UserAutoCreationSerializer(serializers.Serializer):
    # Check request for values
    email = serializers.EmailField(required=True)


class UserSerializer(serializers.ModelSerializer):
    chat_token = serializers.SerializerMethodField()
    chat_user_id = serializers.SerializerMethodField()

    class Meta:
        model = User
        # fields = '__all__'
        fields = ('id', 'email', 'name', 'phone', 'birthday', 'last_name', 'chat_token', 'chat_user_id', 'is_confirmed')

    def get_chat_token(self, user):
        return Chat.get_stream_token(user)

    def get_chat_user_id(self, user):
        return Chat.get_user_stream_id(user)


class SimpleUserSerializer(serializers.ModelSerializer):

    class Meta:
        model = User
        # fields = '__all__'
        fields = ('id', 'email', 'name')

class UpdateUserSerialiser(serializers.ModelSerializer):

    class Meta:
        model = User
        fields = ('name', )


