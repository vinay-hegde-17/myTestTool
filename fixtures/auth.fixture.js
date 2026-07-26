const base = require('@playwright/test');
const AuthClient = require('../api/clients/auth.client');
const { getCachedToken } = require('../utils/token.util');
const employeeData = require('../test-data/employee.json');

const test = base.test.extend({
  authClient: async ({ request }, use) => {
    await use(new AuthClient(request));
  },

  qaToken: async ({ authClient }, use, testInfo) => {
    const cachedToken = getCachedToken();
    if (cachedToken) {
      await use(cachedToken);
      return;
    }

    let response;
    try {
      response = await authClient.generateQaToken(
        employeeData.testData.testEmail || 'qa.user@company.com'
      );
    } catch (error) {
      testInfo.skip(true, `QA token unavailable - ${error.message}`);
      return;
    }

    if (!response.ok()) {
      testInfo.skip(true, 'QA token unavailable - check API_BASE_URL and test-data/employee.json');
      return;
    }
    const { token } = await response.json();
    await use(token);
  },
});

module.exports = { test, expect: base.expect };
