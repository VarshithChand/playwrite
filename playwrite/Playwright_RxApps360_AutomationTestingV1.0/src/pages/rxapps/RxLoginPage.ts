import { Page } from "@playwright/test";
import { createBasePage } from "../BasePage";
import { generateMfaCode } from "../../utils/mfa";

// ─────────────────────────────────────────────────────────────────────────────
// RxLoginPage – the login screen of the RxApps360 
//
 
// It composes createBasePage to get the reusable interaction methods (enterText, click, …)
//  directly on // `basePage`, then exposes login-specific methods.

// ─────────────────────────────────────────────────────────────────────────────
export function createRxLoginPage(page: Page) {
  const basePage = createBasePage(page);

  // ── Locators (defined once, reused below) ──────────────────────────────────
  const emailInput    = "#email";
  const passwordInput = "#password";
  const loginButton   = 'button[type="submit"]';
  const errorToast    = '[role="alert"]';

  // ── MFA locators ───────────────────────────────────────────────────────────
  // OTP field: id="otp" (autocomplete="one-time-code") — stable.
  // Verify button: targeted by its visible text, since the CSS-module class
  // names (e.g. _mfaButton_ce6wg_457) are build-generated hashes that change.
  const otpInput     = "#otp";
  const verifyButton = 'button:has-text("Verify")';

  // ── Actions ───────────────────────────────────────────────────────────────

  /** Navigate to the login page. */
  async function navigate(): Promise<void> {
    await basePage.goto("/login");
  }

  /** Fill in credentials and submit the login form. */
  async function loginAs(email: string, password: string): Promise<void> {
    await basePage.enterText(emailInput, email, { description: "email field" });
    await basePage.enterText(passwordInput, password, { description: "password field" });
    // 📸 after entering login details, BEFORE submitting
    await basePage.screenshot("1-after-login-details-before-submit");
    await basePage.click(loginButton, { description: "Login button" });
    await basePage.wait(3);
  }

  /** Enter a TOTP code on the MFA screen and submit. */
  async function enterMfaCode(code: string): Promise<void> {
    await basePage.enterText(otpInput, code, { description: "MFA code field" });
    // 📸 after entering MFA code, BEFORE submitting
    await basePage.screenshot("2-after-mfa-code-before-submit");
    await basePage.click(verifyButton, { description: "Verify button" });
    await basePage.wait(5);
  }

  /** Full TOTP login: password step → generate live code → enter code. */
  async function loginWithMfa(
    email: string,
    password: string,
    secret: string
  ): Promise<void> {
    await loginAs(email, password);            // password step (screenshot #1 inside)
    const code = await generateMfaCode(secret); // compute current TOTP code
    await enterMfaCode(code);                    // submit it (screenshot #2 inside)
    // 📸 final screenshot after the last submit (landing page)
    await basePage.screenshot("3-after-final-submit");
  }

  // ── Getters / assertions ───────────────────────────────────────────────────

  /** True when the login form is visible (used to confirm we reached the page). */
  async function isLoaded(): Promise<boolean> {
    return basePage.isVisible(emailInput, { description: "email field" });
  }

  /** True when an error toast is shown (safe check — never throws). */
  async function hasError(): Promise<boolean> {
    try {
      // Wait up to 5 seconds for the error toast to appear
      await basePage.waitForVisible(errorToast, { description: "error toast", timeout: 5_000 });
      return true;
    } catch {
      // Alert did not appear within timeout — no error
      return false;
    }
  }

  /** Return the error toast text so a test can assert the exact message. */
  async function getErrorMessage(): Promise<string> {
    return basePage.getText(errorToast, { description: "error toast" });
  }

  return {
    ...basePage,
    navigate,
    loginAs,
    isLoaded,
    hasError,
    getErrorMessage,
    enterMfaCode,
    loginWithMfa,
  };
}

// The type of the object returned by the factory.
export type RxLoginPage = ReturnType<typeof createRxLoginPage>;
