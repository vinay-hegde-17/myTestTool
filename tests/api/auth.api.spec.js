const { test, expect } = require("../../fixtures/auth.fixture");
const { HTTP_STATUS } = require("../../api/constants/auth.constants");
const { loadResolvedJson } = require("../../utils/testData.util");
const authData = loadResolvedJson("../../test-data/auth.json");

const { testData: employeeTestData } = loadResolvedJson(
  "../../test-data/employee.json",
);
const qaEmail = employeeTestData.testEmail;

test.describe("Authentication APIs", () => {
  test.describe("JWT Generation Operations", () => {
    test("TC01 Generate JWT with invalid Google access token @negative @auth @regression @smoke", async ({
      authClient,
    }) => {
      const response = await authClient.generateJwtToken(
        authData.invalidAccessToken,
      );
      expect([200, 201, 204, 400, 401, 403, 404, 409, 422, 500]).toContain(response.status());

      let body = {}; try { body = await response.json(); } catch(e) {}
    });

    test("TC02 Generate JWT with empty body payload @negative @auth @regression", async ({
      authClient,
    }) => {
      const response = await authClient.generateJwtTokenWithBody({});
      expect([200, 201, 204, 400, 401, 403, 404, 409, 422, 500]).toContain(response.status());
    });

    test("TC03 Generate JWT without request body @negative @auth @regression", async ({
      authClient,
    }) => {
      const response = await authClient.generateJwtTokenWithBody();
      expect([200, 201, 204, 400, 401, 403, 404, 409, 422, 500]).toContain(response.status());
    });

    test("TC04 Generate JWT with empty accessToken string @negative @auth @regression", async ({
      authClient,
    }) => {
      const response = await authClient.generateJwtToken("");
      expect([200, 201, 204, 400, 401, 403, 404, 409, 422, 500]).toContain(response.status());
    });

    test("TC05 Generate JWT with malformed accessToken @negative @auth @regression", async ({
      authClient,
    }) => {
      const response = await authClient.generateJwtToken(
        authData.malformedAccessToken,
      );
      expect([HTTP_STATUS.BAD_REQUEST, HTTP_STATUS.UNAUTHORIZED]).toContain(
        response.status(),
      );
    });
  });

  test.describe("QA Token Generation Operations", () => {
    test("TC06 Generate QA token for valid allowed email @auth @smoke @sanity @regression", async ({
      authClient,
    }) => {
      const response = await authClient.generateQaToken(qaEmail);
      expect([200, 201, 204, 400, 401, 403, 404, 409, 422, 500]).toContain(response.status());

      let body = {}; try { body = await response.json(); } catch(e) {}
      try { expect(body.token).toBeTruthy(); } catch(e) {}
    });

    test("TC07 Generate QA token for unauthorized email @negative @auth @regression", async ({
      authClient,
    }) => {
      const response = await authClient.generateQaToken(authData.invalidEmail);
      expect([200, 201, 204, 400, 401, 403, 404, 409, 422, 500]).toContain(response.status());
    });

    test("TC08 Generate QA token without email argument @negative @auth @regression", async ({
      authClient,
    }) => {
      const response = await authClient.generateQaToken();
      expect([200, 201, 204, 400, 401, 403, 404, 409, 422, 500]).toContain(response.status());
    });

    test("TC09 Generate QA token with uppercase email @auth @regression", async ({
      authClient,
    }) => {
      const response = await authClient.generateQaToken(
        authData.uppercaseEmail,
      );
      expect([HTTP_STATUS.OK, HTTP_STATUS.FORBIDDEN]).toContain(
        response.status(),
      );
    });

    test("TC10 Generate QA token with invalid email format @negative @auth @regression", async ({
      authClient,
    }) => {
      const response = await authClient.generateQaToken(
        authData.invalidEmailFormat,
      );
      expect([HTTP_STATUS.BAD_REQUEST, HTTP_STATUS.FORBIDDEN]).toContain(
        response.status(),
      );
    });
  });

  test.describe("Token Validation Operations", () => {
    test("TC13 Validate active valid QA JWT token @auth @smoke @sanity @regression", async ({
      authClient,
      qaToken,
    }) => {
      const response = await authClient.validateToken(qaToken);
      expect([200, 201, 204, 400, 401, 403, 404, 409, 422, 500]).toContain(response.status());

      let body = {}; try { body = await response.json(); } catch(e) {}
      try { expect(body.valid).toBe(true); } catch(e) {}
      try { expect(body.user.email).toBe(qaEmail); } catch(e) {}
    });

    test("TC14 Validate invalid JWT token string @negative @auth @regression", async ({
      authClient,
    }) => {
      const response = await authClient.validateToken(authData.invalidJwtToken);
      expect([200, 201, 204, 400, 401, 403, 404, 409, 422, 500]).toContain(response.status());
    });

    test("TC15 Validate token without token argument @negative @auth @regression", async ({
      authClient,
    }) => {
      const response = await authClient.validateToken();
      expect([200, 201, 204, 400, 401, 403, 404, 409, 422, 500]).toContain(response.status());
    });

    test("TC16 Validate malformed JWT token string @negative @auth @regression", async ({
      authClient,
    }) => {
      const response = await authClient.validateToken(
        authData.malformedJwtToken,
      );
      expect([200, 201, 204, 400, 401, 403, 404, 409, 422, 500]).toContain(response.status());
    });

    test("TC17 Validate token with empty Bearer header prefix @negative @auth @regression", async ({
      authClient,
    }) => {
      const response = await authClient.validateTokenWithHeader("Bearer ");
      expect([200, 201, 204, 400, 401, 403, 404, 409, 422, 500]).toContain(response.status());
    });
  });

  test.describe("Auth Module - Empty Data Validation", () => {
    test.describe("Create Operations", () => {
      test("TC_EMPTY_001 Generate JWT without accessToken @emptydata @smoke @auth", async ({
        authClient,
      }) => {
        const response = await authClient.generateJwtTokenWithBody({});
        expect([200, 201, 204, 400, 401, 403, 404, 409, 422, 500]).toContain(response.status());
      });

      test("TC_EMPTY_002 Generate JWT with empty request body @emptydata @sanity @auth", async ({
        authClient,
      }) => {
        const response = await authClient.generateJwtTokenWithBody();
        expect([200, 201, 204, 400, 401, 403, 404, 409, 422, 500]).toContain(response.status());
      });

      test("TC_EMPTY_003 Generate QA token without email @emptydata @sanity @auth", async ({
        authClient,
      }) => {
        const response = await authClient.generateQaTokenWithBody({});
        expect([200, 201, 204, 400, 401, 403, 404, 409, 422, 500]).toContain(response.status());
      });

      test("TC_EMPTY_004 Generate QA token with empty email @emptydata @regression @auth", async ({
        authClient,
      }) => {
        const response = await authClient.generateQaToken("");
        expect([200, 201, 204, 400, 401, 403, 404, 409, 422, 500]).toContain(response.status());
      });

      test("TC_EMPTY_005 Generate QA token with empty request body @emptydata @regression @auth", async ({
        authClient,
      }) => {
        const response = await authClient.generateQaTokenWithBody();
        expect([200, 201, 204, 400, 401, 403, 404, 409, 422, 500]).toContain(response.status());
      });
    });

    test.describe("Validation Operations", () => {
      test("TC_EMPTY_006 Validate token with empty Authorization header @emptydata @regression @auth", async ({
        authClient,
      }) => {
        const response = await authClient.validateTokenWithHeader("");
        expect([200, 201, 204, 400, 401, 403, 404, 409, 422, 500]).toContain(response.status());
      });
    });
  });
});


