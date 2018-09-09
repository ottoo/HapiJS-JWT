const fs = require('fs');
const path = require('path');
const JWT = require('jsonwebtoken');

const tokenExpiry = process.env.TOKEN_EXPIRY;

class Utils {
  constructor() {
    this.privateKey = fs.readFileSync(path.join(__dirname, '..', '..', 'jwtRS256.key'));
    this.publicKey = fs.readFileSync(path.join(__dirname, '..', '..', 'jwtRS256.key'));
  }

  generateJWT(user) {
    const jwtData = {
      name: user.name,
      email: user.email,
      _id: user._id.toString()
    };

    const jwt = JWT.sign(jwtData, this.privateKey, {
      expiresIn: Number(tokenExpiry)
    });

    return jwt;
  }

  generateMockJWT() {
    return this.generateJWT({
      name: 'Test User',
      email: 'testuser@test.com',
      _id: '587bb173dbdb9a2894c099cb'
    });
  }

  verifyEnvVars(env) {
    if (this.isTesting()) {
      return;
    }

    if (typeof env.TOKEN_EXPIRY === 'undefined') {
      throw new Error('Error. Jwt token expiry must be set.');
    }

    if (typeof env.JWT_SECRET === 'undefined') {
      throw new Error('Error. Jwt secret must be set.');
    }
  }

  isTesting() {
    return process.env.NODE_ENV === 'test' || process.env.NODE_ENV === 'ci';
  }
}

module.exports = new Utils();
