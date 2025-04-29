const models = require('../models');

const { Question, Account } = models;

const profilePage = async (req, res) => {
    const { username } = req.params;
    // check if the user exists
    const account = await models.Account.findOne({ username }).lean();
    const profilePicture = account.avatar || '../assets/img/lemon.png';
    if (!account) {
        return res.status(404).render('notFound', { error: 'User not found!' });
    }
    res.render('profile', { username, profilePicture });

}


const getAnsweredQuestions = async (req, res) => {
    try {
        const query = { owner: req.session.account._id };
        const docs = await Question.find(query).select('title body createdDate answer').lean().exec();
        const answeredQuestions = docs.filter((question) => question.isAnswered === true);
        return res.json({ answeredQuestions: docs });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: 'Error retrieving questions!' });
    }
};

const askQuestion = async (req, res) => {
    if (!req.body.body) {
        return res.status(400).json({ error: 'You cannot submit an empty question!' });
    }
    try {
        console.log('Asking question:', req.body);
        const account = await Account.findById(req.session.account._id);
        const owner = await Account.findOne({ username: req.body.owner });

        const questionData = {
            title: `${account.nickname}'s question`,
            body: req.body.body,
            asker: req.session.account._id,
            owner: owner._id,
            createdDate: req.body.createdDate,
            isAnswered: req.body.isAnswered,
            answer: [],
        }

        const newQuestion = new Question(questionData);
        await newQuestion.save();
        return res.status(201).json({ question: newQuestion });
    } catch (e) {
        console.log(e);
        return res.status(500).json({ error: 'Error submitting the question :(' });
    }
}

module.exports = {
    profilePage,
    getAnsweredQuestions,
    askQuestion,
};
