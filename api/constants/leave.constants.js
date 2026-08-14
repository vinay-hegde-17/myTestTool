const { HTTP_STATUS } = require('./httpStatus.constants');

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