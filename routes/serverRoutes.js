const express = require('express');
const authController = require('../controllers/authController');
const serverController = require('../controllers/serverController');

const router = express.Router();

router.use(authController.isLoggedIn);
router.use(authController.requireLogin);
router.use(authController.restrictTo('admin'));
router.use(authController.setDefPerms);

router
  .route('/')
  .get(serverController.getAllServers)
  .post(serverController.createServer);

router
  .route('/:id')
  .get(serverController.getServer)
  .patch(serverController.updateServer)
  .delete(serverController.deleteServer);

module.exports = router;
