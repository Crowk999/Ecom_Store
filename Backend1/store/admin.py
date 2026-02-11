from django.contrib import admin
# Register your models here.

from .models import Category, Product, UserProfile, Order
from .models import OrderItem, CartItem, Cart, Wishlist

admin.site.register(Category)
admin.site.register(Product)
admin.site.register(UserProfile)
admin.site.register(Order)  
admin.site.register(OrderItem)  
admin.site.register(CartItem)
admin.site.register(Cart)
admin.site.register(Wishlist)