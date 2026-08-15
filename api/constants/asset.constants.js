const { HTTP_STATUS } = require('./httpStatus');

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