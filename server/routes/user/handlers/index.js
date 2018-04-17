const Bcrypt = require('bcryptjs');
const Boom = require('boom');
const JWT = require('jsonwebtoken');
const _ = require('lodash');
const { User } = require('./../../../models/user');
const Utils = require('./../../../../server/utils/utils.js');

const jwtSecret = process.env.JWT_SECRET;

/**
 * Gets the current user. Used to verify whether the user is
 * authenticated or not, for example on browser refresh.
 */
const meHandler = (request) => {
  const authorizationHeader = request.headers.authorization;
  const token = authorizationHeader && authorizationHeader.substring(7);

  if (!token) {
    throw Boom.badRequest('Invalid token provided');
  }

  // Verify the token manually so we get the decoded user object back
  // from the token. Normally would use auth: 'jwt'.
  return new Promise((resolve, reject) => {
    JWT.verify(token, jwtSecret, (err, user) => {
      if (err) {
        return reject(Boom.badRequest('Invalid token provided'));
      }

      User.findById({
        '_id': user._id
      }, (err, user) => {
        if (err) throw Boom.badRequest('Error happened while fetching an user');

        return resolve({
          token,
          userId: user._id
        });
      });
    });
  });
};

/**
 * Logs in the user if one is found in the database.
 */
const loginHandler = async (request) => {
  const user = await User.findOne({
    username: request.payload.username
  }).exec();

  if (!user) {
    throw Boom.notFound('User not found');
  }

  const isValid = await Bcrypt.compare(request.payload.password, user.password);

  if (!isValid) {
    throw Boom.unauthorized('Invalid password');
  }

  const token = Utils.generateJWT(user);

  return {
    token,
    userId: user._id,
    username: user.username
  };
};

const findByIdHandler = (request) => {
  User.findById(request.params.id, (err, user) => {
    if (!err) {
      return user;
    }
    throw Boom.notFound('Couldnt find user with the given id');
  });
};

const createUserHandler = (request) => {
  const hash = Bcrypt.hashSync(request.payload.password.trim(), 10);
  const user = new User({
    username: request.payload.username.trim(),
    password: hash,
    name: {
      firstName: request.payload.name.firstName.trim(),
      lastName: request.payload.name.lastName.trim()
    }
  });

  user.save((err, user) => {
    if (!err) {
      return user;
    }

    if (err.code === 11000 || err.code === 11001) {
      throw Boom.forbidden('please provide another user id, it already exists');
    }

    throw Boom.forbidden('error while creating an user');
  });
};

const updateUserHandler = (request) => {
  const newUserData = _.cloneDeep(request.payload);
  delete newUserData.id;

  User.findByIdAndUpdate(request.payload.id, {
    $set: newUserData
  }, { new: true }, (err, user) => {
    if (!err) {
      return user;
    }
    throw Boom.notFound('Couldnt find user to update with the given id');
  });
};

module.exports = {
  createUserHandler,
  findByIdHandler,
  loginHandler,
  meHandler,
  updateUserHandler
};
