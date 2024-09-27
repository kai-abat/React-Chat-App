const express = require("express");
const cors = require("cors"); // allow us to communicate in the frontend
const mongoose = require("mongoose");
const userRoute = require("./route/userRoute");
const chatRoute = require("./route/chatRoute");
const messageRoute = require("./route/messageRoute");
const path = require("path");
const jwt = require("jsonwebtoken");
const userModel = require("./models/userModel");
const { protect } = require("./auth/auth");

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
app.use(protect);
// app.use(async (req, res, next) => {
//   let token;

//   // auth using header bearer
//   if (
//     req.headers.authorization &&
//     req.headers.authorization.startsWith("Bearer")
//   ) {
//     token = req.headers.authorization.split(" ")[1];

//     const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);

//     req.user = await userModel
//       .findById(decodedToken._id)
//       .select("-password -email");

//     // return res.status(200).json(req.user);
//     console.log("middleware authentication successful");
//     next();
//   }

//   if (!token) {
//     res.status(401).json({ message: "Invalid authorization token..." });
//   }
// });

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
  socket.on("addNewUser", (user) => {
    const newUser = {
      user,
      socketId: socket.id,
    };

    const foundUserIndex = onlineUsers.findIndex(
      (onlineUser) => onlineUser.user._id === user._id
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
      (onlineUsers) => onlineUsers.user._id === newMessage.recipient._id
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

  // ** NEW GROUP CHAT

  socket.on("setup", (userId) => {
    socket.join(userId);
    socket.emit("connected");
  });
});

// ------------------------- socket.io ------------------------------
