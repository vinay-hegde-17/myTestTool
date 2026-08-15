const { HTTP_STATUS } = require('./httpStatus');

const BUILD_VERSION_ENDPOINTS = {

    CREATE: '/build-version',

    GET_LATEST: '/build-version'

};

module.exports = { BUILD_VERSION_ENDPOINTS, HTTP_STATUS };