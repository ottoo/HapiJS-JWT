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
	    path: '/',
	    handler: (request, reply) => {
	    	console.log('asd')
            reply.file('./../ReactFrontend/index.html');
	    }
	}
];