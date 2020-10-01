const express = require('express');
const authController = require('../controllers/authController');

const fieldsController = require('../controllers/fieldsController');

const router = express.Router({ mergeParams: true });

router.use(authController.isLoggedIn);
router.use(authController.requireLogin);
router.use(authController.restrictTo('admin'));
router.use(authController.setDefPerms);

router
  .route('/')
  .get(fieldsController.getAllFields)
  .post(fieldsController.setCollectionId, fieldsController.setAfter, fieldsController.createField);

router
  .route('/:id')
  .get(fieldsController.getField)
  .patch(fieldsController.setAfter, fieldsController.updateField)
  .delete(fieldsController.setAfter, fieldsController.deleteField);

module.exports = router;
