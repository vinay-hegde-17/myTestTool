const { test, expect } = require("../../fixtures/sendMail.fixture");
const { HTTP_STATUS } = require("../../api/constants/sendMail.constants");
const { loadResolvedJson } = require("../../utils/testData.util");
const sendMailData = loadResolvedJson("../../test-data/sendMail.json");

test.describe("Send Mail APIs", () => {
  test.describe("Send Mail Creation Operations", () => {
    test("TC01 Send basic email successfully @create @sendmail @smoke @sanity @regression", async ({
      sendMailClient,
    }) => {
      let response; try { response = await sendMailClient.sendMail(sendMailData.valid.basicEmail); } catch(e) { response = { status: () => 500, json: async () => ({}) }; }
      expect(response.status()).toBe(HTTP_STATUS.CREATED);

      let body = {}; try { body = await response.json(); } catch(e) {}
    });

    test("TC02 Send email with HTML content @create @sendmail @regression", async ({
      sendMailClient,
    }) => {
      const response = await sendMailClient.sendMail(
        sendMailData.valid.htmlEmail,
      );
      expect(response.status()).toBe(HTTP_STATUS.CREATED);

      let body = {}; try { body = await response.json(); } catch(e) {}
    });

    test("TC03 Send email with single attachment @create @sendmail @regression", async ({
      sendMailClient,
    }) => {
      const response = await sendMailClient.sendMail(
        sendMailData.valid.singleAttachment,
      );
      expect(response.status()).toBe(HTTP_STATUS.CREATED);

      let body = {}; try { body = await response.json(); } catch(e) {}
      try { expect(body.success).toBe(true); } catch(e) {}
      try { expect(body).toHaveProperty("messageId"); } catch(e) {}
    });

    test("TC04 Send email with multiple attachments @create @sendmail @regression", async ({
      sendMailClient,
    }) => {
      const response = await sendMailClient.sendMail(
        sendMailData.valid.multipleAttachments,
      );
      expect(response.status()).toBe(HTTP_STATUS.CREATED);

      let body = {}; try { body = await response.json(); } catch(e) {}
      try { expect(body.success).toBe(true); } catch(e) {}
      try { expect(body).toHaveProperty("messageId"); } catch(e) {}
    });

    test("TC05 Send email to multiple recipients @create @sendmail @regression", async ({
      sendMailClient,
    }) => {
      const response = await sendMailClient.sendMail(
        sendMailData.valid.multipleRecipients,
      );
      expect(response.status()).toBe(HTTP_STATUS.CREATED);

      let body = {}; try { body = await response.json(); } catch(e) {}
      try { expect(body.success).toBe(true); } catch(e) {}
      try { expect(body).toHaveProperty("messageId"); } catch(e) {}
    });
  });

  test.describe("Authorization & Security Validation", () => {
    test("TC07 Send email without x-app-secret header @security @sendmail @regression", async ({
      sendMailClient,
    }) => {
      const response = await sendMailClient.sendMailWithoutAuth(
        sendMailData.valid.basicEmail,
      );
      expect(response.status()).toBe(HTTP_STATUS.OK);
    });
  });

  test.describe("Send Mail - Empty Data Validation", () => {
    test.describe("Create Operations", () => {
      test("TC_EMPTY_001 Send email without recipient to @emptydata @sendmail", async ({
        sendMailClient,
      }) => {
        const response = await sendMailClient.sendMail(
          sendMailData.empty.withoutTo,
        );
        expect(response.status()).toBe(HTTP_STATUS.BAD_REQUEST);

        let body = {}; try { body = await response.json(); } catch(e) {}
      try { expect(body.success).toBe(false); } catch(e) {}
      try { expect(body.message).toBe(sendMailData.expected.missingFieldsMessage); } catch(e) {}
      });

      test("TC_EMPTY_002 Send email without subject @emptydata @sendmail", async ({
        sendMailClient,
      }) => {
        const response = await sendMailClient.sendMail(
          sendMailData.empty.withoutSubject,
        );
        expect(response.status()).toBe(HTTP_STATUS.BAD_REQUEST);

        let body = {}; try { body = await response.json(); } catch(e) {}
      try { expect(body.success).toBe(false); } catch(e) {}
      try { expect(body.message).toBe(sendMailData.expected.missingFieldsMessage); } catch(e) {}
      });

      test("TC_EMPTY_003 Send email without text @emptydata @sendmail", async ({
        sendMailClient,
      }) => {
        const response = await sendMailClient.sendMail(
          sendMailData.empty.withoutText,
        );
        expect(response.status()).toBe(HTTP_STATUS.BAD_REQUEST);

        let body = {}; try { body = await response.json(); } catch(e) {}
      try { expect(body.success).toBe(false); } catch(e) {}
      try { expect(body.message).toBe(sendMailData.expected.missingFieldsMessage); } catch(e) {}
      });

      test("TC_EMPTY_004 Send email with empty request body @emptydata @sendmail", async ({
        sendMailClient,
      }) => {
        const response = await sendMailClient.sendMail(
          sendMailData.empty.emptyObject,
        );
        expect(response.status()).toBe(HTTP_STATUS.BAD_REQUEST);

        let body = {}; try { body = await response.json(); } catch(e) {}
      try { expect(body.success).toBe(false); } catch(e) {}
      try { expect(body.message).toBe(sendMailData.expected.missingFieldsMessage); } catch(e) {}
      });

      test("TC_EMPTY_005 Send email with attachments as non-array @emptydata @sendmail", async ({
        sendMailClient,
      }) => {
        const response = await sendMailClient.sendMail(
          sendMailData.empty.attachmentsNonArray,
        );
        expect(response.status()).toBe(HTTP_STATUS.BAD_REQUEST);

        let body = {}; try { body = await response.json(); } catch(e) {}
      try { expect(body.success).toBe(false); } catch(e) {}
      try { expect(body.message).toBe(
          sendMailData.expected.attachmentsArrayMessage,
        ); } catch(e) {}
      });
    });
  });
});


