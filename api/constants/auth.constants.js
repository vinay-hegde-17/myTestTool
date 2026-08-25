const { HTTP_STATUS } = require("./httpStatus.constants");

const AUTH_ENDPOINTS = {
  GENERATE_JWT_TOKEN: "/auth/generatejwttoken",

  QA_TOKEN: "/auth/qa-token",

  VALIDATE_TOKEN: "/auth/isvalidtoken",
};

module.exports = { HTTP_STATUS, AUTH_ENDPOINTS };
