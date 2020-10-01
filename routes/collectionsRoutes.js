const express = require('express');
const authController = require('../controllers/authController');
const collectionsController = require('../controllers/collectionsController');
const fieldsController = require('../controllers/fieldsController');
const fieldsRouter = require('./fieldsRoutes');

const router = express.Router();

router.use(authController.isLoggedIn);
router.use(authController.requireLogin);
router.use(authController.restrictTo('admin'));
router.use(authController.setDefPerms);

router.use('/:collectionID/fields', fieldsController.setFilter, fieldsRouter);

router
  .route('/')
  .get(collectionsController.getAllCollections)
  .post(collectionsController.setAfter, collectionsController.createCollection);

router
  .route('/:id')
  .get(collectionsController.getCollection)
  .patch(collectionsController.setAfter, collectionsController.updateCollection)
  .delete(collectionsController.setAfter, collectionsController.deleteCollection);

module.exports = router;
