module.exports = [
	{
	    method: 'GET',
	    path: '/login',
	    handler: function (request, reply) {
	        reply('Login');
	    }
	}, 
	{
	    method: 'GET',
	    path: '/assets/{param*}',
	    handler: {
	        directory: {
	            path: '../node_modules'
	        }
	    }
	},
	{
	    method: 'GET',
	    path: '/{param*}',
	    handler: {
	        directory: {
	            path: '../src',
	            redirectToSlash: true,
	            index: true
	        }
	    }
	}
];