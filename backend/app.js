
require("dotenv").config();
const express = require("express");
const app = express();
app.use(express.json());
const userRoutes = require("./routes/userRoutes");
const authRoutes = require("./routes/authRoutes");
const todoRoutes = require("./routes/todoRoutes");

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/todos", todoRoutes);

app.get("/", (req, res) => {
  res.send("API is running");
});

app.get("/api/auth/test", (req, res) => {
  res.json({ message : "Backend is connected successfully"});
});
module.exports = app;