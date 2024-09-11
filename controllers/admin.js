require("dotenv").config();
const { JWT_SECRET } = process.env;

const express = require("express");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const router = express.Router();
const moment = require('moment');
const { CourierClient } = require("@trycourier/courier");

const courier = new CourierClient({ authorizationToken: process.env.COURIER_API_KEY });

const { Booking } = require("../models");
const mongoose = require('mongoose');

//--Send email to user after their appointment is cancelled
const sendEmail = async (booking) => {
    try {
        const { requestId } = await courier.send({
            message: {
                to: {
                    email: booking.info.contact.email
                },
                content: {
                    title: `${booking.info.service.service} Appointment with 218 Tattoo Cancelled`,
                    body: `${booking.info.contact.firstName} we're sorry to have to cancel your appointment with us on ${moment(booking.dateTime).format('MM/DD [at] h:mm A')} We hope you'll look into trying our services again soon. 
                    
                    If you have any questions or would like to rebook with us please contact us at 360-443-1777, reply to this email, or visit our website to rebook.`,
                },
                data: {
                    name: `${booking.info.contact.firstName} ${booking.info.contact.lastName}`,
                },
                routing: {
                    method: "single", // Send through the default provider, which is Gmail SMTP
                    channels: ["email"],
                },
            },
        });

        console.log("Email sent successfully with requestId: ", requestId);
    } catch (error) {
        console.error("Error sending email: ", error);
    }
};

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
    console.log('Delete booking id: ', req.body.id)
    Booking.findByIdAndDelete(req.body.id)
        .then((booking) => {
            console.log('Deleted booking: ', booking); 
            sendEmail(booking)
            res.status(200).send({message: 'Booking deleted'})
        })
        .catch((error) => {
            console.error('Error deleting booking:', error);
            res.status(500).send({ message: 'Error deleting booking', error });
        });
});


//----GET---- get all booking appts
router.get("/", (req, res) => {
    //console.log('Booking list requested')
    Booking.find().then((allBookings) => {
        //console.log("All Bookings: ", allBookings);
        res.json(allBookings);
    });
});

module.exports = router;