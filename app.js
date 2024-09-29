const express = require("express");
const cors = require("cors");
const app = express();

// middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
// CORS configuration to allow specific origins
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like Postman or curl requests)
    if (!origin) return callback(null, true);
    // If the origin is in the allowed list, allow the request
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      // If the origin isn't in the allowed list, block the request
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'],  // Specify allowed HTTP methods
  credentials: true  // Enable credentials (cookies, etc.)
}));

// Define Controllers
app.use("/admin", require("./controllers/admin"));
app.use('/book', require('./controllers/book'))
app.use('/payment', require('./controllers/payment'))

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server connected to PORT: ${PORT}`);
});

module.exports = app;