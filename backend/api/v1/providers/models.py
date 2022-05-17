from django.core.exceptions import ValidationError
from django.core.validators import MinValueValidator, MaxValueValidator
from django.db import models, IntegrityError
from django.db.models.signals import post_save
from django.dispatch import receiver
from django_quill.fields import QuillField

from api.v1.billing.models import BillingAccount
from api.v1.images.models import Image
from api.v1.providers.constants import PROVIDER_STATUS_CHOICES, AWAITING, ACTIVE, REJECTED
from api.v1.users.models import User
from utils.geo.models import Country, State, City, Language


class ProviderTheme(models.Model):
    name = models.CharField(null=False, max_length=1000, verbose_name='Название')

    def __str__(self):
        return f"{self.name}"

    class Meta:
        verbose_name = 'Тематика'
        verbose_name_plural = 'Тематики'


class ProviderType(models.Model):
    name = models.CharField(null=False, max_length=1000, verbose_name='Название')

    def __str__(self):
        return f"{self.name}"

    class Meta:
        verbose_name = 'Тип СМИ'
        verbose_name_plural = 'Типы СМИ'


class ProviderPublicationFormat(models.Model):
    name = models.CharField(null=False, max_length=1000, verbose_name='Название')

    def __str__(self):
        return f"{self.name}"

    class Meta:
        verbose_name = 'Формат публикации'
        verbose_name_plural = 'Форматы публикаций'


class ProviderDomain(models.Model):
    name = models.CharField(null=False, max_length=1000, verbose_name='Название')

    def __str__(self):
        return f"{self.name}"

    class Meta:
        verbose_name = 'Домен'
        verbose_name_plural = 'Домены'


class Aggregator(models.Model):
    name = models.CharField(null=False, max_length=1000, verbose_name='Название')

    def __str__(self):
        return f"{self.name}"

    class Meta:
        verbose_name = 'Агрегатор'
        verbose_name_plural = 'Агрегаторы'

class PublicationTheme(models.Model):
    name = models.CharField(null=False, max_length=1000, verbose_name='Название')

    def __str__(self):
        return f"{self.name}"

    class Meta:
        verbose_name = 'Тема публикации'
        verbose_name_plural = 'Темы публикаций'


class ProviderKeyWord(models.Model):
    name = models.CharField(null=False, max_length=1000, verbose_name='Название')

    def __str__(self):
        return f"{self.name}"

    class Meta:
        verbose_name = 'Ключевое словo'
        verbose_name_plural = 'Ключевые слова'


class AnnounsmentType(models.Model):
    name = models.CharField(null=False, max_length=1000, verbose_name='Название')

    def __str__(self):
        return f"{self.name}"

    class Meta:
        verbose_name = 'Тип анонса'
        verbose_name_plural = 'Типы анонсов'

class Provider(models.Model):
    ## Main
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, verbose_name='Владелец')
    name = models.CharField(null=False, max_length=500, verbose_name='Название')
    url = models.URLField(null=True, verbose_name='Ссылка на сайт')
    logo = models.ForeignKey(Image, null=True, on_delete=models.SET_NULL, verbose_name='Логотип')
    birthday = models.DateField(null=False, verbose_name='Дата создания')
    is_active = models.BooleanField(default=False, verbose_name='Доступно ли')
    description = QuillField(null=True, verbose_name='Описание')
    status = models.CharField(max_length=1000, choices=PROVIDER_STATUS_CHOICES, default=AWAITING)

    country = models.ManyToManyField(Country, blank=True, verbose_name='Страны')
    state = models.ManyToManyField(State, blank=True, verbose_name='Области')
    city = models.ManyToManyField(City, blank=True, verbose_name='Города')
    languages = models.ManyToManyField(Language, blank=True, verbose_name='Языки')

    themes = models.ManyToManyField(ProviderTheme, blank=True, verbose_name='Тематики')
    types = models.ManyToManyField(ProviderType, blank=True)
    keywords = models.ManyToManyField(ProviderKeyWord, blank=True, verbose_name='Ключевые слова')
    domains = models.ManyToManyField(ProviderDomain, blank=True, verbose_name='Домены')

    aggregators = models.ManyToManyField(Aggregator, blank=True, verbose_name='Агрегаторы')
    allowed_publication_themes = models.ManyToManyField(PublicationTheme, blank=True, verbose_name='Разрешенные темы')
    # publication_format = models.ManyToManyField(ProviderPublicationFormat, blank=True)

    # Indicators
    index_yandex = models.IntegerField(default=0, validators=[MinValueValidator(0), MaxValueValidator(100)])
    index_google = models.IntegerField(default=0, validators=[MinValueValidator(0), MaxValueValidator(100)])

    index_yandex_news = models.IntegerField(default=0, validators=[MinValueValidator(0), MaxValueValidator(100)])
    index_google_news = models.IntegerField(default=0, validators=[MinValueValidator(0), MaxValueValidator(100)])

    index_trust_checktrust = models.IntegerField(default=0, validators=[MinValueValidator(0), MaxValueValidator(100)])
    index_domain_donors = models.IntegerField(default=0, validators=[MinValueValidator(0), MaxValueValidator(100)])
    index_spam_checktrust = models.IntegerField(default=0, validators=[MinValueValidator(0), MaxValueValidator(100)])
    index_IKS = models.IntegerField(default=0)
    index_organic_traffic = models.IntegerField(default=0)
    index_traffic = models.IntegerField(default=0)
    index_CF = models.IntegerField(default=0)
    index_TF = models.IntegerField(default=0)
    index_TR = models.IntegerField(default=0)
    index_DR = models.IntegerField(default=0)
    index_alexa_rank = models.IntegerField(default=0)
    index_da_moz = models.IntegerField(default=0)
    index_a_hrefs = models.IntegerField(default=0)
    index_backlinks = models.IntegerField(default=0)

    finded_link_exchange = models.BooleanField(default=False)

    # Services
    writing = models.BooleanField(default=False, verbose_name='Есть ли написание')
    advertising_mark = models.BooleanField(default=False, verbose_name='Пометка о рекламе')
    days_to_prod = models.IntegerField(default=0, validators=[MinValueValidator(0)],
                                       verbose_name='Сколько нужно дней на публикацию')
    links = models.IntegerField(default=0, validators=[MinValueValidator(0), MaxValueValidator(100)])
    announsment = models.ForeignKey(AnnounsmentType, null=True, blank=True, on_delete=models.SET_NULL,
                                    verbose_name='Анонс')


    created_at = models.DateTimeField(auto_now_add=True)

    # def clean(self):
    #     if self.city.state != self.state:
    #         raise ValidationError('self.city.state != self.state')
    #
    #     if self.country != self.state.country:
    #         raise ValidationError('self.country != self.state.country')
    #
    #     if self.city.country != self.state.country:
    #         raise ValidationError('self.country != self.state.country')

    def __str__(self):
        return f"{self.name}"

    class Meta:
        verbose_name = 'СМИ'
        verbose_name_plural = 'СМИ'
        app_label = 'providers'

    def approve_moderation(self):
        if self.status not in [ACTIVE]:
            self.status = ACTIVE
            self.is_active = True
            # congrats email
            self.save()
            return True, "Success"
        return False, "Already active"

    def reject_moderation(self):
        if self.status in [AWAITING]:
            self.status = REJECTED
            # congrats email
            self.save()
            return True, "Rejected"
        return False, "Not in moderation"

@receiver(post_save, sender=Provider)
def create_billing_account(sender, instance, **kwargs):
    if not BillingAccount.objects.filter(provider=instance).exists():
        account = BillingAccount.objects.create(provider=instance)