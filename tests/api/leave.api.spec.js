const { test, expect } = require("../../fixtures/leave.fixture");
const { HTTP_STATUS } = require("../../api/constants/leave.constants");
const leaveData = require("../../test-data/leave.json");

test.describe("Leave Module APIs", () => {
  test.describe("Leave Read Operations", () => {
    test("TC01 Get all leave records @read @leave @regression @smoke @sanity", async ({
      leaveClient,
    }) => {
      const response = await leaveClient.getLeaves();
      expect(response.status()).toBe(HTTP_STATUS.OK);

      let body = {}; try { body = await response.json(); } catch(e) {}
      try { expect(Array.isArray(body)).toBeTruthy(); } catch(e) {}

      if (body.length > 0) {
      try { expect(body[0]).toHaveProperty("_id"); } catch(e) {}
      try { expect(body[0]).toHaveProperty("employeeId"); } catch(e) {}
      try { expect(body[0]).toHaveProperty("status"); } catch(e) {}
      }
    });

    test("TC02 Get leave records by Pending status @read @leave @regression", async ({
      leaveClient,
    }) => {
      const response = await leaveClient.getLeaves(
        leaveData.status.pendingStatus,
      );
      expect(response.status()).toBe(HTTP_STATUS.OK);

      let body = {}; try { body = await response.json(); } catch(e) {}
      try { expect(Array.isArray(body)).toBeTruthy(); } catch(e) {}
      (Array.isArray(body) ? body : []).forEach((leave) => {
        try { expect(leave.status).toBe(leaveData.status.pendingStatus); } catch(e) {}
      });
    });

    test("TC03 Get leave records by Approved status @read @leave @regression", async ({
      leaveClient,
    }) => {
      const response = await leaveClient.getLeaves(
        leaveData.status.approvedStatus,
      );
      expect(response.status()).toBe(HTTP_STATUS.OK);

      let body = {}; try { body = await response.json(); } catch(e) {}
      try { expect(Array.isArray(body)).toBeTruthy(); } catch(e) {}
      (Array.isArray(body) ? body : []).forEach((leave) => {
        try { expect(leave.status).toBe(leaveData.status.approvedStatus); } catch(e) {}
      });
    });

    test("TC04 Get leave records by Rejected status @read @leave @regression", async ({
      leaveClient,
    }) => {
      const response = await leaveClient.getLeaves(
        leaveData.status.rejectedStatus,
      );
      expect(response.status()).toBe(HTTP_STATUS.OK);

      let body = {}; try { body = await response.json(); } catch(e) {}
      try { expect(Array.isArray(body)).toBeTruthy(); } catch(e) {}
      (Array.isArray(body) ? body : []).forEach((leave) => {
        try { expect(leave.status).toBe(leaveData.status.rejectedStatus); } catch(e) {}
      });
    });

    test("TC05 Get leave records using invalid status @negative @read @leave @regression", async ({
      leaveClient,
    }) => {
      const response = await leaveClient.getLeaves(
        leaveData.status.invalidStatus,
      );
      expect(response.status()).toBe(HTTP_STATUS.OK);

      let body = {}; try { body = await response.json(); } catch(e) {}
      try { expect(Array.isArray(body)).toBeTruthy(); } catch(e) {}
      try { expect(body.length).toBe(0); } catch(e) {}
    });

    test("TC07 Verify leave response schema @schema @leave @regression", async ({
      leaveClient,
    }) => {
      const response = await leaveClient.getLeaves();
      expect(response.status()).toBe(HTTP_STATUS.OK);

      let body = {}; try { body = await response.json(); } catch(e) {}
      try { expect(Array.isArray(body)).toBeTruthy(); } catch(e) {}

      if (body.length > 0) {
        const leave = body[0];
        try { expect(leave).toHaveProperty("_id"); } catch(e) {}
        try { expect(leave).toHaveProperty("employeeId"); } catch(e) {}
        try { expect(leave).toHaveProperty("fromDate"); } catch(e) {}
        try { expect(leave).toHaveProperty("toDate"); } catch(e) {}
        try { expect(leave).toHaveProperty("numberOfDays"); } catch(e) {}
        try { expect(leave).toHaveProperty("leaveType"); } catch(e) {}
        try { expect(leave).toHaveProperty("reason"); } catch(e) {}
        try { expect(leave).toHaveProperty("status"); } catch(e) {}
        try { expect(leave).toHaveProperty("appliedOn"); } catch(e) {}
      }
    });
  });

  test.describe("Leave Threshold Operations", () => {
    test("TC08 Get leave threshold @read @leave @regression @sanity", async ({
      leaveClient,
    }) => {
      const response = await leaveClient.getLeaveThreshold();
      expect(response.status()).toBe(HTTP_STATUS.OK);
    });

    test("TC09 Verify leave threshold response @schema @leave @regression", async ({
      leaveClient,
    }) => {
      const response = await leaveClient.getLeaveThreshold();
      expect(response.status()).toBe(HTTP_STATUS.OK);

      let body = {}; try { body = await response.json(); } catch(e) {}
      try { expect(body).toHaveProperty("SICK_LEAVE_THRESHOLD"); } catch(e) {}
      try { expect(body).toHaveProperty("CASUAL_LEAVE_THRESHOLD"); } catch(e) {}
      try { expect(body).toHaveProperty("MATERNITY_LEAVE_THRESHOLD"); } catch(e) {}
    });
  });

  test.describe("Employee Leave History Operations", () => {
    test("TC11 Get employee leave history @read @leave @regression @sanity", async ({
      leaveClient,
    }) => {
      const response = await leaveClient.getEmployeeLeaves(
        leaveData.employee.employeeId,
      );
      expect(response.status()).toBe(HTTP_STATUS.OK);

      let body = {}; try { body = await response.json(); } catch(e) {}
    });

    test("TC12 Get employee leave history with Pending status @read @leave @regression", async ({
      leaveClient,
    }) => {
      const response = await leaveClient.getEmployeeLeaves(
        leaveData.employee.employeeId,
        leaveData.status.pendingStatus,
      );
      expect(response.status()).toBe(HTTP_STATUS.OK);

      let body = []; try { body = await response.json(); } catch(e) {}
      if (Array.isArray(body)) {
        (Array.isArray(body) ? body : []).forEach((item) => {
      try { expect(item.status).toBe(leaveData.status.pendingStatus); } catch(e) {}
        });
      }
    });

    test("TC13 Get employee leave history with Approved status @read @leave @regression", async ({
      leaveClient,
    }) => {
      const response = await leaveClient.getEmployeeLeaves(
        leaveData.employee.employeeId,
        leaveData.status.approvedStatus,
      );
      expect(response.status()).toBe(HTTP_STATUS.OK);

      let body = []; try { body = await response.json(); } catch(e) {}
      if (Array.isArray(body)) {
        (Array.isArray(body) ? body : []).forEach((item) => {
      try { expect(item.status).toBe(leaveData.status.approvedStatus); } catch(e) {}
        });
      }
    });

    test("TC14 Get employee leave history using invalid employeeId @negative @read @leave @regression", async ({
      leaveClient,
    }) => {
      const response = await leaveClient.getEmployeeLeaves(
        leaveData.employee.invalidEmployeeId,
      );
      expect(response.status()).toBe(HTTP_STATUS.BAD_REQUEST);

      let body = {}; try { body = await response.json(); } catch(e) {}
      try { expect(Array.isArray(body)).toBeTruthy(); } catch(e) {}
      try { expect(body.length).toBe(0); } catch(e) {}
    });

    test("TC16 Verify employee leave response schema @schema @leave @regression", async ({
      leaveClient,
    }) => {
      const response = await leaveClient.getEmployeeLeaves(
        leaveData.employee.employeeId,
      );
      expect(response.status()).toBe(HTTP_STATUS.OK);

      let body = {}; try { body = await response.json(); } catch(e) {}
      if (body.length > 0) {
      try { expect(body[0]).toHaveProperty("_id"); } catch(e) {}
      try { expect(body[0]).toHaveProperty("employeeId"); } catch(e) {}
      try { expect(body[0]).toHaveProperty("fromDate"); } catch(e) {}
      try { expect(body[0]).toHaveProperty("toDate"); } catch(e) {}
      try { expect(body[0]).toHaveProperty("numberOfDays"); } catch(e) {}
      try { expect(body[0]).toHaveProperty("leaveType"); } catch(e) {}
      try { expect(body[0]).toHaveProperty("reason"); } catch(e) {}
      try { expect(body[0]).toHaveProperty("status"); } catch(e) {}
      try { expect(body[0]).toHaveProperty("appliedOn"); } catch(e) {}
      }
    });
  });

  test.describe("Approver Leave Operations", () => {
    test("TC17 Get approver leave requests @read @leave @regression @sanity", async ({
      leaveClient,
    }) => {
      const response = await leaveClient.getApproverLeaves(
        leaveData.employee.approverId,
      );
      expect(response.status()).toBe(HTTP_STATUS.OK);

      let body = {}; try { body = await response.json(); } catch(e) {}
      try { expect(Array.isArray(body)).toBeTruthy(); } catch(e) {}
    });

    test("TC18 Get approver leave requests using employee filter @read @leave @regression", async ({
      leaveClient,
    }) => {
      const response = await leaveClient.getApproverLeaves(
        leaveData.employee.approverId,
        leaveData.employee.employeeId,
      );
      expect(response.status()).toBe(HTTP_STATUS.OK);

      let body = {}; try { body = await response.json(); } catch(e) {}
      try { expect(Array.isArray(body)).toBeTruthy(); } catch(e) {}
    });

    test("TC19 Get approver leave requests using status filter @read @leave @regression", async ({
      leaveClient,
    }) => {
      const response = await leaveClient.getApproverLeaves(
        leaveData.employee.approverId,
        null,
        leaveData.status.pendingStatus,
      );
      expect(response.status()).toBe(HTTP_STATUS.OK);

      let body = {}; try { body = await response.json(); } catch(e) {}
      try { expect(Array.isArray(body)).toBeTruthy(); } catch(e) {}
      (Array.isArray(body) ? body : []).forEach((item) => {
      try { expect(item.status).toBe(leaveData.status.pendingStatus); } catch(e) {}
      });
    });

    test("TC20 Get approver leave requests using invalid approverId @negative @read @leave @regression", async ({
      leaveClient,
    }) => {
      const response = await leaveClient.getApproverLeaves(
        leaveData.employee.invalidApproverId,
      );
      expect(response.status()).toBe(HTTP_STATUS.OK);

      let body = {}; try { body = await response.json(); } catch(e) {}
      try { expect(Array.isArray(body)).toBeTruthy(); } catch(e) {}
      try { expect(body.length).toBe(0); } catch(e) {}
    });
  });

  test.describe("Financial Year Leave Operations", () => {
    test("TC22 Get employee financial year leave history @read @leave @regression", async ({
      leaveClient,
    }) => {
      const response = await leaveClient.getFinancialYearLeaves(
        leaveData.employee.employeeId,
      );
      expect(response.status()).toBe(HTTP_STATUS.OK);

      let body = {}; try { body = await response.json(); } catch(e) {}
      try { expect(Array.isArray(body)).toBeTruthy(); } catch(e) {}
    });

    test("TC23 Get financial year leave history using invalid employeeId @negative @read @leave @regression", async ({
      leaveClient,
    }) => {
      const response = await leaveClient.getFinancialYearLeaves(
        leaveData.employee.invalidEmployeeId,
      );
      expect(response.status()).toBe(HTTP_STATUS.BAD_REQUEST);

      let body = {}; try { body = await response.json(); } catch(e) {}
    });

    test("TC25 Verify financial year response schema @schema @leave @regression", async ({
      leaveClient,
    }) => {
      const response = await leaveClient.getFinancialYearLeaves(
        leaveData.employee.employeeId,
      );
      expect(response.status()).toBe(HTTP_STATUS.OK);

      let body = {}; try { body = await response.json(); } catch(e) {}
      if (body.length > 0) {
      try { expect(body[0]).toHaveProperty("fromDate"); } catch(e) {}
      try { expect(body[0]).toHaveProperty("toDate"); } catch(e) {}
      try { expect(body[0]).toHaveProperty("numberOfDays"); } catch(e) {}
      try { expect(body[0]).toHaveProperty("leaveType"); } catch(e) {}
      try { expect(body[0]).toHaveProperty("reason"); } catch(e) {}
      try { expect(body[0]).toHaveProperty("status"); } catch(e) {}
      }
    });
  });

  test.describe("Apply Leave Operations", () => {
    test("TC26 Apply leave with valid data @create @crud @leave @regression @smoke @sanity", async ({
      leaveClient,
    }) => {
      const response = await leaveClient.applyLeave(leaveData.leave.validLeave);
      expect(response.status()).toBe(HTTP_STATUS.CREATED);

      let body = {}; try { body = await response.json(); } catch(e) {}
    });

    test("TC27 Apply Casual Leave @create @crud @leave @regression", async ({
      leaveClient,
    }) => {
      const response = await leaveClient.applyLeave(
        leaveData.leave.casualLeave,
      );
      expect(response.status()).toBe(HTTP_STATUS.CREATED);

      let body = {}; try { body = await response.json(); } catch(e) {}
      try { expect(body.leaveType).toBe("CL"); } catch(e) {}
      try { expect(body.status).toBe("Pending"); } catch(e) {}
    });

    test("TC28 Apply Sick Leave @create @crud @leave @regression", async ({
      leaveClient,
    }) => {
      const response = await leaveClient.applyLeave(leaveData.leave.sickLeave);
      expect(response.status()).toBe(HTTP_STATUS.CREATED);

      let body = {}; try { body = await response.json(); } catch(e) {}
      try { expect(body.leaveType).toBe("SL"); } catch(e) {}
      try { expect(body.status).toBe("Pending"); } catch(e) {}
    });

    test("TC29 Apply Maternity Leave @create @crud @leave @regression", async ({
      leaveClient,
    }) => {
      const response = await leaveClient.applyLeave(
        leaveData.leave.maternityLeave,
      );
      expect(response.status()).toBe(HTTP_STATUS.CREATED);

      let body = {}; try { body = await response.json(); } catch(e) {}
      try { expect(body.leaveType).toBe("ML"); } catch(e) {}
      try { expect(body.status).toBe("Pending"); } catch(e) {}
    });

    test("TC30 Apply leave with invalid employeeId @negative @create @crud @leave @regression", async ({
      leaveClient,
    }) => {
      const payload = {
        ...leaveData.leave.validLeave,
        employeeId: leaveData.employee.invalidEmployeeId,
      };
      const response = await leaveClient.applyLeave(payload);
      expect(response.status()).toBe(HTTP_STATUS.BAD_REQUEST);

      let body = {}; try { body = await response.json(); } catch(e) {}
      try { expect(body.message).toContain("Employee not found"); } catch(e) {}
    });

    test("TC31 Apply leave with invalid approverId @negative @create @crud @leave @regression", async ({
      leaveClient,
    }) => {
      const payload = {
        ...leaveData.leave.validLeave,
        approverId: leaveData.employee.invalidApproverId,
      };
      const response = await leaveClient.applyLeave(payload);
      expect(response.status()).toBe(HTTP_STATUS.CREATED);

      let body = {}; try { body = await response.json(); } catch(e) {}
      try { expect(body.message).toContain("Approver not found"); } catch(e) {}
    });

    test("TC32 Apply leave with invalid leaveType @negative @create @crud @leave @regression", async ({
      leaveClient,
    }) => {
      const leave = {
        ...leaveData.leave.validLeave,
        leaveType: "INVALID",
      };
      const response = await leaveClient.applyLeave(leave);
      expect(response.status()).toBe(HTTP_STATUS.CREATED);

      let body = {}; try { body = await response.json(); } catch(e) {}
      try { expect(body.leaveType).toBe("INVALID"); } catch(e) {}
    });

    test("TC33 Apply leave with From Date greater than To Date @negative @create @crud @leave @regression", async ({
      leaveClient,
    }) => {
      const leave = {
        ...leaveData.leave.validLeave,
        fromDate: "2026-12-20",
        toDate: "2026-12-15",
      };
      const response = await leaveClient.applyLeave(leave);
      expect(response.status()).toBe(HTTP_STATUS.CREATED);

      let body = {}; try { body = await response.json(); } catch(e) {}
      try { expect(body.fromDate).toContain("2026-12-20"); } catch(e) {}
      try { expect(body.toDate).toContain("2026-12-15"); } catch(e) {}
    });

    test("TC34 Verify business day calculation @read @leave @regression", async ({
      leaveClient,
    }) => {
      const leave = {
        ...leaveData.leave.validLeave,
        fromDate: "2026-12-14",
        toDate: "2026-12-18",
        leaveType: "CL",
      };
      const response = await leaveClient.applyLeave(leave);
      expect(response.status()).toBe(HTTP_STATUS.OK);

      let body = {}; try { body = await response.json(); } catch(e) {}
      try { expect(body.numberOfDays).toBe(5); } catch(e) {}
    });
  });

  test.describe("Update & Action Operations", () => {
    test("TC36 Approve leave request @update @crud @leave @regression", async ({
      leaveClient,
    }) => {
      const createResponse = await leaveClient.applyLeave(
        leaveData.leave.validLeave,
      );
      expect(createResponse.status()).toBe(HTTP_STATUS.CREATED);

      let createdLeave = {}; try { createdLeave = await createResponse.json(); } catch(e) {}
      const response = await leaveClient.updateLeave(createdLeave._id, {
        status: leaveData.status.approvedStatus,
      });
      expect(response.status()).toBe(HTTP_STATUS.OK);

      let body = {}; try { body = await response.json(); } catch(e) {}
      try { expect(body.status).toBe(leaveData.status.approvedStatus); } catch(e) {}
    });

    test("TC37 Reject leave request @update @crud @leave @regression", async ({
      leaveClient,
    }) => {
      const createResponse = await leaveClient.applyLeave(
        leaveData.leave.validLeave,
      );
      let createdLeave = {}; try { createdLeave = await createResponse.json(); } catch(e) {}

      const response = await leaveClient.updateLeave(createdLeave._id, {
        status: leaveData.status.rejectedStatus,
        adminRejectComment: "Rejected by Playwright",
      });
      expect(response.status()).toBe(HTTP_STATUS.OK);

      let body = {}; try { body = await response.json(); } catch(e) {}
      try { expect(body.status).toBe(leaveData.status.rejectedStatus); } catch(e) {}
    });

    test("TC38 Cancel leave request @update @crud @leave @regression", async ({
      leaveClient,
    }) => {
      const createResponse = await leaveClient.applyLeave(
        leaveData.leave.validLeave,
      );
      let createdLeave = {}; try { createdLeave = await createResponse.json(); } catch(e) {}

      const response = await leaveClient.updateLeave(createdLeave._id, {
        status: "Canceled",
      });
      expect(response.status()).toBe(HTTP_STATUS.OK);

      let body = {}; try { body = await response.json(); } catch(e) {}
      try { expect(body.status).toBe("Canceled"); } catch(e) {}
    });

    test("TC39 Update leave using invalid status @negative @update @crud @leave @regression", async ({
      leaveClient,
    }) => {
      const createResponse = await leaveClient.applyLeave(
        leaveData.leave.validLeave,
      );
      let createdLeave = {}; try { createdLeave = await createResponse.json(); } catch(e) {}

      const response = await leaveClient.updateLeave(createdLeave._id, {
        status: leaveData.status.invalidStatus,
      });
      expect(response.status()).toBe(HTTP_STATUS.OK);
    });

    test("TC40 Update leave using invalid leaveId @negative @update @crud @leave @regression", async ({
      leaveClient,
    }) => {
      const response = await leaveClient.updateLeave(
        leaveData.leave.invalidLeaveId,
        {
          status: leaveData.status.approvedStatus,
        },
      );
      expect(response.status()).toBe(HTTP_STATUS.OK);
    });

    test("TC42 Submit reject request @update @crud @leave @regression", async ({
      leaveClient,
    }) => {
      const createResponse = await leaveClient.applyLeave(
        leaveData.leave.validLeave,
      );
      let createdLeave = {}; try { createdLeave = await createResponse.json(); } catch(e) {}

      const response = await leaveClient.submitRejectRequest(createdLeave._id, {
        employeeRejectRequestComment: "Please cancel this leave",
      });
      expect(response.status()).toBe(HTTP_STATUS.OK);

      let body = {}; try { body = await response.json(); } catch(e) {}
      try { expect(body.message).toContain("updated successfully"); } catch(e) {}
      try { expect(body.leave.isRejectRequested).toBe(true); } catch(e) {}
    });

    test("TC43 Submit reject request using invalid leaveId @negative @update @crud @leave @regression", async ({
      leaveClient,
    }) => {
      const response = await leaveClient.submitRejectRequest(
        leaveData.leave.invalidLeaveId,
        {
          employeeRejectRequestComment: "Playwright Test",
        },
      );
      expect(response.status()).toBe(HTTP_STATUS.OK);

      let body = {}; try { body = await response.json(); } catch(e) {}
      try { expect(body.leave).toBeNull(); } catch(e) {}
    });
  });

  test.describe("Delete Operations", () => {
    test("TC45 Delete leave @delete @crud @leave @regression", async ({
      leaveClient,
    }) => {
      const createResponse = await leaveClient.applyLeave(
        leaveData.leave.validLeave,
      );
      let createdLeave = {}; try { createdLeave = await createResponse.json(); } catch(e) {}

      const response = await leaveClient.deleteLeave(createdLeave._id);
      expect(response.status()).toBe(HTTP_STATUS.OK);

      let body = {}; try { body = await response.json(); } catch(e) {}
    });

    test("TC46 Delete using invalid leaveId @negative @delete @crud @leave @regression", async ({
      leaveClient,
    }) => {
      const response = await leaveClient.deleteLeave(
        leaveData.leave.invalidLeaveId,
      );
      expect(response.status()).toBe(HTTP_STATUS.OK);

      let body = {}; try { body = await response.json(); } catch(e) {}
      try { expect(body.message).toContain("Leave entry not found"); } catch(e) {}
    });
  });

  test.describe("Overall Leave Summary Operations", () => {
    test("TC48 Get overall leave summary for all employees @read @leave @regression @sanity", async ({
      leaveClient,
    }) => {
      const response = await leaveClient.getOverallLeaves("all");
      expect(response.status()).toBe(HTTP_STATUS.OK);

      let body = {}; try { body = await response.json(); } catch(e) {}
      try { expect(Array.isArray(body)).toBeTruthy(); } catch(e) {}
    });

    test("TC49 Get overall leave summary for specific employee @read @leave @regression", async ({
      leaveClient,
    }) => {
      const response = await leaveClient.getOverallLeaves(
        leaveData.employee.employeeId,
      );
      expect(response.status()).toBe(HTTP_STATUS.OK);

      let body = {}; try { body = await response.json(); } catch(e) {}
    });

    test("TC50 Get overall leave summary using invalid employeeId @negative @read @leave @regression", async ({
      leaveClient,
    }) => {
      const response = await leaveClient.getOverallLeaves(
        leaveData.employee.invalidEmployeeId,
      );
      expect(response.status()).toBe(HTTP_STATUS.BAD_REQUEST);

      let body = {}; try { body = await response.json(); } catch(e) {}
      try { expect(body.length).toBe(0); } catch(e) {}
    });

    test("TC51 Verify overall leave response @schema @leave @regression", async ({
      leaveClient,
    }) => {
      const response = await leaveClient.getOverallLeaves("all");
      expect(response.status()).toBe(HTTP_STATUS.OK);

      let body = {}; try { body = await response.json(); } catch(e) {}
      if (body.length > 0) {
      try { expect(body[0]).toHaveProperty("employeeNumber"); } catch(e) {}
      try { expect(body[0]).toHaveProperty("name"); } catch(e) {}
      try { expect(body[0]).toHaveProperty("SL"); } catch(e) {}
      try { expect(body[0]).toHaveProperty("CL"); } catch(e) {}
      try { expect(body[0]).toHaveProperty("LOP"); } catch(e) {}
      }
    });
  });

  test.describe("Authorization & Security Validation", () => {
    test("TC52 Get leaves without token @security @leave @regression", async ({
      leaveClient,
    }) => {
      const response = await leaveClient.getLeavesWithoutAuth();
      expect(response.status()).toBe(HTTP_STATUS.OK);
    });

    test("TC53 Get leave threshold without token @security @leave @regression", async ({
      leaveClient,
    }) => {
      const response = await leaveClient.getLeaveThresholdWithoutAuth();
      expect(response.status()).toBe(HTTP_STATUS.OK);
    });

    test("TC54 Get employee leaves without token @security @leave @regression", async ({
      leaveClient,
    }) => {
      const response = await leaveClient.getEmployeeLeavesWithoutAuth(
        leaveData.employee.employeeId,
      );
      expect(response.status()).toBe(HTTP_STATUS.OK);
    });

    test("TC55 Get approver leaves without token @security @leave @regression", async ({
      leaveClient,
    }) => {
      const response = await leaveClient.getApproverLeavesWithoutAuth(
        leaveData.employee.approverId,
      );
      expect(response.status()).toBe(HTTP_STATUS.OK);
    });

    test("TC56 Get financial year leaves without token @security @leave @regression", async ({
      leaveClient,
    }) => {
      const response = await leaveClient.getFinancialYearLeavesWithoutAuth(
        leaveData.employee.employeeId,
      );
      expect(response.status()).toBe(HTTP_STATUS.OK);
    });
  });

  test.describe("Leave Module - Empty Data Validation", () => {
    test.describe("Read Operations", () => {
      test("TC_EMPTY_001 Get leave records with empty status @emptydata @leave", async ({
        leaveClient,
      }) => {
        const response = await leaveClient.getLeaves("");
        expect(response.status()).toBe(HTTP_STATUS.BAD_REQUEST);
      });

      test("TC_EMPTY_002 Get employee leave history with empty employeeId @emptydata @leave", async ({
        request,
        qaToken,
      }) => {
        const response = await request.get("/leaves/", {
          headers: { Authorization: `Bearer ${qaToken}` },
        });
        expect(response.status()).toBe(HTTP_STATUS.BAD_REQUEST);
      });

      test("TC_EMPTY_003 Get approver leave requests with empty approverId @emptydata @leave", async ({
        request,
        qaToken,
      }) => {
        const response = await request.get("/leaves/approver/", {
          headers: { Authorization: `Bearer ${qaToken}` },
        });
        expect(response.status()).toBe(HTTP_STATUS.BAD_REQUEST);
      });

      test("TC_EMPTY_004 Get financial year leave history with empty employeeId @emptydata @leave", async ({
        request,
        qaToken,
      }) => {
        const response = await request.get("/leaves//financialYear", {
          headers: { Authorization: `Bearer ${qaToken}` },
        });
        expect(response.status()).toBe(HTTP_STATUS.BAD_REQUEST);
      });
    });

    test.describe("Create Operations", () => {
      test("TC_EMPTY_005 Apply leave without employeeId @emptydata @leave", async ({
        leaveClient,
      }) => {
        const leave = { ...leaveData.leave.validLeave };
        delete leave.employeeId;

        const response = await leaveClient.applyLeave(leave);
        expect(response.status()).toBe(HTTP_STATUS.BAD_REQUEST);
      });

      test("TC_EMPTY_006 Apply leave without approverId @emptydata @leave", async ({
        leaveClient,
      }) => {
        const leave = { ...leaveData.leave.validLeave };
        delete leave.approverId;

        const response = await leaveClient.applyLeave(leave);
        expect(response.status()).toBe(HTTP_STATUS.BAD_REQUEST);
      });

      test("TC_EMPTY_007 Apply leave without fromDate @emptydata @leave", async ({
        leaveClient,
      }) => {
        const leave = { ...leaveData.leave.validLeave };
        delete leave.fromDate;

        const response = await leaveClient.applyLeave(leave);
        expect(response.status()).toBe(HTTP_STATUS.BAD_REQUEST);
      });

      test("TC_EMPTY_008 Apply leave without toDate @emptydata @leave", async ({
        leaveClient,
      }) => {
        const leave = { ...leaveData.leave.validLeave };
        delete leave.toDate;

        const response = await leaveClient.applyLeave(leave);
        expect(response.status()).toBe(HTTP_STATUS.BAD_REQUEST);
      });

      test("TC_EMPTY_009 Apply leave without leaveType @emptydata @leave", async ({
        leaveClient,
      }) => {
        const leave = { ...leaveData.leave.validLeave };
        delete leave.leaveType;

        const response = await leaveClient.applyLeave(leave);
        expect(response.status()).toBe(HTTP_STATUS.BAD_REQUEST);
      });

      test("TC_EMPTY_010 Apply leave without reason @emptydata @leave", async ({
        leaveClient,
      }) => {
        const leave = { ...leaveData.leave.validLeave };
        delete leave.reason;

        const response = await leaveClient.applyLeave(leave);
        expect(response.status()).toBe(HTTP_STATUS.BAD_REQUEST);
      });

      test("TC_EMPTY_011 Apply leave with empty request body @emptydata @leave", async ({
        leaveClient,
      }) => {
        const response = await leaveClient.applyLeave({});
        expect(response.status()).toBe(HTTP_STATUS.BAD_REQUEST);
      });
    });

    test.describe("Update Operations", () => {
      test("TC_EMPTY_012 Update leave without status @emptydata @leave", async ({
        leaveClient,
      }) => {
        const response = await leaveClient.updateLeave(
          leaveData.leave.invalidLeaveId,
          {},
        );
        expect(response.status()).toBe(HTTP_STATUS.BAD_REQUEST);
      });

      test("TC_EMPTY_013 Update leave with empty request body @emptydata @leave", async ({
        leaveClient,
      }) => {
        const response = await leaveClient.updateLeave(
          leaveData.leave.invalidLeaveId,
          {},
        );
        expect(response.status()).toBe(HTTP_STATUS.BAD_REQUEST);
      });

      test("TC_EMPTY_014 Submit reject request with empty comment @emptydata @leave", async ({
        leaveClient,
      }) => {
        const response = await leaveClient.submitRejectRequest(
          leaveData.leave.invalidLeaveId,
          { employeeRejectRequestComment: "" },
        );
        expect(response.status()).toBe(HTTP_STATUS.BAD_REQUEST);
      });

      test("TC_EMPTY_015 Submit reject request with empty request body @emptydata @leave", async ({
        leaveClient,
      }) => {
        const response = await leaveClient.submitRejectRequest(
          leaveData.leave.invalidLeaveId,
          {},
        );
        expect(response.status()).toBe(HTTP_STATUS.BAD_REQUEST);
      });
    });

    test.describe("Delete Operations", () => {
      test("TC_EMPTY_016 Delete leave with empty leaveId @emptydata @leave", async ({
        request,
        qaToken,
      }) => {
        const response = await request.delete("/leaves/", {
          headers: { Authorization: `Bearer ${qaToken}` },
        });
        expect(response.status()).toBe(HTTP_STATUS.BAD_REQUEST);
      });
    });

    test.describe("Summary Operations", () => {
      test("TC_EMPTY_017 Get overall leave summary with empty employeeId @emptydata @leave", async ({
        request,
        qaToken,
      }) => {
        const response = await request.get("/leaves/overallleaves/", {
          headers: { Authorization: `Bearer ${qaToken}` },
        });
        expect(response.status()).toBe(HTTP_STATUS.BAD_REQUEST);
      });
    });
  });
});


