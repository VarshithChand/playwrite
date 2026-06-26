// ─────────────────────────────────────────────────────────────────────────────
// rxapps/login.test.ts 
//  ─────────────────────────────────────────────────────────────────────────────

import { test, expect } from "@playwright/test";
import { createRxLoginPage } from "../../pages/rxapps/RxLoginPage";
import { ENV_CONFIG } from "../../../config/env.config";

test.describe("RxApps360 – Login", () => {

  test("login page loads and shows the email & password form", async ({ page }) => {
    const loginPage = createRxLoginPage(page);
    await loginPage.navigate();

    expect(await loginPage.isLoaded()).toBe(true);
    await expect(page).toHaveURL(/login/);
  });

  // Runs ONLY when credentials are provided in .env — otherwise it is skipped.
  test("valid user can log in", async ({ page }) => {
    test.skip(
      !ENV_CONFIG.appUser || !ENV_CONFIG.appPassword,
      "Set APP_USER and APP_PASSWORD in .env to enable this test"
    );

    const loginPage = createRxLoginPage(page);
    await loginPage.navigate();
    await loginPage.loginAs(ENV_CONFIG.appUser, ENV_CONFIG.appPassword);

    // After a successful login the app should navigate away from /login.
    await expect(page).not.toHaveURL(/login/, { timeout: 15_000 });
  });

  // Runs ONLY when email, password AND the TOTP secret are all set in .env.
  test("user can log in with TOTP MFA", async ({ page }) => {
    test.skip(
      !ENV_CONFIG.appUser || !ENV_CONFIG.appPassword || !ENV_CONFIG.mfaSecret,
      "Set APP_USER, APP_PASSWORD and MFA_SECRET in .env to enable this test"
    );

    await expect(page.locator('[role="alert"][aria-live]')).toBeVisible({ timeout: 30_000 });

    const loginPage = createRxLoginPage(page);
    await loginPage.navigate();
    await loginPage.loginWithMfa(
      ENV_CONFIG.appUser,
      ENV_CONFIG.appPassword,
      ENV_CONFIG.mfaSecret
    );

    // Past MFA → app should leave the login / verify screens
    await expect(page).not.toHaveURL(/login|mfa|verify/, { timeout: 15_000 });
  });

});
