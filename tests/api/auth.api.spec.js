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

});

test.describe('QA Token APIs', () => {

    test('TC02 Generate QA Token', async ({
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

    test('TC03 Unauthorized Email', async ({
        authClient
    }) => {

        const response =
            await authClient.generateQaToken(
                authData.invalidEmail
            );

        expect(response.status())
            .toBe(HTTP_STATUS.FORBIDDEN);
    });

    test('TC04 Missing Email', async ({
        authClient
    }) => {

        const response =
            await authClient.generateQaToken();

        expect(response.status())
            .toBe(HTTP_STATUS.FORBIDDEN);
    });

});

test.describe('Token Validation APIs', () => {

    test('TC05 Validate Generated Token', async ({
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

    test('TC06 Invalid Token', async ({
        authClient
    }) => {

        const response =
            await authClient.validateToken(
                authData.invalidJwtToken
            );

        expect(response.status())
            .toBe(HTTP_STATUS.UNAUTHORIZED);
    });

    test('TC07 Missing Authorization Header', async ({
        authClient
    }) => {

        const response =
            await authClient.validateToken();

        expect(response.status())
            .toBe(HTTP_STATUS.UNAUTHORIZED);
    });

});
