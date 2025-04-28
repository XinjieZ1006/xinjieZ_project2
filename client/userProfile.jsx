const helper = require('./helper.js');
const React = require('react');
const { useState, useEffect } = React;
const { createRoot } = require('react-dom/client');
const { useFormik } = require('formik');

const UserProfile = (props) => {

    const [nickname, setNickname] = useState('');

    useEffect(() => {
        const getNickname = async () => {
            try {
                const response = await fetch('/getNickname');
                const data = await response.json();
                setNickname(data.nickname || 'User');
                document.querySelector("#displayNickname").innerHTML = `Hi, ${data.nickname || 'User'}!`
            } catch (err) {
                console.error('Error fetching nickname:', err);
            }
        };

        getNickname();
    }, []);
    return (
        <div className="userProfile">
            <h1>{nickname}'s Profile</h1>

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
        validate,
        onSubmit: (values) => {
            helper.sendPost("/sendQuestion", values);
        },
    });
}

const validateQuestion = (values) => {
    const errors = {};

    if (!values.questionBody) {
        errors.questionBody = 'Cannot be empty!';
    }
    return errors;
}