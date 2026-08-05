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

const USER_ROLE_ENDPOINTS = {

    GET_USER_ROLES: "/userRoles",

    GET_USER_ROLE: "/userRoles/userRole",

    GET_ROLE_BY_ID: "/userRoles/userId",

    CREATE_USER_ROLE: "/userRoles",

    UPDATE_USER_ROLE: "/userRoles",

    GET_ROLE_ID: "/userRoles/getRoleId",

    GET_ROLE_NAME: "/userRoles/getRoleName",

    CHECK_EXISTS_OR_CREATE_ROLE: "/userRoles/checkExistsOrCreateRole",

    RESET_USER_ROLES: "/userRoles/test/reset",

    SEED_USER_ROLES: "/userRoles/test/seed"

};

module.exports = { USER_ROLE_ENDPOINTS, HTTP_STATUS };
