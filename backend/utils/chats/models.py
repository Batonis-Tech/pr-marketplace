import uuid

from django.db import models
from stream_chat import StreamChat
from django.db.models.signals import post_save, m2m_changed
from django.dispatch import receiver
from stream_chat.base.exceptions import StreamAPIException

from Backend import settings
from api.v1.users.models import User


class UserStreamToken(models.Model):
    user = models.OneToOneField(User, null=False, blank=False, on_delete=models.CASCADE)
    token = models.TextField(null=False)


class Chat(models.Model):
    # users = models.ManyToManyField(User, blank=True)
    members = models.ManyToManyField(User, through='ChatMember', verbose_name='Участники')
    name = models.TextField(null=False, blank=False, default=uuid.uuid4(), unique=True, verbose_name='Название')
    order = models.OneToOneField('products.Order', on_delete=models.CASCADE, null=True, verbose_name='Заказ')

    def __str__(self):
        return f'{self.id} {self.order}'

    @staticmethod
    def get_user_stream_id(user):
        return f"{user.id}_{user.uuid}"

    @staticmethod
    def get_stream_token(user):
        try:
            obj = UserStreamToken.objects.get(user=user)
            return obj.token
        except UserStreamToken.DoesNotExist:
            client = StreamChat(api_key=settings.STREAM_API_KEY, api_secret=settings.STREAM_API_SECRET)
            token = client.create_token(Chat.get_user_stream_id(user))
            client.update_user({"id": Chat.get_user_stream_id(user), "role": "admin"})
            UserStreamToken.objects.create(user=user, token=token)
            return token

    # def save(self, *args, **kwargs):
    #     client = StreamChat(api_key=settings.STREAM_API_KEY,
    #                         api_secret=settings.STREAM_API_SECRET)
    #     # channel = client.channel('messaging', 'General')
    #     # for user in self.users.all():
    #     #     user_stream_id = Chat.get_user_stream_id(user)
    #     #     token = bytes(client.create_token(
    #     #         user_id=user_stream_id)).decode('utf-8')
    #     #     client.update_user({"id": user_stream_id, "role": "admin"})
    #         # channel.add_members([user_stream_id])
    #         # channel = Channel("messaging", None, custom_data=dict(members=["thierry"]))
    #
    #     channel = client.channel("messaging", None, data=dict(members=[Chat.get_user_stream_id(user) for user in self.users.all()]))
    #     channel.query()
    #     print(channel.id)
    #     for e in channel.query_members({}):
    #         print(e)
    #     super(Chat, self).save(*args, **kwargs)

# @receiver(m2m_changed, sender=Chat, dispatch_uid="update_chat")
# def update_chat(sender, instance, **kwargs):
#     print(instance.users.all())
#
#     for e in instance.users.all():
#         Chat.get_stream_token(e)
#
#     if instance.users.all().count() >= 2:
#         client = StreamChat(api_key=settings.STREAM_API_KEY,
#                             api_secret=settings.STREAM_API_SECRET)
#         channel = client.channel('messaging', instance.name)
#         user = instance.users.all()[0]
#         channel.create(Chat.get_user_stream_id(user))
#         channel.add_members([f"{Chat.get_user_stream_id(x)}" for x in instance.users.all()])
#         print('>>>>>>>>>>>>>>>>>>>>>')
#         print(channel.id)


class ChatMember(models.Model):
    chat = models.ForeignKey(Chat, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)

    def save(self, *args, **kwargs):
        client = StreamChat(api_key=settings.STREAM_API_KEY,
                            api_secret=settings.STREAM_API_SECRET)
        channel = client.channel('messaging', self.chat.name)
        # channel.create(Chat.get_user_stream_id(self.user))
        try:
            channel.add_members([Chat.get_user_stream_id(self.user)])
        except StreamAPIException:
            channel.create(Chat.get_user_stream_id(self.user))

        super(ChatMember, self).save(*args, **kwargs)

    def delete(self, *args, **kwargs):
        client = StreamChat(api_key=settings.STREAM_API_KEY,
                            api_secret=settings.STREAM_API_SECRET)
        channel = client.channel('messaging', self.chat.name)
        # channel.create(Chat.get_user_stream_id(self.user))
        channel.remove_members([Chat.get_user_stream_id(self.user)])
        super(ChatMember, self).save(*args, **kwargs)

    class Meta:
        unique_together = ('chat', 'user',)