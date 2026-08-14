const { test, expect } = require('../../fixtures/sendMail.fixture');
const { HTTP_STATUS } = require('../../api/constants/sendMail.constants');
const { loadResolvedJson } = require('../../utils/testData.util');
const sendMailData = loadResolvedJson('../../test-data/sendMail.json');

test.describe('Send Mail APIs', () => {

    test.describe('Create Operations', () => {
        test('TC01 should send email successfully @read @regression', async ({ sendMailClient }) => {
            const response = await sendMailClient.sendMail(sendMailData.valid.basicEmail);

            expect(response.status()).toBe(HTTP_STATUS.OK);

            const body = await response.json();
            expect(body.success).toBe(sendMailData.expected.success);
            expect(body.message).toBe(sendMailData.expected.successMessage);
            expect(body).toHaveProperty('messageId');
            expect(typeof body.messageId).toBe('string');
        });

        test('TC02 should send email with HTML content @read @regression', async ({ sendMailClient }) => {
            const response = await sendMailClient.sendMail(sendMailData.valid.htmlEmail);

            expect(response.status()).toBe(HTTP_STATUS.OK);

            const body = await response.json();
            expect(body.success).toBe(true);
            expect(body.message).toBe(sendMailData.expected.successMessage);
            expect(body).toHaveProperty('messageId');
        });

        test('TC03 should send email with single attachment @read @regression', async ({ sendMailClient }) => {
            const response = await sendMailClient.sendMail(sendMailData.valid.singleAttachment);

            expect(response.status()).toBe(HTTP_STATUS.OK);

            const body = await response.json();
            expect(body.success).toBe(true);
            expect(body).toHaveProperty('messageId');
        });

        test('TC04 should send email with multiple attachments @read @regression', async ({ sendMailClient }) => {
            const response = await sendMailClient.sendMail(sendMailData.valid.multipleAttachments);

            expect(response.status()).toBe(HTTP_STATUS.OK);

            const body = await response.json();
            expect(body.success).toBe(true);
            expect(body).toHaveProperty('messageId');
        });

        test('TC05 should send email to multiple recipients @read @regression', async ({ sendMailClient }) => {
            const response = await sendMailClient.sendMail(sendMailData.valid.multipleRecipients);

            expect(response.status()).toBe(HTTP_STATUS.OK);

            const body = await response.json();
            expect(body.success).toBe(true);
            expect(body).toHaveProperty('messageId');
        });

        test('TC06 should send email without attachments @read @regression', async ({ sendMailClient }) => {
            const response = await sendMailClient.sendMail(sendMailData.valid.withoutAttachments);

            expect(response.status()).toBe(HTTP_STATUS.OK);

            const body = await response.json();
            expect(body.success).toBe(true);
            expect(body.message).toBe(sendMailData.expected.successMessage);
        });
    });

    test.describe('Authorization Validation', () => {

    });
});
