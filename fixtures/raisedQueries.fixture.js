const { test: base, expect } = require('./auth.fixture');
const RaisedQueriesClient = require('../api/clients/raisedQueries.client');

const test = base.extend({

    raisedQueriesClient: async (
        { request, qaToken },
        use
    ) => {

        await use(
            new RaisedQueriesClient(
                request,
                qaToken
            )
        );

    }

});

module.exports = { test, expect };