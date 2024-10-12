const mongoose = require("mongoose");

//Service Costs Schema
const serviceCostsSchema = new mongoose.Schema(
  {
    tattoo: Number,
    piercing: Number,
    toothGem: Boolean,
  },
  { timestamps: true }
);

// User schema
const settingsSchema = new mongoose.Schema(
  {
    requireDeposits: Boolean,
    serviceCosts: serviceCostsSchema,
  },
  { timestamps: true }
);

// Create model
const Settings = mongoose.model("Settings", settingsSchema);

// Export the model
module.exports = Settings;