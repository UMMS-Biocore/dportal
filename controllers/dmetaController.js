const { get } = require('request');
const { promisify } = require('util');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');

const [getAsync] = [get].map(promisify);

exports.getDmetaInfo = catchAsync(async (req, res, next) => {
  try {
    let accessToken = '';
    let url = '';
    if (req.cookies.jwt) accessToken = req.cookies.jwt;
    if (req.body.url) url = req.body.url;
    const data = await getAsync({
      url: `${process.env.DMETA_URL}${url}`,
      headers: {
        Authorization: `Bearer ${accessToken}`
      },
      rejectUnauthorized: false
    });
    if (!data) return next(new AppError(`No document found!`, 404));
    const doc = JSON.parse(data.body).data.data;

    res.status(200).json({
      status: 'success',
      reqeustedAt: req.requestTime,
      data: {
        data: doc
      }
    });
  } catch (err) {
    next(new AppError(`Error occured!`, 404));
  }
});
