from django.db import models
from django.utils.timezone import now


class CarMake(models.Model):
    """A car manufacturer, e.g. Toyota, Ford."""
    name = models.CharField(max_length=100)
    description = models.TextField()

    def __str__(self):
        return self.name


class CarModel(models.Model):
    SEDAN = "sedan"
    SUV = "suv"
    WAGON = "wagon"
    HATCHBACK = "hatchback"
    TRUCK = "truck"
    CAR_TYPES = [
        (SEDAN, "Sedan"),
        (SUV, "SUV"),
        (WAGON, "Wagon"),
        (HATCHBACK, "Hatchback"),
        (TRUCK, "Truck"),
    ]

    car_make = models.ForeignKey(CarMake, on_delete=models.CASCADE, related_name="models")
    name = models.CharField(max_length=100)
    type = models.CharField(max_length=20, choices=CAR_TYPES, default=SEDAN)
    year = models.IntegerField(default=2023)
    dealer_id = models.IntegerField()  # links to dealer stored in the Node/Mongo microservice

    def __str__(self):
        return f"{self.car_make.name} {self.name}"
