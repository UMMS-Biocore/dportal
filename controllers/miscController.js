const fs = require('fs');
const path = require('path');
const axios = require('axios');
const catchAsync = require('../utils/catchAsync');

exports.getChangeLog = catchAsync(async (req, res, next) => {
  const doc = fs.readFileSync(path.join(__dirname, './../NEWS'), 'utf8');
  res.status(200).json({
    status: 'success',
    data: JSON.stringify(doc)
  });
});

exports.getDnextReportContent = catchAsync(async (req, res, next) => {
  if (!req.body.url)
    return res.status(400).json({
      status: 'error',
      message: 'Url not found'
    });
  const { data } = await axios.get(req.body.url);
  res.status(200).json({
    status: 'success',
    data: data
  });
});
