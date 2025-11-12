const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const connectDB = require("./config");

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
  const users = await User.find();
  res.send(users);
});

app.get("/", async (req, res) => {
  res.send("Hello from Express and MongoDB!");
});

app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
