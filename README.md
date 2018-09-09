# HapiJSBackend

[![CircleCI](https://circleci.com/gh/ottoo/HapiJSBackend.svg?style=svg)](https://circleci.com/gh/ottoo/HapiJSBackend)

A personal HapiJS backend project with MongoDB and Mongoose schemas. Has basic user management apis
for logging in via JWT authentication, finding and updating users.

# Instructions

First, `npm install`.

To run the server, add `.env` -file to the root of the project containing the following information:

```
MONGODB_DATABASE=
MONGODB_USERNAME=
MONGODB_PASSWORD=
MONGODB_ROOT_PASSWORD=
DB_HOST=
DB_PORT=
DB_NAME=
DB_USER=
DB_PASSWORD=
JWT_SECRET=
TOKEN_EXPIRY=
```

### Run in dev mode

`npm run server:dev`

### Run in production mode

`npm run server:prod`

### Watch for changes

`npm run server:watch`
