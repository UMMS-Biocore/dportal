const mongoose = require('mongoose');

const AccessTokenSchema = new mongoose.Schema({
  token: String,
  userId: {
    type: String,
    trim: true,
    default: null
  },
  expirationDate: {
    type: Date,
    default: Date.now
  },
  clientId: {
    type: String,
    trim: true,
    required: true
  },
  scope: {
    type: String
  }
});

const AccessToken = mongoose.model('AccessToken', AccessTokenSchema);

module.exports = AccessToken;
