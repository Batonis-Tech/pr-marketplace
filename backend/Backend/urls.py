from django.conf.urls import url
from django.urls import path, include
from django.contrib import admin
from drf_spectacular.views import SpectacularAPIView, SpectacularRedocView, SpectacularSwaggerView
from django.conf.urls.static import static
from django.conf import settings


def get_admin_urls(urls):
    def get_urls():
        custom_urls = [
            path('accounting', include('utils.accounting.urls')),
        ]
        return custom_urls + urls
    return get_urls

admin.autodiscover()
admin_urls = get_admin_urls(admin.site.get_urls())
admin.site.get_urls = admin_urls

urlpatterns = [
    url(r'^admin/', include('smuggler.urls')),
    url(r'^admin/', admin.site.urls),
    url(r'^silk/', include('silk.urls', namespace='silk')),
    url(r'^o/', include('drf_social_oauth2.urls', namespace='drf')),
    path('captcha', include('utils.captcha.urls')),
    path('api/schema/', SpectacularAPIView.as_view(), name='schema'),
    path('api/schema/swagger-ui/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),
    path('api/schema/redoc/', SpectacularRedocView.as_view(url_name='schema'), name='redoc'),
    path('api/v1/users/', include('api.v1.users.urls')),
    path('api/v1/files/', include('api.v1.files.urls')),
    path('api/v1/geo/', include('utils.geo.urls')),
    path('api/v1/images/', include('api.v1.images.urls')),
    path('api/v1/texts/', include('api.v1.texts.urls')),
    path('api/v1/billing/', include('api.v1.billing.urls')),
    path('api/v1/referals/', include('api.v1.referals.urls')),
    path('api/v1/providers/', include('api.v1.providers.urls')),
    path('api/v1/products/', include('api.v1.products.urls')),
    path('editorjs/', include('django_editorjs_fields.urls')),
    path('editorjs/', include('django_editorjs_fields.urls')),
]

# urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
# urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)