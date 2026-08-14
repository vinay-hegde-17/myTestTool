const HTTP_STATUS = {
    OK: 200,
    CREATED: 201,
    NO_CONTENT: 204,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    NOT_FOUND: 404,
    INTERNAL_SERVER_ERROR: 500
};

const SEND_MAIL_ENDPOINTS = {
    SEND_MAIL: '/emailServices/send-mail'
};

module.exports = {
    HTTP_STATUS,
    SEND_MAIL_ENDPOINTS
};