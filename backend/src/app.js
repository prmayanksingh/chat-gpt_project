const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const path = require("path");

// Routes
const authRoutes = require("./routes/auth.routes");
const chatRoutes = require("./routes/chat.routes");

const app = express();
const FRONTEND_URL = process.env.FRONTEND_URL;
const BACKEND_URL = process.env.BACKEND_URL || process.env.RENDER_EXTERNAL_URL;
const CLIENT_BUILD_PATH =
  process.env.CLIENT_BUILD_PATH || path.join(__dirname, "../public");
const allowedOrigins = [
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  FRONTEND_URL,
  BACKEND_URL,
].filter(Boolean);

const isRenderSubdomain = (origin) => {
  if (!origin) return false;
  try {
    const { hostname } = new URL(origin);
    return hostname.endsWith(".onrender.com");
  } catch {
    return false;
  }
};

// Using Middleware
app.use(
  cors({
    origin: (origin, callback) => {
      if (
        !origin ||
        allowedOrigins.includes(origin) ||
        isRenderSubdomain(origin)
      ) {
        return callback(null, true);
      }
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json());

if (process.env.NODE_ENV === "production") {
  app.use(express.static(CLIENT_BUILD_PATH));
}

// Using Routes
app.use("/api/auth", authRoutes);
app.use("/api/chat", chatRoutes);

if (process.env.NODE_ENV === "production") {
  app.get("/*", (req, res, next) => {
    if (req.path.startsWith("/api")) {
      return next();
    }
    res.sendFile(path.join(CLIENT_BUILD_PATH, "index.html"));
  });
}

module.exports = app;
