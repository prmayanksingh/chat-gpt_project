const { Server } = require("socket.io");
const { generateContent, generateVector } = require("../service/ai.service");
const cookie = require("cookie");
const jwt = require("jsonwebtoken");
const usermodel = require("../models/user.model");
const messageModel = require("../models/message.model");
const { createMemory, queryMemory } = require("../service/vector.service");

const FRONTEND_URL = process.env.FRONTEND_URL;
const allowedOrigins = [
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  FRONTEND_URL,
].filter(Boolean);

function initSocketServer(httpServer) {
  const io = new Server(httpServer, {
    cors:{
      origin: allowedOrigins,
      credentials:true
    }
  });

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
      // const message = await messageModel.create({
      //   user: socket.user._id,
      //   chat: messagePayload.chat,
      //   content: messagePayload.content,
      //   role: "user",
      // });

      // const vectors = await generateVector(messagePayload.content);

      const [message, vectors] = await Promise.all([
        messageModel.create({
          user: socket.user._id,
          chat: messagePayload.chat,
          content: messagePayload.content,
          role: "user",
        }),
        generateVector(messagePayload.content),
      ]);

      await createMemory({
        vectors: vectors,
        messageId: message.id,
        metadata: {
          chat: messagePayload.chat,
          user: socket.user._id,
          text: messagePayload.content,
        },
      });

      // const memory = await queryMemory({
      //   queryVector: vectors,
      //   limit: 3,
      //   metadata: {},
      // });

      // const chatHistory = await messageModel.find({
      //   chat: messagePayload.chat,
      // });

      const [memory, chatHistory] = await Promise.all([
        queryMemory({
          queryVector: vectors,
          limit: 3,
          metadata: {},
        }),
        messageModel.find({
          chat: messagePayload.chat,
        }),
      ]);

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

      socket.emit("ai-response", {
        response,
      });

      // const messageResponse = await messageModel.create({
      //   user: socket.user._id,
      //   chat: messagePayload.chat,
      //   content: response,
      //   role: "model",
      // });

      // const responseVector = await generateVector(response);

      const [messageResponse, responseVector] = await Promise.all([
        messageModel.create({
          user: socket.user._id,
          chat: messagePayload.chat,
          content: response,
          role: "model",
        }),
        generateVector(response),
      ]);

      await createMemory({
        vectors: responseVector,
        messageId: messageResponse.id,
        metadata: {
          chat: messagePayload.chat,
          user: socket.user._id,
          text: response,
        },
      });
    });
  });
}

module.exports = initSocketServer;
