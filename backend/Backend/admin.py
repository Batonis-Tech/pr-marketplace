from django.contrib.admin import AdminSite


class CustomAdmin(AdminSite):
    index_template = 'admin/index.html'


custom_admin_site = CustomAdmin(name='admin')