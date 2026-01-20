from django.urls import path
from store.views import get_categories, get_products, get_product_detail, get_carts, get_add_carts, get_remove_carts, update_cart_quantity, register_user, login_user, toggle_wishlist, get_wishlist, create_order

urlpatterns = [
    path("products/", get_products, name="get-products"),
    path("products/<int:pk>/", get_product_detail, name="get-product-detail"),
    path("categories/", get_categories, name="get-categories"),
    path("carts/", get_carts, name="get-carts"),
    path("carts/add", get_add_carts, name="get-add-carts"),
    path("carts/remove", get_remove_carts, name = "get-remove-carts"),
    path("carts/update", update_cart_quantity, name="update-cart-quantity"),
    path("register/", register_user, name="register"),
    path("login/", login_user, name="login"),
    path("wishlist/toggle", toggle_wishlist, name="toggle-wishlist"),
    path("wishlist/", get_wishlist, name="get-wishlist"),
    path("orders/create", create_order, name="create-order"),
]
