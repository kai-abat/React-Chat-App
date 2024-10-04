const socketStart = (server) => {
  const io = require("socket.io")(server, {
    pingTimeout: 60000,
    cors: {
      origin: "http://localhost:5173",
      // credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log("Connected to socket.io: " + socket.id);

    socket.on("setup", (userData) => {
      console.log("Socket SETUP!!!");
      socket.join(userData._id);
      console.log("Connected " + userData._id);
      socket.emit("connected");
    });

    socket.on("join-room", (data) => {
      console.log("Socket JOIN ROOM!!!");
      const { userName, room } = data;
      socket.join(room); // setup => userData._id
      console.log(`User ${userName} Joined Room: ${room}`);
    });

    socket.on("typing", (room) => {
      socket.to(room).emit("typing", room);
    });

    socket.on("stop-typing", (room) => {
      socket.to(room).emit("stop-typing", room);
    });

    socket.on("send-message", (data) => {
      console.log("Socket SEND MESSAGE!!!");
      const newMessage = data.newMessage;
      const chat = data.chat;

      console.log("socket send-message:", newMessage.text, chat._id);

      // if (!chat.members) return console.log("chat.users not defined");

      const timeSent = new Date();
      const isRead = false;

      socket
        .to(chat._id)
        .emit("receive-message", chat, newMessage, isRead, timeSent);

      // chat.members.forEach((user) => {
      //   if (user._id === newMessage.senderId._id) return;

      //   socket
      //     .to(user._id)
      //     .emit("receive-message", chat, newMessage, isRead, timeSent);
      // });
    });

    socket.off("setup", (userData) => {
      console.log("USER DISCONNECTED");
      socket.leave(userData._id);
    });
  });
};

module.exports = {
  socketStart,
};
