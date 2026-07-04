const HTTP_STATUS = {
    OK: 200,
    CREATED: 201,
    NO_CONTENT: 204,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    NOT_FOUND: 404,
    CONFLICT: 409,
    SERVER_ERROR: 500
};

const LEAVE_ENDPOINTS = {

    LIST: '/leaves',

    LEAVE_THRESHOLD: '/leaves/leavesThreshold',

    EMPLOYEE_LEAVES: '/leaves',

    APPROVER_LEAVES: '/leaves/approver',

    FINANCIAL_YEAR: '/leaves',

    CREATE: '/leaves',

    UPDATE: '/leaves',

    REJECT_REQUEST: '/leaves/reject-request',

    DELETE: '/leaves',

    OVERALL_LEAVES: '/leaves/overallleaves'

};

module.exports = { HTTP_STATUS, LEAVE_ENDPOINTS };