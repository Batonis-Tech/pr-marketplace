from django.urls import path

from utils.captcha.views import Submission

urlpatterns = [
    path('', Submission.as_view()),

]
