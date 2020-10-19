const express = require('express');
const authController = require('../controllers/authController');
const dmetaController = require('../controllers/dmetaController');

const router = express.Router();

router.use(authController.isLoggedIn);
router.use(authController.setDefPerms);

router.route('/').post(dmetaController.getDmetaInfo);

module.exports = router;
