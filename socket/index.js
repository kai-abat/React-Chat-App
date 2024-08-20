const { Server } = require("socket.io");

const io = new Server({
  /* options */
  cors: "http://localhost:5173",
});

let onlineUsers = [];

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

io.listen(3020);
