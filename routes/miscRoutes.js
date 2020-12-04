const express = require('express');
const miscController = require('../controllers/miscController');

const router = express.Router();

router.route('/changelog').get(miscController.getChangeLog);
router.route('/getDnextReportContent').post(miscController.getDnextReportContent);

module.exports = router;
