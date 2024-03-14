const express = require("express");
const cors = require("cors");
const app = express();
const { Booking } = require("./models");

// middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());
app.use(passport.initialize());

//----GET---- get all booking appointments
app.get("/bookings", (req, res) => {
  Booking.find().then((allBookings) => {
    console.log("All Bookings: ", allBookings);
    res.json(allBookings);
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server connected to PORT: ${PORT}`);
});

module.exports = app;