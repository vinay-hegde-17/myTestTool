const { LEAVE_ENDPOINTS } = require("../constants/leave.constants");

class LeaveClient {
  constructor(request, token = null) {
    this.request = request;
    this.token = token;
  }

  authHeaders() {
    return this.token ? { Authorization: `Bearer ${this.token}` } : {};
  }

  getLeaves(status) {
    return this.request.get(LEAVE_ENDPOINTS.LIST, {
      headers: this.authHeaders(),
      params: status ? { status } : {},
    });
  }

  getLeavesWithoutAuth(status) {
    return this.request.get(LEAVE_ENDPOINTS.LIST, {
      params: status ? { status } : {},
    });
  }

  getLeaveThreshold() {
    return this.request.get(LEAVE_ENDPOINTS.LEAVE_THRESHOLD, {
      headers: this.authHeaders(),
    });
  }

  getLeaveThresholdWithoutAuth() {
    return this.request.get(LEAVE_ENDPOINTS.LEAVE_THRESHOLD);
  }

  getEmployeeLeaves(employeeId, status) {
    return this.request.get(
      `${LEAVE_ENDPOINTS.EMPLOYEE_LEAVES}/${employeeId}`,
      {
        headers: this.authHeaders(),
        params: status ? { status } : {},
      },
    );
  }

  getEmployeeLeavesWithoutAuth(employeeId) {
    return this.request.get(`${LEAVE_ENDPOINTS.EMPLOYEE_LEAVES}/${employeeId}`);
  }

  getApproverLeaves(approverId, employeeId, status) {
    const params = {};

    if (employeeId) {
      params.employeeId = employeeId;
    }

    if (status) {
      params.status = status;
    }

    return this.request.get(
      `${LEAVE_ENDPOINTS.APPROVER_LEAVES}/${approverId}`,
      {
        headers: this.authHeaders(),
        params,
      },
    );
  }

  getApproverLeavesWithoutAuth(approverId) {
    return this.request.get(`${LEAVE_ENDPOINTS.APPROVER_LEAVES}/${approverId}`);
  }

  getFinancialYearLeaves(employeeId) {
    return this.request.get(
      `${LEAVE_ENDPOINTS.FINANCIAL_YEAR}/${employeeId}/financialYear`,
      {
        headers: this.authHeaders(),
      },
    );
  }

  getFinancialYearLeavesWithoutAuth(employeeId) {
    return this.request.get(
      `${LEAVE_ENDPOINTS.FINANCIAL_YEAR}/${employeeId}/financialYear`,
    );
  }

  applyLeave(leaveData) {
    return this.request.post(LEAVE_ENDPOINTS.CREATE, {
      headers: this.authHeaders(),
      data: leaveData,
    });
  }

  updateLeave(leaveId, payload) {
    return this.request.put(`${LEAVE_ENDPOINTS.UPDATE}/${leaveId}`, {
      headers: this.authHeaders(),
      data: payload,
    });
  }

  submitRejectRequest(leaveId, payload) {
    return this.request.put(`${LEAVE_ENDPOINTS.REJECT_REQUEST}/${leaveId}`, {
      headers: this.authHeaders(),
      data: payload,
    });
  }

  deleteLeave(leaveId) {
    return this.request.delete(`${LEAVE_ENDPOINTS.DELETE}/${leaveId}`, {
      headers: this.authHeaders(),
    });
  }

  getOverallLeaves(employeeId = "all") {
    return this.request.get(`${LEAVE_ENDPOINTS.OVERALL_LEAVES}/${employeeId}`, {
      headers: this.authHeaders(),
    });
  }
}

module.exports = LeaveClient;
