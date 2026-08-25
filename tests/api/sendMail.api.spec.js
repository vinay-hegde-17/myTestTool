const { test, expect } = require("../../fixtures/sendMail.fixture");
const { HTTP_STATUS } = require("../../api/constants/sendMail.constants");
const { loadResolvedJson } = require("../../utils/testData.util");
const sendMailData = loadResolvedJson("../../test-data/sendMail.json");

test.describe("Send Mail APIs", () => {
  test.describe("Send Mail Creation Operations", () => {
    test("TC01 Send basic email successfully @create @sendmail @smoke @sanity @regression", async ({
      sendMailClient,
    }) => {
      const response = await sendMailClient.sendMail(
        sendMailData.valid.basicEmail,
      );
      expect(response.status()).toBe(HTTP_STATUS.OK);

      const body = await response.json();
      expect(body.success).toBe(sendMailData.expected.success);
      expect(body.message).toBe(sendMailData.expected.successMessage);
      expect(body).toHaveProperty("messageId");
      expect(typeof body.messageId).toBe("string");
    });

    test("TC02 Send email with HTML content @create @sendmail @regression", async ({
      sendMailClient,
    }) => {
      const response = await sendMailClient.sendMail(
        sendMailData.valid.htmlEmail,
      );
      expect(response.status()).toBe(HTTP_STATUS.OK);

      const body = await response.json();
      expect(body.success).toBe(true);
      expect(body.message).toBe(sendMailData.expected.successMessage);
      expect(body).toHaveProperty("messageId");
    });

    test("TC03 Send email with single attachment @create @sendmail @regression", async ({
      sendMailClient,
    }) => {
      const response = await sendMailClient.sendMail(
        sendMailData.valid.singleAttachment,
      );
      expect(response.status()).toBe(HTTP_STATUS.OK);

      const body = await response.json();
      expect(body.success).toBe(true);
      expect(body).toHaveProperty("messageId");
    });

    test("TC04 Send email with multiple attachments @create @sendmail @regression", async ({
      sendMailClient,
    }) => {
      const response = await sendMailClient.sendMail(
        sendMailData.valid.multipleAttachments,
      );
      expect(response.status()).toBe(HTTP_STATUS.OK);

      const body = await response.json();
      expect(body.success).toBe(true);
      expect(body).toHaveProperty("messageId");
    });

    test("TC05 Send email to multiple recipients @create @sendmail @regression", async ({
      sendMailClient,
    }) => {
      const response = await sendMailClient.sendMail(
        sendMailData.valid.multipleRecipients,
      );
      expect(response.status()).toBe(HTTP_STATUS.OK);

      const body = await response.json();
      expect(body.success).toBe(true);
      expect(body).toHaveProperty("messageId");
    });
  });

  test.describe("Authorization & Security Validation", () => {
    test("TC07 Send email without x-app-secret header @security @sendmail @regression", async ({
      sendMailClient,
    }) => {
      const response = await sendMailClient.sendMailWithoutAuth(
        sendMailData.valid.basicEmail,
      );
      expect([
        HTTP_STATUS.UNAUTHORIZED,
        HTTP_STATUS.FORBIDDEN,
        HTTP_STATUS.BAD_REQUEST,
      ]).toContain(response.status());
    });
  });

  test.describe("Send Mail - Empty Data Validation", () => {
    test.describe("Create Operations", () => {
      test("TC_EMPTY_001 Send email without recipient to @emptydata @sendmail @smoke @create", async ({
        sendMailClient,
      }) => {
        const response = await sendMailClient.sendMail(
          sendMailData.empty.withoutTo,
        );
        expect(response.status()).toBe(HTTP_STATUS.BAD_REQUEST);

        const body = await response.json();
        expect(body.success).toBe(false);
        expect(body.message).toBe(sendMailData.expected.missingFieldsMessage);
      });

      test("TC_EMPTY_002 Send email without subject @emptydata @sendmail @sanity @create", async ({
        sendMailClient,
      }) => {
        const response = await sendMailClient.sendMail(
          sendMailData.empty.withoutSubject,
        );
        expect(response.status()).toBe(HTTP_STATUS.BAD_REQUEST);

        const body = await response.json();
        expect(body.success).toBe(false);
        expect(body.message).toBe(sendMailData.expected.missingFieldsMessage);
      });

      test("TC_EMPTY_003 Send email without text @emptydata @sendmail @sanity @create", async ({
        sendMailClient,
      }) => {
        const response = await sendMailClient.sendMail(
          sendMailData.empty.withoutText,
        );
        expect(response.status()).toBe(HTTP_STATUS.BAD_REQUEST);

        const body = await response.json();
        expect(body.success).toBe(false);
        expect(body.message).toBe(sendMailData.expected.missingFieldsMessage);
      });

      test("TC_EMPTY_004 Send email with empty request body @emptydata @sendmail @regression @create", async ({
        sendMailClient,
      }) => {
        const response = await sendMailClient.sendMail(
          sendMailData.empty.emptyObject,
        );
        expect(response.status()).toBe(HTTP_STATUS.BAD_REQUEST);

        const body = await response.json();
        expect(body.success).toBe(false);
        expect(body.message).toBe(sendMailData.expected.missingFieldsMessage);
      });

      test("TC_EMPTY_005 Send email with attachments as non-array @emptydata @sendmail @regression @create", async ({
        sendMailClient,
      }) => {
        const response = await sendMailClient.sendMail(
          sendMailData.empty.attachmentsNonArray,
        );
        expect(response.status()).toBe(HTTP_STATUS.BAD_REQUEST);

        const body = await response.json();
        expect(body.success).toBe(false);
        expect(body.message).toBe(
          sendMailData.expected.attachmentsArrayMessage,
        );
      });
    });
  });
});
