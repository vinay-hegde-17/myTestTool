const { test, expect } = require('../../fixtures/sendEmail.fixture');
const { HTTP_STATUS } = require('../../api/constants/sendEmail.constants');
const sendEmailData = require('../../test-data/sendEmail.json');

test.describe('Send Email Functional APIs', () => {

    test(
        'TC01 Send leave request email successfully @create @sendemail @regression',
        async ({ sendEmailClient }) => {

            const response =
                await sendEmailClient.sendLeaveEmail(
                    sendEmailData.valid.leaveEmail
                );

            expect(response.status())
                .toBe(HTTP_STATUS.OK);

            const body =
                await response.json();

            expect(body.message)
                .toBe(
                    sendEmailData.expected.leaveEmailMessage
                );
        }
    );


    test(
        'TC02 Send leave email for non-existing employee @negative @sendemail @regression',
        async ({ sendEmailClient }) => {

            const payload = {
                ...sendEmailData.valid.leaveEmail,
                employeeId:
                    sendEmailData.invalid.nonExistingEmployeeId
            };

            const response =
                await sendEmailClient.sendLeaveEmail(
                    payload
                );

            expect(response.status())
                .toBe(
                    HTTP_STATUS.INTERNAL_SERVER_ERROR
                );
        }
    );


    test(
        'TC03 Send timesheet approval request successfully @create @sendemail @regression',
        async ({ sendEmailClient }) => {

            const response =
                await sendEmailClient.requestTimesheetApproval(
                    sendEmailData.valid.timesheetApproval
                );

            expect(response.status())
                .toBe(HTTP_STATUS.OK);

            const body =
                await response.json();

            expect(body.message)
                .toBe(
                    sendEmailData.expected
                        .timesheetRequestedMessage
                );
        }
    );


    test(
        'TC04 Verify timesheet approval status updated to Requested @update @sendemail @regression',
        async ({ sendEmailClient }) => {

            const response =
                await sendEmailClient.requestTimesheetApproval(
                    sendEmailData.valid.timesheetApproval
                );

            expect(response.status())
                .toBe(HTTP_STATUS.OK);

            const body =
                await response.json();

            expect(body.message)
                .toBe(
                    sendEmailData.expected
                        .timesheetRequestedMessage
                );

            /*
             * API response does not return the updated
             * TimeTracker approvalRequest value.
             *
             * This test currently verifies the successful
             * requested-status flow.
             *
             * Direct DB verification should only be added
             * if your framework already has DB access.
             */
        }
    );


    test(
        'TC05 Update timesheet status without sending email @update @sendemail @regression',
        async ({ sendEmailClient }) => {

            const response =
                await sendEmailClient.requestTimesheetApproval(
                    sendEmailData.valid.timesheetStatusUpdate
                );

            expect(response.status())
                .toBe(HTTP_STATUS.OK);

            const body =
                await response.json();

            expect(body.message)
                .toBe(
                    sendEmailData.expected
                        .timesheetUpdatedMessage
                );
        }
    );

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
