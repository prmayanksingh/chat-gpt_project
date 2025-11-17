const express = require('express');
const authMiddleware = require('../middleware/auth.middleware');
const {createChat, getChats,getMessages} = require('../controller/chat.controller');

const router = express.Router();



// /api/chat
router.post("/",authMiddleware, createChat)

router.get("/",authMiddleware, getChats)

router.get("/messages/:id", authMiddleware, getMessages)

module.exports = router