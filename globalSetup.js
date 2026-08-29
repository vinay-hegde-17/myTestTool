const fs = require('fs');
const path = require('path');
const { request } = require('@playwright/test');
const { loadResolvedJson } = require('./utils/testData.util');
const employeeData = loadResolvedJson('./test-data/employee.json');

module.exports = async function globalSetup() {
  const cacheDir = path.join(process.cwd(), '.cache');
  if (!fs.existsSync(cacheDir)) {
    fs.mkdirSync(cacheDir, { recursive: true });
  }

  const tokenPath = path.join(cacheDir, 'token.json');
  if (process.env.QA_TOKEN) {
    fs.writeFileSync(tokenPath, JSON.stringify({ token: process.env.QA_TOKEN }));
    return;
  }

  const apiContext = await request.newContext({
    baseURL: process.env.API_BASE_URL || 'http://localhost:3000',
  });
  try {
    const response = await apiContext.post('/auth/qa-token', {
      data: {
        email: process.env.TEST_EMAIL || employeeData.testData.testEmail || 'qa.user@company.com'
      },
    });

    if (response.ok()) {
      const { token } = await response.json();
      fs.writeFileSync(
        tokenPath,
        JSON.stringify({ token })
      );
    }
  } catch (error) {
    console.warn(`QA token setup skipped: ${error.message}`);
  } finally {
    await apiContext.dispose();
  }
};
