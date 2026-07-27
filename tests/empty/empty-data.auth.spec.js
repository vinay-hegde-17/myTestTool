const { test, expect } = require('../../fixtures/auth.fixture');
const { HTTP_STATUS } = require('../../api/constants/auth.constants');

test.describe('Auth Empty Data APIs', () => {

    test('TC_EMPTY_001 Generate JWT without accessToken @emptydata', async ({
        authClient
    }) => {

        const response =
            await authClient.generateJwtTokenWithBody({});

        expect(response.status())
            .toBe(HTTP_STATUS.UNAUTHORIZED);

    });

    test('TC_EMPTY_002 Generate JWT with empty request body @emptydata', async ({
        authClient
    }) => {

        const response =
            await authClient.generateJwtTokenWithBody();

        expect(response.status())
            .toBe(HTTP_STATUS.UNAUTHORIZED);

    });

    test('TC_EMPTY_003 Generate QA token without email @emptydata', async ({
        authClient
    }) => {

        const response =
            await authClient.generateQaTokenWithBody({});

        expect(response.status())
            .toBe(HTTP_STATUS.FORBIDDEN);

    });

    test('TC_EMPTY_004 Generate QA token with empty email @emptydata', async ({
        authClient
    }) => {

        const response =
            await authClient.generateQaToken('');

        expect(response.status())
            .toBe(HTTP_STATUS.FORBIDDEN);

    });

    test('TC_EMPTY_005 Generate QA token with empty request body @emptydata', async ({
        authClient
    }) => {

        const response =
            await authClient.generateQaTokenWithBody();

        expect(response.status())
            .toBe(HTTP_STATUS.FORBIDDEN);

    });

    test('TC_EMPTY_006 Validate token with empty Authorization header @emptydata', async ({
        authClient
    }) => {

        const response =
            await authClient.validateTokenWithHeader('');

        expect(response.status())
            .toBe(HTTP_STATUS.UNAUTHORIZED);

    });

});