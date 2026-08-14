const { test: base, expect } = require('./auth.fixture');
const TimeTrackerClient = require('../api/clients/timetracker.client');

const test = base.extend({
    timeTrackerClient: async ({ request, qaToken }, use) => {
        await use(new TimeTrackerClient(request, qaToken));
    }
});

module.exports = { test, expect };