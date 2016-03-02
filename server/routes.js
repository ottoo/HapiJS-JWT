'use strict';

let JWT = require('jsonwebtoken');

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