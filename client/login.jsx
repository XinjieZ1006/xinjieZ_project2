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
        formik.setErrors({ username: 'Required', pass: 'Required' });
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
        formik.setErrors({ username: 'Required', pass: 'Required', pass2: 'Required' });
        return false;
    }

    if (pass != pass2) {
        formik.setErrors({ pass2: 'Passwords do not match!' });
        return false;
    }

    helper.sendPost(e.target.action, { username, nickname, pass, pass2 });
    return false;
}


const validateSignup = (values) => {
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

const validateLogin = (values) => {
    const errors = {};

    if (!values.username) {
        errors.username = 'Required';
    }

    if (!values.pass) {
        errors.pass = 'Required';
    }
}

const LoginForm = (props) => {
    const formik = useFormik({
        initialValues: {
            username: '',
            pass: ''
        },
        validateLogin,
        onSubmit: (values) => {
            helper.sendPost("/login", values);
        },
    });

    return (
        <form onSubmit={formik.handleSubmit}>
            <div className='field'>
            <label htmlFor='username' className='label'>Username: </label>
            <input id='username' className='input' type='text' name='username' placeholder='username' onChange={formik.handleChange} value={formik.values.username} />
            {formik.errors.username ? <div className='inputError help is-danger'>{formik.errors.username}</div> : null}
            </div>

            <div className='field'>
            <label htmlFor='pass' className='label'>Password:</label>
            <input id='pass' className='input' type='password' name='pass' placeholder='password' onChange={formik.handleChange} value={formik.values.pass} />
            {formik.errors.pass ? <div className='inputError help is-danger'>{formik.errors.pass}</div> : null}
            </div>

            <div className='field'>
            <button className='formSubmit button is-primary' type='submit'>Submit</button>
            </div>
        </form>
    )
}

const SignUpForm = (props) => {
    const formik = useFormik({
        initialValues: {
            username: '',
            nickname: '',
            pass: '',
            pass2: ''
        },
        validateSignup,
        onSubmit: (values) => {
            helper.sendPost("/signup", values);
        },
    });

    return (
        <form onSubmit={formik.handleSubmit}>
            <div className='field'>
            <label htmlFor='username' className='label'>Username: </label>
            <input id='username' className='input' type='text' name='username' placeholder='username' onChange={formik.handleChange} value={formik.values.username} />
            {formik.errors.username ? <div className='inputError help is-danger'>{formik.errors.username}</div> : null}
            </div>

            <div className='field'>
            <label htmlFor='nickname' className='label'>Nickname: </label>
            <input id='nickname' className='input' type='text' name='nickname' placeholder='optional' onChange={formik.handleChange} value={formik.values.nickname} />
            </div>

            <div className='field'>
            <label htmlFor='pass' className='label'>Password:</label>
            <input id='pass' className='input' type='password' name='pass' placeholder='password' onChange={formik.handleChange} value={formik.values.pass} />
            {formik.errors.pass ? <div className='inputError help is-danger'>{formik.errors.pass}</div> : null}
            </div>

            <div className='field'>
            <label htmlFor='pass2' className='label'>Password:</label>
            <input id='pass2' className='input' type='password' name='pass2' placeholder='retype password?' onChange={formik.handleChange} value={formik.values.pass2} />
            {formik.errors.pass2 ? <div className='inputError help is-danger'>{formik.errors.pass2}</div> : null}
            </div>

            <div className='field'>
            <button className='formSubmit button is-primary' type='submit' >Submit</button>
            </div>
        </form>
    )
}

const init = () => {
    const loginButton = document.getElementById('loginButton');
    const signupButton = document.getElementById('signupButton');

    const root = createRoot(document.getElementById('content'));

    loginButton.addEventListener('click', (e) => {
        e.preventDefault();
        root.render(<LoginForm />);
        return false;
    })
    signupButton.addEventListener('click', (e) => {
        e.preventDefault();
        root.render(<SignUpForm />);
        return false;
    })

    root.render(<LoginForm />);
}

window.onload = init;