const mongoose = require("mongoose");

// BuzzList schema (embedded document)
const bookingInfoSchema = new mongoose.Schema(
  {
    email: String,
    size: String,
    placement: String,
    comments: String,
  },
  { timestamps: true }
);

// User schema
const bookingSchema = new mongoose.Schema(
  {
    dateTime: Date,
    name: String,
    email: String,
    phone: String,
    info: [bookingInfoSchema],
  },
  { timestamps: true }
);

// Create model
const Booking = mongoose.model("Booking", bookingSchema);

// Export the model
module.exports = Booking;