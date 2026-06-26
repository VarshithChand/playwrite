import { defineConfig } from "@playwright/test";
import { ENV_CONFIG } from "./config/env.config";

// ─────────────────────────────────────────────────────────────────────────────
// Playwright configuration file.
//
// Key concepts:
//   • testDir       – where Playwright looks for test files
//   • reporter      – "allure-playwright" writes result XML that Allure reads
//   • use.baseURL   – every page.goto('/path') is relative to this URL
//   • projects      – each entry is a separate browser / device run
// ─────────────────────────────────────────────────────────────────────────────
export default defineConfig({
  // Where test files live
  testDir: "./src/tests",

  // Max time ONE test may run before failing. Default is 30s, which is too
  // short for the MFA flow (login + waits + slow dev environment), so we raise
  // it to 90s.
  timeout: 90_000,

  // Run tests one-by-one (not in parallel) so only ONE browser window is open
  // at a time. Set this back to `true` later if you want parallel speed.
  fullyParallel: false,

  // Fail the CI build if you accidentally left test.only() in a file
  forbidOnly: !!process.env.CI,

  // Retry failed tests: twice on CI, once locally. Guards against transient
  // network blips and public-demo-site throttling under parallel load.
  retries: process.env.CI ? 2 : 1,

  // Use a single worker so all tests run sequentially in ONE browser process —
  // no multiple windows opening at once. (Increase this for parallel speed.)
  workers: 1,

  // ── Reporters ─────────────────────────────────────────────────────────────
  reporter: [
    // Print results to the terminal while tests run
    ["list"],
    // Write Allure-compatible XML into ./allure-results/
    ["allure-playwright", { outputFolder: "allure-results", detail: true }],
    // Write a standard HTML report to ./playwright-report/ and AUTO-OPEN it
    // after each local run (so you don't need a separate command). In CI it
    // never opens a browser.
    ["html", { outputFolder: "playwright-report", open: process.env.CI ? "never" : "always" }],
  ],

  // ── Shared settings for every test ────────────────────────────────────────
  use: {
    // Base URL loaded from .env so switching environments is one variable
    baseURL: ENV_CONFIG.baseUrl,

    // Keep a trace only when a test fails (saves a lot of disk vs "on").
    trace: "retain-on-failure",

    // Capture a screenshot for EVERY test — including passing ones — so the
    // report always shows screenshots.
    screenshot: "on",

    // No videos — disabled to save disk space.
    video: "off",

    // ── Browser maximization ────────────────────────────────────────────────
    // Local/headed runs: `viewport: null` lets the page fill the real OS window,
    // and `--start-maximized` opens that window full-screen.
    // CI/headless runs: `--start-maximized` has no visible window to maximize,
    // so we use an explicit 1920×1080 viewport instead — this keeps screenshots,
    // videos, and traces full-size in CI.
    viewport: process.env.CI ? { width: 1920, height: 1080 } : null,
    launchOptions: {
      args: ["--start-maximized"],
    },
  },

  // ── Browser projects ───────────────────────────────────────────────────────
  // Add more entries here to run on Firefox, WebKit, or mobile viewports.
  projects: [
    {
      name: "chromium",
      use: {
        browserName: "chromium",
        // Viewport is inherited from the shared `use` block above (null locally
        // for maximization, 1920×1080 in CI). We do NOT spread
        // devices["Desktop Chrome"] here because that preset sets a
        // `deviceScaleFactor`, which Playwright forbids together with a null
        // viewport.
      },
    },
  ],
});
