const { BUILD_VERSION_ENDPOINTS } = require('../constants/buildVersion.constants');

class BuildVersionClient {

    constructor(request, token = null) {
        this.request = request;
        this.token = token;
    }

    authHeaders() {
        return this.token
            ? {
                Authorization: `Bearer ${this.token}`
            }
            : {};
    }

    // POST /build-version
    create() {
        return this.request.post(
            BUILD_VERSION_ENDPOINTS.CREATE,
            {
                headers: {
                    ...this.authHeaders(),
                    'Content-Type': 'application/json'
                }
            }
        );
    }

    // POST /build-version without Authorization
    createWithoutAuth() {
        return this.request.post(
            BUILD_VERSION_ENDPOINTS.CREATE,
            {
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        );
    }

    // GET /build-version
    getLatest() {
        return this.request.get(
            BUILD_VERSION_ENDPOINTS.GET_LATEST,
            {
                headers: this.authHeaders()
            }
        );
    }

    // GET /build-version without Authorization
    getLatestWithoutAuth() {
        return this.request.get(
            BUILD_VERSION_ENDPOINTS.GET_LATEST
        );
    }
}

module.exports = BuildVersionClient;