require("dotenv").config();
const { Stripe } = require('stripe');
const express = require("express");
const router = express.Router();



const stripe = new Stripe(process.env.STRIPE_SECRET_TEST_API_KEY.toString());


router.post('/create-checkout-session', async (req, res) => {
    console.log('Checkout session requested')
    try {
        const session = await stripe.checkout.sessions.create({
            ui_mode: 'embedded',
            line_items: [{
                price: 'price_1Q1YwELeR8KUSkpbrZzZ3umY', // Replace with your actual price ID
                quantity: 1,
            }],
            mode: 'payment',
            return_url: `${process.env.NEXT_BASE_URL}/return.html?session_id={CHECKOUT_SESSION_ID}`,
            automatic_tax: {
                enabled: true,
            },
        });

        res.json({ clientSecret: session.client_secret });
    } catch (error) {
        console.error('Error creating checkout session:', error);
        res.status(500).json({ error: 'Failed to create checkout session' });
    }
});

router.get('/session-status', async (req, res) => {
    const sessionId = req.query.session_id;

    try {
        const session = await stripe.checkout.sessions.retrieve(sessionId);
        res.json({ status: session.status, customer_email: session.customer_details.email });
    } catch (error) {
        console.error('Error retrieving checkout session:', error);
        res.status(500).json({ error: 'Failed to retrieve session status' });
    }
});



module.exports = router


//create price------------------------------------------------------------------

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

// // ...

// // In your checkout session creation:
// const priceId = await createPrice(
//   // Calculate amount based on user input or other factors
//   calculatedAmount,
//   'usd', // Replace with your desired currency
//   // Product data if applicable
// );

// const session = await stripe.checkout.sessions.create({
//   // ... other checkout session options
//   line_items: [{
//     price: priceId,
//     quantity: 1,
//   }],
// });



//ruby convert------------------------------------------------------------------

// const express = require('express');
// const stripe = require('stripe')('YOUR_STRIPE_SECRET_KEY'); // Replace with your secret key

// const app = express();
// const YOUR_DOMAIN = 'http://localhost:3000'; // Adjust port if needed, assuming frontend on 3000

// app.use(express.json()); // Parse incoming JSON data

// app.post('/create-checkout-session', async (req, res) => {
//   try {
//     const session = await stripe.checkout.sessions.create({
//       ui_mode: 'embedded',
//       line_items: [{
//         price: '{{PRICE_ID}}', // Replace with your actual price ID
//         quantity: 1,
//       }],
//       mode: 'payment',
//       return_url: `${YOUR_DOMAIN}/return.html?session_id={CHECKOUT_SESSION_ID}`,
//       automatic_tax: {
//         enabled: true,
//       },
//     });

//     res.json({ clientSecret: session.clientSecret });
//   } catch (error) {
//     console.error('Error creating checkout session:', error);
//     res.status(500).json({ error: 'Failed to create checkout session' });
//   }
// });

// app.get('/session-status', async (req, res) => {
//   const sessionId = req.query.session_id;

//   try {
//     const session = await stripe.checkout.sessions.retrieve(sessionId);
//     res.json({ status: session.status, customer_email: session.customer_details.email });
//   } catch (error) {
//     console.error('Error retrieving checkout session:', error);
//     res.status(500).json({ error: 'Failed to retrieve session status' });
//   }
// });

// const port = process.env.PORT || 3000; // Use environment variable or default to 3000
// app.listen(port, () => console.log(`Server listening on port ${port}`));
