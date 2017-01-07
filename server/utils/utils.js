'use strict';

const JWT = require('jsonwebtoken');
const jwtSecret = require('./../config').jwtSecret;
const tokenExpiry = require('./../config').tokenExpiry;

module.exports = {
    generateJWT: function(user) {
        let jwtData = {
            name: user.name,
            email: user.email,
            _id: user._id.toString()
        };

        return JWT.sign(jwtData, jwtSecret, {
            expiresIn: tokenExpiry
        });
    }
}
