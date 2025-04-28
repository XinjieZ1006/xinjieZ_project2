const helper = require('./helper.js');
const React = require('react');
const { createRoot } = require('react-dom/client');
const { useFormik } = require('formik');
const { values } = require('underscore');

const handleLogin = (e) => {
    e.preventDefault();
    helper.hideError();

    const username = e.target.querySelector('#user').value;
    const pass = e.target.querySelector('#pass').value;

    if (!username || !pass) {
        helper.handleError('Username or password is empty!');
        return false;
    }

    helper.sendPost(e.target.action, { username, pass });
    return false;
}

const handleSignup = (e) => {
    e.preventDefault();
    helper.hideError();

    const username = e.target.querySelector('#user').value;
    const nickname = e.target.querySelector('#nickname').value;
    const pass = e.target.querySelector('#pass').value;
    const pass2 = e.target.querySelector('#pass2').value;

    if (!username || !pass || !pass2) {
        helper.handleError('All fields are required!');
        return false;
    }

    if (pass != pass2) {
        helper.handleError('Passwords do not match!');
        return false;
    }

    helper.sendPost(e.target.action, { username, nickname, pass, pass2 });
    return false;
}

const LoginWindow = (props) => {
    return (
        <form id="loginForm"
            name='loginForm'
            onSubmit={handleLogin}
            action="/login"
            method='POST'
            className='mainForm'>
            <label htmlFor='username'>Username: </label>
            <input id='user' type='text' name='username' placeholder='username' />
            <label htmlFor='pass'>Password:</label>
            <input id='pass' type='password' name='pass' placeholder='password' />
            <input className='formSubmit' type='submit' value='Sign In' />
        </form>
    )
}

const SignupWindow = (props) => {
    return (
        <form id="signupForm"
            name='signupForm'
            onSubmit={handleSignup}
            action="/signup"
            method='POST'
            className='mainForm'>
            <label htmlFor='username'>Username: </label>
            <input id='user' type='text' name='username' placeholder='username' />
            <label htmlFor='nickname'>Nickname: </label>
            <input id='nickname' type='text' name='nickname' placeholder='optional' />
            <label htmlFor='pass'>Password:</label>
            <input id='pass' type='password' name='pass' placeholder='password' />
            <label htmlFor='pass2'>Password:</label>
            <input id='pass2' type='password' name='pass2' placeholder='retype password?' />
            <input className='formSubmit' type='submit' value='Sign Up' />
        </form>
    )
}

const validate = (values) => {
    const errors = {};

    if (!values.username) {
        errors.username = 'Required';
    }
    else if (values.username.length < 3) {
        errors.username = 'Must be 3 characters or more';
    }
    else if (values.username.length > 15) {
        errors.username = 'Must be 15 characters or less';
    }

    if (!values.pass) {
        errors.pass = 'Required';
    }

    if (!values.pass2) {
        errors.pass2 = 'Required';
    }
    if (values.pass !== values.pass2) {
        errors.pass2 = 'Passwords do not match!';
    }

    return errors;
}

const SignUpForm = (props) => {
    const formik = useFormik({
        initialValues: {
            username: '',
            nickname: '',
            pass: '',
            pass2: ''
        },
        validate,
        onSubmit: (values) => {
            helper.sendPost("/signup", values);
        },
    });

    return (
        <form onSubmit={formik.handleSubmit}>
            <label htmlFor='username'>Username: </label>
            <input id='username' type='text' name='username' placeholder='username' onChange={formik.handleChange} value={formik.values.username} />
            {formik.errors.username ? <div>{formik.errors.username}</div> : null}
            <label htmlFor='nickname'>Nickname: </label>
            <input id='nickname' type='text' name='nickname' placeholder='optional' onChange={formik.handleChange} value={formik.values.nickname} />
            <label htmlFor='pass'>Password:</label>
            <input id='pass' type='password' name='pass' placeholder='password' onChange={formik.handleChange} value={formik.values.pass} />
            {formik.errors.pass ? <div>{formik.errors.pass}</div> : null}
            <label htmlFor='pass2'>Password:</label>
            <input id='pass2' type='password' name='pass2' placeholder='retype password?' onChange={formik.handleChange} value={formik.values.pass2} />
            {formik.errors.pass2 ? <div>{formik.errors.pass2}</div> : null}
            <button className='formSubmit' type='submit' >Submit</button>
        </form>
    )
}

const init = () => {
    const loginButton = document.getElementById('loginButton');
    const signupButton = document.getElementById('signupButton');

    const root = createRoot(document.getElementById('content'));

    loginButton.addEventListener('click', (e) => {
        e.preventDefault();
        root.render(<LoginWindow />);
        return false;
    })
    signupButton.addEventListener('click', (e) => {
        e.preventDefault();
        root.render(<SignUpForm />);
        return false;
    })

    root.render(<LoginWindow />);
}

window.onload = init;