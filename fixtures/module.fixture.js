const { test: base, expect } = require("./auth.fixture");
const ModuleClient = require("../api/clients/module.client");

const test = base.extend({
  moduleClient: async ({ request, qaToken }, use) => {
    await use(new ModuleClient(request, qaToken));
  },
});

module.exports = { test, expect };
