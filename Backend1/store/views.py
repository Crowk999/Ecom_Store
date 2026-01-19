from django.shortcuts import render
from django.http import JsonResponse

# Create your views here.

def home(request):
    data = {
        "message": "Welcome to my ecom store"
    }
    return(JsonResponse(data))
