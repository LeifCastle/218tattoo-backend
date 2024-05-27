const express = require("express");
const router = express.Router();

const cloudinary = require("cloudinary")

cloudinary.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const { Booking } = require("../models");

cloudinary.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true
});

//--POST new booking 
router.post('/new', async (req, res) => {
    const requestedBooking = req.body.newBooking;
    console.log('Booking requested for: ', requestedBooking)
    Booking.findOne({ date: requestedBooking.dateTime })
        .then(foundBooking => {
            if (foundBooking) {
                console.log(`${requestedBooking.dateTime} is already booked`)
                return res.status(401).send({
                    message: `${requestedBooking.dateTime} is already booked`,
                });
            } else {
                const newBooking = new Booking({ ...requestedBooking })
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

router.post('/signImage', async (req, res) => {
    const { paramsToSign } = req.body;
    const signature = cloudinary.utils.api_sign_request(paramsToSign, process.env.CLOUDINARY_API_SECRET);
    const url = `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/${paramsToSign.public_id}`;
    res.status(200).json({ signature });
})

router.get('/designs/:type', async (req, res) => {
    const { type } = req.params
    let images = []
    cloudinary.v2.search.expression(
        `folder:${type}/*` // add your folder
    ).execute()
        .then(results => {
            results.resources.forEach(resource => {
                images.push(resource.url)
            })
            console.log('Response: ', images)
            res.status(200).send(images);
        })
        .catch(error => {
            console.log(error)
        })

})

module.exports = router;
