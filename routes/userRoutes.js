const express = require('express');
const userController = require('./../controllers/userController');
const authController = require('./../controllers/authController');

const router = express.Router();

router.post('/login', authController.login);
router.get('/logout', authController.logout);

router.use(authController.isLoggedIn);
router.use(authController.requireLogin);
router.get('/me', userController.getMe, userController.getUser);

module.exports = router;
