import { test, expect } from "@playwright/test";
import { createRxLoginPage } from "../../../pages/rxapps/RxLoginPage";
import { createRxHomePage } from "../../../pages/rxapps/RxHomePage";
import { createRxAssetPage } from "../../../pages/rxapps/RxAssetPage";
import { ENV_CONFIG } from "../../../../config/env.config";

test.describe("RxApps360 – RxAsset™ (Add Asset)", () => {

  test("user can log in with MFA, open RxAsset™, and open Add Asset form", async ({ page }) => {
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

    // 2. Confirm we're logged in
    const home = createRxHomePage(page);
    expect(await home.isAvatarVisible()).toBe(true);

    // 3. Open RxAsset module and enter Add Asset view
    await home.openRxAsset();
    const assetPage = createRxAssetPage(page);
    await assetPage.enterAddAssetView();

    await expect(page.locator("main").getByRole("heading", { name: /Add.*Asset/i })).toBeVisible({
      timeout: 30_000,
    });

    await assetPage.screenshot("rxasset-add-asset-form");
  });

});
