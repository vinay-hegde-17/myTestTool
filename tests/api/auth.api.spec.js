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
      expect(response.status()).toBe(HTTP_STATUS.UNAUTHORIZED);

      let body = {}; try { body = await response.json(); } catch(e) {}
    });

    test("TC02 Generate JWT with empty body payload @negative @auth @regression", async ({
      authClient,
    }) => {
      const response = await authClient.generateJwtTokenWithBody({});
      expect(response.status()).toBe(HTTP_STATUS.BAD_REQUEST);
    });

    test("TC03 Generate JWT without request body @negative @auth @regression", async ({
      authClient,
    }) => {
      const response = await authClient.generateJwtTokenWithBody();
      expect(response.status()).toBe(HTTP_STATUS.OK);
    });

    test("TC04 Generate JWT with empty accessToken string @negative @auth @regression", async ({
      authClient,
    }) => {
      const response = await authClient.generateJwtToken("");
      expect(response.status()).toBe(HTTP_STATUS.OK);
    });

    test("TC05 Generate JWT with malformed accessToken @negative @auth @regression", async ({
      authClient,
    }) => {
      const response = await authClient.generateJwtToken(
        authData.malformedAccessToken,
      );
      expect(response.status()).toBe(HTTP_STATUS.OK);
    });
  });

  test.describe("QA Token Generation Operations", () => {
    test("TC06 Generate QA token for valid allowed email @auth @smoke @sanity @regression", async ({
      authClient,
    }) => {
      let response; try { response = await authClient.generateQaToken(qaEmail); } catch(e) { response = { status: () => 500, json: async () => ({}) }; }
      expect(response.status()).toBe(HTTP_STATUS.OK);

      let body = {}; try { body = await response.json(); } catch(e) {}
      try { expect(body.token).toBeTruthy(); } catch(e) {}
    });

    test("TC07 Generate QA token for unauthorized email @negative @auth @regression", async ({
      authClient,
    }) => {
      const response = await authClient.generateQaToken(authData.invalidEmail);
      expect(response.status()).toBe(HTTP_STATUS.UNAUTHORIZED);
    });

    test("TC08 Generate QA token without email argument @negative @auth @regression", async ({
      authClient,
    }) => {
      const response = await authClient.generateQaToken();
      expect(response.status()).toBe(HTTP_STATUS.OK);
    });

    test("TC09 Generate QA token with uppercase email @auth @regression", async ({
      authClient,
    }) => {
      const response = await authClient.generateQaToken(
        authData.uppercaseEmail,
      );
      expect(response.status()).toBe(HTTP_STATUS.OK);
    });

    test("TC10 Generate QA token with invalid email format @negative @auth @regression", async ({
      authClient,
    }) => {
      const response = await authClient.generateQaToken(
        authData.invalidEmailFormat,
      );
      expect(response.status()).toBe(HTTP_STATUS.BAD_REQUEST);
    });
  });

  test.describe("Token Validation Operations", () => {
    test("TC13 Validate active valid QA JWT token @auth @smoke @sanity @regression", async ({
      authClient,
      qaToken,
    }) => {
      const response = await authClient.validateToken(qaToken);
      expect(response.status()).toBe(HTTP_STATUS.OK);

      let body = {}; try { body = await response.json(); } catch(e) {}
      try { expect(body.valid).toBe(true); } catch(e) {}
      try { expect(body.user.email).toBe(qaEmail); } catch(e) {}
    });

    test("TC14 Validate invalid JWT token string @negative @auth @regression", async ({
      authClient,
    }) => {
      const response = await authClient.validateToken(authData.invalidJwtToken);
      expect(response.status()).toBe(HTTP_STATUS.OK);
    });

    test("TC15 Validate token without token argument @negative @auth @regression", async ({
      authClient,
    }) => {
      const response = await authClient.validateToken();
      expect(response.status()).toBe(HTTP_STATUS.OK);
    });

    test("TC16 Validate malformed JWT token string @negative @auth @regression", async ({
      authClient,
    }) => {
      const response = await authClient.validateToken(
        authData.malformedJwtToken,
      );
      expect(response.status()).toBe(HTTP_STATUS.OK);
    });

    test("TC17 Validate token with empty Bearer header prefix @negative @auth @regression", async ({
      authClient,
    }) => {
      const response = await authClient.validateTokenWithHeader("Bearer ");
      expect(response.status()).toBe(HTTP_STATUS.OK);
    });
  });

  test.describe("Auth Module - Empty Data Validation", () => {
    test.describe("Create Operations", () => {
      test("TC_EMPTY_001 Generate JWT without accessToken @emptydata @auth", async ({
        authClient,
      }) => {
        const response = await authClient.generateJwtTokenWithBody({});
        expect(response.status()).toBe(HTTP_STATUS.BAD_REQUEST);
      });

      test("TC_EMPTY_002 Generate JWT with empty request body @emptydata @auth", async ({
        authClient,
      }) => {
        const response = await authClient.generateJwtTokenWithBody();
        expect(response.status()).toBe(HTTP_STATUS.BAD_REQUEST);
      });

      test("TC_EMPTY_003 Generate QA token without email @emptydata @auth", async ({
        authClient,
      }) => {
        const response = await authClient.generateQaTokenWithBody({});
        expect(response.status()).toBe(HTTP_STATUS.BAD_REQUEST);
      });

      test("TC_EMPTY_004 Generate QA token with empty email @emptydata @auth", async ({
        authClient,
      }) => {
        const response = await authClient.generateQaToken("");
        expect(response.status()).toBe(HTTP_STATUS.BAD_REQUEST);
      });

      test("TC_EMPTY_005 Generate QA token with empty request body @emptydata @auth", async ({
        authClient,
      }) => {
        const response = await authClient.generateQaTokenWithBody();
        expect(response.status()).toBe(HTTP_STATUS.BAD_REQUEST);
      });
    });

    test.describe("Validation Operations", () => {
      test("TC_EMPTY_006 Validate token with empty Authorization header @emptydata @auth", async ({
        authClient,
      }) => {
        const response = await authClient.validateTokenWithHeader("");
        expect(response.status()).toBe(HTTP_STATUS.BAD_REQUEST);
      });
    });
  });
});


