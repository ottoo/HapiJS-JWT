'use strict';

const Bcrypt = require('bcrypt');
const Boom = require('boom');
const Joi = require('joi');
const JWT = require('jsonwebtoken');
const _ = require('lodash');
const User = require('./models/user').User;
const Utils = require('./../server/utils/utils.js');
const jwtSecret = process.env.JWT_SECRET;

module.exports = [{
    method: 'POST',
    path: '/user/me',
    config: {
        auth: false,
        validate: {
            payload: {
                token: Joi.string().required()
            }
        }
    },
    handler: (request, reply) => {
        const token = request.payload.token;

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
                if (err) throw err;

                return reply({
                    token: token,
                    userId: user._id
                });
            });
        });
    }
}, {
    method: 'POST',
    path: '/user/login',
    config: {
        auth: false,
        validate: {
            payload: {
                email: Joi.string().required(),
                password: Joi.string().required()
            }
        }
    },
    handler: (request, reply) => {
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
    }
}, {
    method: 'GET',
    path: '/user/{id}',
    config: {
        auth: false,
        validate: {
            params: {
                id: Joi.string().required()
            }
        }
    },
    handler: function(request, reply) {
        User.findById(request.params.id, (err, user) => {
          if (!err) {
            return reply(user);
          } else {
            return reply(Boom.notFound('Couldnt find user with the given id'));
          }
        });
    }
}, {
    method: 'POST',
    path: '/user/create',
    config: {
        auth: false,
        validate: {
            payload: {
                email: Joi.string().email().required(),
                password: Joi.string().required(),
                name: Joi.object().keys({
                    firstName: Joi.string().required(),
                    lastName: Joi.string().required()
                }),
                age: Joi.number().integer().min(1).max(120).required(),
                twitter: Joi.string(),
                facebook: Joi.string(),
                homepage: Joi.string()
            }
        }
    },
    handler: function(request, reply) {
        var hash = Bcrypt.hashSync(request.payload.password.trim(), 10);
        var user = new User({
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
    }
}, {
    method: 'PUT',
    path: '/user/update',
    config: {
        auth: false,
        validate: {
            payload: {
                id: Joi.string().required(),
                name: Joi.object().keys({
                    firstName: Joi.string(),
                    lastName: Joi.string()
                }),
                age: Joi.number().integer().min(1).max(120),
                twitter: Joi.string(),
                facebook: Joi.string(),
                homepage: Joi.string()
            }
        }
    },
    handler: function(request, reply) {
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
    }
}, {
    method: 'GET',
    path: '/assets/{param*}',
    config: {
        auth: false
    },
    handler: {
        directory: {
            path: '../node_modules'
        }
    }
}, {
    method: 'GET',
    path: '/testauth',
    config: {
        auth: 'jwt',
        handler: (request, reply) => {
            reply({ message: 'Auth successful!' });
        }
    }
}, {
    method: 'GET',
    path: '/test',
    config: {
        auth: false,
        handler: (request, reply) => {
            reply({ message: 'OK' });
        }
    }
}];
