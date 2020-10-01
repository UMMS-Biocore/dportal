const AccessToken = require('../models/accessTokenModel');

exports.find = async token => {
  return await AccessToken.findOne({ token: token }, function(err, item) {
    if (err) {
      return err;
    }
    return item;
  });
};

exports.save = async (token, expirationDate, userId, clientId, scope) => {
  try {
    const newToken = new AccessToken({
      token: token,
      expirationDate: expirationDate,
      userId: userId,
      clientId: clientId,
      scope: scope
    });
    const saveToken = await newToken.save();
    console.log('**** AccessToken saved:', token);
    return saveToken;
  } catch (err) {
    return err;
  }
};

exports.delete = async token => {
  return await AccessToken.findOneAndRemove({ token: token }, function(err, item) {
    console.log('AccessToken removed', item, err);
    if (err) {
      return err;
    }
    return item;
  });
};

// Removes expired access tokens.
exports.removeExpired = async function(done) {
  try {
    await AccessToken.find({ expirationDate: { $lt: Date.now() } }, async function(err, item) {
      if (item) {
        await AccessToken.find({ expirationDate: { $lt: Date.now() } }).deleteMany(function(err2) {
          return done(err2);
        });
      }
    });
  } catch (err) {
    done(err);
  }
  return done(null);
};
