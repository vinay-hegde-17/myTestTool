const { request } = require('@playwright/test');
const fs = require('fs');

async function globalSetup(config) {

    const apiContext = await request.newContext({
        baseURL: process.env.BASE_URL
    });

    const response = await apiContext.post(
        '/auth/qa-token',
        {
            data: {
                email: process.env.QA_EMAIL
            }
        }
    );

    const body = await response.json();

    fs.writeFileSync(
        './.cache/token.json',
        JSON.stringify({
            token: body.token
        })
    );

    await apiContext.dispose();
}

module.exports = globalSetup;