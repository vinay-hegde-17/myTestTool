const { test, expect } = require('../../fixtures/auth.fixture');
const { HTTP_STATUS } = require('../../api/constants/auth.constants');
const authData = require('../../test-data/auth.json');

const qaEmail = process.env.TEST_EMAIL;

test.describe('Google Authentication APIs', () => {

    test('TC01 Invalid Google Access Token', async ({
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

    test('TC02 Missing Access Token', async ({
        authClient
    }) => {

        const response =
            await authClient.generateJwtTokenWithBody({});

        expect(response.status())
            .toBe(HTTP_STATUS.UNAUTHORIZED);

    });

    test('TC03 Empty Request Body', async ({
        authClient
    }) => {

        const response =
            await authClient.generateJwtTokenWithBody();

        expect(response.status())
            .toBe(HTTP_STATUS.UNAUTHORIZED);

    });

    test('TC04 Empty Access Token', async ({
        authClient
    }) => {

        const response =
            await authClient.generateJwtToken('');

        expect(response.status())
            .toBe(HTTP_STATUS.UNAUTHORIZED);

    });

    test('TC05 Malformed Access Token', async ({
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

    test('TC06 Generate QA Token', async ({
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

    test('TC07 Unauthorized Email', async ({
        authClient
    }) => {

        const response =
            await authClient.generateQaToken(
                authData.invalidEmail
            );

        expect(response.status())
            .toBe(HTTP_STATUS.FORBIDDEN);
    });

    test('TC08 Missing Email', async ({
        authClient
    }) => {

        const response =
            await authClient.generateQaToken();

        expect(response.status())
            .toBe(HTTP_STATUS.FORBIDDEN);
    });

    test('TC09 Empty Email', async ({
        authClient
    }) => {

        const response =
            await authClient.generateQaToken('');

        expect(response.status())
            .toBe(HTTP_STATUS.FORBIDDEN);

    });

    test('TC10 Invalid Email Format', async ({
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

    test('TC11 Uppercase Email', async ({
        authClient
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

    test('TC12 QA Token Response Schema', async ({
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

    test('TC13 Validate Generated Token', async ({
        authClient,
        qaToken
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

    test('TC14 Invalid Token', async ({
        authClient
    }) => {

        const response =
            await authClient.validateToken(
                authData.invalidJwtToken
            );

        expect(response.status())
            .toBe(HTTP_STATUS.UNAUTHORIZED);
    });

    test('TC15 Missing Authorization Header', async ({
        authClient
    }) => {

        const response =
            await authClient.validateToken();

        expect(response.status())
            .toBe(HTTP_STATUS.UNAUTHORIZED);
    });

    test('TC16 Malformed JWT Token', async ({
        authClient
    }) => {

        const response =
            await authClient.validateToken(
                authData.malformedJwtToken
            );

        expect(response.status())
            .toBe(HTTP_STATUS.UNAUTHORIZED);

    });

    test('TC17 Empty Bearer Token', async ({
        authClient
    }) => {

        const response =
            await authClient.validateTokenWithHeader(
                'Bearer '
            );

        expect(response.status())
            .toBe(HTTP_STATUS.UNAUTHORIZED);

    });

    test('TC18 Validate Token Response Schema', async ({
        authClient,
        qaToken
    }) => {

        const response =
            await authClient.validateToken(
                qaToken
            );

        expect(response.status())
            .toBe(HTTP_STATUS.OK);

        const body =
            await response.json();

        expect(body)
            .toHaveProperty('valid');

        expect(body)
            .toHaveProperty('user');

        expect(body.user)
            .toHaveProperty('email');

    });

});
