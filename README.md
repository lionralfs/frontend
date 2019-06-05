[![Netlify Status](https://api.netlify.com/api/v1/badges/4e81fde5-90d4-40f2-a358-9ca43362b0a2/deploy-status)](https://app.netlify.com/sites/airdata/deploys)

# frontend

## Setup

To start developing, there are 2 options to get the project up and running:

1. via Docker

   This requires you to have [`docker-compose`](https://docs.docker.com/compose/install/) installed locally.

   Run the following commands to start a local development server:

   ```sh
   docker-compose build --no-cache web
   docker-compose up
   ```

   The first command will have to be re-run every time a dependency changes.

2. via Node.js directly

   For this option, you need [`Node.js`](https://nodejs.org/en/) and `npm` installed on your machine. (`npm` usually gets installed along with `Node.js`).

   Once you did that, run

   ```sh
   npm install
   ```

   to install all dependencies and

   ```
   npm start
   ```

   to start the development server.

## Contributing

1. `git checkout master`
2. `git pull`
3. `git checkout -b <branch-name>`
4. `npm install`
5. `npm start`
6. Apply your changes
7. `git add .`
8. `git commit -m "commit message"`
9. `git push -u origin <branch-name>`
10. Go to GitHub and open a pull request

## Running tests

To run all tests, use

```sh
npm test
```

Or, to have the tests run in watch mode (re-run every time the test/source files are changed), use:

```sh
npm test -- --watch
```
