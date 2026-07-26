const fs = require('fs');
const path = require('path');
const { request } = require('@playwright/test');
const employeeData = require('./test-data/employee.json');

module.exports = async function globalSetup() {
  const cacheDir = path.join(process.cwd(), '.cache');
  if (!fs.existsSync(cacheDir)) {
    fs.mkdirSync(cacheDir, { recursive: true });
  }

  const apiContext = await request.newContext({
    baseURL: process.env.API_BASE_URL || 'http://localhost:3000',
  });
  try {
    const response = await apiContext.post('/auth/qa-token', {
      data: {
        email: employeeData.testData.testEmail || 'qa.user@company.com'
      },
    });

    if (response.ok()) {
      const { token } = await response.json();
      fs.writeFileSync(
        path.join(cacheDir, 'token.json'),
        JSON.stringify({ token })
      );
    }
  } catch (error) {
    console.warn(`QA token setup skipped: ${error.message}`);
  } finally {
    await apiContext.dispose();
  }
};
