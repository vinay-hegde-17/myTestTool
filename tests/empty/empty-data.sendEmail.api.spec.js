const { test, expect } = require('../../fixtures/sendEmail.fixture');
const { HTTP_STATUS } = require('../../api/constants/sendEmail.constants');
const sendEmailData = require('../../test-data/sendEmail.json');

test.describe('Send Email Empty Data APIs', () => {

    test(
        'TC06 Send leave email with empty request body @emptydata @sendemail @regression',
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


    test(
        'TC07 Send timesheet approval with empty request body @emptydata @sendemail @regression',
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