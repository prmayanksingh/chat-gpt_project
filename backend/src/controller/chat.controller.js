const chatModel = require("../models/chat.model");
const messageModel = require("../models/message.model");

async function createChat(req, res) {
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

async function getChats(req, res) {
  const chats = await chatModel
    .find()
    .sort({ createdAt: -1 });

  res.status(200).json({
    message: "Chat fetched successfully",
    chats,
  });
}

async function getMessages(req, res) {
  const chatId = req.params.id;

  const messages = await messageModel
    .find({ chat: chatId })
    .sort({ createdAt: 1 });

  res.status(200).json({
    message: "Messages retrieved successfully!",
    messages: messages,
  });
}

module.exports = {
  createChat,
  getChats,
  getMessages,
};
