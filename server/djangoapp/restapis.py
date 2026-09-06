"""
Helper functions that call the external Node.js/Express/MongoDB microservice
(dealer + review data) and the Flask sentiment-analysis microservice.
"""
import os
import requests
from django.conf import settings

backend_url = os.environ.get("BACKEND_URL", settings.BACKEND_URL)
sentiment_analyzer_url = os.environ.get(
    "SENTIMENT_ANALYZER_URL", settings.SENTIMENT_ANALYZER_URL
)


def get_request(endpoint, **kwargs):
    params = "&".join(f"{k}={v}" for k, v in kwargs.items())
    request_url = f"{backend_url}{endpoint}?{params}" if params else f"{backend_url}{endpoint}"
    try:
        response = requests.get(request_url, timeout=10)
        return response.json()
    except Exception as err:
        print(f"Network exception occurred calling {request_url}: {err}")
        return {"status": 500, "message": str(err)}


def analyze_review_sentiments(text):
    request_url = f"{sentiment_analyzer_url}/analyze/{text}"
    try:
        response = requests.get(request_url, timeout=10)
        return response.json()
    except Exception as err:
        print(f"Network exception occurred calling {request_url}: {err}")
        return {"sentiment": "neutral"}


def post_review(data_dict):
    request_url = f"{backend_url}/insert_review"
    try:
        response = requests.post(request_url, json=data_dict, timeout=10)
        return response.json()
    except Exception as err:
        print(f"Network exception occurred calling {request_url}: {err}")
        return {"status": 500, "message": str(err)}


def get_dealers_from_cf(endpoint="/fetchDealers"):
    return get_request(endpoint)


def get_dealer_by_id_from_cf(endpoint, dealer_id):
    return get_request(endpoint, id=dealer_id)


def get_dealers_by_state_from_cf(endpoint, state):
    return get_request(endpoint, state=state)


def get_dealer_reviews_from_cf(endpoint, dealer_id):
    return get_request(endpoint, dealerId=dealer_id)
