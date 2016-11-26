const configProd = require('./config.prod.js');
const configDev = require('./config.dev.js');

const env = process.env.NODE_ENV;

module.exports = env === 'development' ? configDev : configProd;
