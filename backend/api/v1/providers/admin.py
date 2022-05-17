from django.contrib import admin
from django.core.checks import messages
from django_object_actions import DjangoObjectActions

from api.v1.products.models import Product
from api.v1.providers.models import ProviderTheme, ProviderType, ProviderPublicationFormat, ProviderDomain, Aggregator, \
    PublicationTheme, ProviderKeyWord, Provider, AnnounsmentType

class ProviderInlines(admin.TabularInline):
    model = Product
    fk_name = "provider"
    # extra = 1

@admin.register(Provider)
class ProviderAdmin(DjangoObjectActions, admin.ModelAdmin):
    list_display = ('id', 'name', 'status')
    filter_horizontal = ('country', 'state', 'city', 'languages', 'themes',
                         'types', 'keywords', 'domains', 'aggregators', 'allowed_publication_themes',)
    list_filter = ('is_active', 'country', 'aggregators', 'status')
    readonly_fields = ('status', )
    search_fields = ('name',)
    inlines = (ProviderInlines, )

    def approve(self, request, obj):
        if obj.approve_moderation():
            self.message_user(request, 'Success', level=messages.INFO)
        else:
            self.message_user(request, 'FAIL', level=messages.ERROR)

    def reject(self, request, obj):
        if obj.reject_moderation():
            self.message_user(request, 'Success', level=messages.INFO)
        else:
            self.message_user(request, 'FAIL', level=messages.ERROR)

    approve.label = 'Согласовать'
    reject.label = 'Отклонить'

    change_actions = ('approve', 'reject')

    def get_form(self, request, obj=None, **kwargs):
        # just save obj reference for future processing in Inline
        request._obj_ = obj
        return super(ProviderAdmin, self).get_form(request, obj, **kwargs)


admin.site.register(ProviderTheme)
admin.site.register(ProviderType)
# admin.site.register(ProviderPublicationFormat)
admin.site.register(ProviderDomain)
admin.site.register(Aggregator)
admin.site.register(AnnounsmentType)
admin.site.register(PublicationTheme)
admin.site.register(ProviderKeyWord)
# admin.site.register(Provider, ProviderAdmin)
