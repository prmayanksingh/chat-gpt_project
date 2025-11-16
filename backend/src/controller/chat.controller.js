const chatModel = require("../models/chat.model");

async function chatController(req, res) {
  const { title } = req.body;
  const user = req.user;

  const chat = await chatModel.create({
    user: user._id,
    title,
  });

  res.status(201).json({
    message: "Chat created successfully!",
    chat: {
      id: chat._id,
      user: chat.user,
      title: chat.title,
      lastActivity: chat.lastActivity,
    },
  });
}

async function getChatController(req, res) {
  const chats = await chatModel.find();

  res.status(200).json({
    message: "Chat fetched successfully",
    chats
  });
}

module.exports = {
  chatController,
  getChatController,
};
