from django.db import models


class Language(models.Model):
    name = models.CharField(max_length=1000, unique=True, verbose_name='Название')

    def __str__(self):
        return f'{self.name}'

    class Meta:
        verbose_name = "Язык"
        verbose_name_plural = "Языки"


class Country(models.Model):
    name = models.CharField(max_length=1000, unique=True, verbose_name='Название')

    def __str__(self):
        return f'{self.name}'

    class Meta:
        verbose_name = "Страна"
        verbose_name_plural = "Страны"


class State(models.Model):
    country = models.ForeignKey(Country, on_delete=models.CASCADE, verbose_name='Страна')
    name = models.CharField(null=False, max_length=1000, verbose_name='Название')

    def __str__(self):
        return f'{self.name}'

    class Meta:
        verbose_name = "Область"
        verbose_name_plural = "Области"


class City(models.Model):
    name = models.CharField(max_length=100, verbose_name='Название')
    state = models.ForeignKey(State, on_delete=models.CASCADE, verbose_name='Область')
    country = models.ForeignKey(Country, on_delete=models.CASCADE, verbose_name='Страна')

    def __str__(self):
        return f'{self.name}'

    class Meta:
        verbose_name = "Город"
        verbose_name_plural = "Города"
