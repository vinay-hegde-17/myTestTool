// @ts-check

require('dotenv').config();

const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({

  globalSetup: require.resolve('./globalSetup'),

  testDir: './tests',

  timeout: 60000,

  expect: {
    timeout: 10000,
  },

  fullyParallel: true,

  retries: process.env.CI ? 2 : 0,

  reporter: [
    ['list'],
    ['html'],
    ['allure-playwright'],
  ],

  use: {
    baseURL: process.env.BASE_URL,

    extraHTTPHeaders: {
      'Content-Type': 'application/json',
    },
  },
});
