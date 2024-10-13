require("dotenv").config();
const { Stripe } = require('stripe');
const express = require("express");
const router = express.Router();



const stripe = new Stripe(process.env.STRIPE_SECRET_API_KEY);

router.post('/create-checkout-session', async (req, res) => {
    console.log('Checkout session requested')
    try {
        const session = await stripe.checkout.sessions.create({
            ui_mode: 'embedded',
            line_items: [
                {
                  price_data: {
                    currency: 'usd',
                    product_data: {
                      name: 'Service Payment',
                    },
                    unit_amount: req.body.amount, // The amount should be passed in cents
                  },
                  quantity: 1,
                },
              ],
            mode: 'payment',
            redirect_on_completion: 'never',
            automatic_tax: {
                enabled: true,
            },
            payment_method_types: ['card'], // Specify 'card' as the only payment method
        });

        res.json({ clientSecret: session.client_secret, sessionId: session.id });
    } catch (error) {
        console.error('Error creating checkout session:', error);
        res.status(500).json({ error: 'Failed to create checkout session' });
    }
});

router.post('/session-status', async (req, res) => {
    const sessionId = req.body.sessionId;
    console.log('SessionId: ', sessionId)
    try {
        const session = await stripe.checkout.sessions.retrieve(sessionId);
        res.json({ status: session.status, customer_email: session.customer_details.email });
    } catch (error) {
        console.error('Error retrieving checkout session:', error);
        res.status(500).json({ error: 'Failed to retrieve session status' });
    }
});



module.exports = router


//create price for down payment------------------------------------------------------------------

// const stripe = require('stripe')('YOUR_STRIPE_SECRET_KEY');

// Function to create a dynamic Price object
// const createPrice = async (amount, currency, productData) => {
//   try {
//     const price = await stripe.prices.create({
//       unit_amount: amount,
//       currency,
//       product: productData.productId, // If you have a product ID, use it here
//       // Other Price object attributes as needed
//     });

//     return price.id;
//   } catch (error) {
//     console.error('Error creating Price:', error);
//     throw error;
//   }
// };
