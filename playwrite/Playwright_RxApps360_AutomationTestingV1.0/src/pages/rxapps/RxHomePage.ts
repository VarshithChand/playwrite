import { Page } from "@playwright/test";
import { createBasePage } from "../BasePage";

// ─────────────────────────────────────────────────────────────────────────────
// RxHomePage – the landing/dashboard area shown AFTER a successful login.
//
// Factory-function Page Object (no class, no `this`). Composes createBasePage
// for the reusable interaction methods, then exposes home-screen actions.
// ─────────────────────────────────────────────────────────────────────────────
export function createRxHomePage(page: Page) {
  const basePage = createBasePage(page);

  // ── Locators ────────────────────────────────────────────────────────────────
  // The user avatar button. We combine a PARTIAL class match with the aria-label:
  //   • [class*="_userAvatar"] → matches any class CONTAINING "_userAvatar",
  //     so it survives the changing CSS-module hash (_userAvatar_34qii_295).
  //   • [aria-label="User menu"] → the stable semantic label.
  // Both conditions together make the locator precise and build-proof.
  const userAvatar = 'button[class*="_userAvatar"][aria-label="User menu"]';

  // Logout item inside the user dropdown. Targeted by its visible text because
  // the class (_userDropdownItemLogout_34qii_424) is a build-generated hash.
  const logoutButton = 'button[class*="_userDropdownItemLogout"]';

  // RxOrder™ module card on the home page dashboard.
  const rxOrderCard = '[aria-label="Open RxOrder™"]';

  // RxPlan™ module card on the home page dashboard.
  const rxPlanCard = '[aria-label="Open RxPlan™"]';

  // RxActivate™ module card on the home page dashboard.
  const rxActivateCard = '[aria-label="Open RxActivate™"]';

  // RxAsset™ module card on the home page dashboard.
  const rxAssetCard = '[aria-label="Open RxAsset™"]';

  // ── Actions ───────────────────────────────────────────────────────────────

  /** Click the user avatar to open the user menu. */
  async function clickUserAvatar(): Promise<void> {
    await basePage.click(userAvatar, { description: "user avatar" });
  }

  /** True when the avatar is visible (e.g. to confirm we're logged in). */
  async function isAvatarVisible(): Promise<boolean> {
    return basePage.isVisible(userAvatar, { description: "user avatar" });
  }

  /** Open the user menu and click Logout — the full sign-out flow. */
  async function logout(): Promise<void> {
    // Make sure the avatar itself is ready before clicking (handles slow loads).
    await basePage.waitForVisible(userAvatar, { description: "user avatar" });
    await clickUserAvatar(); // opens the dropdown menu

    // Wait for the Logout item to actually appear (the menu animates open) —
    // more reliable than a fixed wait, and works across slow/fast machines.
    await basePage.waitForVisible(logoutButton, { description: "Logout menu item" });
    await basePage.screenshot("4-Screenshot forlogout");
    await basePage.click(logoutButton, { description: "Logout button" });
  }

  /** Click the RxOrder™ card to open the module. */
  async function openRxOrder(): Promise<void> {
    await basePage.click(rxOrderCard, { description: "RxOrder™ card" });
  }

  /** Click the RxPlan™ card to open the module. */
  async function openRxPlan(): Promise<void> {
    await basePage.click(rxPlanCard, { description: "RxPlan™ card" });
  }

  /** Click the RxActivate™ card to open the module. */
  async function openRxActivate(): Promise<void> {
    await basePage.click(rxActivateCard, { description: "RxActivate™ card" });
  }

  /** Click the RxAsset™ card to open the module. */
  async function openRxAsset(): Promise<void> {
    await basePage.click(rxAssetCard, { description: "RxAsset™ card" });
    await basePage.waitForNetworkIdle();
  }

  return { ...basePage, clickUserAvatar, isAvatarVisible, logout, openRxOrder, openRxPlan, openRxActivate, openRxAsset };
}

// The type of the object returned by the factory.
export type RxHomePage = ReturnType<typeof createRxHomePage>;
