const express = require("express");
const cors = require("cors"); // allow us to communicate in the frontend
const mongoose = require("mongoose");
const userRoute = require("./route/userRoute");
const chatRoute = require("./route/chatRoute");
const messageRoute = require("./route/messageRoute");
const path = require("path");

require("dotenv").config();

const port = process.env.PORT || 5000;
const mongoDbURI = process.env.MONGODB_URI;

mongoose
  .connect(mongoDbURI)
  .then(() => console.log("Successfully connected to MongoDB"))
  .catch((err) => console.log("MongoDB connection failed:", err.message));

const app = express();

app.use(express.json());

app.use(cors());

app.use("/api/users", userRoute);
app.use("/api/chats", chatRoute);
app.use("/api/messages", messageRoute);

// --------------------------deployment------------------------------

const __dirname1 = path.resolve();

if (process.env.NODE_ENV === "production") {
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

const server = app.listen(port, (req, res) => {
  console.log("Running in local: http://localhost:" + port);
});

// ------------------------- socket.io ------------------------------

let onlineUsers = [];

const io = require("socket.io")(server, {
  pingTimeout: 60000,
  cors: {
    origin: "http://localhost:5173",
    // credentials: true,
  },
});

io.on("connection", (socket) => {
  // ...
  console.log("New connection", socket.id);

  // listen to a connection
  // resend an event coming from the client
  socket.on("addNewUser", (userId) => {
    const newUser = {
      userId,
      socketId: socket.id,
    };

    const foundUserIndex = onlineUsers.findIndex(
      (user) => user.userId === userId
    );

    if (foundUserIndex !== -1) {
      onlineUsers[foundUserIndex] = newUser;
    } else {
      onlineUsers.push(newUser);
    }
    console.log("onlineUsers", onlineUsers);

    // trigger event and recieved by the client
    io.emit("getOnlineUsers", onlineUsers);
  });

  // add message
  socket.on("sendMessage", (newMessage) => {
    const user = onlineUsers.find(
      (user) => user.userId === newMessage.recipientId
    );

    if (user) {
      io.to(user.socketId).emit("getMessage", newMessage);

      if (newMessage.senderId) {
        io.to(user.socketId).emit("getNotification", {
          senderId: newMessage.senderId,
          isRead: false,
          date: new Date(),
        });
      }
    }
  });

  // if socket is disconnected the trigger the event to update the online user and send it back to the client
  socket.on("disconnect", () => {
    onlineUsers = onlineUsers.filter((user) => user.socketId !== socket.id);
    io.emit("getOnlineUsers", onlineUsers);
  });
});

// ------------------------- socket.io ------------------------------
