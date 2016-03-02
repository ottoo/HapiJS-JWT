'use strict';

let Boom = require('boom');
let Joi = require('joi');
let JWT = require('jsonwebtoken');
let User = require('./models/user').User;

module.exports = [
	{
	    method: 'GET',
	    path: '/login',
	    config: {
	    	auth: false
	    },
	    handler: function (request, reply) {
	    	// let token = JWT.sign({ username: 'ottoki' }, 'NeverShareYourSecret');
	     //    reply(token);
	     reply({
	     	loggedIn: true,
	     	message: 'Logged in successfully',
	     	role: 'ADMIN'
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
		            password: Joi.string().required()
		        }
	    	},
		},
	    handler: function(request, reply) {
	    	let user = new User(request.payload);

	    	user.save((err, user) => {
	            if (!err) {
	                reply(user);
	            } else {
	                if (11000 === err.code || 11001 === err.code) {
	                    reply(Boom.forbidden('please provide another user id, it already exists'));
	                } else {
	                	reply(Boom.forbidden('error while creating an user'));
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
	    path: '/test',
	    config: {
	    	auth: 'jwt',
	    	handler: (request, reply) => {
	            reply('test');
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