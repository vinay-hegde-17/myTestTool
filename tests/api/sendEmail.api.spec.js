const { test, expect } = require('../../fixtures/sendEmail.fixture');
const { HTTP_STATUS } = require('../../api/constants/sendEmail.constants');
const { loadResolvedJson } = require('../../utils/testData.util');
const sendEmailData = loadResolvedJson('../../test-data/sendEmail.json');

test.describe('Send Email APIs', () => {

    test.describe('Create Operations', () => {
        test('TC01 should send leave request email successfully @read @regression', async ({ sendEmailClient }) => {
            const response = await sendEmailClient.sendLeaveEmail(sendEmailData.valid.leaveEmail);

            expect(response.status()).toBe(HTTP_STATUS.OK);

            const body = await response.json();
            expect(body.message).toBe(sendEmailData.expected.leaveEmailMessage);
        });

        test('TC02 should return server error when sending leave email for a non-existing employee @read @regression', async ({ sendEmailClient }) => {
            const payload = {
                ...sendEmailData.valid.leaveEmail,
                employeeId: sendEmailData.invalid.nonExistingEmployeeId
            };

            const response = await sendEmailClient.sendLeaveEmail(payload);
            expect(response.status()).toBe(HTTP_STATUS.INTERNAL_SERVER_ERROR);
        });

        test('TC03 should send timesheet approval request successfully @read @regression', async ({ sendEmailClient }) => {
            const response = await sendEmailClient.requestTimesheetApproval(sendEmailData.valid.timesheetApproval);

            expect(response.status()).toBe(HTTP_STATUS.OK);

            const body = await response.json();
            expect(body.message).toBe(sendEmailData.expected.timesheetRequestedMessage);
        });
    });

    test.describe('Update Operations', () => {
        test('TC04 should verify timesheet approval request status message @read @regression', async ({ sendEmailClient }) => {
            const response = await sendEmailClient.requestTimesheetApproval(sendEmailData.valid.timesheetApproval);

            expect(response.status()).toBe(HTTP_STATUS.OK);

            const body = await response.json();
            expect(body.message).toBe(sendEmailData.expected.timesheetRequestedMessage);

            /*
             * API response does not return the updated
             * TimeTracker approvalRequest value.
             *
             * This test currently verifies the successful
             * requested-status flow.
             */
        });

        test('TC05 should update timesheet status without sending email @update @regression', async ({ sendEmailClient }) => {
            const response = await sendEmailClient.requestTimesheetApproval(sendEmailData.valid.timesheetStatusUpdate);

            expect(response.status()).toBe(HTTP_STATUS.OK);

            const body = await response.json();
            expect(body.message).toBe(sendEmailData.expected.timesheetUpdatedMessage);
        });
    });
});
