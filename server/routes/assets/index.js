module.exports = [{
  method: 'GET',
  path: '/assets/{param*}',
  config: {
    auth: false
  },
  handler: {
    directory: {
      path: '../../../node_modules'
    }
  }
}];
