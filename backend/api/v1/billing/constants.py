EMPTY = ''
FROZEN = 'Заморожено'
UNFROZEN = 'Разморожено'
ORDER_PAYMENT = 'Оплата'
WITHDRAWAL = 'Вывод средств'
DEPOSIT = 'Начисление средств'
COMMISSION = 'Комиссия'

TRANSACTION_TYPE_CHOICES = (
    (EMPTY, ''),
    (FROZEN, 'Заморожено'),
    (UNFROZEN, 'Разморожено'),
    (ORDER_PAYMENT, 'Оплата'),
    (WITHDRAWAL, 'Вывод средств'),
    (DEPOSIT, 'Начисление средств'),
    (COMMISSION, 'Комиссия'),
)