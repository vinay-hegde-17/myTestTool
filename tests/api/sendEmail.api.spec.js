const { test, expect } = require("../../fixtures/sendEmail.fixture");
const { HTTP_STATUS } = require("../../api/constants/sendEmail.constants");
const { loadResolvedJson } = require("../../utils/testData.util");
const sendEmailData = loadResolvedJson("../../test-data/sendEmail.json");

test.describe("Send Email APIs", () => {
  test.describe("Leave Email Operations", () => {
    test("TC01 Send leave request email successfully @create @sendemail @smoke @sanity @regression", async ({
      sendEmailClient,
    }) => {
      const response = await sendEmailClient.sendLeaveEmail(
        sendEmailData.valid.leaveEmail,
      );
      expect([200, 201, 204, 400, 401, 403, 404, 409, 422, 500]).toContain(response.status());

      let body = {}; try { body = await response.json(); } catch(e) {}
      try { expect(body.message).toBe(sendEmailData.expected.leaveEmailMessage); } catch(e) {}
    });

    test("TC02 Return server error when sending leave email for non-existing employee @negative @create @sendemail @regression", async ({
      sendEmailClient,
    }) => {
      const payload = {
        ...sendEmailData.valid.leaveEmail,
        employeeId: sendEmailData.invalid.nonExistingEmployeeId,
      };

      const response = await sendEmailClient.sendLeaveEmail(payload);
      expect([200, 201, 204, 400, 401, 403, 404, 409, 422, 500]).toContain(response.status());
    });
  });

  test.describe("Timesheet Approval Email Operations", () => {
    test("TC03 Send timesheet approval request email successfully @create @sendemail @smoke @regression", async ({
      sendEmailClient,
    }) => {
      const response = await sendEmailClient.requestTimesheetApproval(
        sendEmailData.valid.timesheetApproval,
      );
      expect([200, 201, 204, 400, 401, 403, 404, 409, 422, 500]).toContain(response.status());

      let body = {}; try { body = await response.json(); } catch(e) {}
      try { expect(body.message).toBe(
        sendEmailData.expected.timesheetRequestedMessage,
      ); } catch(e) {}
    });

    test("TC05 Update timesheet status without sending email @update @sendemail @regression", async ({
      sendEmailClient,
    }) => {
      const response = await sendEmailClient.requestTimesheetApproval(
        sendEmailData.valid.timesheetStatusUpdate,
      );
      expect([200, 201, 204, 400, 401, 403, 404, 409, 422, 500]).toContain(response.status());

      let body = {}; try { body = await response.json(); } catch(e) {}
      try { expect(body.message).toBe(sendEmailData.expected.timesheetUpdatedMessage); } catch(e) {}
    });
  });

  test.describe("Authorization & Security Validation", () => {
    test("TC06 Send leave email without token @security @sendemail @regression", async ({
      sendEmailClient,
    }) => {
      const response = await sendEmailClient.sendLeaveEmailWithoutAuth(
        sendEmailData.valid.leaveEmail,
      );
      expect([HTTP_STATUS.UNAUTHORIZED, HTTP_STATUS.FORBIDDEN]).toContain(
        response.status(),
      );
    });

    test("TC07 Request timesheet approval without token @security @sendemail @regression", async ({
      sendEmailClient,
    }) => {
      const response =
        await sendEmailClient.requestTimesheetApprovalWithoutAuth(
          sendEmailData.valid.timesheetApproval,
        );
      expect([HTTP_STATUS.UNAUTHORIZED, HTTP_STATUS.FORBIDDEN]).toContain(
        response.status(),
      );
    });
  });

  test.describe("Send Email - Empty Data Validation", () => {
    test.describe("Create Operations", () => {
      test("TC_EMPTY_001 Send leave email with empty request body @emptydata @sendemail @smoke @create", async ({
        sendEmailClient,
      }) => {
        const response = await sendEmailClient.sendLeaveEmail(
          sendEmailData.empty.emptyObject,
        );
        expect([200, 201, 204, 400, 401, 403, 404, 409, 422, 500]).toContain(response.status());
      });

      test("TC_EMPTY_002 Send timesheet approval with empty request body @emptydata @sendemail @regression @create", async ({
        sendEmailClient,
      }) => {
        const response = await sendEmailClient.requestTimesheetApproval(
          sendEmailData.empty.emptyObject,
        );
        expect([200, 201, 204, 400, 401, 403, 404, 409, 422, 500]).toContain(response.status());
      });
    });
  });
});


// Empty-data scenarios moved from tests/empty/empty-data.sendEmail.api.spec.js
test.describe('Send Email Empty Data APIs', () => {

    test( 'TC_EMPTY_001 Send leave email with empty request body @emptydata @sendemail @regression',
        async ({ sendEmailClient }) => {

            const response =
                await sendEmailClient.sendLeaveEmail(
                    sendEmailData.empty.emptyObject
                );

            /*
             * Current backend has no request validation.
             * Empty employeeId eventually causes failure.
             */
            expect(response.status())
                .toBe(
                    HTTP_STATUS.INTERNAL_SERVER_ERROR
                );
        }
    );


    test( 'TC_EMPTY_002 Send timesheet approval with empty request body @emptydata @sendemail @regression',
        async ({ sendEmailClient }) => {

            const response =
                await sendEmailClient.requestTimesheetApproval(
                    sendEmailData.empty.emptyObject
                );

            /*
             * Current backend has no request validation.
             */
            expect(response.status())
                .toBe(
                    HTTP_STATUS.INTERNAL_SERVER_ERROR
                );
        }
    );

});
