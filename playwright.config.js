// @ts-check
require('dotenv').config();

const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({
  globalSetup: require.resolve('./globalSetup'),

  testDir: './tests',

  testMatch: '**/*.api.spec.js',

  timeout: process.env.PLAYWRIGHT_TIMEOUT
    ? parseInt(process.env.PLAYWRIGHT_TIMEOUT, 10)
    : 60_000,

  expect: {
    timeout: process.env.PLAYWRIGHT_EXPECT_TIMEOUT
      ? parseInt(process.env.PLAYWRIGHT_EXPECT_TIMEOUT, 10)
      : 10_000,
  },

  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 2 : undefined,

  reporter: [
    ['list'],
    ['allure-playwright', {
      resultsDir: 'reports/allure-results'
    }]
  ],

  use: {
    baseURL: process.env.API_BASE_URL || 'http://localhost:3000',
  },

  projects: [
    {
      name: 'api',
      testMatch: '**/*.api.spec.js',
    },
  ],
});
