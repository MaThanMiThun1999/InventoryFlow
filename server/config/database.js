// config/database.js
const mongoose = require("mongoose");
const { MONGODB_URI } = require("./envConfig");
const colors = require("colors");
// Set up MongoDB connection
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(MONGODB_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`.cyan.underline);
  } catch (error) {
    console.error(`Error: ${error.message}`.red.underline.bold);
    process.exit(1); // Exit process with failure
  }
};

module.exports = connectDB;