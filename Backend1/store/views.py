from rest_framework.response import Response
from rest_framework.decorators import api_view
from .models import Product, Category, Cart, CartItem, Wishlist, Order, OrderItem
from .serilizer import ProductSerializer, CategorySerializer, CartItemSerializer, CartSerializer, UserRegisterSerializer, OrderSerializer, OrderItemSerializer
from django.contrib.auth import authenticate
from rest_framework.authtoken.models import Token
from rest_framework import status

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
    token_key = request.headers.get("Authorization")
    if not token_key:
        return Response({"error": "Authentication required"}, status=status.HTTP_401_UNAUTHORIZED)
    
    # Simple token extraction (Token <key>)
    try:
        key = token_key.split(" ")[1]
        token = Token.objects.get(key=key)
        user = token.user
    except:
        return Response({"error": "Invalid token"}, status=status.HTTP_401_UNAUTHORIZED)

    product_id = request.data.get("product_id")
    if not product_id:
        return Response({"error": "Product ID required"}, status=400)
    
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
    token_key = request.headers.get("Authorization")
    if not token_key:
        return Response([]) 
    
    try:
        key = token_key.split(" ")[1]
        token = Token.objects.get(key=key)
        user = token.user
        wishlist, _ = Wishlist.objects.get_or_create(user=user)
        # Return list of product IDs
        return Response(wishlist.products.values_list('id', flat=True))
    except:
        return Response([])

@api_view(["POST"])
def create_order(request):
    """Create an order from the current cart - Simplified for Nepal COD"""
    # Check authentication
    token_key = request.headers.get("Authorization")
    if not token_key:
        return Response({"error": "Authentication required"}, status=status.HTTP_401_UNAUTHORIZED)
    
    try:
        key = token_key.split(" ")[1]
        token = Token.objects.get(key=key)
        user = token.user
    except:
        return Response({"error": "Invalid token"}, status=status.HTTP_401_UNAUTHORIZED)
    
    # Get cart
    try:
        cart = Cart.objects.get(user=None)  # Guest cart
        if not cart.items.exists():
            return Response({"error": "Cart is empty"}, status=status.HTTP_400_BAD_REQUEST)
    except Cart.DoesNotExist:
        return Response({"error": "Cart not found"}, status=status.HTTP_404_NOT_FOUND)
    
    # Get required fields from request
    full_name = request.data.get('full_name', '').strip()
    phone = request.data.get('phone', '').strip()
    address = request.data.get('address', '').strip()
    
    # Validate required fields
    if not full_name:
        return Response({"error": "Full name is required"}, status=status.HTTP_400_BAD_REQUEST)
    if not phone:
        return Response({"error": "Phone number is required"}, status=status.HTTP_400_BAD_REQUEST)
    if not address:
        return Response({"error": "Delivery address is required"}, status=status.HTTP_400_BAD_REQUEST)
    
    # Create order with simplified data
    order = Order.objects.create(
        user=user,
        total_amount=cart.total,
        full_name=full_name,
        phone=phone,
        address=address,
        email=request.data.get('email', 'customer@example.com'),
        city=request.data.get('city', 'Kathmandu'),
        state=request.data.get('state', ''),
        country=request.data.get('country', 'Nepal'),
        zip_code=request.data.get('zip_code', '44600'),
        payment_method='cod',  # Always Cash on Delivery
        order_notes=request.data.get('order_notes', ''),
        status='pending'
    )
    
    # Create order items from cart
    for cart_item in cart.items.all():
        OrderItem.objects.create(
            order=order,
            product=cart_item.product,
            quantity=cart_item.quantity,
            price=cart_item.product.price
        )
    
    # Clear the cart
    cart.items.all().delete()
    
    # Return success response
    serializer = OrderSerializer(order)
    return Response({
        "message": "Order placed successfully! We will contact you soon.",
        "order": serializer.data
    }, status=status.HTTP_201_CREATED)

@api_view(["GET"])
def get_products(request):
    query = request.query_params.get('search')
    if query:
        products = Product.objects.filter(name__icontains=query)
    else:
        products = Product.objects.all()
    serializer = ProductSerializer(products, many=True)
    return Response(serializer.data)

@api_view(["GET"])
def get_categories(request):
    categories = Category.objects.all()
    serializer = CategorySerializer(categories, many=True)
    return Response(serializer.data)

@api_view(["GET"])
def get_product_detail(request, pk):
    try:
        product = Product.objects.get(pk=pk)
    except Product.DoesNotExist:
        return Response(status=404)
    serializer = ProductSerializer(product)
    return Response(serializer.data)

@api_view(["GET"])
def get_carts(request):
    cart, created = Cart.objects.get_or_create(user=None)
    serializer = CartSerializer(cart)
    return Response(serializer.data)

@api_view(["POST"]) # Adding to the cart
def get_add_carts(request):
    product_id = request.data.get("product_id")
    # Get optional quantity from request, default to 1
    quantity = int(request.data.get("quantity", 1))
    
    product = Product.objects.get(id=product_id)
    cart, created = Cart.objects.get_or_create(user=None)
    item, created = CartItem.objects.get_or_create(cart= cart, product= product)

    if not created:
        item.quantity += quantity
    else:
        # If it was just created, it has default=1. 
        # But we want to set it to the requested quantity.
        item.quantity = quantity
    item.save()
    
    return Response({
        "message" : f"Added {quantity} unit(s) to cart",
        "cart" : CartSerializer(cart).data
    })


@api_view(["POST"])
def get_remove_carts(request):
    item_id = request.data.get("item_id")
    if not item_id:
        return Response({"error": "item_id is required"}, status=400)
    
    try:
        item = CartItem.objects.get(id=item_id)
        item.delete()
    except CartItem.DoesNotExist:
        return Response({"error": "Item not found"}, status=404)

    cart, created = Cart.objects.get_or_create(user=None)

    return Response({
        "message": "Item removed from  cart",
        "cart" : CartSerializer(cart).data
    })

@api_view(["POST"])
def update_cart_quantity(request):
    item_id = request.data.get("item_id")
    action = request.data.get("action") # "increase" or "decrease"

    if not item_id or not action:
        return Response({"error": "item_id and action are required"}, status=400)

    try:
        item = CartItem.objects.get(id=item_id)
        if action == "increase":
            item.quantity += 1
            item.save()
        elif action == "decrease":
            item.quantity -= 1
            if item.quantity <= 0:
                item.delete()
            else:
                item.save()
        else:
             return Response({"error": "Invalid action"}, status=400)
             
    except CartItem.DoesNotExist:
        return Response({"error": "Item not found"}, status=404)

    cart, created = Cart.objects.get_or_create(user=None)
    return Response({
        "message": "Cart updated",
        "cart": CartSerializer(cart).data
    })