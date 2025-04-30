const models = require('../models');

const { Question, Account } = models;

const questionPage = (req, res) => {
    const questionID = req.params;
    res.render('question', {});
}

const getAnswer = async (req, res) => {
    try {
        const answerID = req.params.answerId;
        const answer = await models.Answer.findById(answerID);
        if (!answer) {
            return res.status(404).render('notFound', { error: 'Answer not found!' });
        }
        return res.json({ answer: answer });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: 'Error retrieving answer!' });
    }
}

const getQuestion = async (req, res) => {
    try {
        const questionID = req.params.questionId;
        const question = await Question.findById(questionID).populate('answer').lean();
        console.log('Question:', question);
        let answerer = null;
        if(question.answer) {
        answerer = await Account.findById(question.answer.answerer).select('nickname username').lean();
        }
        if (!question) {
            return res.status(404).render('notFound', { error: 'Question not found!' });
        }
        return res.json({ question: question, answerer: answerer });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: 'Error retrieving question!' });
    }
};

const sendAnswer = async (req, res) => {
    console.log('Sending answer:', req.body);
    if (!req.body.body) {
        return res.status(400).json({ error: 'You cannot submit an empty answer!' });
    }
    try {
        const questionID = req.params.questionId;
        const question = await Question.findById(questionID);
        if (!question) {
            return res.status(404).render('notFound', { error: 'Question not found!' });
        }
        const answerData = {
            answerer: req.session.account._id,
            body: req.body.body,
            question: questionID,
            createdDate: req.body.createdDate,
        };

        const newAnswer = new models.Answer(answerData);
        await newAnswer.save();
        question.answer = (newAnswer);
        question.isAnswered = true;
        await question.save();
        return res.status(201).json({ question: question });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: 'Error submitting answer!' });
    }
}

module.exports = {
    questionPage,
    getQuestion,
    sendAnswer,
    getAnswer,
};