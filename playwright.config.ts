import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: 0,
  workers: 1,
  reporter: [["list"], ["json", { outputFile: "workflow/TASK-002-code-audit-fix-e2e/proof/test-results.json" }]],
  use: {
    baseURL: "http://localhost:3100",
    trace: "on-first-retry",
    screenshot: "only-on-failure",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  webServer: {
    command: "bun run start -- -p 3100",
    url: "http://localhost:3100",
    reuseExistingServer: false,
    timeout: 120 * 1000,
    env: {
      PLAYWRIGHT_TEST: "true",
    },
  },
});
