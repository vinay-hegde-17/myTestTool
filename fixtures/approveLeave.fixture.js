const { test: base, expect } =
    require('./auth.fixture');

const ApproveLeaveClient =
    require('../api/clients/approveLeave.client');

const test = base.extend({

    approveLeaveClient: async (
        { request, qaToken },
        use
    ) => {

        await use(
            new ApproveLeaveClient(
                request,
                qaToken
            )
        );
    }

});

module.exports = {
    test,
    expect
};