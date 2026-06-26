// ─────────────────────────────────────────────────────────────────────────────
// rxapps/rxactivate.test.ts – end-to-end: log in with MFA → confirm logged in →
// open RxActivate™ module → confirm RxActivate page loads.
//
// Opens the RxActivate™ module from the home page dashboard using the method
// exposed by RxHomePage.openRxActivate().
//
// Gated: runs only when APP_USER, APP_PASSWORD and MFA_SECRET are all set.
// ─────────────────────────────────────────────────────────────────────────────
import { test, expect } from "@playwright/test";
import { createRxLoginPage } from "../../pages/rxapps/RxLoginPage";
import { createRxHomePage } from "../../pages/rxapps/RxHomePage";
import { ENV_CONFIG } from "../../../config/env.config";

test.describe("RxApps360 – RxActivate™", () => {

  test("user can log in with MFA and open RxActivate™", async ({ page }) => {
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

    // 3. Open RxActivate™ module
    await home.openRxActivate();

    // 4. Confirm RxActivate page has loaded (wait for a page transition or specific element)
    // Adjust timeout as needed based on your app's load time
    await page.waitForLoadState("networkidle", { timeout: 15_000 });
    
    // Take a screenshot to confirm RxActivate is open
    await home.screenshot("6-rxactivate-opened");
  });

});
