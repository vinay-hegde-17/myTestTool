const { test: base, expect } = require('./auth.fixture');
const EmployeeClient = require('../api/clients/employee.client');

const test = base.extend({

    employeeClient: async (
        { request, qaToken },
        use
    ) => {

        const client =
            new EmployeeClient(
                request,
                qaToken
            );

        await use(client);
    }

});

module.exports = {
    test,
    expect
};