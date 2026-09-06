const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
const port = process.env.PORT || 3030;

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URL || "mongodb://mongo_db:27017/dealershipsDB");

const Reviews = require("./review");
const Dealerships = require("./dealership");

// Seed data on first run
const review_data = JSON.parse(require("fs").readFileSync("data/reviews.json", "utf8"));
const dealership_data = JSON.parse(require("fs").readFileSync("data/dealerships.json", "utf8"));

(async () => {
  try {
    if ((await Reviews.countDocuments()) === 0) {
      await Reviews.insertMany(review_data.reviews);
    }
    if ((await Dealerships.countDocuments()) === 0) {
      await Dealerships.insertMany(dealership_data.dealerships);
    }
  } catch (err) {
    console.error("Seed error:", err);
  }
})();

app.get("/", (req, res) => {
  res.send("Welcome to the Cars Dealership backend (dealers + reviews microservice)");
});

// GET all reviews for a given dealer
app.get("/fetchReviews", async (req, res) => {
  const documents = await Reviews.find();
  res.json(documents);
});

app.get("/fetchReviews/dealer/:id", async (req, res) => {
  const documents = await Reviews.find({ dealership: req.params.id });
  res.json(documents);
});

// GET all dealers
app.get("/fetchDealers", async (req, res) => {
  const documents = await Dealerships.find();
  res.json(documents);
});

// GET dealers by state
app.get("/fetchDealers/state/:state", async (req, res) => {
  const documents = await Dealerships.find({ state: req.params.state });
  res.json(documents);
});

// GET dealer by id
app.get("/fetchDealer/:id", async (req, res) => {
  const document = await Dealerships.findOne({ id: req.params.id });
  res.json(document);
});

// POST a new review
app.post("/insert_review", express.json(), async (req, res) => {
  const data = req.body;
  const documents = await Reviews.find().sort({ id: -1 });
  let new_id = documents.length > 0 ? documents[0].id + 1 : 1;

  const review = new Reviews({
    id: new_id,
    name: data.name,
    dealership: data.dealership,
    review: data.review,
    purchase: data.purchase,
    purchase_date: data.purchase_date,
    car_make: data.car_make,
    car_model: data.car_model,
    car_year: data.car_year,
  });

  try {
    const savedReview = await review.save();
    res.json(savedReview);
  } catch (error) {
    res.status(500).json({ error: "Error inserting review", details: error });
  }
});

app.listen(port, () => console.log(`Dealers/reviews microservice listening on port ${port}`));
