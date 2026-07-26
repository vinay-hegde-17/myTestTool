const { test: base, expect } = require('./auth.fixture');
const EmployeeClient = require('../api/clients/employee.client');

const test = base.extend({

    employeeClient: async (
        { request, qaToken },
        use
    ) => {
        await use(new EmployeeClient(request, qaToken));
    }

});

module.exports = { test, expect };
