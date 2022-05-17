from django.contrib import admin

from utils.chats.models import Chat, ChatMember

# admin.site.register(Chat)


class ChatInlines(admin.TabularInline):
    model = ChatMember
    fk_name = "chat"
    extra = 1


@admin.register(Chat)
class OrderAdmin(admin.ModelAdmin):
    fields = ('name', 'order')
    # list_display = ('id', 'product', 'total_cost', )
    inlines = (ChatInlines, )
