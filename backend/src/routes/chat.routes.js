const express = require('express');
const authMiddleware = require('../middleware/auth.middleware');
const chatController = require('../controller/chat.controller');

const router = express.Router();



// /api/chat
router.post("/",authMiddleware, chatController)


module.exports = router