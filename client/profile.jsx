const helper = require('./helper.js');
const React = require('react');
const { useState, useEffect } = React;
const { createRoot } = require('react-dom/client');
const { useFormik } = require('formik');

const UserProfile = (props) => {

    const [username, setUsername] = useState('');
    const [user, setUser] = useState({});

    useEffect(() => {
        const getUser = async () => {
            try {
                const pathParts = window.location.pathname.split('/');
                const user = pathParts[pathParts.length - 1];
                const response = await fetch('/getUser/' + user);
                const data = await response.json();
                setUser(data.account);
            } catch (err) {
                console.error('Error fetching user', err);
            }
        };

        getUser();
    }, []);
    return (
        <div className="userProfile">
            <div className="box has-text-centered is-rounded has-background-info">
                <figure className="image is-128x128 is-inline-block">
                    <img className="is-rounded profilePicture" src={user.avatar || '../hosted/img/lemon.png'} alt="Profile" />
                </figure>
                <h3 className="title is-5 mt-3">{user.nickname}</h3>
                <h4 className="is-6">@{user.username}</h4>
                <hr />
                <p>Member Since {new Date(user.createdDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}</p>
            </div>
        </div>
    );
}

const QuestionList = (props) => {
    const [questions, setQuestions] = useState(props.questions);

    useEffect(() => {
        const loadQuestionsFromServer = async () => {
            const response = await fetch('/getQuestions');
            const data = await response.json();
            setQuestions(data.questions);
        };
        loadQuestionsFromServer();
    }, [props.reloadQuestions]);

    if (questions.length === 0) {
        return (
            <div className="questionList">
                <h3 className="emptyQuestion">No Questions Yet!</h3>
            </div>
        );
    }

    const questionNodes = questions.map(question => {
        return (
            <div key={question.id} className="question">
                <h3 className="questionTitle">{question.title}</h3>
                <p className="questionBody">{question.body}</p>
            </div>
        );
    });

    return (
        <div className="questionList">
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
        <form onSubmit={formik.handleSubmit}>
            <label htmlFor='questionBody'>Question Body: </label>
            <input id='questionBody' className='textarea' type='text' name='questionBody' placeholder='Question Body' onChange={formik.handleChange} value={formik.values.questionBody} />
            {formik.errors.questionBody ? <div>{formik.errors.questionBody}</div> : null}
            <input className='formSubmit' type='submit' value='Ask Question!' />
        </form>

    )
}

const validateQuestion = (values) => {
    const errors = {};

    if (!values.questionBody) {
        errors.questionBody = 'Cannot be empty!';
    }
    return errors;
}

const App = () => {
    return (
        <div className="appContainer columns is-fullheight">
            <div className="column is-one-third">
                <UserProfile />
            </div>
            <div className="column is-two-thirds mr-6">
                <QuestionForm />
            </div>
        </div>
    );
}

const init = () => {
    const root = createRoot(document.getElementById('app'));
    root.render(<App />);
}

window.onload = init;