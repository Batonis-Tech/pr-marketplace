from django.contrib.auth import get_user_model
from django.core.paginator import Paginator, PageNotAnInteger, EmptyPage
from django.db.models import Q
from rest_framework import permissions, generics
from rest_framework import status
from rest_framework.generics import RetrieveAPIView, GenericAPIView
from rest_framework.response import Response
from rest_framework.views import APIView

from Backend import settings
from .tasks import send_confimation_token, send_reset_password_token
from .user_utils import create_user_and_tokens, auto_registrate_user
from ..users.models import UserToken, User
from .serializers import CreateUserSerializer, TokenSerializer, EmailConfSerializer, \
    UserCreationSerializer, RefreshTokenSerializer, UserAutoCreationSerializer, UserSerializer, UpdateUserSerialiser

from utils.utils import get_token, validate_password, parse_int, parse_bool


class LogoutView(GenericAPIView):
    serializer_class = RefreshTokenSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def post(self, request, *args):
        sz = self.get_serializer(data=request.data)
        sz.is_valid(raise_exception=True)
        sz.save()
        return Response(status=status.HTTP_204_NO_CONTENT)


# Create your views here.
class CheckEmail(APIView):

    def post(self, request):
        ser = EmailConfSerializer(data=request.data)
        if ser.is_valid(raise_exception=True):
            user = get_user_model()
            if user.objects.filter(email=request.data['email']):
                return Response({
                    'details': 'Email is already used'
                }, status.HTTP_403_FORBIDDEN)
            else:
                return Response({
                    'details': 'Email not already used'
                }, status.HTTP_202_ACCEPTED)
        else:
            return Response({
                'details': 'Email must be in request'
            }, status.HTTP_400_BAD_REQUEST)

class AutoRegistrateUser(APIView):

    def post(self, request):
        ser = UserAutoCreationSerializer(data=request.data)
        ser.is_valid(raise_exception=True)
        auto_registrate_user(ser.validated_data['email'])

        return Response({
            'details': 'User successfully created'
        }, status.HTTP_201_CREATED)


class RegistrateUser(APIView):

    def post(self, request):
        ser = UserCreationSerializer(data=request.data)
        if ser.is_valid(raise_exception=True):
            redirect_url = self.request.query_params.get('redirect_url')
            tokens, user = create_user_and_tokens(self, request)

            # if redirect_url:
            #     send_confimation_token(email=user.email, name=user.name,
            #                            token_link=f'https://{redirect_url}/confirm_email/?token={tokens.confirmation_token}')
            # else:
            #     send_confimation_token(email=user.email, name=user.name,
            #                 token_link=f'{settings.FRONTEND_URL}/confirm_email/?token={tokens.confirmation_token}')
            send_confimation_token.apply_async(args=[
                user.email,
                user.name,
                f'https://{settings.FRONTEND_URL}/confirm_email?token={tokens.confirmation_token}'
            ])
            return Response({
                'details': 'User successfully created',
                'redirect_url': redirect_url
            }, status.HTTP_201_CREATED)
        else:
            return Response({
                'details': 'Name, email and password must be in request'
            }, status.HTTP_400_BAD_REQUEST)

class ConfirmEmail(APIView):

    def get(self, request, token):
        tokens = UserToken.objects.filter(confirmation_token=token)
        if tokens:
            user_tokens = tokens[0]
            user = user_tokens.user
            user.is_confirmed = True
            user.auth_provider = 'email'
            user.save()
            user_tokens.regenerate()

            return Response({
                'details': 'Email confirmed'
            }, status.HTTP_200_OK)
        else:
            return Response({
                'details': 'Bad token'
            }, status.HTTP_400_BAD_REQUEST)


class ResetPassword(APIView):

    def post(self, request, reset_token):
        if request.data['password']:
            tokens = UserToken.objects.filter(reset_password_token=reset_token)
            if tokens:
                user_tokens = tokens[0]
                user = user_tokens.user
                user.set_password(request.data['password'])
                user.save()
                user_tokens.regenerate()
                return Response({}, status.HTTP_200_OK)

        return Response({

        }, status.HTTP_400_BAD_REQUEST)


class RequestResetPassword(APIView):
    def post(self, request):
        if request.data['email']:
            users = User.objects.filter(email=request.data['email'])
            if users:
                user = users[0]
                user_tokens = UserToken.get_user_tokens(user)
                # redirect_url = self.request.query_params.get('redirect_url')
                send_reset_password_token.apply_async(args=[
                    user.email,
                    user.name,
                    f'https://{settings.FRONTEND_URL}/reset_password?token={user_tokens.reset_password_token}'
                ])
                return Response({

                }, status.HTTP_200_OK)
        return Response({
            'details': 'Bad email'
        }, status.HTTP_400_BAD_REQUEST)


class RequestConfirmationEmail(APIView):
    def post(self, request):
        if request.data['email']:
            users = User.objects.filter(email=request.data['email'])
            if users:
                user = users[0]
                user_tokens = UserToken.get_user_tokens(user)
                # redirect_url = self.request.query_params.get('redirect_url')
                send_confimation_token.apply_async(args=[
                    user.email,
                    user.name,
                    f'https://{settings.FRONTEND_URL}/confirm_email?token={user_tokens.confirmation_token}'
                ])

                return Response({

                }, status.HTTP_200_OK)
        return Response({
            'details': 'Bad email'
        }, status.HTTP_400_BAD_REQUEST)


class UserView(RetrieveAPIView):
    permission_classes = (permissions.IsAuthenticated,)
    model = User
    serializer_class = UserSerializer

    def retrieve(self, request):
        if request.user:
            return Response(UserSerializer(request.user).data)
        return super(UserView, self).retrieve(request)


class IsOwner(permissions.BasePermission):

    def has_object_permission(self, request, view, obj):
        # if request.method == "DELETE" or request.method == "PATCH":
            # check here if the user is owner of the post or comment
        return obj == request.user

class UserEditView(generics.UpdateAPIView):
    permission_classes = (permissions.IsAuthenticated, IsOwner)
    serializer_class = UpdateUserSerialiser
    queryset = User.objects.all()
