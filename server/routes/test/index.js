module.exports = [{
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
