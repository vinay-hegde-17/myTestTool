import { test, expect } from '@playwright/test';
import jwt from 'jsonwebtoken';
import { AuthClient } from '../../api/clients/authClient';

test.describe('Authentication APIs', () => {

    test('TC01 Generate QA Token @smoke @regression', async ({ request }) => {

        const authClient = new AuthClient(request);

        const response = await authClient.getQaToken(
            process.env.QA_EMAIL
        );

        expect(response.status()).toBe(200);

        const body = await response.json();

        expect(body.token).toBeTruthy();
    });

    test('TC02 Validate Generated Token @smoke @regression', async ({ request }) => {

        const authClient = new AuthClient(request);

        const tokenResponse = await authClient.getQaToken(
            process.env.QA_EMAIL
        );

        expect(tokenResponse.status()).toBe(200);

        const tokenBody = await tokenResponse.json();

        const response = await authClient.validateToken(
            tokenBody.token
        );

        expect(response.status()).toBe(200);

        const body = await response.json();

        expect(body.valid).toBe(true);
    });

    test('TC03 Validate Invalid Token @smoke @regression', async ({ request }) => {

        const authClient = new AuthClient(request);

        const response = await authClient.validateToken(
            'invalid-token'
        );

        expect(response.status()).toBe(401);
    });

    test('TC04 Unauthorized Email @regression', async ({ request }) => {

        const authClient = new AuthClient(request);

        const response = await authClient.getQaToken(
            'unauthorized@test.com'
        );

        expect(response.status()).toBe(403);
    });

    test('TC05 Missing Authorization Header @regression', async ({ request }) => {

        const response = await request.get(
            '/auth/isvalidtoken'
        );

        expect(response.status()).toBe(401);
    });

    test('TC06 JWT Contains Correct Email @regression', async ({ request }) => {

        const authClient = new AuthClient(request);

        const response = await authClient.getQaToken(
            process.env.QA_EMAIL
        );

        expect(response.status()).toBe(200);

        const body = await response.json();

        const decoded = jwt.decode(body.token);

        expect(decoded.email).toBe(
            process.env.QA_EMAIL
        );
    });

});