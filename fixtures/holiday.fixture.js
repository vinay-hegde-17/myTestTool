const { test: base, expect } = require('./auth.fixture');
const HolidayClient = require('../api/clients/holiday.client');

const test = base.extend({
    holidayClient: async ({ request, qaToken }, use) => {
        await use(new HolidayClient(request, qaToken));
    }
});

module.exports = { test, expect };