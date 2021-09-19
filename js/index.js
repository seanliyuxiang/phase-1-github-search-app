const userSearchBaseURL = 'https://api.github.com/search/users?q=';
const repoSearchBaseURL = 'https://api.github.com/users';

const init = () => {

  // grab all necessary html tags
  const githubSearchFormTag = document.querySelector('#github-form');
  const usersUnorderedListTag = document.querySelector('#user-list');
  const reposUnorderedListTag = document.querySelector('#repos-list');

  // function to render a single repository
  const renderSingleRepository = singleRepositoryObj => {
    // create a list item tag for a repository and append it to DOM
    const repoListItemTag = document.createElement('li');
    repoListItemTag.innerText = singleRepositoryObj.full_name;
    reposUnorderedListTag.appendChild(repoListItemTag);
  };

  // function to render a single user's information
  const renderSingleUserInfo = singleUserObj => {
    // create a list item tag containing an user's info and append it to DOM
    const singleUserListItemTag = document.createElement('li');
    singleUserListItemTag.innerHTML = `<p>Username: ${singleUserObj.login}</p>
                                       <a href="${singleUserObj.html_url}" target="_blank">GitHub profile link</a>
                                       <br>
                                       <img src="${singleUserObj.avatar_url}">`;
    usersUnorderedListTag.appendChild(singleUserListItemTag);

    // function to retrieve repositories for a specific user
    const clickUserProfilePicHandler = event => {
      // fetch for all the repositories for a specific user
      fetch(`${repoSearchBaseURL}/${singleUserObj.login}/repos`)
      .then(response => response.json())
      .then(jsonRepositories => {
        reposUnorderedListTag.innerHTML = '';
        jsonRepositories.forEach(renderSingleRepository);
      });

    };

    // add event listener on the user's profile pic
    singleUserListItemTag.querySelector('img').addEventListener('click', clickUserProfilePicHandler);
  };

  // function to search GitHub for user matches
  const githubSearchHandler = (event) => {
    // get name of user to search GitHub by
    const userName = event.target.children[0].value;

    // fetch for matching users
    fetch(`${userSearchBaseURL}${userName}`)
    .then(response => response.json())
    .then(json => {
      json.items.forEach(renderSingleUserInfo);
    });

    // clear out search box
    githubSearchFormTag.reset();
  };

  // add event listener on the GitHub search form
  githubSearchFormTag.addEventListener('submit', event => {
    event.preventDefault();
    if (event.target.children[0].value !== '') {
      usersUnorderedListTag.innerHTML = '';
      reposUnorderedListTag.innerHTML = '';
      githubSearchHandler(event);
    }
  });

};

document.addEventListener('DOMContentLoaded', init);
