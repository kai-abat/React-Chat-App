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
      socket.join(userData._id);
      console.log("Connected " + userData._id);
      socket.emit("connected");
    });

    socket.on("join-room", (data) => {
      const { userName, room } = data;
      socket.join(room); // setup => userData._id
      console.log(`User ${userName} Joined Room: ${room}`);
      const roomList = socket.rooms;
      console.log("roomList", roomList);
    });

    socket.on("typing", (room) => {
      socket.in(room).emit("typing");
    });

    socket.on("stop-typing", (room) => {
      socket.in(room).emit("stop-typing");
    });

    /* {
      _id: string;
      chatId: ChatModelType;
      senderId: UserModelType;
      text: string;
      readBy: {
        _id: string;
        name: string;
        email: string;
        createdAt: string;
        updatedAt: string;
      }
      createdAt: string;
      updatedAt: string;
    } */

    socket.on("send-message", (data) => {
      const newMessage = data.newMessage;
      const chat = data.chat;

      if (!chat.members) return console.log("chat.users not defined");

      chat.members.forEach((user) => {
        if (user._id === newMessage.senderId._id) return;

        socket.in(user._id).emit("receive-message", chat, newMessage);
      });
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
