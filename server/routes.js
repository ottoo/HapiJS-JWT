'use strict';

let Bcrypt = require('bcrypt');
let Boom = require('boom');
let Joi = require('joi');
let JWT = require('jsonwebtoken');
let User = require('./models/user').User;
let generateJWT = require('./utils/utils.js').generateJWT;

module.exports = [
	{
	    method: 'POST',
	    path: '/user/login',
	    config: {
	    	auth: false
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
	    		console.log(request.payload.password);
	    		console.log(user.password)
	    		Bcrypt.compare(request.payload.password, user.password, (err, isValid) => {
	    			if (!isValid) {
	    				return reply(Boom.unauthorized('Invalid password'));	    				
	    			}

    				let token = generateJWT(user);

    				return reply('User validated successfully with token: ' + token);	
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
		            password: Joi.string().required()
		        }
	    	},
		},
	    handler: function(request, reply) {
	    	var hash = Bcrypt.hashSync(request.payload.password.trim(), 10);
			var user = new User({
		  		email: request.payload.email.trim(),
		  		password: hash,
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