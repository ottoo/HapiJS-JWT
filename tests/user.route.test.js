const { initialize } = require('../server/server');
const { expect } = require('chai');
const sinon = require('sinon');
require('sinon-mongoose');

const Utils = require('./../server/utils/utils.js');
const { User } = require('./../server/models/user');

describe('User routes', () => {
  let server = null;

  before(async () => {
    server = await initialize({ port: 4444 });
  });

  after(async () => {
    await server.stop();
  });

  describe('GET /api/user/me', () => {
    it('should respond with a json message', async () => {
      const token = Utils.generateMockJWT();

      const UserMock = sinon.mock(User);
      const expected = {
        token,
        _id: '123'
      };

      UserMock.expects('findById')
        .once()
        .yields(null, expected);

      const req = {
        method: 'GET',
        url: '/api/user/me',
        headers: {
          authorization: `Bearer ${token}`
        }
      };

      const res = await server.inject(req);
      UserMock.verify();
      UserMock.restore();
      expect(res.statusCode).to.equal(200);
      expect(res.result.token).to.equal(expected.token);
      expect(res.result.userId).to.equal(expected._id);
    });

    it('should respond with an error message', async () => {
      const token = Utils.generateMockJWT();

      const UserMock = sinon.mock(User);
      const err = {
        text: 'Error'
      };

      UserMock.expects('findById')
        .once()
        .yields(err, null);

      const req = {
        method: 'GET',
        url: '/api/user/me',
        headers: {
          authorization: `Bearer ${token}`
        }
      };

      const res = await server.inject(req);
      UserMock.verify();
      UserMock.restore();
      expect(res.statusCode).to.equal(400);
      expect(res.result.message).to.equal('Error happened while fetching an user');
    });
  });

  describe('POST /api/user/login', () => {
    it('should login successfully', async () => {
      const generateJWTMock = sinon
        .stub(Utils, 'generateJWT')
        .returns('test_token');
      const UserMock = sinon.mock(User);
      const expected = {
        username: 'testuser',
        '_id': '587bb173dbdb9a2894c099cb',
        password: '$2a$10$C4Op1O2Kt6h88vzYwa0F3O/EnR0VALURkCbcVcBCGNSD7n9N6fxCe'
      };

      UserMock.expects('findOne')
        .once()
        .withArgs({ username: expected.username })
        .chain('exec')
        .returns(expected);

      const req = {
        method: 'POST',
        url: '/api/user/login',
        payload: {
          username: 'testuser',
          password: 'salasana'
        }
      };

      const res = await server.inject(req);
      UserMock.verify();
      UserMock.restore();
      generateJWTMock.restore();
      expect(res.statusCode).to.equal(200);
      expect(res.result).to.deep.equal({
        token: 'test_token',
        userId: '587bb173dbdb9a2894c099cb',
        username: 'testuser'
      });
    });

    it('should return 404 when no user is found', async () => {
      const UserMock = sinon.mock(User);

      UserMock.expects('findOne')
        .once()
        .chain('exec')
        .returns(null);

      const req = {
        method: 'POST',
        url: '/api/user/login',
        payload: {
          username: 'testuser',
          password: 'salasana'
        }
      };

      const res = await server.inject(req);
      UserMock.verify();
      UserMock.restore();
      expect(res.statusCode).to.equal(404);
      expect(res.result.message).to.equal('User not found');
    });

    it('should return 401 when user is has invalid password', async () => {
      const UserMock = sinon.mock(User);
      const expected = {
        username: 'testuser',
        '_id': '587bb173dbdb9a2894c099cb',
        password: '$2a$10$C4Op1O2Kt6h88vzYwa0F3O/EnR0VALURkCbcVcBCGNSD7n9N6fxCe'
      };

      UserMock.expects('findOne')
        .once()
        .withArgs({ username: expected.username })
        .chain('exec')
        .returns(expected);

      const req = {
        method: 'POST',
        url: '/api/user/login',
        payload: {
          username: 'testuser',
          password: 'salasana123'
        }
      };

      const res = await server.inject(req);
      UserMock.verify();
      UserMock.restore();
      expect(res.statusCode).to.equal(401);
      expect(res.result.message).to.equal('Invalid password');
    });
  });
});
