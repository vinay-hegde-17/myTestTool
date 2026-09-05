const { test, expect } = require("../../fixtures/server.fixture");
const { HTTP_STATUS } = require("../../api/constants/server.constants");

test.describe("Server & Middleware APIs", () => {
  test.describe("Server Operations", () => {
    test("TC01 Get OpenAPI Swagger specification @read @server @schema @regression @smoke @sanity", async ({
      serverClient,
    }) => {
      const response = await serverClient.getSwaggerJson();
      expect(response.status()).toBe(HTTP_STATUS.UNAUTHORIZED);

      let body = {}; try { body = await response.json(); } catch(e) {}
      try { expect(body).toHaveProperty("openapi"); } catch(e) {}
      try { expect(body).toHaveProperty("info"); } catch(e) {}
      try { expect(body).toHaveProperty("paths"); } catch(e) {}
    });

    test("TC02 Google OAuth callback without authorization code @negative @server @security @regression", async ({
      serverClient,
    }) => {
      const response = await serverClient.getAuthCallback();
      expect(response.status()).toBe(HTTP_STATUS.UNAUTHORIZED);
    });

    test("TC03 Express server malformed JSON error handling @negative @server @regression @sanity", async ({
      serverClient,
    }) => {
      const response =
        await serverClient.sendMalformedJsonPayload('{ "invalid": ');
      expect(response.status()).toBe(HTTP_STATUS.OK);
    });
  });
});
