// ─────────────────────────────────────────────────────────────────────────────
// rxapps/logout.test.ts – end-to-end: log in with MFA → confirm logged in →
// log out → confirm back at the login page.
//
// Logout itself lives in RxHomePage.logout() — a single reusable method any
// test can call. This spec just exercises the full flow.
//
// Gated: runs only when APP_USER, APP_PASSWORD and MFA_SECRET are all set.
// ─────────────────────────────────────────────────────────────────────────────
import { test, expect } from "@playwright/test";
import { createRxLoginPage } from "../../pages/rxapps/RxLoginPage";
import { createRxHomePage } from "../../pages/rxapps/RxHomePage";
import { ENV_CONFIG } from "../../../config/env.config";

test.describe("RxApps360 – Logout", () => {

  test("user can log in with MFA and then log out", async ({ page }) => {
    test.skip(
      !ENV_CONFIG.appUser || !ENV_CONFIG.appPassword || !ENV_CONFIG.mfaSecret,
      "Set APP_USER, APP_PASSWORD and MFA_SECRET in .env to enable this test"
    );

    // 1. Log in (password + auto-generated TOTP)
    const loginPage = createRxLoginPage(page);
    await loginPage.navigate();
    await loginPage.loginWithMfa(
      ENV_CONFIG.appUser,
      ENV_CONFIG.appPassword,
      ENV_CONFIG.mfaSecret
    );

    // 2. Confirm we're logged in — the user avatar should be visible
    const home = createRxHomePage(page);
    expect(await home.isAvatarVisible()).toBe(true);

    // 3. Log out (reusable method: opens the menu, clicks Logout)
    await home.logout();

    // 4. Confirm we're back at the login page
    await expect(page).toHaveURL(/login/, { timeout: 15_000 });
    await home.screenshot("5-after-logout");
  });

});
