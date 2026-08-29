const { test: base, expect } = require("./auth.fixture");
const ServerClient = require("../api/clients/server.client");

const test = base.extend({
  serverClient: async ({ request, qaToken }, use) => {
    await use(new ServerClient(request, qaToken));
  },
});

module.exports = { test, expect };
