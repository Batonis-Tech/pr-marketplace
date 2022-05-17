from django.contrib import admin
from django.core.checks import messages
from django.urls import resolve
from django_object_actions import DjangoObjectActions

from api.v1.products.models import ProductType, Product, Order, ProductAdditionalOption, OrderAdditionalItem, CartItem


class ProductInlines(admin.TabularInline):
    model = ProductAdditionalOption
    list_display = ('id', 'name', 'price', 'is_active')
    readonly_fields = ('id',)
    fk_name = "product"
    extra = 1

    def formfield_for_foreignkey(self, db_field, request=None, **kwargs):

        field = super(ProductInlines, self).formfield_for_foreignkey(db_field, request, **kwargs)

        if db_field.name == 'option':
            if request._obj_ is not None:
                field.queryset = field.queryset.filter(is_active=True)
            else:
                field.queryset = field.queryset.none()
        return field

class ProductAdmin(admin.ModelAdmin):
    list_display = ('id', 'type', 'provider', 'price')
    list_filter = ('provider', 'type')
    raw_id_fields = ('provider', )
    inlines = (ProductInlines,)

admin.site.register(Product, ProductAdmin)
admin.site.register(ProductType)
# admin.site.register(CartItem)


class OrderInlines(admin.TabularInline):
    model = OrderAdditionalItem
    fk_name = "order"
    extra = 1

    def formfield_for_foreignkey(self, db_field, request=None, **kwargs):

        field = super(OrderInlines, self).formfield_for_foreignkey(db_field, request, **kwargs)

        if db_field.name == 'option':
            if request._obj_ is not None:
                field.queryset = field.queryset.filter(product=request._obj_.product)
            else:
                field.queryset = field.queryset.none()
        return field


@admin.register(Order)
class OrderAdmin(DjangoObjectActions, admin.ModelAdmin):
    # fields = ('user', 'product', 'provider', 'quill_task', 'quill_solution', 'status')
    list_display = ('id', 'product', 'total_cost', )
    inlines = (OrderInlines, )

    def get_inline_instances(self, request, obj=None):
        if not obj:
            return []
        if obj.product:
            return obj and super(OrderAdmin, self).get_inline_instances(request, obj)
        else:
            return []

    def close(self, request, obj):
        if obj.close():
            self.message_user(request, 'Success', level=messages.INFO)
        else:
            self.message_user(request, 'FAIL', level=messages.ERROR)

    def cancel(self, request, obj):
        if obj.cancel():
            self.message_user(request, 'Success', level=messages.INFO)
        else:
            self.message_user(request, 'FAIL', level=messages.ERROR)

    def pay(self, request, obj):
        if obj.pay():
            self.message_user(request, 'Success', level=messages.INFO)
        else:
            self.message_user(request, 'FAIL', level=messages.ERROR)

    close.label = "Закрыть"
    close.short_description = "Закрыть заказ и начислить деньги исполнителю"

    pay.label = "Оплатить"
    pay.short_description = "Заморозить деньги со счета заказчика"

    cancel.label = "Отменить"
    cancel.short_description = "Отменить заказ и вернуть замороженные средства заказчику"

    change_actions = ('close', 'pay', 'cancel')

    def get_form(self, request, obj=None, **kwargs):
        # just save obj reference for future processing in Inline
        request._obj_ = obj
        return super(OrderAdmin, self).get_form(request, obj, **kwargs)