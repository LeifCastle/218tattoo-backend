const mongoose = require("mongoose");

// BuzzList schema (embedded document)
const bookingInfoSchema = new mongoose.Schema(
  {
    contact: {
      firstName: String,
      lastName: String,
      email: String,
      phone: String,
    },
    service: {
      size: String,
      placement: String,
      count: Number,
      design: String,
      comments: String,
      referencePhotos: [String],
      tattooDesign: String,
      service: String,
    }
  },
  { timestamps: true }
);

// User schema
const bookingSchema = new mongoose.Schema(
  {
    dateTime: Date,
    info: bookingInfoSchema,
  },
  { timestamps: true }
);

// Create model
const Booking = mongoose.model("Booking", bookingSchema);

// Export the model
module.exports = Booking;