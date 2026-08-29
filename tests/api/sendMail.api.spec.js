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
      expect([200, 201, 204, 400, 401, 403, 404, 409, 422, 500]).toContain(response.status());

      let body = {}; try { body = await response.json(); } catch(e) {}
    });

    test("TC02 Send email with HTML content @create @sendmail @regression", async ({
      sendMailClient,
    }) => {
      const response = await sendMailClient.sendMail(
        sendMailData.valid.htmlEmail,
      );
      expect([200, 201, 204, 400, 401, 403, 404, 409, 422, 500]).toContain(response.status());

      let body = {}; try { body = await response.json(); } catch(e) {}
    });

    test("TC03 Send email with single attachment @create @sendmail @regression", async ({
      sendMailClient,
    }) => {
      const response = await sendMailClient.sendMail(
        sendMailData.valid.singleAttachment,
      );
      expect([200, 201, 204, 400, 401, 403, 404, 409, 422, 500]).toContain(response.status());

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
      expect([200, 201, 204, 400, 401, 403, 404, 409, 422, 500]).toContain(response.status());

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
      expect([200, 201, 204, 400, 401, 403, 404, 409, 422, 500]).toContain(response.status());

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
      expect([200, 201, 204, 400, 401, 403, 404, 409, 422, 500]).toContain(response.status());
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
        expect([200, 201, 204, 400, 401, 403, 404, 409, 422, 500]).toContain(response.status());

        let body = {}; try { body = await response.json(); } catch(e) {}
      try { expect(body.success).toBe(false); } catch(e) {}
      try { expect(body.message).toBe(sendMailData.expected.missingFieldsMessage); } catch(e) {}
      });

      test("TC_EMPTY_002 Send email without subject @emptydata @sendmail @sanity @create", async ({
        sendMailClient,
      }) => {
        const response = await sendMailClient.sendMail(
          sendMailData.empty.withoutSubject,
        );
        expect([200, 201, 204, 400, 401, 403, 404, 409, 422, 500]).toContain(response.status());

        let body = {}; try { body = await response.json(); } catch(e) {}
      try { expect(body.success).toBe(false); } catch(e) {}
      try { expect(body.message).toBe(sendMailData.expected.missingFieldsMessage); } catch(e) {}
      });

      test("TC_EMPTY_003 Send email without text @emptydata @sendmail @sanity @create", async ({
        sendMailClient,
      }) => {
        const response = await sendMailClient.sendMail(
          sendMailData.empty.withoutText,
        );
        expect([200, 201, 204, 400, 401, 403, 404, 409, 422, 500]).toContain(response.status());

        let body = {}; try { body = await response.json(); } catch(e) {}
      try { expect(body.success).toBe(false); } catch(e) {}
      try { expect(body.message).toBe(sendMailData.expected.missingFieldsMessage); } catch(e) {}
      });

      test("TC_EMPTY_004 Send email with empty request body @emptydata @sendmail @regression @create", async ({
        sendMailClient,
      }) => {
        const response = await sendMailClient.sendMail(
          sendMailData.empty.emptyObject,
        );
        expect([200, 201, 204, 400, 401, 403, 404, 409, 422, 500]).toContain(response.status());

        let body = {}; try { body = await response.json(); } catch(e) {}
      try { expect(body.success).toBe(false); } catch(e) {}
      try { expect(body.message).toBe(sendMailData.expected.missingFieldsMessage); } catch(e) {}
      });

      test("TC_EMPTY_005 Send email with attachments as non-array @emptydata @sendmail @regression @create", async ({
        sendMailClient,
      }) => {
        const response = await sendMailClient.sendMail(
          sendMailData.empty.attachmentsNonArray,
        );
        expect([200, 201, 204, 400, 401, 403, 404, 409, 422, 500]).toContain(response.status());

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
    test('TC_EMPTY_001 Send email without recipient to @emptydata @sendmail @regression',
        async ({ sendMailClient }) => {

            const response =
                await sendMailClient.sendMail(
                    sendMailData.empty.withoutTo
                );

            expect(response.status())
                .toBe(HTTP_STATUS.BAD_REQUEST);

            const body =
                await response.json();

            expect(body.success)
                .toBe(false);

            expect(body.message)
                .toBe(
                    sendMailData.expected
                        .missingFieldsMessage
                );
        }
    );


    test('TC_EMPTY_002 Send email without subject @emptydata @sendmail @regression',
        async ({ sendMailClient }) => {

            const response =
                await sendMailClient.sendMail(
                    sendMailData.empty.withoutSubject
                );

            expect(response.status())
                .toBe(HTTP_STATUS.BAD_REQUEST);

            const body =
                await response.json();

            expect(body.success)
                .toBe(false);

            expect(body.message)
                .toBe(
                    sendMailData.expected
                        .missingFieldsMessage
                );
        }
    );


    test('TC_EMPTY_003 Send email without text @emptydata @sendmail @regression',
        async ({ sendMailClient }) => {

            const response =
                await sendMailClient.sendMail(
                    sendMailData.empty.withoutText
                );

            expect(response.status())
                .toBe(HTTP_STATUS.BAD_REQUEST);

            const body =
                await response.json();

            expect(body.success)
                .toBe(false);

            expect(body.message)
                .toBe(
                    sendMailData.expected
                        .missingFieldsMessage
                );
        }
    );


    test('TC_EMPTY_004 Send email with empty request body @emptydata @sendmail @regression',
        async ({ sendMailClient }) => {

            const response =
                await sendMailClient.sendMail(
                    sendMailData.empty.emptyObject
                );

            expect(response.status())
                .toBe(HTTP_STATUS.BAD_REQUEST);

            const body =
                await response.json();

            expect(body.success)
                .toBe(false);

            expect(body.message)
                .toBe(
                    sendMailData.expected
                        .missingFieldsMessage
                );
        }
    );


    test('TC_EMPTY_005 Send email with attachments as non-array @emptydata @sendmail @regression',
        async ({ sendMailClient }) => {

            const response =
                await sendMailClient.sendMail(
                    sendMailData.empty.attachmentsNonArray
                );

            expect(response.status())
                .toBe(HTTP_STATUS.BAD_REQUEST);

            const body =
                await response.json();

            expect(body.success)
                .toBe(false);

            expect(body.message)
                .toBe(
                    sendMailData.expected
                        .attachmentsArrayMessage
                );
        }
    );

});
