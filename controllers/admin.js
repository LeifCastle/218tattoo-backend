require("dotenv").config();
const { JWT_SECRET } = process.env;

const express = require("express");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const router = express.Router();

const { Booking } = require("../models");
const mongoose = require('mongoose');

//--Login 
router.post('/login', async (req, res) => {
    const { user, password } = req.body;
    const adminPasswordHash = process.env.ADMIN_PASSWORD;
    const passwordMatch = await bcrypt.compare(password, adminPasswordHash);

    if (passwordMatch && user === "admin") {
        const token = jwt.sign({ user: 'admin' }, process.env.JWT_SECRET, { expiresIn: '8h' });
        res.json({ token });
    } else {
        res.status(401).send('Unauthorized');
    }
});

//----DELETE---- delete a booking appt
router.post("/cancelBooking", (req, res) => {
    console.log('Delete booking: ', req.body.id)
    Booking.findByIdAndDelete(req.body.id)
        .then((booking) => {
            console.log('Deleted booking: ', booking); // Check if the booking is found
            res.status(200).send({message: 'Booking deleted'})
        })
        .catch((error) => {
            console.error('Error deleting booking:', error);
            res.status(500).send({ message: 'Error deleting booking', error });
        });
});


//----GET---- get all booking appts
router.get("/", (req, res) => {
    console.log('Booking list requested')
    Booking.find().then((allBookings) => {
        console.log("All Bookings: ", allBookings);
        res.json(allBookings);
    });
});

module.exports = router;