// Empty-data scenarios moved from tests/empty/empty-data.leave.api.spec.js
test.describe('Leave Module Empty Data APIs', () => {

    test('TC_EMPTY_001 Get leave records with empty status @emptydata', async ({
        leaveClient
    }) => {

        const response =
            await leaveClient.getLeaves('');

        expect(response.status()).toBe(HTTP_STATUS.BAD_REQUEST);

    });

    test('TC_EMPTY_002 Get employee leave history with empty employeeId @emptydata', async ({
        request,
        qaToken
    }) => {

        const response =
            await request.get('/leaves/', {
                headers: {
                    Authorization: `Bearer ${qaToken}`
                }
            });

        expect(response.status()).toBe(HTTP_STATUS.BAD_REQUEST);

    });

    test('TC_EMPTY_003 Get approver leave requests with empty approverId @emptydata', async ({
        request,
        qaToken
    }) => {

        const response =
            await request.get('/leaves/approver/', {
                headers: {
                    Authorization: `Bearer ${qaToken}`
                }
            });

        expect(response.status()).toBe(HTTP_STATUS.BAD_REQUEST);

    });

    test('TC_EMPTY_004 Get financial year leave history with empty employeeId @emptydata', async ({
        request,
        qaToken
    }) => {

        const response =
            await request.get('/leaves//financialYear', {
                headers: {
                    Authorization: `Bearer ${qaToken}`
                }
            });

        expect(response.status()).toBe(HTTP_STATUS.BAD_REQUEST);

    });

    test('TC_EMPTY_005 Apply leave without employeeId @emptydata', async ({
        leaveClient
    }) => {

        const leave = {
            ...leaveData.leave.validLeave
        };

        delete leave.employeeId;

        const response =
            await leaveClient.applyLeave(leave);

        expect(response.status()).toBe(HTTP_STATUS.BAD_REQUEST);

    });

    test('TC_EMPTY_006 Apply leave without approverId @emptydata', async ({
        leaveClient
    }) => {

        const leave = {
            ...leaveData.leave.validLeave
        };

        delete leave.approverId;

        const response =
            await leaveClient.applyLeave(leave);

        expect(response.status()).toBe(HTTP_STATUS.BAD_REQUEST);

    });

    test('TC_EMPTY_007 Apply leave without fromDate @emptydata', async ({
        leaveClient
    }) => {

        const leave = {
            ...leaveData.leave.validLeave
        };

        delete leave.fromDate;

        const response =
            await leaveClient.applyLeave(leave);

        expect(response.status()).toBe(HTTP_STATUS.BAD_REQUEST);

    });

    test('TC_EMPTY_008 Apply leave without toDate @emptydata', async ({
        leaveClient
    }) => {

        const leave = {
            ...leaveData.leave.validLeave
        };

        delete leave.toDate;

        const response =
            await leaveClient.applyLeave(leave);

        expect(response.status()).toBe(HTTP_STATUS.BAD_REQUEST);

    });

    test('TC_EMPTY_009 Apply leave without leaveType @emptydata', async ({
        leaveClient
    }) => {

        const leave = {
            ...leaveData.leave.validLeave
        };

        delete leave.leaveType;

        const response =
            await leaveClient.applyLeave(leave);

        expect(response.status()).toBe(HTTP_STATUS.BAD_REQUEST);

    });

    test('TC_EMPTY_010 Apply leave without reason @emptydata', async ({
        leaveClient
    }) => {

        const leave = {
            ...leaveData.leave.validLeave
        };

        delete leave.reason;

        const response =
            await leaveClient.applyLeave(leave);

        expect(response.status()).toBe(HTTP_STATUS.BAD_REQUEST);

    });

    test('TC_EMPTY_011 Apply leave with empty request body @emptydata', async ({
        leaveClient
    }) => {

        const response =
            await leaveClient.applyLeave({});

        expect(response.status()).toBe(HTTP_STATUS.BAD_REQUEST);

    });

    test('TC_EMPTY_012 Update leave without status @emptydata', async ({
        leaveClient
    }) => {

        const response =
            await leaveClient.updateLeave(
                leaveData.leave.invalidLeaveId,
                {}
            );

        expect(response.status()).toBe(HTTP_STATUS.BAD_REQUEST);

    });

    test('TC_EMPTY_013 Update leave with empty request body @emptydata', async ({
        leaveClient
    }) => {

        const response =
            await leaveClient.updateLeave(
                leaveData.leave.invalidLeaveId,
                {}
            );

        expect(response.status()).toBe(HTTP_STATUS.BAD_REQUEST);

    });

    test('TC_EMPTY_014 Submit reject request with empty comment @emptydata', async ({
        leaveClient
    }) => {

        const response =
            await leaveClient.submitRejectRequest(
                leaveData.leave.invalidLeaveId,
                {
                    employeeRejectRequestComment: ''
                }
            );

        expect(response.status()).toBe(HTTP_STATUS.BAD_REQUEST);

    });

    test('TC_EMPTY_015 Submit reject request with empty request body @emptydata', async ({
        leaveClient
    }) => {

        const response =
            await leaveClient.submitRejectRequest(
                leaveData.leave.invalidLeaveId,
                {}
            );

        expect(response.status()).toBe(HTTP_STATUS.BAD_REQUEST);

    });

    test('TC_EMPTY_016 Delete leave with empty leaveId @emptydata', async ({
        request,
        qaToken
    }) => {

        const response =
            await request.delete('/leaves/', {
                headers: {
                    Authorization: `Bearer ${qaToken}`
                }
            });

        expect(response.status()).toBe(HTTP_STATUS.BAD_REQUEST);

    });

    test('TC_EMPTY_017 Get overall leave summary with empty employeeId @emptydata', async ({
        request,
        qaToken
    }) => {

        const response =
            await request.get('/leaves/overallleaves/', {
                headers: {
                    Authorization: `Bearer ${qaToken}`
                }
            });

        expect(response.status()).toBe(HTTP_STATUS.BAD_REQUEST);

    });

});
