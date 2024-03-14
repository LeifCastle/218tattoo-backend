const express = require("express");
const router = express.Router();
const { Booking } = require("../models");

//----GET---- get all booking appointments
router.get("/", (req, res) => {
    console.log('requested')
  Booking.find().then((allBookings) => {
    console.log("All Bookings: ", allBookings);
    res.json(allBookings);
  });
});

module.exports = router;