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
    path("login/", views.login_user, name="login"),
    path("logout/", views.logout_request, name="logout"),
    path("register/", views.registration, name="register"),
    # Cars (Tasks 14/15)
    path("get_cars/", views.get_cars, name="getcars"),
    # Dealers (Tasks 9, 10, 11) - renamed to required "fetch..." convention
    path("fetchDealers/", views.get_dealerships, name="fetchDealers"),
    path("fetchDealers/<str:state>/", views.get_dealerships, name="fetchDealersByState"),
    path("fetchDealer/<int:dealer_id>/", views.get_dealer_details, name="fetchDealerById"),
    # Reviews (Task 8, add review) - matches required endpoint pattern
    path("fetchReviews/dealer/<int:dealer_id>/", views.get_dealer_reviews, name="fetchDealerReviews"),
    path("add_review/", views.add_review, name="add_review"),
]

if settings.DEBUG and settings.STATICFILES_DIRS:
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATICFILES_DIRS[0])
