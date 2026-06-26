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

const ASSET_ENDPOINTS = {

    GET_ASSETS: '/assets',

    GET_ASSET_TYPES: '/assets/types',

    GET_ASSET_MODELS: '/assets/models',

    CREATE_ASSET: '/assets',

    UPDATE_ASSET: '/assets',

    CREATE_ASSET_TYPE: '/assets/type',

    CREATE_ASSET_MODEL: '/assets/model'

};

module.exports = { ASSET_ENDPOINTS, HTTP_STATUS };