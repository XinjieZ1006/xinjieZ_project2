const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const _ = require('underscore');

let AnswerModel = {};
const AnswerSchema = new mongoose.Schema({
    question: {
      type: mongoose.Schema.ObjectId,
      required: true,
      ref: 'Question',
    },
    answerer: {
      type: mongoose.Schema.ObjectId,
      required: true,
      ref: 'Account',
    },
    createdDate: {
      type: Date,
      default: Date.now,
    },
    body: {
      type: String,
      required: true,
      trim: true,
    },
  });
  
  AnswerModel = mongoose.model('Answer', AnswerSchema);
  module.exports = AnswerModel;
  