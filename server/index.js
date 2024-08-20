const express = require("express");
const app = express();
const cors = require("cors"); // allow us to communicate in the frontend
const mongoose = require("mongoose");
const userRoute = require("./route/userRoute");
const chatRoute = require("./route/chatRoute");
const messageRoute = require("./route/messageRoute");
require("dotenv").config();

app.use(express.json());

// const port = 3010;
const port = process.env.PORT || 3010;
const mongoDbURI = process.env.MONGODB_URI;

app.use(cors());

app.use("/api/users", userRoute);
app.use("/api/chats", chatRoute);
app.use("/api/messages", messageRoute);

app.get("/", (req, res) => {
  res.send("Welcome to our chat app APIs");
});

app.listen(port, (req, res) => {
  console.log("Running in local: http://localhost:" + port);
});

mongoose
  .connect(mongoDbURI)
  .then(() => console.log("Successfully connected to MongoDB"))
  .catch((err) => console.log("MongoDB connection failed:", err.message));
