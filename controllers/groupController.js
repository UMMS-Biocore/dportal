const factory = require('./handlerFactory');
const Group = require('../models/groupModel');
const UserGroup = require('../models/userGroupModel');

exports.setUserFilter = (req, res, next) => {
  if (req.params.id) res.locals.Filter = { user_id: req.params.id };
  next();
};
exports.setGroupFilter = (req, res, next) => {
  if (req.params.id) res.locals.Filter = { group_id: req.params.id };
  next();
};

// get list of group_ids belong to user -> return as an array
exports.getUserGroupIds = async userId => {
  let userGroups;
  try {
    const userGroupData = await UserGroup.find({ user_id: userId }).exec();
    userGroups = userGroupData.map(a => a.group_id.toString());
  } catch {
    userGroups = [];
  }
  return userGroups;
};

exports.getAllGroups = factory.getAll(Group);
exports.getGroup = factory.getOne(Group);
exports.createGroup = factory.createOne(Group);
exports.updateGroup = factory.updateOne(Group);
exports.deleteGroup = factory.deleteOne(Group);

exports.getUserGroups = factory.getAll(UserGroup);
exports.getGroupUsers = factory.getAll(UserGroup);
exports.createUserGroup = factory.createOne(UserGroup);
exports.updateUserGroup = factory.updateOne(UserGroup);
exports.deleteUserGroup = factory.deleteOne(UserGroup);
