// http://eslint.org/docs/user-guide/configuring

module.exports = {
  root: true,
  parserOptions: {
    sourceType: 'module'
  },
  env: {
    node: true,
    mocha: true
  },
  extends: 'airbnb-base',
  'rules': {
    'consistent-return': 'off',
    'no-underscore-dangle': 'off',
    'global-require': 'off',
    'arrow-body-style': 'off',
    'comma-dangle': 'off',
    'no-console': 'off',
    'no-shadow': 'off',
    'quote-props': 'off',
    'class-methods-use-this': 'off'
  },
  'globals': {
    'io': false
  }
}
