const models = require('../models');

const { Account } = models;

const loginPage = (req, res) => res.render('login');
const accountInfo = (req, res) => res.render('account');

const logout = (req, res) => {
  req.session.destroy();
  res.redirect('/');
};

const login = (req, res) => {
  const username = `${req.body.username}`;
  const pass = `${req.body.pass}`;

  if (!username || !pass) {
    return res.status(400).json({ error: 'All fields are required!' });
  }
  return Account.authenticate(username, pass, (err, account) => {
    if (err || !account) {
      return res.status(401).json({ error: 'Wrong username or password!' });
    }
    req.session.account = Account.toAPI(account);
    return res.json({ redirect: `/profile/${username}` });
  });
};

const signup = async (req, res) => {
  const username = `${req.body.username}`;
  let nickname = `${req.body.nickname}`;
  const pass = `${req.body.pass}`;
  const pass2 = `${req.body.pass2}`;

  if (!username || !pass || !pass2) {
    return res.status(400).json({ error: 'All fields are required!' });
  }

  if (!nickname) {
    nickname = username;
  }

  if (pass !== pass2) {
    return res.status(400).json({ error: 'Passwords do not match!' });
  }

  try {
    const hash = await Account.generateHash(pass);
    const newAcc = new Account({ username, nickname, password: hash });
    await newAcc.save();
    req.session.account = Account.toAPI(newAcc);
    return res.json({ redirect: '/profile' + `/${username}` });
  } catch (e) {
    console.log(e);
    if (e.code === 11000) {
      return res.status(400).json({ error: 'Username already in use!' });
    }
    return res.status(500).json({ error: 'An error occured' });
  }
};

const getName = async (req, res) => {
  try {
    const account = await Account.findById(req.session.account._id).select('nickname');
    console.log('Account:', account);
    return res.json({ nickname: account.nickname });
  } catch (e) {
    return res.status(400).json({ error: 'Error retrieving nickname' });
  }
};

const getUser = async (req, res) => {
  try {
    const username = req.params.username;
    const account = await Account.findOne({ username });

    if(!account) {
      return res.status(404).json({ error: 'User not found' });
    }
    return res.status(200).json({ account });
  }catch (e) {
    console.log(e);
    return res.status(500).json({ error: 'Error retrieving user' });
  }
    
}


const getCurrentUser = async (req, res) => {
  if (!req.session.account) {
    return res.status(401).json({ error: 'You need to log in first.' });
  }

  try {
    const account = await Account.findById(req.session.account._id);
    console.log('Account:', account);
    return res.json({
      nickname: account.nickname,
      username: account.username,
      isPremium: account.isPremium,
    });
  } catch (e) {
    return res.status(400).json({ error: 'Error retrieving user' });
  }
};

const updateNickname = async (req, res) => {
  const nickname = req.body.newName;
  if (!nickname) {
    return res.status(400).json({ error: 'Enter a new nickname' });
  }
  try {
    const account = await Account.findById(req.session.account._id);
    account.nickname = nickname;
    await account.save();
    return res.json({ redirect: '/maker' });
  } catch (e) {
    return res.status(400).json({ error: 'Error updating nickname' });
  }
};

module.exports = {
  loginPage,
  accountInfo,
  login,
  logout,
  signup,
  getName,
  updateNickname,
  getCurrentUser,
  getUser,
};
