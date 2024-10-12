const mongoose = require("mongoose");

// Info Schema 
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
      service: [String],
    }
  },
  { timestamps: true }
);

//Payment Schema
const paymentSchema = new mongoose.Schema(
  {
    total: Number,
    totalPaid: Number,
    complete: Boolean,
  },
  { timestamps: true }
);

// User schema
const bookingSchema = new mongoose.Schema(
  {
    dateTime: Date,
    info: bookingInfoSchema,
    payment: paymentSchema,
  },
  { timestamps: true }
);

// Create model
const Booking = mongoose.model("Booking", bookingSchema);

// Export the model
module.exports = Booking;