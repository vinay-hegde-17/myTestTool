const { test: base, expect } = require("./auth.fixture");
const UserRoleClient = require("../api/clients/userRole.client");

const test = base.extend({
  userRoleClient: async ({ request, qaToken }, use) => {
    await use(new UserRoleClient(request, qaToken));
  },
});

module.exports = { test, expect };
