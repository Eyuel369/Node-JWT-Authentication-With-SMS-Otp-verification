const express = require('express');
const authController = require('../controllers/authController');
const cookieParser = require("cookie-parser");
const { userAuth } = require('../middleware/auth');
const upload = require('../middleware/upload');


const router = express.Router();
router.use(cookieParser());
router.post('/register', upload.single('image'), authController.register);
router.post('/verify', authController.verifyOTP);
router.post('/login', authController.login);
router.get('/logout',userAuth, authController.logout);

module.exports = router;