const { test: base, expect } = require("./auth.fixture");
const WeeklyReportClient = require("../api/clients/weeklyReport.client");

const test = base.extend({
  weeklyReportClient: async ({ request, qaToken }, use) => {
    await use(new WeeklyReportClient(request, qaToken));
  },
});

module.exports = { test, expect };
