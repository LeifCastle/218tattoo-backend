const express = require("express");
const cors = require("cors");
const app = express();

// middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const allowedOrigins = [
  'https://tattoo218-backend-de45108a854b.herokuapp.com',
  'https://tattoo218-d1912baeabec.herokuapp.com',  // Your production frontend URL
  'http://localhost:3000',  // Localhost for development
];

// Enable CORS for specific origins and handle preflight requests
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin, like mobile apps or curl requests
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true); // Allow if the origin is in the allowed list
    } else {
      callback(new Error('Not allowed by CORS')); // Block if not in the allowed list
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed HTTP methods
  credentials: true,  // Allow cookies or credentials
}));

// Handle preflight requests for all routes
app.options('*', cors());

// Define Controllers
app.use("/admin", require("./controllers/admin"));
app.use('/book', require('./controllers/book'))
app.use('/payment', require('./controllers/payment'))

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server connected to PORT: ${PORT}`);
});

module.exports = app;