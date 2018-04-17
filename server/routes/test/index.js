module.exports = [{
  method: 'GET',
  path: '/testauth',
  config: {
    handler: async (request) => {
      try {
        const credentials = await request.server.auth.test('default', request);
        return { status: true, user: credentials.name };
      } catch (err) {
        return { status: false };
      }
    }
  }
}, {
  method: 'GET',
  path: '/test',
  config: {
    auth: false,
    handler: () => {
      return { message: 'OK' };
    }
  }
}];
