import { Page, Locator, test, errors as PWErrors } from "@playwright/test";
import { TIMEOUTS } from "../../config/timeouts";
import { logger } from "../utils/logger";
import {
  elementNotFoundError,
  actionTimeoutError,
  elementStateError,
} from "./errors";

// ─────────────────────────────────────────────────────────────────────────────
// ElementActions – the reusable interaction layer (factory-function style).
//
// `createElementActions(page)` captures `page` in a closure and returns an
// object of action methods. There is NO `this` — every helper (toLocator,
// perform, …) is a plain closure function that can see `page` directly.
//
// EVERY interaction in the framework goes through this layer instead of calling
// Playwright's raw API directly. Benefits:
//   • Consistent waiting   – we always wait for visibility before acting.
//   • Consistent logging   – every action is logged for CI traceability.
//   • Clean exceptions     – Playwright's TimeoutError is translated into our
//                            named errors with the selector + action baked in.
//   • One place to change  – add retries, screenshots, analytics here once.
//
// A selector can be either a CSS/XPath string OR an already-built Locator.
// ─────────────────────────────────────────────────────────────────────────────

export type SelectorLike = string | Locator;

export interface ActionOptions {
  /** Override the default timeout for this single action. */
  timeout?: number;
  /** Human-readable description used in logs (defaults to the selector). */
  description?: string;
}

