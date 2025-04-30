const helper = require('./helper.js');
const React = require('react');
const { useState, useEffect } = React;
const { createRoot } = require('react-dom/client');
const { useFormik } = require('formik');
const reactDom = require('react-dom/client');
const { Navbar } = require('./helper.jsx');


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

    return { user, isOwnProfile, questions, sessionUser };
}

const UserProfile = (props) => {

    const { user, isOwnProfile } = useCheckProfile(props);

    return (
        <div className="userProfile">
            <div className="box has-text-centered is-rounded has-background-primary">
                <figure className="image is-128x128 is-inline-block">
                    <img className="is-rounded profilePicture" src={user.avatar || '../hosted/img/lemon.png'} alt="Profile" />
                </figure>
                <h3 className="has-text-weight-semibold is-size-4 mt-3">{user.nickname}</h3>
                <h4 className="is-size-7 has-text-gray mt-1 mb-3">@{user.username}</h4>
                {user.isPremium ? <span className="tag is-warning">Premium User</span> : <span className="tag is-gray">Free User</span>}
                <hr />
                {isOwnProfile ? <h3 className="is-size-5">Your Profile</h3> : <h3 className="is-size-5">User Profile</h3>}
                <p>Member Since {new Date(user.createdDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}</p>
                {/* {isOwnProfile ? <div className='mt-4'><a className="button is-outlined has-text-weight-semibold">Unanswered Questions</a></div> : null} */}
                {isOwnProfile ? <div className='mt-4'><a href='/editProfile' className="button is-outlined has-text-weight-semibold">Edit Profile</a></div> : null}
            </div>
        </div>
    );
}


const QuestionList = (props) => {
    const { user, questions } = useCheckProfile(props);

    console.log('Questions:', questions);
    if (questions.length === 0) {
        return (
            <div className="questionList">
                <h3 className="emptyQuestion">No Questions Yet!</h3>
            </div>
        );
    }

    const questionNodes = questions.map(question => {
        return (
            <div key={question.id} className="question box is-flex is-flex-direction-column is-justify-content-center is-align-content-center has-text-centered is-rounded has-background-primary" style={{ height: 300 + 'px', width: 900 + 'px' }}>
                <h3 className="questionTitle mb-3 has-text-weight-bold is-size-3">{question.title}</h3>
                {question.isAnswered ? <span className="tag is-success is-size-6">Answered</span> : <span className="tag is-grey-dark is-size-6">Unanswered</span>}
                <div className="questionBody box is-shadowless has-text-centered is-rounded has-background-white p-9" style={{ height: 60 + '%' }}>
                    <p className='is-flex is-justify-content-center is-align-content-center has-text-centered p-5'>{question.body.length > 100 ? question.body.slice(0, 100) + '...' : question.body}</p>
                </div>
                <div><a className='button has-text-weight-bold is-outlined' href={'/viewQuestion/' + question._id} >View Question</a></div>
            </div>
        );
    });

    return (
        <div className=" questionList is-flex is-flex-direction-column-reverse is-justify-content-space-evenly is-align-content-center">
            {questionNodes}
        </div>
    );

}

const QuestionForm = (props) => {
    const formik = useFormik({
        initialValues: {
            questionTitle: '',
            questionBody: '',
        },
        validateQuestion,
        onSubmit: (values) => {
            props.triggerReload();
            const pathParts = window.location.pathname.split('/');
            const user = pathParts[pathParts.length - 1];
            const data = {
                title: values.questionTitle,
                body: values.questionBody,
                owner: user,
                createdDate: Date.now(),
                isAnswered: false,
                answer: [],
            }
            helper.sendPost("/sendQuestion", data);
        },
    });

    return (
        <div className="box has-shadow has-text-centered is-rounded has-background-primary">
            <form onSubmit={formik.handleSubmit}>
                <div className='field'>
                    <label htmlFor='questionBody' className='title is-size-3 mb-2'>Ask Your Questions! </label>
                    <input id='questionBody' className='textarea has-text-centered' type='text' name='questionBody' placeholder='Question Body' onChange={formik.handleChange} value={formik.values.questionBody} />
                    {formik.errors.questionBody ? <div>{formik.errors.questionBody}</div> : null}
                </div>
                <div className='field'>
                    <input className='formSubmit button is-outlined has-text-weight-semibold' type='submit' value='Submit!' />
                </div>
            </form>
        </div>

    )
}

const validateQuestion = (values) => {
    const errors = {};

    if (!values.questionBody) {
        errors.questionBody = 'Cannot be empty!';
    }
    return errors;
}

const App = (props) => {
    const [reloadQuestions, setReloadQuestions] = useState(false);
    const { user, isOwnProfile } = useCheckProfile(props);
    return (
        <div>
            <div className="appContainer columns is-fullheight m-1" style={{ height: 100 + '%' }}>
                <div className="column is-one-third">
                    <UserProfile />
                </div>
                <div className="column is-two-thirds mr-6 is-flex is-justify-content-center is-align-items-center is-flex-direction-column">
                    {!isOwnProfile ? <div className="mb-5" style={{ width: 90 + '%' }}>
                        <QuestionForm triggerReload={() => setReloadQuestions(!reloadQuestions)} />
                    </div> : null}

                    <div className="mr-6" style={{ overflowX: 'hidden', wordWrap: 'break-word' }}>
                        <QuestionList reloadQuestions={reloadQuestions} />
                    </div>
                </div>
            </div></div>
    );
}

const init = () => {
    const root = createRoot(document.getElementById('app'));
    root.render(<App />);
    helper.handleSearch();
}

window.onload = init;