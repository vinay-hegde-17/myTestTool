const { test, expect } = require('../../fixtures/approveLeave.fixture');
const { HTTP_STATUS } = require('../../api/constants/approveLeave.constants');
const approveLeaveData = require('../../test-data/approveLeave.json');

test.describe('Approve Leave Functional APIs', () => {

    test('TC01 Approve leave successfully @approveleave @regression @smoke',
        async ({ approveLeaveClient }) => {

            const response =
                await approveLeaveClient.updateLeaveStatus(
                    approveLeaveData.valid.leaveId,
                    approveLeaveData.valid.approveStatus
                );

            expect(response.status())
                .toBe(HTTP_STATUS.OK);

            const body =
                await response.text();

            expect(body)
                .toContain(
                    approveLeaveData.expected.approvedMessage
                );
        }
    );


    test('TC02 Reject leave successfully @approveleave @regression @smoke',
        async ({ approveLeaveClient }) => {

            const response =
                await approveLeaveClient.updateLeaveStatus(
                    approveLeaveData.valid.rejectLeaveId,
                    approveLeaveData.valid.rejectStatus
                );

            expect(response.status())
                .toBe(HTTP_STATUS.OK);

            const body =
                await response.text();

            expect(body)
                .toContain(
                    approveLeaveData.expected.rejectedMessage
                );
        }
    );


    test('TC03 Verify approved leave status response @approveleave @regression',
        async ({ approveLeaveClient }) => {

            const response =
                await approveLeaveClient.updateLeaveStatus(
                    approveLeaveData.valid.approveLeaveId,
                    approveLeaveData.valid.approveStatus
                );

            expect(response.status())
                .toBe(HTTP_STATUS.OK);

            const body =
                await response.text();

            expect(body)
                .toContain(
                    approveLeaveData.expected.approvedMessage
                );
        }
    );


    test('TC04 Verify rejected leave status response @approveleave @regression',
        async ({ approveLeaveClient }) => {

            const response =
                await approveLeaveClient.updateLeaveStatus(
                    approveLeaveData.valid.rejectLeaveId,
                    approveLeaveData.valid.rejectStatus
                );

            expect(response.status())
                .toBe(HTTP_STATUS.OK);

            const body =
                await response.text();

            expect(body)
                .toContain(
                    approveLeaveData.expected.rejectedMessage
                );
        }
    );


    test('TC05 Verify already processed leave returns 400 @approveleave @regression',
        async ({ approveLeaveClient }) => {

            const response =
                await approveLeaveClient.updateLeaveStatus(
                    approveLeaveData.processed.leaveId,
                    approveLeaveData.valid.approveStatus
                );

            expect(response.status())
                .toBe(HTTP_STATUS.BAD_REQUEST);

            const body =
                await response.text();

            expect(body)
                .toContain(
                    approveLeaveData.processed.expectedMessage
                );
        }
    );


    test('TC06 Update using non-existing leaveId @approveleave @regression',
        async ({ approveLeaveClient }) => {

            const response =
                await approveLeaveClient.updateLeaveStatus(
                    approveLeaveData.invalid.nonExistingLeaveId,
                    approveLeaveData.valid.approveStatus
                );

            expect(response.status())
                .toBe(HTTP_STATUS.NOT_FOUND);

            const body =
                await response.text();

            expect(body)
                .toBe(
                    approveLeaveData.expected.notFoundMessage
                );
        }
    );

}
);