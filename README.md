<!-- # Meetup-Clone

[API Documentation](https://github.com/ouStanleyy/Meetup-Clone/wiki/API-Documentation)

[Database Schema](https://github.com/ouStanleyy/Meetup-Clone/wiki/Database-Schema) -->

<a name="readme-top"></a>

<!-- PROJECT OVERVIEW -->
<br />
<div align="center">
  <a href="https://github.com/ouStanleyy/Meetup-Clone">
    <img src="https://user-images.githubusercontent.com/97637598/194911575-e775fc5b-168f-4069-af47-7e3bf8731ac5.png" alt="Logo" width="200" height="200">
  </a>

  # RendeVue

  <p align="center">
    RendeVue is my first project and is an attempt at cloning the social platform, <a href="meetup.com">Meetup</a>. The design is personalized and only lightly imitates the actual website. Features include user authentication, organizing and managing groups and events, linking venues to events, and the ability to join or leave another user's group.
  </p>
  
  [API Documentation](https://github.com/ouStanleyy/Meetup-Clone/wiki/API-Documentation) · [Database Schema](https://github.com/ouStanleyy/Meetup-Clone/wiki/Database-Schema) · [Live Link](https://rendevue.herokuapp.com/)
</div>

<!-- TABLE OF CONTENTS -->
## Table of Contents

1. <a href="#getting-started">Getting Started</a>
2. <a href="#features">Features</a>
3. <a href="#contact-me">Contact Me</a>

<!-- BUILD -->
## Built With The Following

[![HTML5][HTML5]][HTML-url]
[![CSS][CSS]][CSS-url]
[![Javascript][Javascript]][Javascript-url]
[![Express.js][Express.js]][Express-url]
[![React][React.js]][React-url]
[![Node.js][Node.js]][Node-url]
[![Sequelize][Sequelize.js]][Sequelize-url]
[![SQLite][SQLite]][SQLite-url]
[![Heroku][Heroku]][Heroku-url]
[![NPM][NPM]][NPM-url]
[![Git][Git]][Git-url]
[![Github][Github]][Github-url]

<!-- GETTING STARTED -->
## Getting Started

1. Clone this repository
2. Run `npm run install` at the root of the project directory to install the backend and frontend dependencies
3. Create a `.env` file from the `.env.example` at the root of the backend directory
4. Run `npx dotenv sequelize db:migrate` at the root of the backend directory to create the database and migrate the models
5. Run `npx dotenv sequelize db:seed:all` at the root of the backend directory to populate the database with the provided seeds
6. Run `npm start` at the root of the backend directory to start the api server
7. Run `npm start` at the root of the frontend directory to start the react live server

_<h4>Note: A JWT secret key and google maps API key are required for this project to work as intended<h4>_

<!-- USAGE EXAMPLES -->
## Features
  
- Authenticate, sign up, and log in/out a user
- View, create, edit, and delete a group
- View, create, edit, and delete an event
- View, create, and edit a venue
- View, create, edit, and delete a membership to a group

_For more examples, please refer to the [Documentation](https://github.com/ouStanleyy/Meetup-Clone/wiki/API-Documentation)_

<!-- CONTACT -->
## Contact Me
<!-- Your Name - [@twitter_handle](https://twitter.com/twitter_handle) - email@email_client.com -->
  [![LinkedIn][linkedin-shield]][linkedin-url]
  <br />
  Stanley Ou - ou.stanley@yahoo.com

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->
[contributors-shield]: https://img.shields.io/github/contributors/github_username/repo_name.svg?style=for-the-badge
[contributors-url]: https://github.com/github_username/repo_name/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/github_username/repo_name.svg?style=for-the-badge
[forks-url]: https://github.com/github_username/repo_name/network/members
[stars-shield]: https://img.shields.io/github/stars/github_username/repo_name.svg?style=for-the-badge
[stars-url]: https://github.com/github_username/repo_name/stargazers
[issues-shield]: https://img.shields.io/github/issues/github_username/repo_name.svg?style=for-the-badge
[issues-url]: https://github.com/github_username/repo_name/issues
[license-shield]: https://img.shields.io/github/license/github_username/repo_name.svg?style=for-the-badge
[license-url]: https://github.com/github_username/repo_name/blob/master/LICENSE.txt
[linkedin-shield]: https://img.shields.io/badge/-LinkedIn-black.svg?style=for-the-badge&logo=linkedin&colorB=555
[linkedin-url]: https://www.linkedin.com/in/stanley-ou/
[product-screenshot]: https://user-images.githubusercontent.com/90014250/193957812-22cd83df-f0b3-4479-b593-129798382a1d.png
[Next.js]: https://img.shields.io/badge/next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white
[Next-url]: https://nextjs.org/
[React.js]: https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB
[React-url]: https://reactjs.org/
[Vue.js]: https://img.shields.io/badge/Vue.js-35495E?style=for-the-badge&logo=vuedotjs&logoColor=4FC08D
[Vue-url]: https://vuejs.org/
[Angular.io]: https://img.shields.io/badge/Angular-DD0031?style=for-the-badge&logo=angular&logoColor=white
[Angular-url]: https://angular.io/
[Svelte.dev]: https://img.shields.io/badge/Svelte-4A4A55?style=for-the-badge&logo=svelte&logoColor=FF3E00
[Svelte-url]: https://svelte.dev/
[Laravel.com]: https://img.shields.io/badge/Laravel-FF2D20?style=for-the-badge&logo=laravel&logoColor=white
[Laravel-url]: https://laravel.com
[Bootstrap.com]: https://img.shields.io/badge/Bootstrap-563D7C?style=for-the-badge&logo=bootstrap&logoColor=white
[Bootstrap-url]: https://getbootstrap.com
[JQuery.com]: https://img.shields.io/badge/jQuery-0769AD?style=for-the-badge&logo=jquery&logoColor=white
[JQuery-url]: https://jquery.com 
[Sequelize-url]: https://sequelize.org/
[Sequelize.js]: https://img.shields.io/badge/Sequelize-52B0E7?style=for-the-badge&logo=Sequelize&logoColor=white
[Git]: https://img.shields.io/badge/git-%23F05033.svg?style=for-the-badge&logo=git&logoColor=white
[Git-url]: https://git-scm.com/
[Github]: https://img.shields.io/badge/github-%23121011.svg?style=for-the-badge&logo=github&logoColor=white
[Github-url]: https://github.com/
[Javascript]: https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E
[Javascript-url]: https://www.javascript.com/
[HTML5]: https://img.shields.io/badge/html5-%23E34F26.svg?style=for-the-badge&logo=html5&logoColor=white
[HTML-url]: https://html.com/
[CSS]: https://img.shields.io/badge/css3-%231572B6.svg?style=for-the-badge&logo=css3&logoColor=white
[CSS-url]: https://developer.mozilla.org/en-US/docs/Web/CSS
[Node.js]: https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white
[Node-url]: https://nodejs.org/en/
[Express.js]: https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB
[Express-url]: https://expressjs.com/
[NPM]: https://img.shields.io/badge/NPM-%23000000.svg?style=for-the-badge&logo=npm&logoColor=white
[NPM-url]: https://www.npmjs.com/
[Heroku]: https://img.shields.io/badge/heroku-%23430098.svg?style=for-the-badge&logo=heroku&logoColor=white
[Heroku-url]: https://id.heroku.com/
[SQLite]: https://img.shields.io/badge/sqlite-%2307405e.svg?style=for-the-badge&logo=sqlite&logoColor=white
[SQLite-url]: https://www.sqlite.org/index.html