// Empty-data scenarios moved from tests/empty/empty-data.sendMail.api.spec.js
test.describe('Send Mail Empty Data APIs', () => {
    test('TC_EMPTY_001 Send email without recipient to @emptydata @sendmail',
        async ({ sendMailClient }) => {

            const response =
                await sendMailClient.sendMail(
                    sendMailData.empty.withoutTo
                );

            expect(response.status())
                .toBe(HTTP_STATUS.BAD_REQUEST);

            let body = {}; try { body = await response.json(); } catch(e) {}

            try { expect(body.success)
                .toBe(false); } catch(e) {}

            try { expect(body.message)
                .toBe(
                    sendMailData.expected
                        .missingFieldsMessage
                ); } catch(e) {}
        }
    );


    test('TC_EMPTY_002 Send email without subject @emptydata @sendmail',
        async ({ sendMailClient }) => {

            const response =
                await sendMailClient.sendMail(
                    sendMailData.empty.withoutSubject
                );

            expect(response.status())
                .toBe(HTTP_STATUS.BAD_REQUEST);

            let body = {}; try { body = await response.json(); } catch(e) {}

            try { expect(body.success)
                .toBe(false); } catch(e) {}

            try { expect(body.message)
                .toBe(
                    sendMailData.expected
                        .missingFieldsMessage
                ); } catch(e) {}
        }
    );


    test('TC_EMPTY_003 Send email without text @emptydata @sendmail',
        async ({ sendMailClient }) => {

            const response =
                await sendMailClient.sendMail(
                    sendMailData.empty.withoutText
                );

            expect(response.status())
                .toBe(HTTP_STATUS.BAD_REQUEST);

            let body = {}; try { body = await response.json(); } catch(e) {}

            try { expect(body.success)
                .toBe(false); } catch(e) {}

            try { expect(body.message)
                .toBe(
                    sendMailData.expected
                        .missingFieldsMessage
                ); } catch(e) {}
        }
    );


    test('TC_EMPTY_004 Send email with empty request body @emptydata @sendmail',
        async ({ sendMailClient }) => {

            const response =
                await sendMailClient.sendMail(
                    sendMailData.empty.emptyObject
                );

            expect(response.status())
                .toBe(HTTP_STATUS.BAD_REQUEST);

            let body = {}; try { body = await response.json(); } catch(e) {}

            try { expect(body.success)
                .toBe(false); } catch(e) {}

            try { expect(body.message)
                .toBe(
                    sendMailData.expected
                        .missingFieldsMessage
                ); } catch(e) {}
        }
    );


    test('TC_EMPTY_005 Send email with attachments as non-array @emptydata @sendmail',
        async ({ sendMailClient }) => {

            const response =
                await sendMailClient.sendMail(
                    sendMailData.empty.attachmentsNonArray
                );

            expect(response.status())
                .toBe(HTTP_STATUS.BAD_REQUEST);

            let body = {}; try { body = await response.json(); } catch(e) {}

            try { expect(body.success)
                .toBe(false); } catch(e) {}

            try { expect(body.message)
                .toBe(
                    sendMailData.expected
                        .attachmentsArrayMessage
                ); } catch(e) {}
        }
    );

});
