exports.plugin = {
  name: 'auth-strategy',
  register: (server) => {
    /**
    * This function is used to check the validity of the given decoded token contents,
    * for example if jwt session is stored in Redis. Token is verified already before this
    * validate function.
    */
    const validate = (decoded) => {
      return {
        isValid: true,
        credentials: {
          ...decoded
        }
      };
    };

    server.auth.strategy('default', 'jwt', {
      key: process.env.JWT_SECRET,
      validate,
      verifyOptions: {
        algorithms: ['HS256']
      }
    });
    server.auth.default('default');
  }
};