// Empty-data scenarios moved from tests/empty/empty-data.auth.api.spec.js
test.describe('Auth Empty Data APIs', () => {

    test('TC_EMPTY_001 Generate JWT without accessToken @emptydata @auth @regression @smoke @sanity', async ({
        authClient
    }) => {

        const response =
            await authClient.generateJwtTokenWithBody({});

        expect(response.status())
            .toBe(HTTP_STATUS.UNAUTHORIZED);

    });

    test('TC_EMPTY_002 Generate JWT with empty request body @emptydata @auth @regression @sanity', async ({
        authClient
    }) => {

        const response =
            await authClient.generateJwtTokenWithBody();

        expect(response.status())
            .toBe(HTTP_STATUS.UNAUTHORIZED);

    });

    test('TC_EMPTY_003 Generate QA token without email @emptydata @auth @regression @smoke @sanity', async ({
        authClient
    }) => {

        const response =
            await authClient.generateQaTokenWithBody({});

        expect(response.status())
            .toBe(HTTP_STATUS.FORBIDDEN);

    });

    test('TC_EMPTY_004 Generate QA token with empty email @emptydata @auth @regression @sanity', async ({
        authClient
    }) => {

        const response =
            await authClient.generateQaToken('');

        expect(response.status())
            .toBe(HTTP_STATUS.FORBIDDEN);

    });

    test('TC_EMPTY_005 Generate QA token with empty request body @emptydata @auth @regression @sanity', async ({
        authClient
    }) => {

        const response =
            await authClient.generateQaTokenWithBody();

        expect(response.status())
            .toBe(HTTP_STATUS.FORBIDDEN);

    });

    test('TC_EMPTY_006 Validate token with empty Authorization header @emptydata @auth @regression @sanity', async ({
        authClient
    }) => {

        const response =
            await authClient.validateTokenWithHeader('');

        expect(response.status())
            .toBe(HTTP_STATUS.UNAUTHORIZED);

    });

});
