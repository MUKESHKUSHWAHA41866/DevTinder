const socket  = require("socket.io");
const crypto = require("crypto");
const { Chat } = require("../models/chat");
const ConnectionRequest = require("../models/connectionRequest");

const getSecretRoomId = (userId, targetUserId) => {
  return crypto
    .createHash("sha256")
    .update([userId, targetUserId].sort().join("$"))
    .digest("hex");
};
const initializeSocket = (server) => {
    const io = socket(server, {
   cors: {
      origin: "http://localhost:5173",
      // methods: ["GET", "POST"],
      // credentials: true
   }
});

io.on("connection", (socket) => {
    console.log("socket connected", socket.id);

    // keep track of the authenticated user on the socket if provided later
    socket.userId = null;

    socket.on("joinChat", async ({ firstName, userId, targetUserId }) => {
      // if the client didn't provide a name, fetch it from DB
      let name = firstName;
      if (!name) {
        try {
          const User = require("../models/user");
          const u = await User.findById(userId).select("firstName");
          if (u) name = u.firstName;
        } catch (err) {
          console.error("joinChat lookup error", err);
        }
      }

      const roomId = getSecretRoomId(userId, targetUserId);
      console.log(`${name || userId} joined Room : ${roomId}`);
      socket.userId = userId;

      // join a per-user room as well so we can emit events directly
      socket.join(`user_${userId}`);
      socket.join(roomId);
    });

    // handle sending a new message
    socket.on(
      "sendMessage",
      async ({ firstName, lastName, userId, targetUserId, text }, callback) => {
        try {
          const roomId = getSecretRoomId(userId, targetUserId);

          // if client didn't send names, fetch sender's info
          let senderName = firstName;
          let senderLast = lastName;
          if (!senderName) {
            try {
              const User = require("../models/user");
              const u = await User.findById(userId).select("firstName lastName");
              if (u) {
                senderName = u.firstName;
                senderLast = u.lastName;
              }
            } catch (err) {
              console.error("sendMessage lookup error", err);
            }
          }

          console.log(`${senderName || userId} -> ${text}`);

          let chat = await Chat.findOne({
            participants: { $all: [userId, targetUserId] },
          });

          if (!chat) {
            chat = new Chat({
              participants: [userId, targetUserId],
              messages: [],
            });
          }

          // push a new message document (status defaults to 'sent')
          chat.messages.push({
            senderId: userId,
            text,
          });

          await chat.save();

          // grab the just-added message
          const msg = chat.messages[chat.messages.length - 1];
          const messageObj = {
            _id: msg._id,
            senderId: msg.senderId,
            text: msg.text,
            status: msg.status,
            createdAt: msg.createdAt,
            firstName: senderName,
            lastName: senderLast,
          };

          // broadcast to everyone *except* the sender
          socket.to(roomId).emit("messageReceived", messageObj);

          // acknowledge back to the sender with the canonical message
          if (typeof callback === "function") {
            callback(messageObj);
          }
        } catch (err) {
          console.log(err);
          if (typeof callback === "function") {
            callback({ error: "failed" });
          }
        }
      }
    );

    // when a recipient has actually received (rendered) a message
    socket.on("messageDelivered", async ({ messageId, userId, targetUserId }) => {
      try {
        const roomId = getSecretRoomId(userId, targetUserId);
        const now = new Date();
        await Chat.updateOne(
          { participants: { $all: [userId, targetUserId] }, "messages._id": messageId },
          { $set: { "messages.$.status": "delivered", "messages.$.deliveredAt": now } }
        );
        io.to(roomId).emit("messageDelivered", { messageId, deliveredAt: now });
      } catch (err) {
        console.error(err);
      }
    });

    socket.on("messageSeen", async ({ messageId, userId, targetUserId }) => {
      try {
        const roomId = getSecretRoomId(userId, targetUserId);
        const now = new Date();
        await Chat.updateOne(
          { participants: { $all: [userId, targetUserId] }, "messages._id": messageId },
          { $set: { "messages.$.status": "seen", "messages.$.seenAt": now } }
        );
        io.to(roomId).emit("messageSeen", { messageId, seenAt: now });
      } catch (err) {
        console.error(err);
      }
    });

    socket.on("disconnect", () => {
      console.log("socket disconnected", socket.id);
    });
  });
};

module.exports = initializeSocket;