const Bcrypt = require('bcrypt');
const Boom = require('boom');
const Joi = require('joi');
const JWT = require('jsonwebtoken');
const _ = require('lodash');
const User = require('./../../models/user').User;
const Utils = require('./../../../server/utils/utils.js');
const jwtSecret = process.env.JWT_SECRET;

const UserRoutes = require('./handlers');

module.exports = [{
    method: 'GET',
    path: '/user/me',
    config: {
        auth: false
    },
    handler: UserRoutes.meHandler
  },
  {
    method: 'POST',
    path: '/user/login',
    config: {
        auth: false,
        validate: {
            payload: {
                username: Joi.string().required(),
                password: Joi.string().required()
            }
        }
    },
    handler: UserRoutes.loginHandler
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
    handler: UserRoutes.findByIdHandler
}, {
    method: 'POST',
    path: '/user/create',
    config: {
        auth: false,
        validate: {
            payload: {
                username: Joi.string().required(),
                password: Joi.string().required(),
                name: Joi.object().keys({
                    firstName: Joi.string().required(),
                    lastName: Joi.string().required()
                })
            }
        }
    },
    handler: UserRoutes.createUserHandler
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
    handler: UserRoutes.updateUserHandler
}];
