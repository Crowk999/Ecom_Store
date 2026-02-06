import os
from dotenv import load_dotenv
load_dotenv() 
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status
from django.contrib.auth import authenticate
from django.db import transaction
from rest_framework.authtoken.models import Token
from .models import Product, Category, Cart, CartItem, Wishlist, Order, OrderItem
from .serilizer import (
    ProductSerializer, CategorySerializer, CartItemSerializer, 
    CartSerializer, UserRegisterSerializer, OrderSerializer
)
from django.core.mail import send_mail
from django.conf import settings

def get_auth_user(request):
    """Helper to get user from Token in Authorization header"""
    auth_header = request.headers.get("Authorization")
    if not auth_header or not auth_header.startswith("Token "):
        return None
    try:
        token_key = auth_header.split(" ")[1]
        return Token.objects.get(key=token_key).user
    except (IndexError, Token.DoesNotExist):
        return None

@api_view(["POST"])
def register_user(request):
    serializer = UserRegisterSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response({"message": "User registered successfully"}, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(["POST"])
def login_user(request):
    username = request.data.get("username")
    password = request.data.get("password")
    user = authenticate(username=username, password=password)
    
    if user:
        token, _ = Token.objects.get_or_create(user=user)
        return Response({"token": token.key, "username": user.username}, status=status.HTTP_200_OK)
    return Response({"error": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)

@api_view(["POST"])
def toggle_wishlist(request):
    user = get_auth_user(request)
    if not user:
        return Response({"error": "Authentication required"}, status=status.HTTP_401_UNAUTHORIZED)

    product_id = request.data.get("product_id")
    try:
        product = Product.objects.get(id=product_id)
        wishlist, _ = Wishlist.objects.get_or_create(user=user)
        if product in wishlist.products.all():
            wishlist.products.remove(product)
            liked = False
        else:
            wishlist.products.add(product)
            liked = True
        return Response({"liked": liked, "message": "Wishlist updated"})
    except Product.DoesNotExist:
        return Response({"error": "Product not found"}, status=404)

@api_view(["GET"])
def get_wishlist(request):
    user = get_auth_user(request)
    if not user:
        return Response([]) 
    wishlist, _ = Wishlist.objects.get_or_create(user=user)
    return Response(wishlist.products.values_list('id', flat=True))

@api_view(["POST"])
@transaction.atomic
def create_order(request):
    user = get_auth_user(request)
    if not user:
        return Response({"error": "Authentication required"}, status=status.HTTP_401_UNAUTHORIZED)
    
    try:
        cart = Cart.objects.get(user=user)
        if not cart.items.exists():
            return Response({"error": "Your cart is empty. Please add items before checkout."}, status=status.HTTP_400_BAD_REQUEST)
    except Cart.DoesNotExist:
        return Response({"error": "Cart not found"}, status=status.HTTP_404_NOT_FOUND)
    
    full_name = request.data.get('full_name', '').strip()
    phone = request.data.get('phone', '').strip()
    address = request.data.get('address', '').strip()
    
    if not all([full_name, phone, address]):
        return Response({"error": "Full name, phone, and address are required"}, status=status.HTTP_400_BAD_REQUEST)
    
    # Simple phone cleaning (take only digits)
    clean_phone = ''.join(filter(str.isdigit, phone))
    if len(clean_phone) > 10:
        clean_phone = clean_phone[-10:] # Keep last 10 digits as per model constraint
    elif len(clean_phone) < 10:
        return Response({"error": "Phone number must be at least 10 digits"}, status=status.HTTP_400_BAD_REQUEST)

    order = Order.objects.create(
        user=user,
        total_amount=cart.total,
        full_name=full_name,
        phone=clean_phone,
        address=address,
        order_notes=request.data.get('order_notes', ''),
        payment_method='cash',
        status='pending'
    )
    
    for cart_item in cart.items.all():
        OrderItem.objects.create(
            order=order,
            product=cart_item.product,
            quantity=cart_item.quantity,
            price=cart_item.product.price
        )
    
    cart.items.all().delete()

    #  EMAIL TO Owner (ADMIN)
    try:
        send_mail(
            subject=f"New Order #{order.id}",
                        message=f"""
            New order placed!
            Order ID: {order.id}
            Customer: {user.email} (Username: {user.username})
            Full Name: {order.full_name}
            Phone: {order.phone}
            Total Amount: $ {order.total_amount}
            Address: {order.address}
            Notes: {order.order_notes}
            """,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[ os.getenv("EMAIL_USER")],
            fail_silently=True
        )
    except Exception as e:
        print(f"Failed to send email: {e}")

    return Response({
        "message": "Order placed successfully!",
        "order": OrderSerializer(order).data
    }, status=status.HTTP_201_CREATED)

@api_view(["GET"])
def get_products(request):
    query = request.query_params.get('search')
    products = Product.objects.filter(name__icontains=query) if query else Product.objects.all()
    return Response(ProductSerializer(products, many=True).data)

@api_view(["GET"])
def get_categories(request):
    return Response(CategorySerializer(Category.objects.all(), many=True).data)

@api_view(["GET"])
def get_product_detail(request, pk):
    try:
        return Response(ProductSerializer(Product.objects.get(pk=pk)).data)
    except Product.DoesNotExist:
        return Response({"error": "Product not found"}, status=404)

@api_view(["GET"])
def get_carts(request):
    user = get_auth_user(request)
    cart, _ = Cart.objects.get_or_create(user=user)
    return Response(CartSerializer(cart).data)

@api_view(["POST"])
def get_add_carts(request):
    product_id = request.data.get("product_id")
    quantity = int(request.data.get("quantity", 1))
    
    try:
        product = Product.objects.get(id=product_id)
        user = get_auth_user(request)
        cart, _ = Cart.objects.get_or_create(user=user)
        item, created = CartItem.objects.get_or_create(cart=cart, product=product)
        item.quantity = item.quantity + quantity if not created else quantity
        item.save()
        
        return Response({
            "message": f"Added to cart",
            "cart": CartSerializer(cart).data
        })
    except Product.DoesNotExist:
        return Response({"error": "Product not found"}, status=404)

@api_view(["POST"])
def get_remove_carts(request):
    item_id = request.data.get("item_id")
    try:
        item = CartItem.objects.get(id=item_id)
        item.delete()
        user = get_auth_user(request)
        cart, _ = Cart.objects.get_or_create(user=user)
        return Response({
            "message": "Item removed",
            "cart": CartSerializer(cart).data
        })
    except CartItem.DoesNotExist:
        return Response({"error": "Item not found"}, status=404)

@api_view(["POST"])
def update_cart_quantity(request):
    item_id = request.data.get("item_id")
    action = request.data.get("action")
    try:
        item = CartItem.objects.get(id=item_id)
        if action == "increase":
            item.quantity += 1
        elif action == "decrease":
            item.quantity -= 1
        
        if item.quantity <= 0:
            item.delete()
        else:
            item.save()
            
        user = get_auth_user(request)
        cart, _ = Cart.objects.get_or_create(user=user)
        return Response({"cart": CartSerializer(cart).data})
    except CartItem.DoesNotExist:
        return Response({"error": "Item not found"}, status=404)

@api_view(["GET"])
def get_user_orders(request):
    user = get_auth_user(request)
    if not user:
        return Response({"error": "Authentication required"}, status=status.HTTP_401_UNAUTHORIZED)
    orders = Order.objects.filter(user=user).order_by('-created_at')
    return Response(OrderSerializer(orders, many=True).data)

@api_view(["GET"])
def get_order_detail(request, pk):
    user = get_auth_user(request)
    if not user:
        return Response({"error": "Authentication required"}, status=status.HTTP_401_UNAUTHORIZED)
    try:
        order = Order.objects.get(id=pk, user=user)
        return Response(OrderSerializer(order).data)
    except Order.DoesNotExist:
        return Response({"error": "Order not found"}, status=status.HTTP_404_NOT_FOUND)


