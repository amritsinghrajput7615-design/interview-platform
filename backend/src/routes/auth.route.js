const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const authmiddleware = require('../middleware/auth.middleware');

router.post('/register', authController.userRegister)

router.post('/login',authController.login)

router.get('/logout',authController.logout)

router.get('/get-me',authmiddleware,authController.getme)

router.post('/google',authController.googleLogin);
module.exports = router;