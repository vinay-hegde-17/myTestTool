const { SEND_EMAIL_ENDPOINTS } = require("../constants/sendEmail.constants");

class SendEmailClient {
  constructor(request, token) {
    this.request = request;
    this.token = token;
  }

  getHeaders() {
    return {
      Authorization: `Bearer ${this.token}`,
      "Content-Type": "application/json",
    };
  }

  async sendLeaveEmail(payload) {
    return await this.request.post(SEND_EMAIL_ENDPOINTS.SEND_LEAVE_EMAIL, {
      headers: this.getHeaders(),
      data: payload,
    });
  }

  async sendLeaveEmailWithoutAuth(payload) {
    return await this.request.post(SEND_EMAIL_ENDPOINTS.SEND_LEAVE_EMAIL, {
      headers: {
        "Content-Type": "application/json",
      },
      data: payload,
    });
  }

  async requestTimesheetApproval(payload) {
    return await this.request.post(SEND_EMAIL_ENDPOINTS.TIMESHEET_APPROVAL, {
      headers: this.getHeaders(),
      data: payload,
    });
  }

  async requestTimesheetApprovalWithoutAuth(payload) {
    return await this.request.post(SEND_EMAIL_ENDPOINTS.TIMESHEET_APPROVAL, {
      headers: {
        "Content-Type": "application/json",
      },
      data: payload,
    });
  }
}

module.exports = SendEmailClient;
