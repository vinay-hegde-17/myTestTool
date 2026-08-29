const { SERVER_ENDPOINTS } = require("../constants/server.constants");

class ServerClient {
  constructor(request, token = null) {
    this.request = request;
    this.token = token;
  }

  authHeaders() {
    return this.token ? { Authorization: `Bearer ${this.token}` } : {};
  }

  getSwaggerJson() {
    return this.request.get(SERVER_ENDPOINTS.SWAGGER_JSON);
  }

  getAuthCallback(params = {}) {
    return this.request.get(SERVER_ENDPOINTS.AUTH_CALLBACK, { params });
  }

  sendMalformedJsonPayload(rawBody) {
    return this.request.post(SERVER_ENDPOINTS.EMPLOYEES, {
      headers: {
        ...this.authHeaders(),
        "Content-Type": "application/json",
      },
      data: rawBody,
    });
  }
}

module.exports = ServerClient;
