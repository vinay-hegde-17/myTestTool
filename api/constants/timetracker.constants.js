const { HTTP_STATUS } = require('./httpStatus');

const TIME_TRACKER_ENDPOINTS = {

    GET_MULTIPLE_TIMESHEETS: "/timesheettracker",

    GET_EMPLOYEES: "/timesheettracker/employees",

    GET_EMPLOYEE_TIMESHEET: "/timesheettracker",

    CREATE_TIMESHEET: "/timesheettracker",

    UPDATE_TIMESHEET: "/timesheettracker"

};

module.exports = { TIME_TRACKER_ENDPOINTS, HTTP_STATUS };