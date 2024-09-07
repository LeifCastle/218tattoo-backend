const express = require("express");
const router = express.Router();
const cloudinary = require("cloudinary")
const { CourierClient } = require("@trycourier/courier");
const moment = require('moment');

const courier = new CourierClient({ authorizationToken: process.env.COURIER_API_KEY });

const { Booking } = require("../models");

cloudinary.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true
});

//--Send email to user after the book an appt
const sendEmail = async (booking) => {
    try {
        const { requestId } = await courier.send({
            message: {
                to: {
                    email: booking.contact.email
                },
                content: {
                    title: `${booking.service.service} Appointment with 218 Tattoo`,
                    body: `Thank you for booking with us ${booking.contact.firstName}! We look forward to seeing you on ${moment(booking.appointment.dateTime).format('MM/DD')}!  
                    If you have any questions or need to change your appointment details please contact us at 360-443-1777 or reply to this email.`,
                },
                data: {
                    name: `${booking.contact.firstName} ${booking.contact.lastName}`,
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

//--POST new booking 
router.post('/new', async (req, res) => {
    const requestedBooking = req.body.newBooking;
    //console.log('Booking requested for: ', requestedBooking)
    Booking.findOne({ date: requestedBooking.appointment.dateTime })
        .then(foundBooking => {
            if (foundBooking) {
                console.log(`${requestedBooking.appointment.dateTime} is already booked`)
                return res.status(401).send({
                    message: `${requestedBooking.appointment.dateTime} is already booked`,
                });
            } else {
                const newBooking = new Booking({
                    dateTime: requestedBooking.appointment.dateTime,
                    info: {
                        contact: requestedBooking.contact,
                        service: requestedBooking.service
                    }
                })
                newBooking
                    .save()
                    .then(createdBooking => {
                        console.log('Sending confirmation email to: ', requestedBooking.contact.email)
                        sendEmail(requestedBooking); //Send appointment confirmation email to user
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
    try {
        const timestamp = Math.round(new Date().getTime() / 1000);
        const signature = cloudinary.utils.api_sign_request(
            {
                timestamp: timestamp,
            },
            process.env.CLOUDINARY_API_SECRET
        );

        res.status(200).json({
            timestamp: timestamp,
            signature: signature,
        });
    } catch (error) {
        console.error('Error signing image:', error);
        res.status(500).json({ error: 'Failed to sign image' });
    }
});



router.get('/designs/:type', async (req, res) => {
    const { type } = req.params
    let images = []
    cloudinary.v2.search.expression(
        `folder:${type}/*` // add your folder
    ).with_field('tags').execute()
        .then(results => {
            results.resources.forEach(resource => {
                images.push({ url: resource.url, tags: resource.tags })
                console.log('Resource: ', resource.tags)
            })
            console.log('Response: ', images, 'Folder: ', type)
            res.status(200).send(images);
        })
        .catch(error => {
            console.log(error)
        })

})

module.exports = router;
