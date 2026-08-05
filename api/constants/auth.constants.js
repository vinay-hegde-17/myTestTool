const HTTP_STATUS = {
    OK: 200,
    CREATED: 201,
    NO_CONTENT: 204,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    CONFLICT: 409,
    INTERNAL_SERVER_ERROR: 500
};

const AUTH_ENDPOINTS = {
  GENERATE_JWT_TOKEN: '/auth/generatejwttoken',

  QA_TOKEN: '/auth/qa-token',
  
  VALIDATE_TOKEN: '/auth/isvalidtoken',
};

module.exports = { HTTP_STATUS, AUTH_ENDPOINTS };
