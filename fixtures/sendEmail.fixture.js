const { test: base, expect } = require("./auth.fixture");

const SendEmailClient = require("../api/clients/sendEmail.client");

const test = base.extend({
  sendEmailClient: async ({ request, qaToken }, use) => {
    await use(new SendEmailClient(request, qaToken));
  },
});

module.exports = {
  test,
  expect,
};
