from django.urls import path
from store.views import get_categories, get_product

urlpatterns = [
    path("products/", get_product, name="get-products"),
    path("categories/", get_categories, name="get-categories")
]
