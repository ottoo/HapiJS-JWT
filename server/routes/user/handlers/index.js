const Bcrypt = require('bcrypt');
const Boom = require('boom');
const Joi = require('joi');
const JWT = require('jsonwebtoken');
const _ = require('lodash');
const User = require('./../../../models/user').User;
const Utils = require('./../../../../server/utils/utils.js');
const jwtSecret = process.env.JWT_SECRET;

/**
 * Gets the current user. Used to verify whether the user is
 * authenticated or not, for example on browser refresh.
 */
const meHandler = (request, reply) => {
  const token = request.headers.authorization.substring(7);

  if (!token) {
      return reply(Boom.notFound('Token not found'));
  }

  // Verify the token manually so we get the decoded user object back
  // from the token. Normally would use auth: 'jwt'.
  JWT.verify(token, jwtSecret, (err, user) => {
      if (err) {
          return reply(Boom.badRequest('Invalid token provided'));
      }

      User.findById({
          '_id': user._id
      }, (err, user) => {
          if (err) return reply(Boom.badRequest('Error happened while fetching an user'));

          return reply({
              token: token,
              userId: user._id
          });
      });
  });
};

/**
 * Logs in the user if one is found in the database.
 */
const loginHandler = (request, reply) => {
  User.findOne({
    email: request.payload.email
  })
  .exec((err, user) => {
    if (err) throw err;

    if (!user) {
        return reply(Boom.notFound('User not found'));
    }

    Bcrypt.compare(request.payload.password, user.password, (err, isValid) => {
        if (!isValid) {
            return reply(Boom.unauthorized('Invalid password'));
        }

        let token = Utils.generateJWT(user);

        return reply({
            token: token,
            userId: user._id
        });
    });
  });
};

const findByIdHandler = (request, reply) => {
  User.findById(request.params.id, (err, user) => {
    if (!err) {
      return reply(user);
    } else {
      return reply(Boom.notFound('Couldnt find user with the given id'));
    }
  });
};

const createUserHandler = (request, reply) => {
  const hash = Bcrypt.hashSync(request.payload.password.trim(), 10);
  const user = new User({
    email: request.payload.email.trim(),
    password: hash,
    name: {
      firstName: request.payload.name.firstName.trim(),
      lastName: request.payload.name.lastName.trim()
    },
    age: request.payload.age,
    twitter: request.payload.twitter,
    facebook: request.payload.facebook,
    homepage: request.payload.homepage
  });

  user.save((err, user) => {
    if (!err) {
      return reply(user);
    } else {
      if (11000 === err.code || 11001 === err.code) {
        return reply(Boom.forbidden('please provide another user id, it already exists'));
      } else {
        return reply(Boom.forbidden('error while creating an user'));
      }
    }
  });
};

const updateUserHandler = (request, reply) => {
  let newUserData = _.cloneDeep(request.payload);
  delete newUserData.id;

  User.findByIdAndUpdate(request.payload.id, {
    $set: newUserData
  }, {
    new: true
  }, (err, user) => {
    if (!err) {
      return reply(user);
    } else {
      return reply(Boom.notFound('Couldnt find user to update with the given id'));
    }
  });
};

module.exports = {
  createUserHandler,
  findByIdHandler,
  loginHandler,
  meHandler,
  updateUserHandler
};
