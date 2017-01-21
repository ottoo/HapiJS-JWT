const server = require('../server/server');
const expect = require('chai').expect;
const sinon = require('sinon');

const Utils = require('./../server/utils/utils.js');

describe('GET /test', () => {
  it('responds with a json message', function(done) {
    const req = {
      method: 'GET',
      url: '/test'
    };

    server.inject(req, res => {
      expect(res.statusCode).to.equal(200);
      expect(res.headers['content-type']).to.equal('application/json; charset=utf-8');
      expect(res.payload).to.equal(JSON.stringify({ message: 'OK' }));
      done();
    });
  });
});

describe('GET /testauth', () => {
  it('responds with a json message', function(done) {
    const token = Utils.generateMockJWT();
    const req = {
      method: 'GET',
      url: '/testauth',
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
