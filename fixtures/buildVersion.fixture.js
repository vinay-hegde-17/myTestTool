const { test: base, expect } = require("./auth.fixture");
const BuildVersionClient = require("../api/clients/buildVersion.client");

const test = base.extend({
  buildVersionClient: async ({ request, qaToken }, use) => {
    await use(new BuildVersionClient(request, qaToken));
  },
});

module.exports = { test, expect };
