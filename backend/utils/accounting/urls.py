from django.urls import path

from utils.accounting.views import TransactionListView
from django.contrib.admin.views.decorators import staff_member_required

urlpatterns = [
    path('', staff_member_required(TransactionListView.as_view())),
]
