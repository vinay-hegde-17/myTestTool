const HTTP_STATUS = {
    OK: 200,
    CREATED: 201,
    NO_CONTENT: 204,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    NOT_FOUND: 404,
    CONFLICT: 409,
    INTERNAL_SERVER_ERROR: 500
};


const MODULE_USER_ROLE_ENDPOINTS = {

    GET_ALL: '/moduleUserRole',

    GET_BY_ROLE: '/moduleUserRole',

    CREATE: '/moduleUserRole',

    UPDATE_BY_ROLE: '/moduleUserRole'
};

module.exports = { MODULE_USER_ROLE_ENDPOINTS, HTTP_STATUS };