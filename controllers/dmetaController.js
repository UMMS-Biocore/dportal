const axios = require('axios');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');

exports.getDmetaInfo = catchAsync(async (req, res, next) => {
  try {
    let accessToken = '';
    let url = '';
    let body = {};
    if (req.cookies.jwt) accessToken = req.cookies.jwt;
    if (req.body.url) url = req.body.url;
    if (req.body.body) body = req.body.body;

    const { data } = await axios.get(`${process.env.DMETA_URL}${url}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      },
      data: body
    });
    if (!data) return next(new AppError(`No document found!`, 404));
    const doc = data.data.data;

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
