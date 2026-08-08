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

const TIME_TRACKER_ENDPOINTS = {

    GET_MULTIPLE_TIMESHEETS: "/timesheettracker",

    GET_EMPLOYEES: "/timesheettracker/employees",

    GET_EMPLOYEE_TIMESHEET: "/timesheettracker",

    CREATE_TIMESHEET: "/timesheettracker",

    UPDATE_TIMESHEET: "/timesheettracker"

};

module.exports = { TIME_TRACKER_ENDPOINTS, HTTP_STATUS };