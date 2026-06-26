import { Page, Locator, expect } from "@playwright/test";
import { createElementActions } from "../core/ElementActions";

// ─────────────────────────────────────────────────────────────────────────────
// BasePage – the shared foundation every Page Object builds on (factory style).
//
// `createBasePage(page)` returns one flat object that carries BOTH the reusable
// interaction methods (enterText, click, selectByValue, …) AND common page
// helpers (goto, assertVisible, …). Page objects COMPOSE this instead of
// extending a class — so there is no `this` and no inheritance:
//
//   export function createRxLoginPage(page) {
//     const basePage = createBasePage(page);
//     async function login(u, p) { await basePage.enterText(emailInput, u); ... }
//     return { ...basePage, login };
//   }
//
// Because the action methods are spread in, you call them directly on the page
// object (basePage.enterText / loginPage.click) — no nested ".actions." needed.
// ─────────────────────────────────────────────────────────────────────────────
export function createBasePage(page: Page) {
  // The reusable interaction layer — its methods are spread into the result below.
  const actions = createElementActions(page);

  // ── Navigation ────────────────────────────────────────────────────────────

  /** Navigate to a path relative to the configured baseURL. */
  async function goto(path = "/"): Promise<void> {
    await actions.navigate(path);
  }

  /** Return the current page title. */
  async function getTitle(): Promise<string> {
    return page.title();
  }

  // ── Assertion helpers ─────────────────────────────────────────────────────

  /** Assert that a locator is visible (fails the test if not). */
  async function assertVisible(locator: Locator, message?: string): Promise<void> {
    await expect(locator, message).toBeVisible();
  }

  /** Assert the page URL contains a substring. */
  async function assertUrlContains(fragment: string): Promise<void> {
    await expect(page).toHaveURL(new RegExp(fragment));
  }

  // Spread the interaction methods (enterText, click, …) onto the base object so
  // they are callable directly: basePage.enterText(...) instead of basePage.actions.enterText(...)
  return { page, ...actions, goto, getTitle, assertVisible, assertUrlContains };
}

// The type of the object returned by the factory.
export type BasePage = ReturnType<typeof createBasePage>;
