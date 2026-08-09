const { test: base, expect } = require('./auth.fixture');
const ModuleClient = require('../api/clients/module.clinet');

const test = base.extend({

    moduleClient: async (
        { request, qaToken },
        use
    ) => {

        await use(
            new ModuleClient(
                request,
                qaToken
            )
        );

    }

});

module.exports = { test, expect };