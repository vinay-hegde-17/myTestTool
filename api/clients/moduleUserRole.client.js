const { MODULE_USER_ROLE_ENDPOINTS } = require('../constants/moduleUserRole.constants');

class ModuleUserRoleClient {

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

    validateUserRoleId(userRoleId) {
        const objectIdRegex = /^[0-9a-fA-F]{24}$/;

        if (!objectIdRegex.test(userRoleId)) {
            throw new Error(
                'userRoleId must be a valid MongoDB ObjectId'
            );
        }
    }

    // GET /moduleUserRole
    getAll() {
        return this.request.get(
            MODULE_USER_ROLE_ENDPOINTS.GET_ALL,
            {
                headers: this.authHeaders()
            }
        );
    }

    // GET /moduleUserRole/:userRoleId
    async getByRole(userRoleId) {

        this.validateUserRoleId(userRoleId);

        return this.request.get(
            `${MODULE_USER_ROLE_ENDPOINTS.GET_BY_ROLE}/${userRoleId}`,
            {
                headers: this.authHeaders()
            }
        );
    }

    // GET /moduleUserRole without Authorization
    getAllWithoutAuth() {
        return this.request.get(
            MODULE_USER_ROLE_ENDPOINTS.GET_ALL
        );
    }

    // GET /moduleUserRole/:userRoleId without Authorization
    async getByRoleWithoutAuth(userRoleId) {

        this.validateUserRoleId(userRoleId);

        return this.request.get(
            `${MODULE_USER_ROLE_ENDPOINTS.GET_BY_ROLE}/${userRoleId}`
        );
    }

    // POST /moduleUserRole
    create(payload) {
        return this.request.post(
            MODULE_USER_ROLE_ENDPOINTS.CREATE,
            {
                headers: {
                    ...this.authHeaders(),
                    'Content-Type': 'application/json'
                },
                data: payload
            }
        );
    }

    // POST /moduleUserRole without Authorization
    createWithoutAuth(payload) {
        return this.request.post(
            MODULE_USER_ROLE_ENDPOINTS.CREATE,
            {
                headers: {
                    'Content-Type': 'application/json'
                },
                data: payload
            }
        );
    }

    // PUT /moduleUserRole/:userRoleId
    async update(userRoleId, payload) {

        this.validateUserRoleId(userRoleId);

        return this.request.put(
            `${MODULE_USER_ROLE_ENDPOINTS.UPDATE_BY_ROLE}/${userRoleId}`,
            {
                headers: {
                    ...this.authHeaders(),
                    'Content-Type': 'application/json'
                },
                data: payload
            }
        );
    }

    // PUT /moduleUserRole/:userRoleId without Authorization
    async updateWithoutAuth(userRoleId, payload) {

        this.validateUserRoleId(userRoleId);

        return this.request.put(
            `${MODULE_USER_ROLE_ENDPOINTS.UPDATE_BY_ROLE}/${userRoleId}`,
            {
                headers: {
                    'Content-Type': 'application/json'
                },
                data: payload
            }
        );
    }
}

module.exports = { ModuleUserRoleClient };