const handleError = (message) => {
  document.querySelector('#error').classList.add('is-active');
  document.querySelector('#errorMessage').innerHTML = message;
};

const handleSearch = (e) => {
  const searchButton = document.querySelector('#searchButton');

  searchButton.onclick = () => {
    const searchTerm = document.querySelector('#searchInput').value.trim();
    if (searchTerm) {
      window.location = `/profile/${searchTerm}`;
    } else {
      handleError('Please enter a username to search!');
    }
  }

};

/* Sends post requests to the server using fetch. Will look for various
   entries in the response JSON object, and will handle them appropriately.
*/
const sendPost = async (url, data, handler) => {
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  const result = await response.json();

  if (result.redirect) {
    window.location = result.redirect;
  }

  if (result.error) {
    handleError(result.error);
  }

  if (handler) {
    handler(result);
  }
};

const hideError = () => {
  document.querySelector('#error').classList.remove('is-active');
};

window.addEventListener('DOMContentLoaded', () => {
  const components = document.querySelectorAll('.delete, .modal-background');
  for (let i = 0; i < components.length; i++) {
    components[i].addEventListener('click', hideError);
  }
})

module.exports = {
  handleError,
  sendPost,
  hideError,
  handleSearch,
}