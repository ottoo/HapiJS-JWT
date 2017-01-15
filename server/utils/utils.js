'use strict';

const JWT = require('jsonwebtoken');
const jwtSecret = process.env.JWT_SECRET;
const tokenExpiry = process.env.TOKEN_EXPIRY;

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
