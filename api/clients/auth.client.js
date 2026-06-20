const { AUTH_ENDPOINTS } = require('../constants/auth.constants');

class AuthClient {
  constructor(request) {
    this.request = request;
  }

  generateJwtToken(accessToken) {
    return this.request.post(AUTH_ENDPOINTS.GENERATE_JWT_TOKEN, {
      data: { accessToken },
    });
  }

  generateQaToken(email) {
    return this.request.post(AUTH_ENDPOINTS.QA_TOKEN, { data: { email } });
  }

  validateToken(token) {
    const options = {};
    if (token) {
      options.headers = { Authorization: `Bearer ${token}` };
    }
    return this.request.get(AUTH_ENDPOINTS.VALIDATE_TOKEN, options);
  }
}

module.exports = AuthClient;
