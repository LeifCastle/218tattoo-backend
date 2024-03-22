require("dotenv").config();
const { JWT_SECRET } = process.env;

const express = require("express");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const router = express.Router();

const { Booking } = require("../models");

//--Login 
router.post('/login', async (req, res) => {
    const { password } = req.body;
    const adminPasswordHash = process.env.ADMIN_PASSWORD;
    const passwordMatch = await bcrypt.compare(password, adminPasswordHash);

    if (passwordMatch) {
        const token = jwt.sign({ user: 'admin' }, process.env.JWT_SECRET, { expiresIn: '8h' });
        res.json({ token });
    } else {
        res.status(401).send('Unauthorized');
    }
});


//----GET---- get all booking appointments
router.get("/", (req, res) => {
    console.log('Booking list requested')
    Booking.find().then((allBookings) => {
        console.log("All Bookings: ", allBookings);
        res.json(allBookings);
    });
});

module.exports = router;