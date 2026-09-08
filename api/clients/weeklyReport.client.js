const { WEEKLY_REPORT_ENDPOINTS } = require("../constants/weeklyReport.constants");

class WeeklyReportClient {
  constructor(request, token = null) {
    this.request = request;
    this.token = token;
  }

  authHeaders() {
    return this.token ? { Authorization: `Bearer ${this.token}` } : {};
  }

  getWeeklyReports() {
    return this.request.get(WEEKLY_REPORT_ENDPOINTS.GET_WEEKLY_REPORTS, {
      headers: this.authHeaders(),
    });
  }

  getWeeklyReportsByWeek(params) {
    return this.request.get(
      WEEKLY_REPORT_ENDPOINTS.GET_WEEKLY_REPORTS_BY_WEEK,
      {
        params,
        headers: this.authHeaders(),
      },
    );
  }

  getWeeklyReportsWithoutAuth() {
    return this.request.get(WEEKLY_REPORT_ENDPOINTS.GET_WEEKLY_REPORTS);
  }

  getWeeklyReportsByWeekWithoutAuth(params) {
    return this.request.get(
      WEEKLY_REPORT_ENDPOINTS.GET_WEEKLY_REPORTS_BY_WEEK,
      {
        params,
      },
    );
  }

  createWeeklyReports(payload) {
    return this.request.post(WEEKLY_REPORT_ENDPOINTS.CREATE_WEEKLY_REPORT, {
      headers: {
        ...this.authHeaders(),
        "Content-Type": "application/json",
      },
      data: payload,
    });
  }

  createWeeklyReportsWithoutAuth(payload) {
    return this.request.post(WEEKLY_REPORT_ENDPOINTS.CREATE_WEEKLY_REPORT, {
      data: payload,
    });
  }
}

module.exports = WeeklyReportClient;
