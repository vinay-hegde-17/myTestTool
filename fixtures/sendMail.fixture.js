const { test: base, expect } = require('./auth.fixture');

const SendMailClient =
    require('../api/clients/sendMail.client');

const test = base.extend({

    sendMailClient: async (
        { request },
        use
    ) => {

        const appSecret = process.env.APP_SECRET;

        if (!appSecret) {
            throw new Error(
                'APP_SECRET is not set in the test environment. ' +
                'sendMail tests require the same APP_SECRET value the server uses.'
            );
        }

        await use(
            new SendMailClient(
                request,
                appSecret
            )
        );
    }

});

module.exports = { test, expect };