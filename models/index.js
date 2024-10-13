require("dotenv").config();
const mongoose = require("mongoose");

// import all models
const Booking = require("./booking");
const Settings = require("./settings");

// connect to the database
mongoose.connect(process.env.MONGO_URI);

// create connection object
const db = mongoose.connection;

// once the database opens
db.once("open", () => {
  //console.log("Connected to MongoDB Database: Mongoose App at HOST:", db.host, "PORT:", db.port);
});

// if there is a database error
db.on("error", (err) => {
  console.log(`Database error: `, err);
});

module.exports = {
  Booking,
  Settings,
};