const helper = require('./helper.js');
const React = require('react');
const { createRoot } = require('react-dom/client');

const { useState, useEffect } = React;


const handleChangeName = (e) => {
    e.preventDefault();
    helper.hideError();

    const newName = e.target.querySelector('#newName').value;

    if (!newName) {
        helper.handleError('Please enter a new name!');
        return false;
    }

    helper.sendPost(e.target.action, { newName});
    return false;
}

const ChangeName = (props) => {
    return <form id="changeNameForm"
        name='changeNameForm'
        onSubmit={handleChangeName}
        action="/updateName"
        method='POST'
        className='mainForm'>
        <label htmlFor='newName'>New Name: </label>
        <input id='newName' type='text' name='newName' placeholder='Enter your new name' />
        <input className='formSubmit' type='submit' value='Change' />
    </form>
}

const init = () => {
    const root = createRoot(document.getElementById('info'));
    root.render(<ChangeName />);
}

window.onload = init;