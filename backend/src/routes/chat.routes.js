const express = require('express');
const authMiddleware = require('../middleware/auth.middleware');
const {chatController, getChatController} = require('../controller/chat.controller');

const router = express.Router();



// /api/chat
router.post("/",authMiddleware, chatController)

router.get("/",authMiddleware, getChatController)

module.exports = router