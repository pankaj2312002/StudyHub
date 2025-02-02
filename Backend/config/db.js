
const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected successfully.');
  } catch (err) {
    console.log("DB connection failed");
    console.error(err);
    process.exit(1);
  }
};

module.exports = connectDB;
