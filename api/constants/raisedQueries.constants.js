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

const RAISED_QUERIES_ENDPOINTS = {

    GET_ALL: '/raiseQueries',

    GET_TYPES: '/raiseQueries/types',

    GET_BY_EMPLOYEE: '/raiseQueries',

    CREATE_QUERY: '/raiseQueries',

    UPDATE_QUERY: '/raiseQueries/update',

    UPDATE_RAISE_QUERY: '/raiseQueries/updateRaiseQuery',
    
    GET_FAQ: '/raiseQueries/faq/all',

};

module.exports = { RAISED_QUERIES_ENDPOINTS, HTTP_STATUS };