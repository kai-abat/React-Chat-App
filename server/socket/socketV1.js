let onlineUsers = [];

const socketStart = (server) => {
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
};

module.exports = {
  socketStart,
};
