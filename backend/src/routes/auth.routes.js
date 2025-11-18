const express = require('express');
const { registerController, loginController, logoutController } = require('../controller/auth.controller');

const router = express.Router();


// /api/auth
router.post('/register',registerController)
router.post('/login', loginController)
router.post('/logout', logoutController)


module.exports = router