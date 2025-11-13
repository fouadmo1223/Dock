const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const connectDB = require("./config");
const redisClient = require("./redis"); // 👈 Import Redis client

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// ✅ Connect to MongoDB
connectDB();

// Simple model for testing
const User = mongoose.model(
  "User",
  new mongoose.Schema({
    name: String,
    email: String,
  })
);

// Create a test user (only once)
app.get("/add", async (req, res) => {
  const { email, name } = req.query;
  if (!email || !name) {
    return res.status(400).send("Please provide name and email");
  }
  const user = new User({ name, email });
  await user.save();
  res.send("User added to MongoDB");
});

app.get("/users", async (req, res) => {
  const redisUsers = await redisClient.get("users");
  if (redisUsers) {
    console.log("🔵 Serving from Redis Cache");
    return res.json({
      users: JSON.parse(redisUsers),
      message: "Data fetched from Redis Cache",
    });
  }
  const users = await User.find();
  await redisClient.set("users", JSON.stringify(users), { EX: 60 }); // Cache for 60 seconds
  console.log("🟢 Serving from MongoDB");
  res.json({ users, message: "Data fetched from MongoDB" });
});

app.get("/", async (req, res) => {
  res.send("Hello from Express and MongoDB!");
});

app.get("/cache-test", async (req, res) => {
  await redisClient.set("greeting", "Hello from Redis!");
  const value = await redisClient.get("greeting");
  res.send({ value });
});

app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
