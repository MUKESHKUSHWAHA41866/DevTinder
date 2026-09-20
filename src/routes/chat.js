const express = require("express");
const { userAuth } = require("../middlewares/auth");
const { Chat } = require("../models/chat");

const chatRouter = express.Router();

chatRouter.get("/chat/:targetUserId", userAuth, async (req, res) => {
  const { targetUserId } = req.params;
  const userId = req.user._id;

  try {
    let chat = await Chat.findOne({
      participants: { $all: [userId, targetUserId] },
    }).populate({
      path: "messages.senderId",
      select: "firstName lastName",
    });
    if (!chat) {
      chat = new Chat({
        participants: [userId, targetUserId],
        messages: [],
      });
      await chat.save();
    }

    // normalize message objects for the client
    const response = {
      _id: chat._id,
      participants: chat.participants,
      messages: chat.messages.map((m) => {
        // m.senderId may be populated or just an ObjectId
        const sender = typeof m.senderId === "object" ? m.senderId : { _id: m.senderId };
        return {
          messageId: m._id,
          senderId: sender._id,
          senderFirstName: sender.firstName || null,
          senderLastName: sender.lastName || null,
          text: m.text,
          status: m.status,
          createdAt: m.createdAt,
          deliveredAt: m.deliveredAt,
          seenAt: m.seenAt,
        };
      }),
    };

    res.json(response);
  } catch (err) {
    console.error(err);
  }
});

module.exports = chatRouter;