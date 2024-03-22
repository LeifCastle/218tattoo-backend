const express = require("express");
const router = express.Router();

const { Booking } = require("../models");

//--POST new booking 
router.post('/new', async (req, res) => {
    const requestedBooking = req.body.newBooking;
    console.log('Booking requested for: ', requestedBooking)
    Booking.findOne({ date: requestedBooking.date })
        .then(foundBooking => {
            if (foundBooking) {
                console.log(`${requestedBooking.date} is already booked`)
                return res.status(401).send({
                    message: `${requestedBooking.date} is already booked`,
                });
            } else {
                const newBooking = new Booking({...requestedBooking})
                newBooking
                    .save()
                    .then(createdBooking => {
                        console.log('Creating new Booking: ', createdBooking)
                        return res.json({ booking: createdBooking })
                    })
                    .catch((err) => {
                        console.log("Error creating new booking", err);
                        res.json({ message: "Error occured... Please try again." });
                    });
            }
        })
        .catch(error => {
            console.log('Error: ', error)
        })

});


module.exports = router;
