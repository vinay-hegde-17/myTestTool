const { HTTP_STATUS } = require('./httpStatus.constants');

const MODULES_ENDPOINTS = {

    GET_ALL: '/modules',

    GET_FOR_PERMISSION: '/modules/modulesForPermission',

    CREATE_MODULE: '/modules',

    UPDATE_MODULE: '/modules',

    GET_MENU: '/modules/menu',

    GET_BY_IDS: '/modules/modulesByIds'

};

module.exports = { MODULES_ENDPOINTS, HTTP_STATUS };