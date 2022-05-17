from django.urls import path

from api.v1.billing.views import SingleBillingAccountView, TransactionsListView, UserBillingAccountView, \
    MyBillingAccountView, BillingRequestView, BillingAccountView, BillingAccountControlView, CheckBillingRequestData

urlpatterns = [
    path('account/<int:pk>', SingleBillingAccountView.as_view()),
    path('account/<int:pk>/edit', BillingAccountControlView.as_view()),
    path('useraccount', UserBillingAccountView.as_view()),
    path('account/my', BillingAccountView.as_view()),
    path('account/me', MyBillingAccountView.as_view()),
    path('transactions', TransactionsListView.as_view()),
    path('create_request', BillingRequestView.as_view()),
    path('check_request', CheckBillingRequestData.as_view()),
]