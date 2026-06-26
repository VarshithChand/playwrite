import { test, expect } from "@playwright/test";
import { createRxLoginPage } from "../../pages/rxapps/RxLoginPage";
import { createRxHomePage } from "../../pages/rxapps/RxHomePage";
import { createRxAssetPage } from "../../pages/rxapps/RxAssetPage";
import { ENV_CONFIG } from "../../../config/env.config";

test.describe("RxApps360 – RxAsset™", () => {

  test("user can log in with MFA, open RxAsset™, and view Assets", async ({ page }) => {
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

    // 3. Open RxAsset™ module and navigate to the Assets view
    await home.openRxAsset();

    // 4. Enter the Assets view and capture the loaded page
    const assetPage = createRxAssetPage(page);
    await assetPage.enterAssetsView();

    // 5. Capture the View Assets screenshot
    await assetPage.screenshot("rxasset-view-assets");
  });

});
