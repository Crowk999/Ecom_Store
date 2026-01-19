from django.db import models
# Create your models here.

from django.contrib.auth.models import User
from django.core.validators import MinLengthValidator, RegexValidator 

class Category(models.Model):
    name = models.CharField(max_length=100, unique=True)
    slug = models.CharField(max_length=100,unique=True)

    def __str__(self):
        return self.name
    
class Product(models.Model):
    category = models.ForeignKey(Category, related_name="products", on_delete=models.CASCADE )
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    price = models.DecimalField(max_digits=10, decimal_places=3)
    image = models.ImageField(upload_to="products/",blank= True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now = True)

    def __str__(self):
       return self.name
    
class UserProfile(models.Model):
    user = models.OneToOneField( User, on_delete=models.CASCADE) 
    phone = models.CharField(
        max_length=10,  # max 10 digits
        validators=[
            MinLengthValidator(10),  # min 10 digits
            RegexValidator(r'^\d{10}$', message="Phone must be 10 digits")
        ]
    )
    address = models.TextField(blank=True)

    def __str__(self):
        return self.user.username
    
class Order(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    total_amount = models.DecimalField(max_digits=10, decimal_places=3)

    def __str__(self):
        return(f"Order:{self.id}")
    
class OrderItem(models.Model):
    order = models.ForeignKey(Order, related_name="items", on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=1)
    price = models.DecimalField(max_digits=10, decimal_places=3)

    def __str__(self):
        return(f"{self.quantity}*{self.product.name}")