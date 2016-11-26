'use strict';

var JWT = require('jsonwebtoken');
var jwtSecret = require('./../config').jwtSecret;
var tokenExpiry = require('./../config').tokenExpiry;

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
