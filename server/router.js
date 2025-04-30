const controllers = require('./controllers');
const mid = require('./middleware');

const router = (app) => {
  app.get('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
  app.post('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.login);

  app.post('/signup', mid.requiresSecure, mid.requiresLogout, controllers.Account.signup);

  app.get('/logout', mid.requiresLogin, controllers.Account.logout);

  app.get('/', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);

  app.get('/getNickname', mid.requiresLogin, controllers.Account.getName);
  app.get('/changeName', mid.requiresLogin, controllers.Account.accountInfo);
  app.post('/updateName', mid.requiresLogin, controllers.Account.updateNickname);

  app.get('/profile/:username', mid.requiresLogin, controllers.Profile.profilePage);
  app.get('/getUser/:username', mid.requiresLogin, controllers.Account.getUser);
  app.get('/getCurrentUser', mid.requiresLogin, controllers.Account.getCurrentUser);
  app.get('/getQuestions/:username', mid.requiresLogin, controllers.Profile.getAnsweredQuestions);
  app.post('/sendQuestion', mid.requiresLogin, controllers.Profile.askQuestion);
  app.post('/sendAnswer/:questionId', mid.requiresLogin, controllers.Question.sendAnswer);
  app.get('/getSessionUser', mid.requiresLogin, controllers.Account.getSessionUser);
  app.get('/viewQuestion/:questionId', mid.requiresLogin, controllers.Question.questionPage);
  app.get('/getQuestion/:questionId', mid.requiresLogin, controllers.Question.getQuestion);
  app.get('/editProfile/', mid.requiresLogin, controllers.Account.accountInfo);
  app.post('/changePassword', mid.requiresLogin, controllers.Account.changePassword);
  app.post('/changeStatus', mid.requiresLogin, controllers.Account.updateStatus);

  app.all('*', (req, res) => {
    res.status(404).render('notFound', { title: 'Page Not Found' }); // Render 404 page (if using views) or send a message
  });
};

module.exports = router;
