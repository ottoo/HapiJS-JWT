const server = require('../server/server');
const expect = require('chai').expect;
const sinon = require('sinon');

const Utils = require('./../server/utils/utils.js');

describe('GET /api/test', () => {
  it('responds with a json message', function(done) {
    const req = {
      method: 'GET',
      url: '/api/test'
    };

    server.inject(req, res => {
      expect(res.statusCode).to.equal(200);
      expect(res.headers['content-type']).to.equal('application/json; charset=utf-8');
      expect(res.payload).to.equal(JSON.stringify({ message: 'OK' }));
      done();
    });
  });
});

describe('GET /api/testauth', () => {
  it('responds with a json message', function(done) {
    const token = Utils.generateMockJWT();
    const req = {
      method: 'GET',
      url: '/api/testauth',
      headers: { Authorization: `Bearer ${token}`}
    };

    server.inject(req, res => {
      expect(res.statusCode).to.equal(200);
      expect(res.headers['content-type']).to.equal('application/json; charset=utf-8');
      expect(res.payload).to.equal(JSON.stringify({ message: 'Auth successful!' }));
      done();
    });
  });
});
