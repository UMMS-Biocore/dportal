const AppError = require('./../utils/appError');
const catchAsync = require('./../utils/catchAsync');
const APIFeatures = require('./../utils/apiFeatures');

//* -------------- Global Variables for handlerFactory ----------------------
// 1. res.locals.Model => use as a Model (for dataRoutes)
//    e.g. if (res.locals.Model) Model = res.locals.Model;
// 2. res.locals.After => commands will be executed after query is completed
//    e.g. if (res.locals.After) res.locals.After();
// 3. res.locals.user set with `isLoggedIn` or `isLoggedInView` middleware
// 4. res.locals.Perms returns filtration creteria regarding permission
//    e.g. permission methods: authController.setDefPerms
//    usage e.g. const permFilter = await res.locals.Perms("read");
//         query.find(permFilter);

exports.deleteOne = Model =>
  catchAsync(async (req, res, next) => {
    let doc;
    if (res.locals.Model) Model = res.locals.Model;
    // Check if deletion is allowed
    if (res.locals.Perms) {
      let query = Model.findById(req.params.id);
      const permFilter = await res.locals.Perms('write');
      query.find(permFilter);
      doc = await query;
      if (!doc || (Array.isArray(doc) && doc.length === 0)) {
        return next(new AppError(`No document found with ${req.params.id}!`, 404));
      }
    }
    const delDoc = await Model.findByIdAndDelete(req.params.id);
    if (!delDoc || (Array.isArray(delDoc) && delDoc.length === 0)) {
      return next(new AppError(`No document found with ${req.params.id}!`, 404));
    }
    if (res.locals.After) res.locals.After();
    if (res.locals.Event) res.locals.Event('delete', Model.collection.collectionName, doc);

    res.status(200).json({
      status: 'success',
      data: {
        doc: 'Deleted!'
      }
    });
  });

exports.updateOne = Model =>
  catchAsync(async (req, res, next) => {
    if (res.locals.Model) Model = res.locals.Model;
    req.body.lastUpdatedUser = req.user.id;
    // don't allow to change internal parameters such as owner, creationDate etc.
    ['owner', 'creationDate', 'lastUpdateDate', 'lastUpdatedUser'].forEach(function(key) {
      delete req.body[key];
    });
    // Check if update is allowed
    if (res.locals.Perms) {
      let query = Model.findById(req.params.id);
      const permFilter = await res.locals.Perms('write');
      query.find(permFilter);
      const doc = await query;
      if (!doc || (Array.isArray(doc) && doc.length === 0)) {
        return next(new AppError(`No document found with ${req.params.id}!`, 404));
      }
    }

    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
      context: 'query' //  lets you set `this` as a query object in model validators
    });
    if (!doc) {
      return next(new AppError(`No document found with ${req.params.id}!`, 404));
    }
    if (res.locals.After) res.locals.After();
    if (res.locals.Event) res.locals.Event('update', Model.collection.collectionName, doc);

    res.status(200).json({
      status: 'success',
      data: {
        data: doc
      }
    });
  });

exports.createOne = Model =>
  catchAsync(async (req, res, next) => {
    if (res.locals.Model) Model = res.locals.Model;
    req.body.lastUpdatedUser = req.user.id;
    req.body.owner = req.user.id;
    if (res.locals.Perms) {
      const permCreate = await res.locals.Perms('create');
      if (!permCreate) {
        return next(new AppError(`Permission denied: no write permission`, 404));
      }
    }
    const doc = await Model.create(req.body);
    if (res.locals.After) res.locals.After();
    if (res.locals.Event) res.locals.Event('insert', Model.collection.collectionName, doc);

    res.status(201).json({
      status: 'success',
      data: {
        data: doc
      }
    });
  });

exports.getOne = (Model, popOptions) =>
  catchAsync(async (req, res, next) => {
    if (res.locals.Model) Model = res.locals.Model;
    let query = Model.findById(req.params.id);
    if (res.locals.Perms) {
      const permFilter = await res.locals.Perms('read');
      query.find(permFilter);
    }
    if (popOptions) query = query.populate(popOptions);
    const doc = await query;
    if (!doc || (Array.isArray(doc) && doc.length === 0)) {
      return next(new AppError(`No document found with ${req.params.id}!`, 404));
    }

    res.status(200).json({
      status: 'success',
      reqeustedAt: req.requestTime,
      data: {
        data: doc
      }
    });
  });

exports.getAll = Model =>
  catchAsync(async (req, res, next) => {
    if (res.locals.Model) Model = res.locals.Model;
    let filter = {};
    if (res.locals.Filter) filter = res.locals.Filter;
    const query = Model.find(filter);
    if (res.locals.Perms) {
      const permFilter = await res.locals.Perms('read');
      query.find(permFilter);
    }
    const features = new APIFeatures(query, req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();
    //const doc = await features.query.explain();
    const doc = await features.query;
    if (!doc || (Array.isArray(doc) && doc.length === 0)) {
      return next(new AppError(`No document found!`, 404));
    }
    res.status(200).json({
      status: 'success',
      reqeustedAt: req.requestTime,
      results: doc.length,
      data: {
        data: doc
      }
    });
  });
