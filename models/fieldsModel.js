const mongoose = require('mongoose');
const Collection = require('../models/collectionsModel');

const fieldsSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A field must have a name'],
      validate: {
        validator: async function(v) {
          v = v.replace(/\s+/g, '_').toLowerCase();
          let collectionID;
          if (this.collectionID) {
            // for createNewField
            collectionID = this.collectionID;
          } else if (this.r && this.r.collectionID) {
            // for findByIdAndUpdate
            collectionID = this.r.collectionID;
          }
          const docs = await mongoose.model('Fields').find({
            name: v,
            collectionID: collectionID
          });
          return docs.length === 0;
        },
        message: 'Field name has found. It has to be unique in the collection!'
      }
    },
    label: {
      type: String,
      required: [true, 'A field must have a label']
    },
    type: {
      type: String,
      required: [true, 'A field must have a label'],
      default: 'String',
      enum: ['String', 'Number', 'Boolean', 'Array', 'Date', 'Mixed', 'mongoose.Schema.ObjectId']
    },
    collectionID: {
      type: mongoose.Schema.ObjectId,
      ref: 'Collection',
      required: [true, 'A field must have a collection'],
      validate: {
        validator: async function(v) {
          const docs = await Collection.find({ _id: v });
          return docs.length > 0;
        },
        message: 'Collection id is not exist!'
      }
    },
    required: { type: 'Mixed', default: false },
    checkvalid: { type: 'Mixed' },
    active: { type: 'boolean', default: true },
    default: { type: 'String' },
    ref: { type: 'String' },
    enum: { type: 'Mixed' },
    min: { type: 'Mixed' },
    max: { type: 'Mixed' },
    lowercase: { type: 'boolean' },
    uppercase: { type: 'boolean' },
    trim: { type: 'boolean' },
    minlength: { type: 'Number' },
    maxlength: { type: 'Number' },
    various: { type: 'Mixed' },
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
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

fieldsSchema.pre(/^find/, function(next) {
  this.find({ active: { $ne: false } });
  next();
});

// for findByIdAndUpdate and findByIdAndDelete
fieldsSchema.pre(/^findOneAnd/, async function(next) {
  // When running update validators with the `context` option set to 'query',
  //`this` is query object. `this.r` is query document
  this.r = await this.findOne();
  next();
});

fieldsSchema.pre('save', function(next) {
  this.name = this.name.replace(/\s+/g, '_').toLowerCase();
  next();
});

const Fields = mongoose.model('Fields', fieldsSchema);

module.exports = Fields;
