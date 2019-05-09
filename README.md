# frontend

## Setup

To start developing, there are 2 options to get the project up and running:

1. via Docker

   This requires you to have [`docker-compose`](https://docs.docker.com/compose/install/) installed locally.

   Run the following commands to start a local development server:

   ```sh
   docker-compose build --no-cache
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
