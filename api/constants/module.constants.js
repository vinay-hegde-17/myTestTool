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

const MODULES_ENDPOINTS = {

    GET_ALL: '/modules',

    GET_FOR_PERMISSION: '/modules/modulesForPermission',

    CREATE_MODULE: '/modules',

    UPDATE_MODULE: '/modules',

    GET_MENU: '/modules/menu',

    GET_BY_IDS: '/modules/modulesByIds'

};

module.exports = { MODULES_ENDPOINTS, HTTP_STATUS };