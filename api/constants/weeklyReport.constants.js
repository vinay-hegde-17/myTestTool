const { HTTP_STATUS } = require('./httpStatus');

const WEEKLY_REPORT_ENDPOINTS = {
  GET_WEEKLY_REPORTS: "/weeklyReports",

  GET_WEEKLY_REPORTS_BY_WEEK: "/weeklyReports/byWeek",

  CREATE_WEEKLY_REPORT: "/weeklyReports",
};

module.exports = { WEEKLY_REPORT_ENDPOINTS, HTTP_STATUS };
