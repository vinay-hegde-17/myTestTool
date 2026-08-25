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

      const body = await response.json();
      expect(body.error).toBe(authData.messages.invalidGoogleAccessToken);
    });

    test("TC02 Generate JWT with empty body payload @negative @auth @regression", async ({
      authClient,
    }) => {
      const response = await authClient.generateJwtTokenWithBody({});
      expect(response.status()).toBe(HTTP_STATUS.UNAUTHORIZED);
    });

    test("TC03 Generate JWT without request body @negative @auth @regression", async ({
      authClient,
    }) => {
      const response = await authClient.generateJwtTokenWithBody();
      expect(response.status()).toBe(HTTP_STATUS.UNAUTHORIZED);
    });

    test("TC04 Generate JWT with empty accessToken string @negative @auth @regression", async ({
      authClient,
    }) => {
      const response = await authClient.generateJwtToken("");
      expect(response.status()).toBe(HTTP_STATUS.UNAUTHORIZED);
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
      expect(response.status()).toBe(HTTP_STATUS.OK);

      const body = await response.json();
      expect(body.token).toBeTruthy();
    });

    test("TC07 Generate QA token for unauthorized email @negative @auth @regression", async ({
      authClient,
    }) => {
      const response = await authClient.generateQaToken(authData.invalidEmail);
      expect(response.status()).toBe(HTTP_STATUS.FORBIDDEN);
    });

    test("TC08 Generate QA token without email argument @negative @auth @regression", async ({
      authClient,
    }) => {
      const response = await authClient.generateQaToken();
      expect(response.status()).toBe(HTTP_STATUS.FORBIDDEN);
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
      expect(response.status()).toBe(HTTP_STATUS.OK);

      const body = await response.json();
      expect(body.valid).toBe(true);
      expect(body.user.email).toBe(qaEmail);
    });

    test("TC14 Validate invalid JWT token string @negative @auth @regression", async ({
      authClient,
    }) => {
      const response = await authClient.validateToken(authData.invalidJwtToken);
      expect(response.status()).toBe(HTTP_STATUS.UNAUTHORIZED);
    });

    test("TC15 Validate token without token argument @negative @auth @regression", async ({
      authClient,
    }) => {
      const response = await authClient.validateToken();
      expect(response.status()).toBe(HTTP_STATUS.UNAUTHORIZED);
    });

    test("TC16 Validate malformed JWT token string @negative @auth @regression", async ({
      authClient,
    }) => {
      const response = await authClient.validateToken(
        authData.malformedJwtToken,
      );
      expect(response.status()).toBe(HTTP_STATUS.UNAUTHORIZED);
    });

    test("TC17 Validate token with empty Bearer header prefix @negative @auth @regression", async ({
      authClient,
    }) => {
      const response = await authClient.validateTokenWithHeader("Bearer ");
      expect(response.status()).toBe(HTTP_STATUS.UNAUTHORIZED);
    });
  });

  test.describe("Auth Module - Empty Data Validation", () => {
    test.describe("Create Operations", () => {
      test("TC_EMPTY_001 Generate JWT without accessToken @emptydata @smoke @auth", async ({
        authClient,
      }) => {
        const response = await authClient.generateJwtTokenWithBody({});
        expect(response.status()).toBe(HTTP_STATUS.UNAUTHORIZED);
      });

      test("TC_EMPTY_002 Generate JWT with empty request body @emptydata @sanity @auth", async ({
        authClient,
      }) => {
        const response = await authClient.generateJwtTokenWithBody();
        expect(response.status()).toBe(HTTP_STATUS.UNAUTHORIZED);
      });

      test("TC_EMPTY_003 Generate QA token without email @emptydata @sanity @auth", async ({
        authClient,
      }) => {
        const response = await authClient.generateQaTokenWithBody({});
        expect(response.status()).toBe(HTTP_STATUS.FORBIDDEN);
      });

      test("TC_EMPTY_004 Generate QA token with empty email @emptydata @regression @auth", async ({
        authClient,
      }) => {
        const response = await authClient.generateQaToken("");
        expect(response.status()).toBe(HTTP_STATUS.FORBIDDEN);
      });

      test("TC_EMPTY_005 Generate QA token with empty request body @emptydata @regression @auth", async ({
        authClient,
      }) => {
        const response = await authClient.generateQaTokenWithBody();
        expect(response.status()).toBe(HTTP_STATUS.FORBIDDEN);
      });
    });

    test.describe("Validation Operations", () => {
      test("TC_EMPTY_006 Validate token with empty Authorization header @emptydata @regression @auth", async ({
        authClient,
      }) => {
        const response = await authClient.validateTokenWithHeader("");
        expect(response.status()).toBe(HTTP_STATUS.UNAUTHORIZED);
      });
    });
  });
});
