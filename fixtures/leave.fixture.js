const { test: base, expect } = require("./auth.fixture");
const LeaveClient = require("../api/clients/leave.client");

const test = base.extend({
  leaveClient: async ({ request, qaToken }, use) => {
    await use(new LeaveClient(request, qaToken));
  },
});

module.exports = { test, expect };
