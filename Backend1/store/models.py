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
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('processing', 'Processing'),
        ('shipped', 'Shipped'),
        ('delivered', 'Delivered'),
        ('cancelled', 'Cancelled'),
    ]
    
    PAYMENT_METHOD_CHOICES = [
        ('credit_card', 'Credit Card'),
        ('debit_card', 'Debit Card'),
        ('cod', 'Cash on Delivery'),
    ]
    
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    total_amount = models.DecimalField(max_digits=10, decimal_places=3)
    
    # Contact Information
    email = models.EmailField(max_length=255, blank=True, default='')
    phone = models.CharField(max_length=20, blank=True, default='')
    
    # Shipping Information
    full_name = models.CharField(max_length=255, blank=True, default='')
    address = models.TextField(blank=True, default='')
    city = models.CharField(max_length=100, blank=True, default='')
    state = models.CharField(max_length=100, blank=True, default='')
    country = models.CharField(max_length=100, default='Nepal')
    zip_code = models.CharField(max_length=20, blank=True, default='')
    
    # Payment Information
    payment_method = models.CharField(max_length=20, choices=PAYMENT_METHOD_CHOICES, default='cod')
    
    # Order Status
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    
    # Optional
    order_notes = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"Order #{self.id} - {self.user.username}"
    
class OrderItem(models.Model):
    order = models.ForeignKey(Order, related_name="items", on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=1)
    price = models.DecimalField(max_digits=10, decimal_places=3)

    def __str__(self):
        return(f"{self.quantity}*{self.product.name}")

class Cart(models.Model):
    user = models.ForeignKey(UserProfile, on_delete=models.CASCADE, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return(f"Cart {self.id} for {self.user}")

    @property
    def total(self):
        return sum(item.subtotal for item in self.items.all())

class CartItem(models.Model):
    cart = models.ForeignKey(Cart, related_name="items", on_delete=models.CASCADE )
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=1)

    def __str__(self):
        return (f"{self.quantity} X {self.product}")
    
    @property
    def subtotal(self):
        return self.quantity * self.product.price

class Wishlist(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="wishlist")
    products = models.ManyToManyField(Product, blank=True, related_name="wishlists")
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Wishlist for {self.user.username}"

