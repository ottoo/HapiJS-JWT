# HapiJSBackend

[![Build Status](https://api.travis-ci.org/ottoo/HapiJSBackend.svg)](https://travis-ci.org/ottoo/HapiJSBackend)

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

## Docker

To run the server and/or mongodb locally, go to the `docker` directory and copy the created
`.env` file there.

### Run application

`docker compose up -d`

The application will be available at
`http://localhost:3334`.

### Run only the database

`docker compose up -d mongodb`
