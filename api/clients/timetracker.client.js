const { TIME_TRACKER_ENDPOINTS } = require("../constants/timetracker.constants");

class TimeTrackerClient {
  constructor(request, token = null) {
    this.request = request;
    this.token = token;
  }

  authHeaders() {
    return this.token ? { Authorization: `Bearer ${this.token}` } : {};
  }

  invalidAuthHeaders() {
    return { Authorization: "Bearer invalid_token" };
  }

  getMultipleTimesheets(payload) {
    return this.request.post(TIME_TRACKER_ENDPOINTS.GET_MULTIPLE_TIMESHEETS, {
      data: payload,
      headers: this.authHeaders(),
    });
  }

  getMultipleTimesheetsWithoutAuth(payload) {
    return this.request.post(TIME_TRACKER_ENDPOINTS.GET_MULTIPLE_TIMESHEETS, {
      data: payload,
    });
  }

  getEmployeeTimesheetLogsWithoutAuth(payload) {
    return this.getMultipleTimesheetsWithoutAuth(payload);
  }

  getMultipleTimesheetsWithInvalidAuth(payload) {
    return this.request.post(TIME_TRACKER_ENDPOINTS.GET_MULTIPLE_TIMESHEETS, {
      data: payload,
      headers: this.invalidAuthHeaders(),
    });
  }

  getEmployees(params = {}) {
    return this.request.get(TIME_TRACKER_ENDPOINTS.GET_EMPLOYEES, {
      params,
      headers: this.authHeaders(),
    });
  }

  getEmployeesWithoutAuth(params = {}) {
    return this.request.get(TIME_TRACKER_ENDPOINTS.GET_EMPLOYEES, {
      params,
    });
  }

  getEmployeesWithInvalidAuth(params = {}) {
    return this.request.get(TIME_TRACKER_ENDPOINTS.GET_EMPLOYEES, {
      params,
      headers: this.invalidAuthHeaders(),
    });
  }

  getEmployeeTimesheet(employeeId, params = {}) {
    return this.request.get(
      `${TIME_TRACKER_ENDPOINTS.GET_EMPLOYEE_TIMESHEET}/${employeeId}`,
      {
        params,
        headers: this.authHeaders(),
      },
    );
  }

  getEmployeeTimesheetWithoutAuth(employeeId, params = {}) {
    return this.request.get(
      `${TIME_TRACKER_ENDPOINTS.GET_EMPLOYEE_TIMESHEET}/${employeeId}`,
      {
        params,
      },
    );
  }

  getEmployeeTimesheetWithInvalidAuth(employeeId, params = {}) {
    return this.request.get(
      `${TIME_TRACKER_ENDPOINTS.GET_EMPLOYEE_TIMESHEET}/${employeeId}`,
      {
        params,
        headers: this.invalidAuthHeaders(),
      },
    );
  }

  createTimesheet(employeeId, payload) {
    return this.request.post(
      `${TIME_TRACKER_ENDPOINTS.CREATE_TIMESHEET}/${employeeId}`,
      {
        data: payload,
        headers: this.authHeaders(),
      },
    );
  }

  createTimesheetWithoutAuth(employeeId, payload) {
    return this.request.post(
      `${TIME_TRACKER_ENDPOINTS.CREATE_TIMESHEET}/${employeeId}`,
      {
        data: payload,
      },
    );
  }

  createTimesheetWithInvalidAuth(employeeId, payload) {
    return this.request.post(
      `${TIME_TRACKER_ENDPOINTS.CREATE_TIMESHEET}/${employeeId}`,
      {
        data: payload,
        headers: this.invalidAuthHeaders(),
      },
    );
  }

  updateTimesheet(employeeId, payload) {
    return this.request.put(
      `${TIME_TRACKER_ENDPOINTS.UPDATE_TIMESHEET}/${employeeId}`,
      {
        data: payload,
        headers: this.authHeaders(),
      },
    );
  }

  updateTimesheetWithoutAuth(employeeId, payload) {
    return this.request.put(
      `${TIME_TRACKER_ENDPOINTS.UPDATE_TIMESHEET}/${employeeId}`,
      {
        data: payload,
      },
    );
  }

  updateTimesheetWithInvalidAuth(employeeId, payload) {
    return this.request.put(
      `${TIME_TRACKER_ENDPOINTS.UPDATE_TIMESHEET}/${employeeId}`,
      {
        data: payload,
        headers: this.invalidAuthHeaders(),
      },
    );
  }
}

module.exports = TimeTrackerClient;
