const { initialize } = require('../server/server');
const { expect } = require('chai');

const Utils = require('./../server/utils/utils.js');

describe('Test routes', () => {
  let server = null;

  before(async () => {
    server = await initialize({ port: 4444 });
  });

  after(async () => {
    await server.stop();
  });

  describe('GET /api/test', () => {
    it('responds with a json message', async () => {
      const req = {
        method: 'GET',
        url: '/api/test'
      };

      const res = await server.inject(req);

      expect(res.statusCode).to.equal(200);
      expect(res.headers['content-type']).to.equal('application/json; charset=utf-8');
      expect(res.payload).to.equal(JSON.stringify({ message: 'OK' }));
    });
  });

  describe('GET /api/testauth', () => {
    it('responds with a json message', async () => {
      const token = Utils.generateMockJWT();
      const req = {
        method: 'GET',
        url: '/api/testauth',
        headers: { Authorization: `Bearer ${token}` }
      };

      const res = await server.inject(req);

      expect(res.statusCode).to.equal(200);
      expect(res.headers['content-type']).to.equal('application/json; charset=utf-8');
      expect(res.payload).to.equal(JSON.stringify({ status: true, user: 'Test User' }));
    });
  });
});
