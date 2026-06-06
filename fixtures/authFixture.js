const base = require('@playwright/test');

exports.test = base.test.extend({
    authToken: async ({ request }, use) => {

        const response = await request.post(
            '/auth/qa-token',
            {
                data: {
                    email: process.env.QA_EMAIL
                }
            }
        );

        const body = await response.json();

        await use(body.token);
    }
});

exports.expect = base.expect;