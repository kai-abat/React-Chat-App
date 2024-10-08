const express = require("express");
const cors = require("cors"); // allow us to communicate in the frontend
const mongoose = require("mongoose");
const userRoute = require("./route/userRoute");
const chatRoute = require("./route/chatRoute");
const messageRoute = require("./route/messageRoute");
const path = require("path");
const { socketStart } = require("./socket/socketV2");

require("dotenv").config(); // config env variables

const port = process.env.PORT || 5000;
const mongoDbURI = process.env.MONGODB_URI;

mongoose
  .connect(mongoDbURI)
  .then(() => console.log("Successfully connected to MongoDB"))
  .catch((err) => console.log("MongoDB connection failed:", err.message));

const app = express();

app.use(express.json());
// midlleware allow cors
app.use(cors());

// middleware authorization
// app.use(protect);

app.use("/api/users", userRoute);
app.use("/api/chats", chatRoute);
app.use("/api/messages", messageRoute);

// --------------------------deployment------------------------------

const __dirname1 = path.resolve();

if (process.env.NODE_ENV === "production") {
  console.log("RUNNING ON PRODUCTION....");
  app.use(express.static(path.join(__dirname1, "/client-ts/dist")));

  app.get("*", (req, res) =>
    res.sendFile(path.resolve(__dirname1, "client-ts", "dist", "index.html"))
  );
} else {
  app.get("/", (req, res) => {
    res.send("API is running..");
  });
}

// --------------------------deployment------------------------------

app.get("/", (req, res) => {
  res.send("Welcome to our chat app APIs");
});

const server = app.listen(port, () => {
  console.log("Running in local: http://localhost:" + port);
});

// app.listen(port, () => {
//   console.log("Running in local: http://localhost:" + port);
// });

// ------------------------- socket.io ------------------------------

socketStart(server);
// ------------------------- socket.io ------------------------------
