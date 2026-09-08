const { APPROVE_LEAVE_ENDPOINTS } = require("../constants/approveLeave.constants");

class ApproveLeaveClient {
  constructor(request, token) {
    this.request = request;
    this.token = token;
  }

  async updateLeaveStatus(leaveId, status) {
    const encodedLeaveId = Buffer.from(leaveId).toString("base64");

    const encodedStatus = Buffer.from(status).toString("base64");

    const safeId = encodeURIComponent(encodedLeaveId);
    return await this.request.get(
      `${APPROVE_LEAVE_ENDPOINTS.UPDATE_LEAVE_STATUS}/${safeId}`,
      {
        headers: {
          Authorization: `Bearer ${this.token}`,
        },
        params: {
          status: encodedStatus,
        },
      },
    );
  }

  async updateLeaveStatusWithEncodedId(encodedLeaveId, encodedStatus) {
    return await this.request.get(
      `${APPROVE_LEAVE_ENDPOINTS.UPDATE_LEAVE_STATUS}/${encodedLeaveId}`,
      {
        headers: {
          Authorization: `Bearer ${this.token}`,
        },
        params: {
          status: encodedStatus,
        },
      },
    );
  }
}

module.exports = ApproveLeaveClient;
