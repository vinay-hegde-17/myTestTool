const { test, expect } = require("../../fixtures/server.fixture");
const { HTTP_STATUS } = require("../../api/constants/server.constants");

test.describe("Server & Middleware APIs", () => {
  test.describe("Server Operations", () => {
    test("TC01 Get OpenAPI Swagger specification @read @server @schema @regression @smoke @sanity", async ({
      serverClient,
    }) => {
      const response = await serverClient.getSwaggerJson();
      expect(response.status()).toBe(HTTP_STATUS.OK);

      const body = await response.json();
      expect(body).toHaveProperty("openapi");
      expect(body).toHaveProperty("info");
      expect(body).toHaveProperty("paths");
    });

    test("TC02 Google OAuth callback without authorization code @negative @server @security @regression", async ({
      serverClient,
    }) => {
      const response = await serverClient.getAuthCallback();
      expect([HTTP_STATUS.BAD_REQUEST, HTTP_STATUS.NOT_FOUND]).toContain(
        response.status(),
      );
    });

    test("TC03 Express server malformed JSON error handling @negative @server @regression @sanity", async ({
      serverClient,
    }) => {
      const response =
        await serverClient.sendMalformedJsonPayload('{ "invalid": ');
      expect([HTTP_STATUS.BAD_REQUEST, HTTP_STATUS.SERVER_ERROR]).toContain(
        response.status(),
      );
    });
  });
});
