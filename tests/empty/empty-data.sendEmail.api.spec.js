const { test, expect } = require('../../fixtures/sendEmail.fixture');
const { HTTP_STATUS } = require('../../api/constants/sendEmail.constants');
const { loadResolvedJson } = require('../../utils/testData.util');
const sendEmailData = loadResolvedJson('../../test-data/sendEmail.json');

test.describe('Send Email - Empty Data Validation', () => {
    test.describe('Create Operations', () => {
        test('TC_EMPTY_001 Send leave email with empty request body @emptydata @smoke @create', async ({ sendEmailClient }) => {
            const response = await sendEmailClient.sendLeaveEmail(sendEmailData.empty.emptyObject);
            expect(response.status()).toBe(HTTP_STATUS.INTERNAL_SERVER_ERROR);
        });

        test('TC_EMPTY_002 Send timesheet approval with empty request body @emptydata @regression @create', async ({ sendEmailClient }) => {
            const response = await sendEmailClient.requestTimesheetApproval(sendEmailData.empty.emptyObject);
            expect(response.status()).toBe(HTTP_STATUS.INTERNAL_SERVER_ERROR);
        });
    });
});