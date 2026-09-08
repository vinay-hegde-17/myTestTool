const { test: base, expect } = require("./auth.fixture");
const { ModuleUserRoleClient } = require("../api/clients/moduleUserRole.client");

const test = base.extend({
  moduleUserRoleClient: async ({ request, qaToken }, use) => {
    await use(new ModuleUserRoleClient(request, qaToken));
  },
});

module.exports = { test, expect };
