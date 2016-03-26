'use strict';

let Bcrypt = require('bcrypt');
let Boom = require('boom');
let Joi = require('joi');
let JWT = require('jsonwebtoken');
var _ = require('lodash');
let User = require('./models/user').User;
let generateJWT = require('./utils/utils.js').generateJWT;
let jwtSecret = require('./config/config.js').jwtSecret;

module.exports = [
	{
		method: 'POST',
		path: '/user/me',
		config: {
	    	auth: false,
	    	cors: { origin: ['http://localhost:8080']},
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
	},
	{
	    method: 'POST',
	    path: '/user/login',
	    config: {
	    	auth: false,
	    	cors: { origin: ['http://localhost:8080']},
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

    				let token = generateJWT(user);

    				return reply({
    					token: token,
    					userId: user._id
    				});	
	    		});
	    	});
	    }
	}, 
	{
	    method: 'POST',
		path: '/user/create',
		config: {
			auth: false,
			validate: {
		        payload: {
		            email: Joi.string().required(),
		            password: Joi.string().required(),
		            name: Joi.object().keys({
		            	firstName: Joi.string().required(),
		            	lastName: Joi.string().required()
		            })
		        }
	    	},
		},
	    handler: function(request, reply) {
	    	var hash = Bcrypt.hashSync(request.payload.password.trim(), 10);
			var user = new User({
		  		email: request.payload.email.trim(),
		  		password: hash,
		  		name: {
		  			firstName: request.payload.name.firstName.trim(),
		  			lastName: request.payload.name.lastName.trim()
		  		}
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
	},
	{
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
	},
	{
	    method: 'GET',
	    path: '/testauth',
	    config: {
	    	auth: 'jwt',
	    	handler: (request, reply) => {
	            reply('Auth successful!');
		    }
	    }
	    
	},
	{
	    method: 'GET',
	    path: '/{param*}',
	    config: {
	    	auth: false
	    },
	    handler: (request, reply) => {
            reply.file('./../ReactFrontend/index.html');
	    }
	},
];