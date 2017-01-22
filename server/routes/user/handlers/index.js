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

module.exports = {
  meHandler,
  loginHandler
};
