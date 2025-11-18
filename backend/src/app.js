const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");

// Routes
const authRoutes = require("./routes/auth.routes");
const chatRoutes = require("./routes/chat.routes");

const app = express();
const FRONTEND_URL = process.env.FRONTEND_URL;
const allowedOrigins = [
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  FRONTEND_URL,
].filter(Boolean);

// Using Middleware
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json());

// Using Routes
app.use("/api/auth", authRoutes);
app.use("/api/chat", chatRoutes);

module.exports = app;
