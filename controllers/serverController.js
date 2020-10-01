const factory = require('./handlerFactory');
const Server = require('../models/serverModel');

exports.getAllServers = factory.getAll(Server);
exports.getServer = factory.getOne(Server);
exports.createServer = factory.createOne(Server);
exports.updateServer = factory.updateOne(Server);
exports.deleteServer = factory.deleteOne(Server);

exports.getServerById = async id => {
  return await Server.findById(id).lean();
};
