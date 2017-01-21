'use strict';

const JWT = require('jsonwebtoken');
const jwtSecret = process.env.JWT_SECRET;
const tokenExpiry = process.env.TOKEN_EXPIRY;

class Utils {

    constructor() {}

    generateJWT(user) {
        let jwtData = {
            name: user.name,
            email: user.email,
            _id: user._id.toString()
        };

        return JWT.sign(jwtData, jwtSecret, {
            expiresIn: tokenExpiry
        });
    }

    generateMockJWT() {
        return this.generateJWT({
            name: 'Test User',
            email: 'testuser@test.com',
            _id: "587bb173dbdb9a2894c099cb"
        });
    }
}

module.exports = new Utils();
