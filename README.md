# HapiJSBackend

[![Build Status](https://circleci.com/gh/ottoo/HapiJSBackend/tree/master.svg?style=shield&circle-token=7452b036509c90784a124fcb9e1c8742bc063400)](https://circleci.com/gh/ottoo/HapiJSBackend)

A personal HapiJS backend project with MongoDB and Mongoose schemas.

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
