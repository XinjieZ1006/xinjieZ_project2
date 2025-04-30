const helper = require('./helper.js');
const React = require('react');
const ReactDOM = require('react-dom');
const { useState, useEffect } = React;
const { createRoot } = require('react-dom/client');
const { useFormik } = require('formik');
const { useCheckProfile, useQuestionDetail, Navbar } = require('./helper.jsx');

const useQuestion = (props) => {
    const [question, setQuestion] = useState({});
    const [answers, setAnswers] = useState([]);

    useEffect(() => {
        const getQuestion = async () => {
            try {
                const pathParts = window.location.pathname.split('/');
                const questionId = pathParts[pathParts.length - 1];
                const response = await fetch('/getQuestion/' + questionId);

                const data = await response.json();

                setQuestion(data.question);
                setAnswers(data.question.answers);
            } catch (err) {
                console.error('Error fetching question', err);
            }
        };

        getQuestion();
    }, []);

    return { question, answers };
}

const QuestionDetail = (props) => {
    const { sessionUser, question, } = props.details;

    return (
        <div className="questionDetail" style={{ width: 60 + '%', height: 70 + 'vh' }}>
            <div className="box has-text-centered is-rounded has-background-primary mb-5" >
                <h3 className="has-text-weight-semibold is-size-4 mt-3 mb-3">{question.title}</h3>
                <div className='box has-background-white has-text-centered is-rounded has-background-white'>
                    <p className="is-size-4 has-text-gray mt-1 mb-3 p-6">{question.body}</p>
                </div>
            </div>
        </div>
    )
}

const Answer = (props) => {
    const {answer, answerer} = props.details;
    console.log("answer", answer);
    return (
        <div className="box has-text-centered is-rounded has-background-primary" style={{ width: 60 + '%' }}>
            <div className='box has-background-white has-text-centered is-rounded has-background-white'>
                <p className="is-size-5 has-text-gray mt-1 mb-3 p-6">{answer && answer.body ? answer.body : "No Answer Yet"}</p>
            </div>
            <div>
                <h3 className="has-text-weight-semibold is-size-4 mt-3 mb-3">{answerer?.nickname ? `Answered by ${answerer.nickname}` : null} </h3>
            </div>
        </div>
    )
}

const AnswerForm = (props) => {

    const { question, sessionUser } = props.details;
    const formik = useFormik({
        initialValues: {
            answerBody: '',
        },
        validateAnswer,
        onSubmit: async (values) => {
            try {
                const data = {
                    answerer: sessionUser,
                    body: values.answerBody,
                    createdDate: Date.now(),
                    question: question,
                }
                await helper.sendPost(`/sendAnswer/${question._id}`, data);
                props.triggerReload();
                formik.resetForm();
            } catch (err) {
                console.error('Error sending answer', err);
            }
        }

    });

    return (
        <div className="box has-shadow has-text-centered is-rounded has-background-primary" style={{ width: 60 + '%' }}>
            <form onSubmit={formik.handleSubmit}>
                <div className='field'>
                    <label htmlFor='answerBody' className='title is-size-3 mb-2'>Answer the Question! </label>
                    <input id='answerBody' className='textarea has-text-centered' type='text' name='answerBody' placeholder='Answer Body' onChange={formik.handleChange} value={formik.values.answerBody} />
                    {formik.errors.answerBody ? <div>{formik.errors.answerBody}</div> : null}
                </div>
                <div className='field'>
                    <input className='formSubmit button is-outlined has-text-weight-semibold' type='submit' value='Submit!' />
                </div>
            </form>
        </div>
    )

}

const validateAnswer = (values) => {
    const errors = {};
    if (!values.answerBody) {
        errors.answerBody = 'Cannot be empty!';
    }
    return errors;
}

const App = (props) => {
    const [reloadQuestions, setReloadQuestions] = useState(false);
    const details = useQuestionDetail({reloadQuestions});

    return (
            <div className="questionDetail is-flex is-justify-content-center is-align-items-center is-flex-direction-column" style={{ height: 80 + 'vh', width: 90 + 'vw' }}>
                <QuestionDetail details = {details}/>
                {(!details.question.isAnswered && details.question.owner === details.sessionUser._id) ? <AnswerForm triggerReload={() => setReloadQuestions(!reloadQuestions)} details={details} /> : null}
                {(details.question.isAnswered || details.question.owner !== details.sessionUser._id) ? <Answer details = {details} /> : null}
            </div>
    )
}

const init = () => {
    const root = createRoot(document.getElementById('app'));
    root.render(<App />);
    helper.handleSearch();
}

window.onload = init;

