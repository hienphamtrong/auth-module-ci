const { defineConfig } = require("@playwright/test");

module.exports = defineConfig({
  testDir: "./e2e-tests",    
  timeout: 30000,

  use: {
    baseURL: "http://localhost:3000",
    headless: true,
    screenshot: "only-on-failure",
    reporter: process.env.CI ? 'dot' : 'list',
    video: "retain-on-failure"
  }
});
