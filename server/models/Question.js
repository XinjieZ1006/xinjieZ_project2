const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const _ = require('underscore');

const setName = (name) => _.escape(name).trim();

let QuestionModel = {};

const QuestionSchema = new mongoose.Schema({
    // user receiving the question
    owner: {
        type: mongoose.Schema.ObjectId,
        required: true,
        ref: 'Account',
    },
    // user asking the question
    asker: {
        type: mongoose.Schema.ObjectId,
        required: true,
        ref: 'Account',
    },
    createdDate: {
        type: Date,
        default: Date.now,
    },
    title: {
        type: String,
        required: true,
        trim: true,
    },
    body: {
        type: String,
        required: true,
        trim: true,
    },
    isAnswered: {
        type: Boolean,
        default: false,
    },
    answer:
    {
        type: mongoose.Schema.ObjectId,
        ref: 'Answer',
    },
});

QuestionModel = mongoose.model('Question', QuestionSchema);

module.exports = QuestionModel;
