const express = require('express');
const dataController = require('../controllers/dataController');
const authController = require('../controllers/authController');
const eventController = require('../controllers/eventController');

const router = express.Router({ mergeParams: true });

router.use(authController.setDefPerms);
router.use(authController.isLoggedIn);

router.route('/:collectionName/summary').get(dataController.getDataSummary);
router.route('/:collectionName/detailed').get(dataController.getDataDetailed);

router
  .route('/:collectionName')
  .get(dataController.setModel, dataController.getAllData)
  .post(
    authController.requireLogin,
    dataController.setModel,
    eventController.setEvent,
    dataController.createData
  );

router
  .route('/:collectionName/:id')
  .get(dataController.setModel, dataController.getData)
  .patch(
    authController.requireLogin,
    dataController.setModel,
    eventController.setEvent,
    dataController.updateData
  )
  .delete(
    authController.requireLogin,
    dataController.setModel,
    eventController.setEvent,
    dataController.deleteData
  );

module.exports = router;
