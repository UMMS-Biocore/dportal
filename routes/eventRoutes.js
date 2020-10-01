const express = require('express');
const authController = require('../controllers/authController');
const eventController = require('../controllers/eventController');

const router = express.Router();

router.use(authController.isLoggedIn);
router.use(authController.requireLogin);
router.use(authController.setDefPerms);

router.route('/').get(eventController.getAllEvents);
router.route('/:id').get(eventController.getEvent);

module.exports = router;
