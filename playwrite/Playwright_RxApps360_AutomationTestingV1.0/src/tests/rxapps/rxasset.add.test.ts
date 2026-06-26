import { test, expect } from "@playwright/test";
import { createRxLoginPage } from "../../pages/rxapps/RxLoginPage";
import { createRxHomePage } from "../../pages/rxapps/RxHomePage";
import { createRxAssetPage } from "../../pages/rxapps/RxAssetPage";
import { ENV_CONFIG } from "../../../config/env.config";

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

    // 3. Open RxAsset module and enter Assets view
    await home.openRxAsset();
    const assetPage = createRxAssetPage(page);
    await assetPage.enterAssetsView();
    // wait for the View Assets UI to fully load
    await assetPage.wait(3);

    // 4. Capture the View Assets page state for debugging
    await assetPage.screenshot("rxasset-view-assets-loaded");

    // 5. Log all visible buttons to diagnose which one is Add Asset
    const allButtons = await page.locator('button').all();
    console.log(`Found ${allButtons.length} buttons on the page`);
    for (const btn of allButtons) {
      const text = await btn.textContent();
      const visible = await btn.isVisible();
      console.log(`  Button: "${text?.trim()}" (visible: ${visible})`);
    }

    // 6. Try to find and click the Add Asset button by text or role
    const addAssetButton = page.locator('button', { hasText: /Add Asset/i }).first();
    
    if (await addAssetButton.isVisible({ timeout: 5000 })) {
      console.log('Add Asset button found, clicking...');
      await assetPage.click(addAssetButton, { description: "Add Asset button" });
      console.log('Add Asset button clicked');
    } else {
      console.log('Add Asset button NOT visible, attempting role-based search');
      const roleButton = page.getByRole("button", { name: /Add Asset/i });
      await assetPage.click(roleButton, { description: "Add Asset button (role)" });
    }

    // 7. Wait for navigation and the Add Asset page UI to load
    try {
      await assetPage.waitForUrl(/\/rxasset\/assets\/add/, { timeout: 30_000 });
      await assetPage.wait(2);
      await expect(page.getByRole("heading", { name: /Add New Asset/i })).toBeVisible({
        timeout: 30_000,
      });
      console.log('Successfully navigated to Add Asset page');
    } catch (err) {
      console.log('Navigation to Add Asset failed, capturing current state');
      await assetPage.screenshot("rxasset-stuck-on-view");
      throw err;
    }

    await assetPage.screenshot("rxasset-add-asset-form");
  });

});
