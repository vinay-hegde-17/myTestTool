const { test, expect } = require('../../fixtures/sendMail.fixture');
const { HTTP_STATUS } = require('../../api/constants/sendMail.constants');
const sendMailData =  require('../../test-data/sendMail.json');

test.describe('Send Mail Functional APIs', () => {

    test(
        'TC01 Send email successfully @create @sendmail @regression',
        async ({ sendMailClient }) => {

            const response =
                await sendMailClient.sendMail(
                    sendMailData.valid.basicEmail
                );

            expect(response.status())
                .toBe(HTTP_STATUS.OK);

            const body =
                await response.json();

            expect(body.success)
                .toBe(
                    sendMailData.expected.success
                );

            expect(body.message)
                .toBe(
                    sendMailData.expected.successMessage
                );

            expect(body)
                .toHaveProperty('messageId');

            expect(typeof body.messageId)
                .toBe('string');
        }
    );


    test(
        'TC02 Send email with HTML content @create @sendmail @regression',
        async ({ sendMailClient }) => {

            const response =
                await sendMailClient.sendMail(
                    sendMailData.valid.htmlEmail
                );

            expect(response.status())
                .toBe(HTTP_STATUS.OK);

            const body =
                await response.json();

            expect(body.success)
                .toBe(true);

            expect(body.message)
                .toBe(
                    sendMailData.expected.successMessage
                );

            expect(body)
                .toHaveProperty('messageId');
        }
    );


    test(
        'TC03 Send email with single attachment @create @sendmail @regression',
        async ({ sendMailClient }) => {

            const response =
                await sendMailClient.sendMail(
                    sendMailData.valid.singleAttachment
                );

            expect(response.status())
                .toBe(HTTP_STATUS.OK);

            const body =
                await response.json();

            expect(body.success)
                .toBe(true);

            expect(body)
                .toHaveProperty('messageId');
        }
    );


    test(
        'TC04 Send email with multiple attachments @create @sendmail @regression',
        async ({ sendMailClient }) => {

            const response =
                await sendMailClient.sendMail(
                    sendMailData.valid.multipleAttachments
                );

            expect(response.status())
                .toBe(HTTP_STATUS.OK);

            const body =
                await response.json();

            expect(body.success)
                .toBe(true);

            expect(body)
                .toHaveProperty('messageId');
        }
    );


    test(
        'TC05 Send email to multiple recipients @create @sendmail @regression',
        async ({ sendMailClient }) => {

            const response =
                await sendMailClient.sendMail(
                    sendMailData.valid.multipleRecipients
                );

            expect(response.status())
                .toBe(HTTP_STATUS.OK);

            const body =
                await response.json();

            expect(body.success)
                .toBe(true);

            expect(body)
                .toHaveProperty('messageId');
        }
    );


    test(
        'TC06 Send email without attachments @create @sendmail @regression',
        async ({ sendMailClient }) => {

            const response =
                await sendMailClient.sendMail(
                    sendMailData.valid.withoutAttachments
                );

            expect(response.status())
                .toBe(HTTP_STATUS.OK);

            const body =
                await response.json();

            expect(body.success)
                .toBe(true);

            expect(body.message)
                .toBe(
                    sendMailData.expected.successMessage
                );
        }
    );


    test(
        'TC07 Send email without Authorization @negative @sendmail @regression',
        async ({ sendMailClient }) => {

            const response =
                await sendMailClient.sendMailWithoutAuth(
                    sendMailData.valid.basicEmail
                );

            expect(response.status())
                .toBe(HTTP_STATUS.UNAUTHORIZED);
        }
    );

});
