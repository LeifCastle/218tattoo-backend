const express = require("express");
const cors = require("cors");
const app = express();

// middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors({
  origin: 'https://tattoo218-d1912baeabec.herokuapp.com', // Replace with your frontend URL
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Specify allowed HTTP methods
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