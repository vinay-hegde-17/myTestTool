const { HTTP_STATUS } = require('./httpStatus');

const SEND_EMAIL_ENDPOINTS = {

    SEND_LEAVE_EMAIL: '/sendEmail',

    TIMESHEET_APPROVAL: '/sendEmail/timeSheetApproval'

};

module.exports = { HTTP_STATUS, SEND_EMAIL_ENDPOINTS };