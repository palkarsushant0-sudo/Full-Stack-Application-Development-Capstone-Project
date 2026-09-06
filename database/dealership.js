const mongoose = require("mongoose");

const dealershipSchema = new mongoose.Schema({
  id: Number,
  full_name: String,
  city: String,
  address: String,
  zip: String,
  state: String,
  lat: Number,
  long: Number,
});

module.exports = mongoose.model("Dealerships", dealershipSchema);
