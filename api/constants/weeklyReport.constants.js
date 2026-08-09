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

const WEEKLY_REPORT_ENDPOINTS = {

    GET_WEEKLY_REPORTS: '/weeklyReports',

    GET_WEEKLY_REPORTS_BY_WEEK: '/weeklyReports/byWeek',

    CREATE_WEEKLY_REPORT: '/weeklyReports'

};

module.exports = {
    WEEKLY_REPORT_ENDPOINTS,
    HTTP_STATUS
};