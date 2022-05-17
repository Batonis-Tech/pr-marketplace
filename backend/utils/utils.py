import string
from datetime import datetime, timedelta
from itertools import chain
from random import choice

import django_filters
from django.contrib.auth.hashers import make_password
from django.core.exceptions import ValidationError
from django.db.models import Q
from rest_framework.pagination import PageNumberPagination
from transliterate import translit
from django.utils.translation import gettext_lazy as _

class StandardResultsSetPagination(PageNumberPagination):
    page_size = 20
    page_size_query_param = 'page_size'
    max_page_size = 1000

def get_client_ip(request):
  x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
  if x_forwarded_for:
    ip = x_forwarded_for.split(',')[0]
  else:
    ip = request.META.get('REMOTE_ADDR')
  return ip

def validate_password(self, value: str) -> str:
    """
    Hash value passed by user.
    :param value: password of a user
    :return: a hashed version of the password
    """
    return make_password(value)


def get_token(length=15, only_digits=False):
    rand_str = lambda n: ''.join([choice(string.ascii_lowercase) for i in range(n)])
    if only_digits:
        rand_str = lambda n: ''.join([choice(string.digits) for i in range(n)])
    set_id = rand_str(length)
    return set_id


def parse_int(s, base=10, val=None):
    try:
        a = int(s, base)
        return a
    except:
        return val


def parse_bool(s, val=False):
    try:
        if s.lower() in ['true', '1', 't', 'y', 'yes']:
            return True
        if s.lower() in ['false', '0', 'n', 'no']:
            return False
    except:
        return val




def time_to_tz_naive(t, tz_in, tz_out):
    return tz_in.localize(datetime.combine(datetime.today(), t)).astimezone(tz_out).time()



def my_translit(text):
    text = text.strip()
    try:
        text = translit(text, reversed=True)
    except:
        print('Translit false')
    text = "".join(e for e in text if e.isalnum())
    return text


def validate_positive(value):
    if value < 0:
        raise ValidationError(
            _('%(value)s is not an even number'),
            params={'value': value},
        )


def insert_keys_to_string(str, dict_of_values):
    t = string.Template(str)
    return t.safe_substitute(**dict_of_values)


def filter_array_by_unique_together(array, keys_array=[]):
    buffer_dict = {}
    for e in array:
        my_tuple = tuple([e[key] for key in keys_array])
        if my_tuple not in buffer_dict:
            buffer_dict[my_tuple] = e
    return buffer_dict.values()

def filter_queryset_by_unique_together(qs):
    buffer_dict = {}
    for e in qs:
        my_tuple = (e.key, e.value)
        if my_tuple not in buffer_dict:
            buffer_dict[my_tuple] = e
    return list(buffer_dict.values())

def yearsago(years, from_date=None):
    if from_date is None:
        from_date = datetime.now()
    try:
        return from_date.replace(year=from_date.year - years)
    except ValueError:
        # Must be 2/29!
        assert from_date.month == 2 and from_date.day == 29 # can be removed
        return from_date.replace(month=2, day=28,
                                 year=from_date.year-years)
        # If it's 2/29, and 18 years ago there was no 2/29, this function will return 2/28.
        # If you'd rather return 3/1, just change the last return statement to read:
        # return from_date.replace(month=3, day=1,
        #                          year=from_date.year - years)

def num_years(begin, end=None):
    if end is None:
        end = datetime.now()
    num_years = int((end - begin).days / 365.2425)
    if begin > yearsago(num_years, end):
        return num_years - 1
    else:
        return num_years

class CharInFilter(django_filters.rest_framework.BaseInFilter, django_filters.rest_framework.CharFilter):
    pass