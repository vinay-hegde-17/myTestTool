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

const SEND_EMAIL_ENDPOINTS = {
    SEND_LEAVE_EMAIL: '/sendEmail',
    TIMESHEET_APPROVAL: '/sendEmail/timeSheetApproval'
};

module.exports = {
    HTTP_STATUS,
    SEND_EMAIL_ENDPOINTS
};