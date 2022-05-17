import django_filters
import pytz
from django.contrib.admin.views.decorators import staff_member_required
from django.contrib.auth.decorators import login_required, user_passes_test
from django.db.models import Sum
from django.http import HttpResponse
from django.shortcuts import render
import django_tables2 as tables
from django_tables2 import SingleTableView, export
from django_filters.views import FilterView

from django_tables2.views import SingleTableMixin

from api.v1.billing.constants import DEPOSIT, WITHDRAWAL, COMMISSION, ORDER_PAYMENT, FROZEN
from api.v1.billing.models import Transaction, BalanceChangingRequest, TransactionBlock

# @staff_member_required
# def accounnting_view(request):
#     return render(request, 'admin/accounting/transactions.html')


# class PersonListView(ListView):
#     model = Transaction
#     template_name = 'admin/accounting/transactions.html'
from api.v1.billing.views import TransactionsFilter
from api.v1.products.models import Order
from babel.dates import format_date, format_datetime, format_time, get_timezone


class TransactionTable(tables.Table):
    order = tables.Column(empty_values=(), verbose_name='Номер заказа', orderable=False)
    client = tables.Column(empty_values=(), verbose_name='Заказчик', orderable=False)
    executor = tables.Column(empty_values=(), verbose_name='Исполнитель', orderable=False)
    created_at = tables.Column(empty_values=(), verbose_name='Время (мск)')
    id = tables.Column(verbose_name='Номер транзакции')
    account__owner = tables.Column(verbose_name='Счет', orderable=False)
    string_type = tables.Column(verbose_name='Тип', orderable=False)
    amount__amount = tables.Column(verbose_name='Сумма руб.', order_by='amount')
    balance_after_transaction__amount = tables.Column(verbose_name='Баланс после транзакции', orderable=False)

    def render_order(self, value, record):
        order = Order.get_order_by_transaction(record)
        return order.id if order else '---'

    def render_client(self, value, record):
        order = Order.get_order_by_transaction(record)
        return order.user if order else '---'

    def render_executor(self, value, record):
        order = Order.get_order_by_transaction(record)
        return order.provider if order else '---'

    def render_created_at(self, value, record):
        # moscow_tz = pytz.timezone("Europe/Moscow")
        return format_datetime(record.created_at, "dd.MM.YY HH:mm", tzinfo=get_timezone('Europe/Moscow'), locale='ru')

    class Meta:
        model = Transaction
        template_name = "django_tables2/bootstrap.html"
        fields = ("id", "string_type", "balance_after_transaction__amount")


# class TransactionListView(SingleTableView):
#     model = Transaction
#     table_class = TransactionTable
#     template_name = 'admin/accounting/transactions.html'

class TransactionFilter(django_filters.rest_framework.FilterSet):
    start_date = django_filters.rest_framework.DateFilter(field_name="created_at", lookup_expr='gte')
    finish_date = django_filters.rest_framework.DateFilter(field_name="created_at", lookup_expr='lte')

    class Meta:
        model = Transaction
        fields = ['account', 'start_date', 'finish_date', 'type']


class TransactionListView(SingleTableMixin, FilterView, export.ExportMixin):
    table_class = TransactionTable
    model = Transaction
    template_name = 'admin/accounting/transactions.html'
    filterset_class = TransactionFilter

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context["var"] = "Kekes"
        # context["withdraw_sum"] = BalanceChangingRequest.get_withdraw_sum()["amount__sum"]
        # context["recieve_sum"] = BalanceChangingRequest.get_recieve_sum()["amount__sum"]
        # context["freezed_sum"] = TransactionBlock.get_freezed_sum()["transaction__amount__sum"]

        recieved = Transaction.objects.filter(type=DEPOSIT).aggregate(sum=Sum('amount'))['sum']
        if recieved == None:
            recieved = 0
        context['recieved'] = recieved

        withdrawed = Transaction.objects.filter(type=WITHDRAWAL).aggregate(sum=Sum('amount'))['sum']
        if withdrawed == None:
            withdrawed = 0
        context['withdrawed'] = withdrawed * -1

        commission = Transaction.objects.filter(type=COMMISSION).aggregate(sum=Sum('amount'))['sum']
        if commission == None:
            commission = 0
        context['commission'] = commission * -1
        # context['orders_closed'] = Transaction.objects.filter(type=ORDER_PAYMENT, amount__gt=0).aggregate(sum=Sum('amount'))['sum']
        return context



# def transactions_view(request):
#     table = TransactionTable(Transaction.objects.all())
#     return render(request, "admin/accounting/transactions.html", {
#         "table": table,
#         "var": "Kekes"
#     })