export function createElementActions(page: Page) {
  // ── Internal helpers (closures — no `this`) ────────────────────────────────

  /** Turn a string-or-Locator into a Locator. */
  function toLocator(selector: SelectorLike): Locator {
    return typeof selector === "string" ? page.locator(selector) : selector;
  }

  /** A printable label for logs / error messages. */
  function label(selector: SelectorLike, opts?: ActionOptions): string {
    if (opts?.description) return opts.description;
    return typeof selector === "string" ? selector : "(locator)";
  }

  /**
   * Central wait-then-act wrapper. This is where ALL exception handling lives.
   * It waits for the element to be visible, runs the supplied action, and
   * converts Playwright's low-level errors into our descriptive named errors.
   */
  async function perform<T>(
    selector: SelectorLike,
    action: string,
    opts: ActionOptions | undefined,
    fn: (locator: Locator) => Promise<T>
  ): Promise<T> {
    const timeout = opts?.timeout ?? TIMEOUTS.element;
    const name = label(selector, opts);
    const locator = toLocator(selector);

    logger.debug(`${action} → "${name}" (timeout ${timeout}ms)`);

    try {
      // Wait until the element is attached AND visible before acting.
      await locator.waitFor({ state: "visible", timeout });
      const result = await fn(locator);
      logger.info(`${action} ✓ "${name}"`);
      return result;
    } catch (err) {
      // ── Exception translation ────────────────────────────────────────────
      // Playwright throws a TimeoutError both when an element never appears AND
      // when it appears but isn't actionable. Inspect the element to decide
      // which named error best describes the situation.
      if (err instanceof PWErrors.TimeoutError) {
        const exists = await locator.count().catch(() => 0);

        if (exists === 0) {
          logger.error(`${action} ✗ element not found: "${name}"`);
          throw elementNotFoundError(name, action);
        }

        const disabled = await locator.isDisabled().catch(() => false);
        if (disabled) {
          logger.error(`${action} ✗ element disabled: "${name}"`);
          throw elementStateError(name, action, "element is disabled");
        }

        logger.error(`${action} ✗ timed out: "${name}"`);
        throw actionTimeoutError(name, action, timeout);
      }

      logger.error(`${action} ✗ unexpected error on "${name}": ${(err as Error).message}`);
      throw err;
    }
  }

  // ── Public actions ─────────────────────────────────────────────────────────

  /** Navigate to a path (relative to baseURL) with navigation-specific waiting. */
  async function navigate(path = "/", opts?: ActionOptions): Promise<void> {
    const timeout = opts?.timeout ?? TIMEOUTS.navigation;
    logger.info(`navigate → "${path}"`);
    try {
      await page.goto(path, { timeout, waitUntil: "domcontentloaded" });
    } catch (err) {
      if (err instanceof PWErrors.TimeoutError) {
        throw actionTimeoutError(path, "navigate", timeout);
      }
      throw err;
    }
  }

  /** Enter text into an input. Clears any existing value first. */
  async function enterText(selector: SelectorLike, value: string, opts?: ActionOptions): Promise<void> {
    await perform(selector, "enterText", opts, async (loc) => {
      await loc.fill(value);
    });
  }

  /** Click an element. */
  async function click(selector: SelectorLike, opts?: ActionOptions): Promise<void> {
    await perform(selector, "click", opts, async (loc) => {
      await loc.click({ timeout: opts?.timeout ?? TIMEOUTS.element });
    });
  }

  /** Double-click an element. */
  async function doubleClick(selector: SelectorLike, opts?: ActionOptions): Promise<void> {
    await perform(selector, "doubleClick", opts, async (loc) => {
      await loc.dblclick();
    });
  }

  /** Read the visible text of an element. */
  async function getText(selector: SelectorLike, opts?: ActionOptions): Promise<string> {
    return perform(selector, "getText", opts, async (loc) => (await loc.innerText()).trim());
  }

  /** Read the value of an attribute (returns null if the attribute is absent). */
  async function getAttribute(
    selector: SelectorLike,
    attribute: string,
    opts?: ActionOptions
  ): Promise<string | null> {
    return perform(selector, `getAttribute(${attribute})`, opts, async (loc) =>
      loc.getAttribute(attribute)
    );
  }

  /** Read the current value of an input/select/textarea (DOM property, not attribute). */
  async function getValue(selector: SelectorLike, opts?: ActionOptions): Promise<string> {
    return perform(selector, "getValue", opts, async (loc) => loc.inputValue());
  }

  // ── Dropdowns (native <select>) ────────────────────────────────────────────

  /** Select an option in a native <select> by its value attribute. */
  async function selectByValue(selector: SelectorLike, value: string, opts?: ActionOptions): Promise<void> {
    await perform(selector, `selectByValue(${value})`, opts, async (loc) => {
      await loc.selectOption({ value });
    });
  }

  /** Select an option in a native <select> by its visible label. */
  async function selectByLabel(selector: SelectorLike, text: string, opts?: ActionOptions): Promise<void> {
    await perform(selector, `selectByLabel(${text})`, opts, async (loc) => {
      await loc.selectOption({ label: text });
    });
  }

  /** Select an option in a native <select> by its index (0-based). */
  async function selectByIndex(selector: SelectorLike, index: number, opts?: ActionOptions): Promise<void> {
    await perform(selector, `selectByIndex(${index})`, opts, async (loc) => {
      await loc.selectOption({ index });
    });
  }

  // ── Custom combo boxes (non-native dropdowns: div/ul based) ────────────────

  /**
   * Handle a custom combo box that is NOT a native <select> — the kind built
   * from a trigger element plus a popup list of options (common in React/Angular).
   */
  async function selectFromComboBox(
    trigger: SelectorLike,
    optionText: string,
    optionSelector = "[role='option']",
    opts?: ActionOptions
  ): Promise<void> {
    // 1. Open the dropdown
    await click(trigger, { ...opts, description: `combo trigger "${label(trigger, opts)}"` });

    // 2. Wait for the option list and click the matching option by exact text
    const option = page.locator(optionSelector, { hasText: optionText });
    await perform(option, `selectFromComboBox(${optionText})`, opts, async (loc) => {
      await loc.first().click();
    });
  }

  // ── Checkboxes & radio buttons ─────────────────────────────────────────────

  /**
   * Set a checkbox to a desired state. Idempotent — checking an already-checked
   * box does nothing, so tests stay stable no matter the starting state.
   */
  async function setCheckbox(selector: SelectorLike, checked: boolean, opts?: ActionOptions): Promise<void> {
    await perform(selector, `setCheckbox(${checked})`, opts, async (loc) => {
      if (checked) {
        await loc.check();
      } else {
        await loc.uncheck();
      }
    });
  }

  /** Return whether a checkbox / radio is currently checked. */
  async function isChecked(selector: SelectorLike, opts?: ActionOptions): Promise<boolean> {
    return perform(selector, "isChecked", opts, async (loc) => loc.isChecked());
  }

  /** Select a radio button (just a checkbox set to true). */
  async function selectRadio(selector: SelectorLike, opts?: ActionOptions): Promise<void> {
    await setCheckbox(selector, true, opts);
  }

  // ── State / safe checks (these DON'T throw if the element is missing) ──────

  /**
   * Return true if the element is visible within a short timeout, false otherwise.
   * Use this for optional elements (cookie banners, conditional warnings) where
   * absence is NOT a failure — so it deliberately swallows the timeout.
   */
  async function isVisible(selector: SelectorLike, opts?: ActionOptions): Promise<boolean> {
    const timeout = opts?.timeout ?? TIMEOUTS.short;
    try {
      await toLocator(selector).waitFor({ state: "visible", timeout });
      return true;
    } catch {
      return false; // not visible in time — treated as "not present", no throw
    }
  }

  /** Wait for an element to disappear (e.g. a loading spinner). */
  async function waitForHidden(selector: SelectorLike, opts?: ActionOptions): Promise<void> {
    const timeout = opts?.timeout ?? TIMEOUTS.element;
    const name = label(selector, opts);
    try {
      await toLocator(selector).waitFor({ state: "hidden", timeout });
      logger.info(`waitForHidden ✓ "${name}"`);
    } catch (err) {
      if (err instanceof PWErrors.TimeoutError) {
        throw actionTimeoutError(name, "waitForHidden", timeout);
      }
      throw err;
    }
  }

  /**
   * Wait for an element to become visible (throws if it never appears).
   * Use this after an action when the next element isn't one you're about to
   * click — e.g. waiting for a dashboard heading to confirm a page loaded.
   */
  async function waitForVisible(selector: SelectorLike, opts?: ActionOptions): Promise<void> {
    const timeout = opts?.timeout ?? TIMEOUTS.element;
    const name = label(selector, opts);
    try {
      await toLocator(selector).waitFor({ state: "visible", timeout });
      logger.info(`waitForVisible ✓ "${name}"`);
    } catch (err) {
      if (err instanceof PWErrors.TimeoutError) {
        logger.error(`waitForVisible ✗ "${name}"`);
        throw actionTimeoutError(name, "waitForVisible", timeout);
      }
      throw err;
    }
  }

  /**
   * Wait for the page URL to match a substring or RegExp — ideal right after
   * clicking submit, when the app redirects (e.g. /login → /dashboard).
   */
  async function waitForUrl(
    pattern: string | RegExp,
    opts?: ActionOptions
  ): Promise<void> {
    const timeout = opts?.timeout ?? TIMEOUTS.navigation;
    const expected = typeof pattern === "string" ? new RegExp(pattern) : pattern;
    try {
      await page.waitForURL(expected, { timeout });
      logger.info(`waitForUrl ✓ "${expected}"`);
    } catch (err) {
      if (err instanceof PWErrors.TimeoutError) {
        logger.error(`waitForUrl ✗ "${expected}"`);
        throw actionTimeoutError(String(expected), "waitForUrl", timeout);
      }
      throw err;
    }
  }

  /**
   * Wait for the network to be idle (no requests for 500ms) — useful after a
   * submit that triggers background XHR/fetch calls with no obvious UI change.
   */
  async function waitForNetworkIdle(opts?: ActionOptions): Promise<void> {
    const timeout = opts?.timeout ?? TIMEOUTS.navigation;
    await page.waitForLoadState("networkidle", { timeout });
    logger.info("waitForNetworkIdle ✓");
  }

  /**
   * Hard wait — pause for a fixed number of SECONDS. Use anywhere:
   *   await basePage.wait(3);   // pause 3 seconds
   *
   * ⚠ Prefer the smart waits above (waitForUrl / waitForVisible / waitForHidden)
   * in real tests — they're faster and far less flaky. Reach for this only for
   * quick debugging or a genuinely time-based pause (e.g. a rate-limit window).
   */
  async function wait(seconds: number): Promise<void> {
    logger.info(`wait → pausing for ${seconds}s`);
    await page.waitForTimeout(seconds * 1000);
  }

  /**
   * Take a full-page screenshot RIGHT NOW. It is BOTH:
   *   1. Saved as a standalone PNG under ./screenshots/<name>-<timestamp>.png
   *   2. Attached to the report (Playwright HTML + Allure) under <name>
   *
   * Call it anywhere you want an explicit, named capture:
   *   await basePage.screenshot("after-entering-credentials");
   */
  async function screenshot(name: string): Promise<void> {
    // Build a safe, unique filename. We avoid Date.now()/new Date() colliding by
    // using the test's start time + a sanitized name.
    const safeName = name.replace(/[^a-z0-9-_]/gi, "_");
    const stamp = test.info().testId; // unique per test run, no Date needed
    const filePath = `screenshots/${safeName}-${stamp}.png`;

    // 1. Save a standalone PNG to disk (path: also captures it on disk).
    const image = await page.screenshot({ path: filePath });

    // 2. Attach it to the report as a named step image.
    await test.info().attach(name, { body: image, contentType: "image/png" });

    logger.info(`screenshot ✓ "${name}" → ${filePath}`);
  }

  // Expose the public API. Internal helpers stay private inside the closure.
  return {
    navigate,
    enterText,
    click,
    doubleClick,
    getText,
    getAttribute,
    getValue,
    selectByValue,
    selectByLabel,
    selectByIndex,
    selectFromComboBox,
    setCheckbox,
    isChecked,
    selectRadio,
    isVisible,
    waitForHidden,
    waitForVisible,
    waitForUrl,
    waitForNetworkIdle,
    wait,
    screenshot,
  };
}

// The type of the object returned by the factory — use this for typing params.
export type ElementActions = ReturnType<typeof createElementActions>;
