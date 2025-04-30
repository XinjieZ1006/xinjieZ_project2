const helper = require('./helper.js');
const React = require('react');
const { createRoot } = require('react-dom/client');
const { useState, useEffect } = React;
const { useFormik } = require('formik');
const { useSessionUser } = require('./helper.jsx');

const handleChangeName = (e) => {
    e.preventDefault();
    helper.hideError();

    const newName = e.target.querySelector('#newName').value;

    if (!newName) {
        helper.handleError('Please enter a new name!');
        return false;
    }

    helper.sendPost(e.target.action, { newName });
    return false;
}

const ChangeName = (props) => {
    return (
        <div className='m-6'>
            <form id="changeNameForm"
                name='changeNameForm'
                onSubmit={handleChangeName}
                action="/updateName"
                method='POST'
                className='mainForm'>
                <label htmlFor='newName' className='label'>New Name: </label>
                <input className='input' id='newName' type='text' name='newName' placeholder='Enter your new name' />
                <input className='formSubmit button is-outlined is-primary mt-2 has-text-weight-bold' type='submit' value='Change' />
            </form>
        </div>
    )
}

const ChangePassword = (props) => {
    const formik = useFormik({
        initialValues: {
            oldPassword: '',
            newPassword: ''
        },
        onSubmit: (values) => {
            helper.sendPost("/changePassword", values);
        },
    });

    return (
        <div className='m-6'>
            <form onSubmit={formik.handleSubmit} className=''>
                <div className=''>
                    <label htmlFor='oldPassword' className='label'>Old Password: </label>
                    <input
                        id='oldPassword'
                        className='input'
                        type='password'
                        name='oldPassword'
                        placeholder='old password'
                        onChange={formik.handleChange}
                        value={formik.values.oldPassword}
                    />
                </div>

                <div className=''>
                    <label htmlFor='newPassword' className='label'>New Password:</label>
                    <input
                        id='newPassword'
                        className='input'
                        type='password'
                        name='newPassword'
                        placeholder='new password'
                        onChange={formik.handleChange}
                        value={formik.values.newPassword}
                    />
                </div>

                <div className=''>
                    <button className='formSubmit button is-outlined has-text-weight-bold mt-2 is-primary' type='submit'>
                        Submit
                    </button>
                </div>
            </form>
        </div>
    )
}

const GetPremium = (props) => {
    const { sessionUser } = useSessionUser(props);
    const formik = useFormik({
        initialValues: {
            isPremium: true,
        },
        onSubmit: (values) => {
            helper.sendPost("/changeStatus", values);
        },
    });
    return (
        <div className='m-6'>
        <form
            id="getPremiumForm"
            name='getPremiumForm'
            onSubmit={formik.handleSubmit} // Use Formik's handleSubmit
            className='mainForm'
        >
            <input
                className='formSubmit button is-outlined is-primary mt-2 has-text-weight-bold'
                type='submit'
                value='Get Premium'
            />
        </form>
    </div>
    )
}

const App = (props) => {
    return (
        <div>
            <ChangeName />
            <ChangePassword />
            <GetPremium />
        </div>
    )
}

const init = () => {
    const root = createRoot(document.getElementById('info'));
    root.render(<App />);
}

window.onload = init;