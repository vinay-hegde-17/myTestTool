const { HTTP_STATUS } = require("./httpStatus.constants");

const SERVER_ENDPOINTS = {
  SWAGGER_JSON: "/swagger.json",
  AUTH_CALLBACK: "/auth/callback",
  EMPLOYEES: "/employees",
};

module.exports = { HTTP_STATUS, SERVER_ENDPOINTS };
