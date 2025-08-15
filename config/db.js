const mongoose = require("mongoose");
require("dotenv").config();

const connectDB = async () => {
  try {
    const uri = process.env.MONGODB_URL;
    console.log("Connecting to MongoDB...");
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 30000, // 30 second timeout
      socketTimeoutMS: 45000, // 45 second timeout
      connectTimeoutMS: 30000, // 30 second timeout
      maxPoolSize: 10,
      minPoolSize: 1,
    });
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection error:", error.message);
    console.log(
      "Server will continue running but database operations will fail"
    );
    console.log(
      "This might be due to IP whitelist restrictions in MongoDB Atlas"
    );
    console.log("Please check your MongoDB Atlas Network Access settings");
  }
};

module.exports = connectDB;
