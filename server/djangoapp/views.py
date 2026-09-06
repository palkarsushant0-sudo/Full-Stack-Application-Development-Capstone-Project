import json
import logging

from django.contrib.auth import login, logout, authenticate
from django.contrib.auth.models import User
from django.http import JsonResponse
from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt

from .models import CarMake, CarModel
from .restapis import (
    analyze_review_sentiments,
    get_dealer_by_id_from_cf,
    get_dealer_reviews_from_cf,
    get_dealers_by_state_from_cf,
    get_dealers_from_cf,
    post_review,
)

logger = logging.getLogger(__name__)


# ---------- Static / template pages ----------

def get_index(request):
    context = {}
    return render(request, "djangoapp/index.html", context)


def about(request):
    return render(request, "djangoapp/about.html")


def contact(request):
    return render(request, "djangoapp/contact.html")


# ---------- Auth ----------

@csrf_exempt
def login_user(request):
    """Task 5: cURL login endpoint."""
    data = json.loads(request.body)
    username = data["userName"]
    password = data["password"]
    user = authenticate(username=username, password=password)
    data = {"userName": username}
    if user is not None:
        login(request, user)
        data["status"] = "Authenticated"
    else:
        data["status"] = "Failed"
    return JsonResponse(data)


def logout_request(request):
    """Task 6: cURL logout endpoint."""
    username = request.user.username if request.user.is_authenticated else ""
    logout(request)
    data = {"userName": ""}
    return JsonResponse(data)


@csrf_exempt
def registration(request):
    """Handles POST from Register.jsx (Task 7)."""
    data = json.loads(request.body)
    username = data["userName"]
    password = data["password"]
    first_name = data["firstName"]
    last_name = data["lastName"]
    email = data["email"]

    if User.objects.filter(username=username).exists():
        return JsonResponse({"userName": username, "error": "Already Registered"})

    user = User.objects.create_user(
        username=username,
        first_name=first_name,
        last_name=last_name,
        password=password,
        email=email,
    )
    login(request, user)
    return JsonResponse({"userName": username, "status": "Authenticated"})


# ---------- Cars ----------

def get_cars(request):
    """Tasks 14/15: return all car makes and models."""
    count = CarMake.objects.count()
    if count == 0:
        initiate()
    car_models = CarModel.objects.select_related("car_make")
    cars = [
        {"CarModel": cm.name, "CarMake": cm.car_make.name}
        for cm in car_models
    ]
    return JsonResponse({"CarModels": cars})


def initiate():
    """Seed a few makes/models so /get_cars returns data out of the box."""
    seed = {
        "Toyota": ["Corolla", "Camry", "RAV4"],
        "Ford": ["Mustang", "F-150", "Explorer"],
        "Honda": ["Civic", "Accord", "CR-V"],
    }
    for make_name, models_list in seed.items():
        make, _ = CarMake.objects.get_or_create(
            name=make_name, defaults={"description": f"{make_name} vehicles"}
        )
        for model_name in models_list:
            CarModel.objects.get_or_create(
                car_make=make, name=model_name, type="sedan",
