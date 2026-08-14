const { test, expect } = require('../../fixtures/approveLeave.fixture');
const { HTTP_STATUS } = require('../../api/constants/approveLeave.constants');
const { loadResolvedJson } = require('../../utils/testData.util');
const approveLeaveData = loadResolvedJson('../../test-data/approveLeave.json');

test.describe('Approve Leave APIs', () => {

    test.describe('Update Operations', () => {
        test('TC01 should approve leave successfully @read @regression', async ({ approveLeaveClient }) => {
            const response = await approveLeaveClient.updateLeaveStatus(
                approveLeaveData.valid.leaveId,
                approveLeaveData.valid.approveStatus
            );

            expect(response.status()).toBe(HTTP_STATUS.OK);

            const body = await response.text();
            expect(body).toContain(approveLeaveData.expected.approvedMessage);
        });

        test('TC02 should reject leave successfully @read @regression', async ({ approveLeaveClient }) => {
            const response = await approveLeaveClient.updateLeaveStatus(
                approveLeaveData.valid.rejectLeaveId,
                approveLeaveData.valid.rejectStatus
            );

            expect(response.status()).toBe(HTTP_STATUS.OK);

            const body = await response.text();
            expect(body).toContain(approveLeaveData.expected.rejectedMessage);
        });

        test('TC03 should return approved message for approval flow @read @regression', async ({ approveLeaveClient }) => {
            const response = await approveLeaveClient.updateLeaveStatus(
                approveLeaveData.valid.approveLeaveId,
                approveLeaveData.valid.approveStatus
            );

            expect(response.status()).toBe(HTTP_STATUS.OK);

            const body = await response.text();
            expect(body).toContain(approveLeaveData.expected.approvedMessage);
        });

        test('TC04 should return rejected message for rejection flow @read @regression', async ({ approveLeaveClient }) => {
            const response = await approveLeaveClient.updateLeaveStatus(
                approveLeaveData.valid.rejectLeaveId,
                approveLeaveData.valid.rejectStatus
            );

            expect(response.status()).toBe(HTTP_STATUS.OK);

            const body = await response.text();
            expect(body).toContain(approveLeaveData.expected.rejectedMessage);
        });
    });

    test.describe('Validation and Error Handling', () => {
        test('TC05 should reject already processed leave request @read @regression', async ({ approveLeaveClient }) => {
            const response = await approveLeaveClient.updateLeaveStatus(
                approveLeaveData.processed.leaveId,
                approveLeaveData.valid.approveStatus
            );

            expect(response.status()).toBe(HTTP_STATUS.BAD_REQUEST);

            const body = await response.text();
            expect(body).toContain(approveLeaveData.processed.expectedMessage);
        });

        test('TC06 should return not found for non-existing leave id @read @regression', async ({ approveLeaveClient }) => {
            const response = await approveLeaveClient.updateLeaveStatus(
                approveLeaveData.invalid.nonExistingLeaveId,
                approveLeaveData.valid.approveStatus
            );

            expect(response.status()).toBe(HTTP_STATUS.NOT_FOUND);

            const body = await response.text();
            expect(body).toBe(approveLeaveData.expected.notFoundMessage);
        });
    });
});