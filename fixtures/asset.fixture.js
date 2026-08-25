const { test: base, expect } = require("./auth.fixture");
const AssetClient = require("../api/clients/asset.client");

const test = base.extend({
  assetClient: async ({ request, qaToken }, use) => {
    await use(new AssetClient(request, qaToken));
  },
});

module.exports = { test, expect };
