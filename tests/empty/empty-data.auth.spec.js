const { test, expect } = require('../../fixtures/auth.fixture');
const { HTTP_STATUS } = require('../../api/constants/auth.constants');

test.describe('Auth Empty Data APIs', () => {

    test('TC01 Generate JWT without accessToken @emptydata', async ({
        authClient
    }) => {

        const response =
            await authClient.generateJwtTokenWithBody({});

        expect(response.status())
            .toBe(HTTP_STATUS.UNAUTHORIZED);

    });

    test('TC02 Generate JWT with empty request body @emptydata', async ({
        authClient
    }) => {

        const response =
            await authClient.generateJwtTokenWithBody();

        expect(response.status())
            .toBe(HTTP_STATUS.UNAUTHORIZED);

    });

    test('TC03 Generate QA token without email @emptydata', async ({
        authClient
    }) => {

        const response =
            await authClient.generateQaTokenWithBody({});

        expect(response.status())
            .toBe(HTTP_STATUS.FORBIDDEN);

    });

    test('TC04 Generate QA token with empty email @emptydata', async ({
        authClient
    }) => {

        const response =
            await authClient.generateQaToken('');

        expect(response.status())
            .toBe(HTTP_STATUS.FORBIDDEN);

    });

    test('TC05 Generate QA token with empty request body @emptydata', async ({
        authClient
    }) => {

        const response =
            await authClient.generateQaTokenWithBody();

        expect(response.status())
            .toBe(HTTP_STATUS.FORBIDDEN);

    });

});