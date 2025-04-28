const models = require('../models');

const { Question, Answers } = models;

const makerPage = (req, res) => res.render('app');

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
const makeDomo = async (req, res) => {
  if (!req.body.name || !req.body.age) {
    return res.status(400).json({ error: 'Both name and age are required!' });
  }

  const domoData = {
    name: req.body.name,
    age: req.body.age,
    owner: req.session.account._id,
  };

  try {
    const newDomo = new Domo(domoData);
    await newDomo.save();
    return res.status(201).json({ name: newDomo.name, age: newDomo.age });
  } catch (e) {
    console.log(e);
    if (e.code === 11000) {
      return res.status(400).json({ error: 'Domo already exists!' });
    }
    return res.status(500).json({ error: 'An error occured making Domo!' });
  }
};

module.exports = {
  makerPage,
  makeDomo,
  getDomos,
};
