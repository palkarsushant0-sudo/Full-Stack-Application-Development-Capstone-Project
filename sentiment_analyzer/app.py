"""
Lightweight Flask microservice that returns sentiment (positive/negative/neutral)
for a piece of review text, using NLTK's VADER lexicon so it needs no external API key.

Endpoint used for grading (Task 16):
  GET /analyze/<text>
"""
from flask import Flask, jsonify
from flask_cors import CORS
import nltk
from nltk.sentiment.vader import SentimentIntensityAnalyzer

nltk.download("vader_lexicon", quiet=True)

app = Flask(__name__)
CORS(app)

analyzer = SentimentIntensityAnalyzer()


def classify(text):
    scores = analyzer.polarity_scores(text)
    compound = scores["compound"]
    if compound >= 0.05:
        return "positive"
    elif compound <= -0.05:
        return "negative"
    return "neutral"


@app.route("/")
def index():
    return "Sentiment analyzer is running. Use GET /analyze/<text>"


@app.route("/analyze/<path:text>", methods=["GET"])
def analyze(text):
    sentiment = classify(text)
    return jsonify({"sentiment": sentiment})


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5050, debug=True)
