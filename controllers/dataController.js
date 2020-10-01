const _ = require('lodash');
const factory = require('./handlerFactory');
const { modelObj } = require('./../utils/buildModels');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');

//if collectionName is set, then save that Model as a res.locals.Model
exports.setModel = (req, res, next) => {
  if (req.params.collectionName) {
    res.locals.Model = modelObj[req.params.collectionName];
    if (!modelObj[req.params.collectionName]) {
      return next(new AppError(`collectionName is not found!`, 404));
    }
    return next();
  }
  return next(new AppError(`collectionName is not defined!`, 404));
};

exports.getAllData = factory.getAll();
exports.getData = factory.getOne();
exports.createData = factory.createOne();
exports.updateData = factory.updateOne();
exports.deleteData = factory.deleteOne();

exports.getDataSummarySchema = (collectionName, type) => {
  // * expected Schema for data summary
  // - collection: main target collecton
  // - populate: space separated fields to be merged my reference
  // - select: space separated selected fields
  // - rename: final name of the fields in the output
  //
  // e.g. const schema = {
  //    collection: 'samples',
  //    select:'dir experiments_id.exp experiments_id.projects_id.name experiments_id.test_id.name',
  //    rename: 'directory exp_name pro_name test_name',
  //    populate: 'experiments_id experiments_id.projects_id experiments_id.test_id'
  //   }
  // IMPORTANT NOTE: `_id` field is required for schemas (for events->startRun function)
  let schemas = { summary: {}, detailed: {} };
  schemas.summary.sample = {
    collection: 'sample',
    select: `_id 
      name 
      file_env 
      file_used
      file_dir
      collection_type
      file_type
      creationDate 
      biosamp_id.exp_id.name 
      biosamp_id.exp_id.exp_series_id.name`,
    rename: `_id 
      name 
      file_env 
      files_used
      file_dir
      collection_type
      file_type
      date_created 
      collection_name 
      project_name`,
    populate: 'biosamp_id biosamp_id.exp_id biosamp_id.exp_id.exp_series_id'
  };
  schemas.detailed.sample = {
    collection: 'sample',
    select: `_id
      name
      file_env
      file_used
      file_dir
      collection_type
      file_type
      creationDate
      biosamp_id.exp_id.name
      biosamp_id.exp_id.exp_series_id.name
      sample_summary_id.doc`,
    rename: `_id
      name
      file_env
      files_used
      file_dir
      collection_type
      file_type
      date_created
      collection_name
      project_name
      sample_summary`,
    populate: 'biosamp_id biosamp_id.exp_id biosamp_id.exp_id.exp_series_id sample_summary_id'
  };
  if (schemas[type][collectionName]) return schemas[type][collectionName];
  return null;
};

const parseSummarySchema = (collectionName, type) => {
  // e.g. const schema = {
  //    collection: 'sample',
  //    select:'dir experiments_id.exp experiments_id.projects_id.name experiments_id.test_id.name',
  //    rename: 'directory exp_name pro_name test_name',
  //    populate: 'experiments_id experiments_id.projects_id experiments_id.test_id'
  //   }
  // returns popObj:{
  //   path: 'experiments_id',
  //   populate: { path: 'projects_id test_id' }
  // }
  // returns `rename` Function: renames keys of query docs according to Schema
  const schema = exports.getDataSummarySchema(collectionName, type);
  if (!schema) {
    return { targetCollection: collectionName, popObj: '', select: '-__v', rename: null };
  }
  const targetCollection = schema.collection;
  const select = schema.select;
  const popObj = {};

  // * prepare popObj
  const popArr = schema.populate.replace(/\s+/g, ' ').split(' ');
  for (let i = 0; i < popArr.length; i++) {
    if (!popArr[i].match(/\./)) {
      // parent fields without dots
      if (popObj.path) popObj.path += ` ${popArr[i]}`;
      if (!popObj.path) popObj.path = popArr[i];
    } else {
      const fields = popArr[i].split('.');
      const level = fields.length;
      const lastfield = fields[level - 1];
      const populates = `populate${'.populate'.repeat(level - 2)}`; // nested populates
      // lodash used for setting multiple levels of object with dot notation
      if (!_.get(popObj, `${populates}.path`)) {
        // set `path` value with `lastfield`
        _.set(popObj, `${populates}.path`, lastfield);
      } else {
        // get last `path` value and concat with `lastfield`
        const path = _.get(popObj, `${populates}`).path;
        _.set(popObj, `${populates}.path`, `${path} ${lastfield}`);
      }
    }
  }

  // * prepare `rename` function
  // e.g. project obj: {
  //   name: d.name,
  //   exp_email: d.experiments_id.email,
  // };
  const renameArr = schema.rename.replace(/\s+/g, ' ').split(' ');
  const selectArr = schema.select.replace(/\s+/g, ' ').split(' ');
  const rename = doc => {
    return doc.map(d => {
      const project = {};
      for (let i = 0; i < renameArr.length; i++) {
        // _.get used for getting multiple levels of object with dot notation
        // by using _.get -> undefined fields doesn't give error
        project[renameArr[i]] = _.get(d, selectArr[i]) === undefined ? '' : _.get(d, selectArr[i]);
      }
      return project;
    });
  };

  return { targetCollection, popObj, select, rename };
};

exports.getDataSummaryDoc = async (type, req, res, next) => {
  try {
    const { targetCollection, popObj, select, rename } = parseSummarySchema(
      req.params.collectionName,
      type
    );

    if (!modelObj[targetCollection]) return null;
    const query = modelObj[targetCollection].find({});
    if (res.locals.Perms) {
      const permFilter = await res.locals.Perms('read');
      query.find(permFilter);
    }
    query
      .populate(popObj)
      .select(select)
      .lean();

    let doc = await query;
    if (doc && rename) doc = rename(doc);
    return doc;
  } catch {
    return null;
  }
};

exports.getDataSummary = catchAsync(async (req, res, next) => {
  const start = Date.now();
  const type = 'summary';
  const doc = await exports.getDataSummaryDoc(type, req, res, next);
  const duration = Date.now() - start;
  if (doc === null) return next(new AppError(`No collection found!`, 404));
  res.status(200).json({
    status: 'success',
    duration: duration,
    results: doc.length,
    data: {
      data: doc
    }
  });
});

exports.getDataDetailed = catchAsync(async (req, res, next) => {
  const start = Date.now();
  const type = 'detailed';
  const doc = await exports.getDataSummaryDoc(type, req, res, next);
  const duration = Date.now() - start;
  if (doc === null) return next(new AppError(`No collection found!`, 404));
  res.status(200).json({
    status: 'success',
    duration: duration,
    results: doc.length,
    data: {
      data: doc
    }
  });
});
