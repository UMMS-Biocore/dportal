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

exports.getUrlContent = catchAsync(async (req, res, next) => {
  try {
    const data2 = await axios.get(req.body.url);
    console.log(data2);
  } catch (err) {
    console.log(err);
  }
  if (req.body.url) {
    const data = await axios.get(req.body.url);
    console.log(data);
  }
  // const json = JSON.parse(JSON.stringify(data));
  const doc = fs.readFileSync(path.join(__dirname, './../NEWS'), 'utf8');
  res.status(200).json({
    status: 'success',
    data: JSON.stringify(doc)
  });
});
