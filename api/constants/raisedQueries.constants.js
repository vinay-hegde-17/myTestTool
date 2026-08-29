const { HTTP_STATUS } = require('./httpStatus');

const RAISED_QUERIES_ENDPOINTS = {
  GET_ALL: "/raiseQueries",

  GET_TYPES: "/raiseQueries/types",

  GET_BY_EMPLOYEE: "/raiseQueries",

  CREATE_QUERY: "/raiseQueries",

  UPDATE_QUERY: "/raiseQueries/update",

    UPDATE_QUERY: '/raiseQueries/update',

    UPDATE_RAISE_QUERY: '/raiseQueries/updateRaiseQuery',

    GET_FAQ: '/raiseQueries/faq/all',

  GET_FAQ: "/raiseQueries/faq/all",
};

module.exports = { RAISED_QUERIES_ENDPOINTS, HTTP_STATUS };
