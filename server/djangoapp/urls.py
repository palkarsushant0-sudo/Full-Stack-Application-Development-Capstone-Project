from django.urls import path
from django.conf.urls.static import static
from django.conf import settings

from . import views

app_name = "djangoapp"

urlpatterns = [
    path("", views.get_index, name="index"),
    path("about/", views.about, name="about"),
    path("contact/", views.contact, name="contact"),

    # Auth (Tasks 5, 6, 7)
    path("login", views.login_user, name="login"),
    path("logout", views.logout_request, name="logout"),
    path("register", views.registration, name="register"),

    # Cars (Tasks 14/15)
    path("get_cars", views.get_cars, name="getcars"),

    # Dealers (Tasks 9, 10, 11)
    path("get_dealers", views.get_dealerships, name="get_dealers"),
    path("get_dealers/<str:state>", views.get_dealerships, name="get_dealers_by_state"),
    path("get_dealer/<int:dealer_id>", views.get_dealer_details, name="get_dealer_details"),

    # Reviews (Task 8, add review)
    path("get_dealer_reviews/<int:dealer_id>", views.get_dealer_reviews, name="get_dealer_reviews"),
    path("add_review", views.add_review, name="add_review"),
]

if settings.DEBUG:
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATICFILES_DIRS[0])