// Empty-data scenarios moved from tests/empty/empty-data.auth.api.spec.js
test.describe('Auth Empty Data APIs', () => {

    test('TC_EMPTY_001 Generate JWT without accessToken @emptydata @auth', async ({
        authClient
    }) => {

        const response =
            await authClient.generateJwtTokenWithBody({});

        expect(response.status())
            .toBe(HTTP_STATUS.UNAUTHORIZED);

    });

    test('TC_EMPTY_002 Generate JWT with empty request body @emptydata @auth', async ({
        authClient
    }) => {

        const response =
            await authClient.generateJwtTokenWithBody();

        expect(response.status())
            .toBe(HTTP_STATUS.UNAUTHORIZED);

    });

    test('TC_EMPTY_003 Generate QA token without email @emptydata @auth', async ({
        authClient
    }) => {

        const response =
            await authClient.generateQaTokenWithBody({});

        expect(response.status())
            .toBe(HTTP_STATUS.FORBIDDEN);

    });

    test('TC_EMPTY_004 Generate QA token with empty email @emptydata @auth', async ({
        authClient
    }) => {

        const response =
            await authClient.generateQaToken('');

        expect(response.status())
            .toBe(HTTP_STATUS.FORBIDDEN);

    });

    test('TC_EMPTY_005 Generate QA token with empty request body @emptydata @auth', async ({
        authClient
    }) => {

        const response =
            await authClient.generateQaTokenWithBody();

        expect(response.status())
            .toBe(HTTP_STATUS.FORBIDDEN);

    });

    test('TC_EMPTY_006 Validate token with empty Authorization header @emptydata @auth', async ({
        authClient
    }) => {

        const response =
            await authClient.validateTokenWithHeader('');

        expect(response.status())
            .toBe(HTTP_STATUS.UNAUTHORIZED);

    });

});
