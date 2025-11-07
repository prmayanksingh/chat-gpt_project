const express = require('express');
const cookieParser = require('cookie-parser')

// Routes
const authRoutes = require('./routes/auth.routes');
const chatRoutes = require('./routes/chat.routes')

const app = express();
app.use(cookieParser())
app.use(express.json())

// Using Routes
app.use('/api/auth',authRoutes)
app.use('/api/chat', chatRoutes)

module.exports = app;
