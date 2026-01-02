require("dotenv").config();
const express = require("express");

const db = require("./db/db");
const app = express();
app.use(express.json());
app.get("/db-test", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT 1");
    res.json({ message: "Database connection successful", data: rows });
    } catch (error) {
        res.status(500).json({ message: "Database connection failed", error: error.message })
        }
    });
module.exports = app;