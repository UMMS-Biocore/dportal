const mongoose = require('mongoose');

const serverSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide server name.']
  },
  type: {
    type: String,
    required: [true, 'Please provide server type.']
  },
  url: {
    type: String,
    required: [true, 'Please provide server url.']
  },
  active: {
    type: Boolean,
    default: true,
    select: false
  },
  creationDate: {
    type: Date,
    default: Date.now()
  },
  lastUpdateDate: {
    type: Date,
    default: Date.now()
  },
  perms: {
    type: 'Mixed'
  },
  owner: {
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  },
  lastUpdatedUser: {
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  }
});

const Server = mongoose.model('Server', serverSchema, 'server');

module.exports = Server;
