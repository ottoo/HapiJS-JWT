const server = require('../server/server');
const expect = require('chai').expect;
const sinon = require('sinon');
const JWT = require('jsonwebtoken');

const Utils = require('./../server/utils/utils.js');
const UserRoutes = require('./../server/routes/user/handlers');
const User = require('./../server/models/user').User;

describe('GET /user/me', () => {
  it('should respond with a json message', function(done) {
    const token = Utils.generateMockJWT();

    const UserMock = sinon.mock(User);
    const expected = {
      token: token,
      _id: '123'
    };
    UserMock.expects('findById').yields(null, expected);

    const req = {
      method: 'GET',
      url: '/user/me',
      headers: {
        authorization: `Bearer ${token}`
      }
    };

    server.inject(req, res => {
      UserMock.verify();
      UserMock.restore();
      expect(res.statusCode).to.equal(200);
      expect(res.result.token).to.equal(expected.token);
      expect(res.result.userId).to.equal(expected._id);
      done();
    });
  });

  it('should respond with an error message', function(done) {
    const token = Utils.generateMockJWT();

    const UserMock = sinon.mock(User);
    const err = {
      text: 'Error'
    };
    UserMock.expects('findById').yields(err, null);

    const req = {
      method: 'GET',
      url: '/user/me',
      headers: {
        authorization: `Bearer ${token}`
      }
    };

    server.inject(req, res => {
      UserMock.verify();
      UserMock.restore();
      expect(res.statusCode).to.equal(400);
      expect(res.result.message).to.equal('Error happened while fetching an user');
      done();
    });
  });
});