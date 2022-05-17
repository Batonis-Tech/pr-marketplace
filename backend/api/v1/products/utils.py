def get_cost(products, options):
    return sum(item.price for item in products) + sum(item['option'].price * item['quantity'] for item in options)
