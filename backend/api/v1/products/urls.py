from django.urls import path

from api.v1.products.views import CreateOrderView, OrderListView, OrderOwnerActionsView, OrderExecutorActionsView, \
    ProductTypeListView, OrderExecutorUpdateView, OrderView, CreateCartItemView, CartItemView, ManyCartItemActions, \
    CartItemListView, ProductListView, ProductUpdateView, OptionUpdateView, ProductCreateView

urlpatterns = [
    path('orders/create', CreateOrderView.as_view()),
    path('orders/', OrderListView.as_view()),
    path('orders/<int:pk>', OrderView.as_view()),
    path('orders/<int:pk>/owner_action', OrderOwnerActionsView.as_view()),
    path('orders/<int:pk>/executor_update', OrderExecutorUpdateView.as_view()),
    path('orders/<int:pk>/executor_action', OrderExecutorActionsView.as_view()),
    path('types', ProductTypeListView.as_view()),
    path('cart/items/create', CreateCartItemView.as_view()),
    path('cart/items/<int:pk>', CartItemView.as_view()),
    path('cart/items/action', ManyCartItemActions.as_view()),
    path('cart/items', CartItemListView.as_view()),
    path('', ProductListView.as_view()),
    path('<int:pk>', ProductUpdateView.as_view()),
    path('create', ProductCreateView.as_view()),
    path('option/<int:pk>', OptionUpdateView.as_view()),
    path('option/create', OptionUpdateView.as_view()),
    # path('cart', CartView.as_view()),
]
