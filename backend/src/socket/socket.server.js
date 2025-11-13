const { Server } = require("socket.io");
const { generateContent, generateVector } = require("../service/ai.service");
const cookie = require("cookie");
const jwt = require("jsonwebtoken");
const usermodel = require("../models/user.model");
const messageModel = require("../models/message.model");
const { createMemory, queryMemory } = require("../service/vector.service");

function initSocketServer(httpServer) {
  const io = new Server(httpServer, {});

  io.use(async (socket, next) => {
    const cookies = cookie.parse(socket.handshake.headers?.cookie || "");

    if (!cookies.token) {
      next(new Error("Authentication error : no token provided"));
    }

    try {
      const decoded = jwt.verify(cookies.token, process.env.JWT_SECRET);

      const user = await usermodel.findById(decoded.id);

      socket.user = user;

      next();
    } catch (err) {
      next(new Error("Authentication error : invalid token"));
    }
  });

  io.on("connection", (socket) => {
    socket.on("ai-message", async (messagePayload) => {

      const message = await messageModel.create({
        user: socket.user._id,
        chat: messagePayload.chat,
        content: messagePayload.content,
        role: "user",
      });

      const vectors = await generateVector(messagePayload.content);

      await createMemory({
        vectors: vectors,
        messageId: message.id,
        metadata: {
          chat: messagePayload.chat,
          user: socket.user._id,
          text: messagePayload.content,
        },
      });

      const memory = await queryMemory({
        queryVector: vectors,
        limit: 3,
        metadata: {},
      });

      const chatHistory = await messageModel.find({
        chat: messagePayload.chat,
      });

      const stm = chatHistory.map((item) => {
        return {
          role: item.role,
          parts: [{ text: item.content }],
        };
      });

      const ltm = [
        {
          role: "user",
          parts: [
            {
              text: `
            these are previous message from the chat, use them to generate response.
            ${memory.map((item) => item.metadata.text).join("/n")}
            `,
            },
          ],
        },
      ];

      const response = await generateContent([...ltm, ...stm]);

      const messageResponse = await messageModel.create({
        user: socket.user._id,
        chat: messagePayload.chat,
        content: response,
        role: "model",
      });

      const responseVector = await generateVector(response);

      await createMemory({
        vectors: responseVector,
        messageId: messageResponse.id,
        metadata: {
          chat: messagePayload.chat,
          user: socket.user._id,
          text: response,
        },
      });

      socket.emit("ai-response", {
        response,
      });
    });
  });
}

module.exports = initSocketServer;
