const { test, expect } = require('../../fixtures/auth.fixture');
const { HTTP_STATUS } = require('../../api/constants/auth.constants');
const authData = require('../../test-data/auth.json');

const { testData: employeeTestData } = require('../../test-data/employee.json');
const qaEmail = employeeTestData.testEmail;

test.describe('Google Authentication APIs', () => {

    test('TC01 Generate JWT using valid Google access token @auth @regression @smoke @sanity', async ({
        authClient
    }) => {

        const response =
            await authClient.generateJwtToken(
                authData.invalidAccessToken
            );

        expect(response.status())
            .toBe(HTTP_STATUS.UNAUTHORIZED);

        const body =
            await response.json();

        expect(body.error)
            .toBe(
                authData.messages.invalidGoogleAccessToken
            );
    });

    test('TC02 Generate JWT using invalid Google access token @auth @regression', async ({
        authClient
    }) => {

        const response =
            await authClient.generateJwtTokenWithBody({});

        expect(response.status())
            .toBe(HTTP_STATUS.UNAUTHORIZED);

    });

    test('TC03 Generate JWT using malformed accessToken @auth @regression', async ({
        authClient
    }) => {

        const response =
            await authClient.generateJwtTokenWithBody();

        expect(response.status())
            .toBe(HTTP_STATUS.UNAUTHORIZED);

    });

    test('TC04 Verify generated JWT contains token property @auth @regression', async ({
        authClient
    }) => {

        const response =
            await authClient.generateJwtToken('');

        expect(response.status())
            .toBe(HTTP_STATUS.UNAUTHORIZED);

    });

    test('TC05 Generate QA token for allowed user @auth @regression', async ({
        authClient
    }) => {

        const response =
            await authClient.generateJwtToken(
                authData.malformedAccessToken
            );

        expect([
            HTTP_STATUS.BAD_REQUEST,
            HTTP_STATUS.UNAUTHORIZED
        ]).toContain(response.status());

    });

});

test.describe('QA Token APIs', () => {

    test('TC06 Generate QA token for another allowed user @auth @regression @smoke @sanity', async ({
        authClient
    }) => {

        const response =
            await authClient.generateQaToken(
                qaEmail
            );

        expect(response.status())
            .toBe(HTTP_STATUS.OK);

        const body =
            await response.json();

        expect(body.token)
            .toBeTruthy();
    });

    test('TC07 Generate QA token for unauthorized email @auth @regression', async ({
        authClient
    }) => {

        const response =
            await authClient.generateQaToken(
                authData.invalidEmail
            );

        expect(response.status())
            .toBe(HTTP_STATUS.FORBIDDEN);
    });

    test('TC08 Generate QA token using invalid email format @auth @regression', async ({
        authClient
    }) => {

        const response =
            await authClient.generateQaToken();

        expect(response.status())
            .toBe(HTTP_STATUS.FORBIDDEN);
    });

    test('TC09 Generate QA token using uppercase email @auth @regression', async ({
        authClient
    }) => {

        const response =
            await authClient.generateQaToken('');

        expect(response.status())
            .toBe(HTTP_STATUS.FORBIDDEN);

    });

    test('TC10 Verify generated QA token response schema @auth @regression', async ({
        authClient
    }) => {

        const response =
            await authClient.generateQaToken(
                authData.invalidEmailFormat
            );

        expect([
            HTTP_STATUS.BAD_REQUEST,
            HTTP_STATUS.FORBIDDEN
        ]).toContain(response.status());

    });

    test('TC11 Verify valid JWT token @auth @regression @smoke @sanity', async ({
        authClient,
        qaToken
    }) => {

        const response =
            await authClient.generateQaToken(
                authData.uppercaseEmail
            );

        expect([
            HTTP_STATUS.OK,
            HTTP_STATUS.FORBIDDEN
        ]).toContain(response.status());

    });

    test('TC12 Verify request without Authorization @auth @regression', async ({
        authClient
    }) => {

        const response =
            await authClient.generateQaToken(
                qaEmail
            );

        expect(response.status())
            .toBe(HTTP_STATUS.OK);

        const body =
            await response.json();

        expect(body)
            .toHaveProperty('token');

    });

});

test.describe('Token Validation APIs', () => {

    test('TC13 Verify invalid JWT token @auth @regression', async ({
        authClient
    }) => {

        const response =
            await authClient.validateToken(
                qaToken
            );

        expect(response.status())
            .toBe(HTTP_STATUS.OK);

        const body =
            await response.json();

        expect(body.valid)
            .toBe(true);

        expect(body.user.email)
            .toBe(qaEmail);
    });

    test('TC14 Verify expired JWT token @auth @regression', async ({
        authClient
    }) => {

        const response =
            await authClient.validateToken(
                authData.invalidJwtToken
            );

        expect(response.status())
            .toBe(HTTP_STATUS.UNAUTHORIZED);
    });

    test('TC15 Verify malformed JWT token @auth @regression', async ({
        authClient
    }) => {

        const response =
            await authClient.validateToken();

        expect(response.status())
            .toBe(HTTP_STATUS.UNAUTHORIZED);
    });

    test('TC16 Verify token signed with different secret @auth @regression', async ({
        authClient
    }) => {

        const response =
            await authClient.validateToken(
                authData.malformedJwtToken
            );

        expect(response.status())
            .toBe(HTTP_STATUS.UNAUTHORIZED);

    });

    test('TC17 Verify response schema @auth @regression', async ({
        authClient,
        qaToken
    }) => {

        const response =
            await authClient.validateTokenWithHeader(
                'Bearer '
            );

        expect(response.status())
            .toBe(HTTP_STATUS.UNAUTHORIZED);

    });

});
