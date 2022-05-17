from django.urls import path
from .views import TextView, ApiEndpoint, TextView2

urlpatterns = [
    path('<int:text_id>', TextView.as_view()),
    path('new/<int:pk>', TextView2.as_view()),
    path('test_auth', ApiEndpoint.as_view()),
]
