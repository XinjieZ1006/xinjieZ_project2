const helper = require('./helper.js');
const React = require('react');
const { useState, useEffect } = React;
const { createRoot } = require('react-dom/client');

const useCheckProfile = (props) => {
    const [user, setUser] = useState({});
    const [isOwnProfile, setIsOwnProfile] = useState(false);
    const [questions, setQuestions] = useState([]);
    const [sessionUser, setSessionUser] = useState({});

    useEffect(() => {
        const getUser = async () => {
            try {
                const pathParts = window.location.pathname.split('/');
                const user = pathParts[pathParts.length - 1];
                const response = await fetch('/getUser/' + user);
                const sessionResponse = await fetch('/getSessionUser');
                const questionsResponse = await fetch('/getQuestions/' + user);

                const data = await response.json();
                const sessionData = await sessionResponse.json();
                const questionsData = await questionsResponse.json();

                // check if the current user is visiting their own profile
                if (sessionData.account.username === user) {
                    setIsOwnProfile(true);
                }
                else {
                    setIsOwnProfile(false);
                }
                setUser(data.account);
                setQuestions(questionsData.answeredQuestions);
                setSessionUser(sessionData.account);
            } catch (err) {
                console.error('Error fetching user', err);
            }
        };

        getUser();
    }, [props.reloadQuestions]);

    return { user, isOwnProfile, questions,sessionUser};
}

const useQuestionDetail = ({reloadQuestions}) => {
    const [question, setQuestion] = useState({});
    const [answer, setAnswer] = useState('');
    const [sessionUser, setSessionUser] = useState({});
    const [answerer, setAnswerer] = useState('');

    useEffect(() => {
        const getQuestion = async () => {
            try {
                const pathParts = window.location.pathname.split('/');
                const questionId = pathParts[pathParts.length - 1];
                const response = await fetch('/getQuestion/' + questionId);
                console.log("response", response);
                const sessionResponse = await fetch('/getSessionUser');
                const sessionData = await sessionResponse.json();
                const data = await response.json();

                setSessionUser(sessionData.account);
                setQuestion(data.question);
                console.log("question",data.question);

                setAnswer(data.question.answer);
                setAnswerer(data.answerer);
            } catch (err) {
                console.error('Error fetching question', err);
            }
        };

        getQuestion();
    }, [reloadQuestions]);

    return { question, answer, sessionUser, answerer };
}

const useSessionUser = (props) => {
    const [sessionUser, setSessionUser] = useState({});

    useEffect(() => {
        const getSessionUser = async () => {
            try {
                const response = await fetch('/getSessionUser');
                const data = await response.json();
                setSessionUser(data.account);
            } catch (err) {
                console.error('Error fetching session user', err);
            }
        };

        getSessionUser();
    },[]);

    return { sessionUser };
}

const Navbar = () => {
    return (
      <nav className="navbar has-background-primary is-align-items-center is-flex is-justify-content-space-between">
        <div className="navbar-start">
          <div className="navlink navbar-item">
            <a className="button is-outlined has-text-weight-bold" id="loginButton" href="/login">Login</a>
          </div>
          <div className="navlink navbar-item">
            <a className="button is-outlined has-text-weight-bold" id="signupButton" href="/signup">Sign up</a>
          </div>
        </div>
  
        {/* Centered Search Bar */}
        <div className="navbar-center is-flex-grow-1 is-align-self-center">
          <div className="field has-addons">
            <div className="control">
              <input className="input" type="text" placeholder="Search..." />
            </div>
            <div className="control">
              <button className="button is-white is-outlined">
                <span className="icon is-small">
                  <i className="fas fa-search"></i>
                </span>
              </button>
            </div>
          </div>
        </div>
  
        <div className="navbar-end">
          {/* You can add items to the right here if needed */}
        </div>
      </nav>
    );
  };
  

module.exports = { useCheckProfile, useQuestionDetail, Navbar,useSessionUser, };