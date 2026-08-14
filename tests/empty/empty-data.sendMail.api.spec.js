const { test, expect } = require('../../fixtures/sendMail.fixture');
const { HTTP_STATUS } = require('../../api/constants/sendMail.constants');
const { loadResolvedJson } = require('../../utils/testData.util');
const sendMailData = loadResolvedJson('../../test-data/sendMail.json');

test.describe('Send Mail - Empty Data Validation', () => {
    test.describe('Create Operations', () => {
        test('TC_EMPTY_001 Send email without recipient to @emptydata @smoke @create', async ({ sendMailClient }) => {
            const response = await sendMailClient.sendMail(sendMailData.empty.withoutTo);
            expect(response.status()).toBe(HTTP_STATUS.BAD_REQUEST);

            const body = await response.json();
            expect(body.success).toBe(false);
            expect(body.message).toBe(sendMailData.expected.missingFieldsMessage);
        });

        test('TC_EMPTY_002 Send email without subject @emptydata @sanity @create', async ({ sendMailClient }) => {
            const response = await sendMailClient.sendMail(sendMailData.empty.withoutSubject);
            expect(response.status()).toBe(HTTP_STATUS.BAD_REQUEST);

            const body = await response.json();
            expect(body.success).toBe(false);
            expect(body.message).toBe(sendMailData.expected.missingFieldsMessage);
        });

        test('TC_EMPTY_003 Send email without text @emptydata @sanity @create', async ({ sendMailClient }) => {
            const response = await sendMailClient.sendMail(sendMailData.empty.withoutText);
            expect(response.status()).toBe(HTTP_STATUS.BAD_REQUEST);

            const body = await response.json();
            expect(body.success).toBe(false);
            expect(body.message).toBe(sendMailData.expected.missingFieldsMessage);
        });

        test('TC_EMPTY_004 Send email with empty request body @emptydata @regression @create', async ({ sendMailClient }) => {
            const response = await sendMailClient.sendMail(sendMailData.empty.emptyObject);
            expect(response.status()).toBe(HTTP_STATUS.BAD_REQUEST);

            const body = await response.json();
            expect(body.success).toBe(false);
            expect(body.message).toBe(sendMailData.expected.missingFieldsMessage);
        });

        test('TC_EMPTY_005 Send email with attachments as non-array @emptydata @regression @create', async ({ sendMailClient }) => {
            const response = await sendMailClient.sendMail(sendMailData.empty.attachmentsNonArray);
            expect(response.status()).toBe(HTTP_STATUS.BAD_REQUEST);

            const body = await response.json();
            expect(body.success).toBe(false);
            expect(body.message).toBe(sendMailData.expected.attachmentsArrayMessage);
        });
    });
});