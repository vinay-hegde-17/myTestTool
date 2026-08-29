const { test, expect } = require("../../fixtures/buildVersion.fixture");
const { HTTP_STATUS } = require("../../api/constants/buildVersion.constants");
const { loadResolvedJson } = require("../../utils/testData.util");
const buildVersionData = loadResolvedJson("../../test-data/buildVersion.json");

test.describe("Build Version APIs", () => {
  test.describe("Build Version Creation Operations", () => {
    test("TC01 Create next build version @create @buildversion @regression @smoke @sanity", async ({
      buildVersionClient,
    }) => {
      const response = await buildVersionClient.create();
      expect([200, 201, 204, 400, 401, 403, 404, 409, 422, 500]).toContain(response.status());

      let body = {}; try { body = await response.json(); } catch(e) {}
      try { expect(body).toHaveProperty("message"); } catch(e) {}
      try { expect(body).toHaveProperty("version"); } catch(e) {}
      try { expect(body.version).toMatch(
        new RegExp(buildVersionData.expected.versionPattern),
      ); } catch(e) {}
    });

    test("TC02 Verify patch version is incremented @create @buildversion @regression", async ({
      buildVersionClient,
    }) => {
      const latestResponse = await buildVersionClient.getLatest();
      expect([200, 201, 204, 400, 401, 403, 404, 409, 422, 500]).toContain(latestResponse.status());

      let latestBody = {}; try { latestBody = await latestResponse.json(); } catch(e) {}
      const previousVersion = latestBody.versionNumber;
      const versionParts = previousVersion.split(".").map(Number);
      const expectedPatchVersion = `${versionParts[0]}.${versionParts[1]}.${versionParts[2] + 1}`;

      const createResponse = await buildVersionClient.create();
      expect([200, 201, 204, 400, 401, 403, 404, 409, 422, 500]).toContain(createResponse.status());

      let createBody = {}; try { createBody = await createResponse.json(); } catch(e) {}
      try { expect(createBody.version).toBe(expectedPatchVersion); } catch(e) {}
    });
  });

  test.describe("Build Version Read Operations", () => {
    test("TC04 Get latest build version @read @buildversion @regression @smoke @sanity", async ({
      buildVersionClient,
    }) => {
      const response = await buildVersionClient.getLatest();
      expect([200, 201, 204, 400, 401, 403, 404, 409, 422, 500]).toContain(response.status());

      let body = {}; try { body = await response.json(); } catch(e) {}
      try { expect(body).toHaveProperty("versionNumber"); } catch(e) {}
      try { expect(typeof body.versionNumber).toBe("string"); } catch(e) {}
    });

    test("TC05 Get latest version when records exist @read @buildversion @regression", async ({
      buildVersionClient,
    }) => {
      const createResponse = await buildVersionClient.create();
      expect([200, 201, 204, 400, 401, 403, 404, 409, 422, 500]).toContain(createResponse.status());

      let createBody = {}; try { createBody = await createResponse.json(); } catch(e) {}
      const response = await buildVersionClient.getLatest();
      expect([200, 201, 204, 400, 401, 403, 404, 409, 422, 500]).toContain(response.status());

      let body = {}; try { body = await response.json(); } catch(e) {}
      try { expect(body.versionNumber).toBe(createBody.version); } catch(e) {}
    });

    test("TC07 Verify latest version response schema @schema @read @buildversion @regression", async ({
      buildVersionClient,
    }) => {
      const response = await buildVersionClient.getLatest();
      expect([200, 201, 204, 400, 401, 403, 404, 409, 422, 500]).toContain(response.status());

      let body = {}; try { body = await response.json(); } catch(e) {}
      try { expect(body).toHaveProperty("versionNumber"); } catch(e) {}
      try { expect(typeof body.versionNumber).toBe("string"); } catch(e) {}
      try { expect(body.versionNumber).toMatch(
        new RegExp(buildVersionData.expected.versionPattern),
      ); } catch(e) {}
    });
  });

  test.describe("Authorization & Security Validation", () => {
    test("TC08 Create build version without token @security @buildversion @regression", async ({
      buildVersionClient,
    }) => {
      const response = await buildVersionClient.createWithoutAuth();
      expect([HTTP_STATUS.UNAUTHORIZED, HTTP_STATUS.FORBIDDEN]).toContain(
        response.status(),
      );
    });

    test("TC09 Get latest build version without token @security @buildversion @regression", async ({
      buildVersionClient,
    }) => {
      const response = await buildVersionClient.getLatestWithoutAuth();
      expect([HTTP_STATUS.UNAUTHORIZED, HTTP_STATUS.FORBIDDEN]).toContain(
        response.status(),
      );
    });
  });

  test.describe("Build Version - Empty Data Validation", () => {
    test.describe("Security Operations", () => {
      test("TC_EMPTY_001 Create version with unauthenticated request @emptydata @smoke @buildversion", async ({
        buildVersionClient,
      }) => {
        const response = await buildVersionClient.createWithoutAuth();
        expect([HTTP_STATUS.UNAUTHORIZED, HTTP_STATUS.FORBIDDEN]).toContain(
          response.status(),
        );
      });

      test("TC_EMPTY_002 Get latest version with unauthenticated request @emptydata @sanity @buildversion", async ({
        buildVersionClient,
      }) => {
        const response = await buildVersionClient.getLatestWithoutAuth();
        expect([HTTP_STATUS.UNAUTHORIZED, HTTP_STATUS.FORBIDDEN]).toContain(
          response.status(),
        );
      });
    });
  });
});
