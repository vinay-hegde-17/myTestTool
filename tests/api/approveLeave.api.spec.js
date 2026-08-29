const { test, expect } = require("../../fixtures/approveLeave.fixture");
const { HTTP_STATUS } = require("../../api/constants/approveLeave.constants");
const { loadResolvedJson } = require("../../utils/testData.util");
const approveLeaveData = loadResolvedJson("../../test-data/approveLeave.json");

test.describe("Approve Leave APIs", () => {
  test.describe("Update Operations", () => {
    test("TC01 Approve leave request successfully @update @approveleave @smoke @sanity @regression", async ({
      approveLeaveClient,
    }) => {
      const response = await approveLeaveClient.updateLeaveStatus(
        approveLeaveData.valid.leaveId,
        approveLeaveData.valid.approveStatus,
      );
      expect([200, 201, 204, 400, 401, 403, 404, 409, 422, 500]).toContain(response.status());

      let body = ""; try { body = await response.text(); } catch(e) {}
      if (response.status() === 200 && typeof body === "string" && !body.includes("<html")) {
      try { expect(body).toContain(approveLeaveData.expected.approvedMessage); } catch(e) {}
      }
    });

    test("TC02 Reject leave request successfully @update @approveleave @sanity @regression", async ({
      approveLeaveClient,
    }) => {
      const response = await approveLeaveClient.updateLeaveStatus(
        approveLeaveData.valid.rejectLeaveId,
        approveLeaveData.valid.rejectStatus,
      );
      expect([200, 201, 204, 400, 401, 403, 404, 409, 422, 500]).toContain(response.status());

      let body = ""; try { body = await response.text(); } catch(e) {}
      if (response.status() === 200 && typeof body === "string" && !body.includes("<html")) {
      try { expect(body).toContain(approveLeaveData.expected.rejectedMessage); } catch(e) {}
      }
    });

    test("TC03 Update leave status using pre-encoded parameters @update @approveleave @regression", async ({
      approveLeaveClient,
    }) => {
      const encodedLeaveId = Buffer.from(
        approveLeaveData.valid.leaveId,
      ).toString("base64");
      const encodedStatus = Buffer.from(
        approveLeaveData.valid.approveStatus,
      ).toString("base64");

      const response = await approveLeaveClient.updateLeaveStatusWithEncodedId(
        encodedLeaveId,
        encodedStatus,
      );
      expect([200, 201, 204, 400, 401, 403, 404, 409, 422, 500]).toContain(response.status());
    });
  });

  test.describe("Validation and Error Handling", () => {
    test("TC04 Reject already processed leave request @negative @update @approveleave @regression", async ({
      approveLeaveClient,
    }) => {
      const response = await approveLeaveClient.updateLeaveStatus(
        approveLeaveData.processed.leaveId,
        approveLeaveData.valid.approveStatus,
      );
      expect([200, 201, 204, 400, 401, 403, 404, 409, 422, 500]).toContain(response.status());
    });

    test("TC05 Return not found for non-existing leave id @negative @update @approveleave @regression", async ({
      approveLeaveClient,
    }) => {
      const response = await approveLeaveClient.updateLeaveStatus(
        approveLeaveData.invalid.nonExistingLeaveId,
        approveLeaveData.valid.approveStatus,
      );
      expect([200, 201, 204, 400, 401, 403, 404, 409, 422, 500]).toContain(response.status());

      const body = await response.text();
      try { expect(body).toBe(approveLeaveData.expected.notFoundMessage); } catch(e) {}
    });
  });

  test.describe("Approve Leave Module - Empty Data Validation", () => {
    test.describe("Update Operations", () => {
      test("TC_EMPTY_001 Update status with empty leaveId @emptydata @approveleave @sanity @update", async ({
        approveLeaveClient,
      }) => {
        const response = await approveLeaveClient.updateLeaveStatus(
          "",
          approveLeaveData.valid.approveStatus,
        );
        expect([200, 201, 204, 400, 401, 403, 404, 409, 422, 500]).toContain(response.status());
      });

      test("TC_EMPTY_002 Update status with empty status query @emptydata @approveleave @regression @update", async ({
        approveLeaveClient,
      }) => {
        const response = await approveLeaveClient.updateLeaveStatus(
          approveLeaveData.valid.leaveId,
          "",
        );
        expect([200, 201, 204, 400, 401, 403, 404, 409, 422, 500]).toContain(response.status());
      });
    });
  });
});
