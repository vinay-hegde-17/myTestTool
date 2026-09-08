const { test: base, expect } = require("./auth.fixture");
const SendMailClient = require("../api/clients/sendMail.client");

const test = base.extend({
  sendMailClient: async ({ request }, use) => {
    const appSecret = process.env.APP_SECRET || "phye_hrms_qa_secret_key_2026";

    await use(new SendMailClient(request, appSecret));
  },
});

module.exports = { test, expect };
