import { test, expect } from "@playwright/test";
import { createRxLoginPage } from "../../../pages/rxapps/RxLoginPage";
import { createRxHomePage } from "../../../pages/rxapps/RxHomePage";
import { createRxAssetPage } from "../../../pages/rxapps/RxAssetPage";
import { ENV_CONFIG } from "../../../../config/env.config";

test.describe("RxApps360 - RxAsset Work Orders", () => {

  test("user can log in with MFA, open RxAsset, and open View Work Orders", async ({ page }) => {
    test.skip(
      !ENV_CONFIG.appUser || !ENV_CONFIG.appPassword || !ENV_CONFIG.mfaSecret,
      "Set APP_USER, APP_PASSWORD and MFA_SECRET in .env to enable this test"
    );

    const loginPage = createRxLoginPage(page);
    await loginPage.navigate();
    await loginPage.loginWithMfa(
      ENV_CONFIG.appUser,
      ENV_CONFIG.appPassword,
      ENV_CONFIG.mfaSecret
    );

    const home = createRxHomePage(page);
    expect(await home.isAvatarVisible()).toBe(true);

    await home.openRxAsset();

    const assetPage = createRxAssetPage(page);
    await assetPage.enterViewWorkOrdersView();

    await expect(page.locator("main").getByRole("heading", { name: /Work Orders|View Work Orders/i })).toBeVisible({
      timeout: 30_000,
    });

    await assetPage.screenshot("rxasset-view-work-orders");
  });

});
