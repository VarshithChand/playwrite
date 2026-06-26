// ─────────────────────────────────────────────────────────────────────────────
// Custom errors — factory-function style (no classes, no `this`).
//
// Why factories instead of `class X extends Error`?
//   • No `this` keyword anywhere — consistent with the rest of the framework.
//   • Still produces real Error objects (proper stack traces).
//   • Each error carries context (selector, action, timeout) as plain fields.
//
// Identify an error by its `.name` field, e.g.:
//   if (err.name === "ElementNotFoundError") { ... }
// ─────────────────────────────────────────────────────────────────────────────

/** The shape every framework error shares. */
export interface FrameworkError extends Error {
  /** The selector or description of the element involved (if any). */
  selector?: string;
  /** The high-level action being attempted, e.g. "click", "enterText". */
  action?: string;
  /** The timeout used, when the failure was time-based. */
  timeoutMs?: number;
}

/** Internal builder — creates a named Error with extra context fields attached. */
function makeError(
  name: string,
  message: string,
  context: Partial<FrameworkError> = {}
): FrameworkError {
  const error = new Error(message) as FrameworkError;
  error.name = name;
  Object.assign(error, context); // attach selector / action / timeoutMs
  return error;
}

/** Element could not be found in the DOM (Selenium's NoSuchElement equivalent). */
export function elementNotFoundError(selector: string, action: string): FrameworkError {
  return makeError(
    "ElementNotFoundError",
    `Element not found: "${selector}" while attempting to "${action}". ` +
      `Check the locator is correct and the element exists in the DOM.`,
    { selector, action }
  );
}

/** An action did not complete within the allotted time. */
export function actionTimeoutError(
  selector: string,
  action: string,
  timeoutMs: number
): FrameworkError {
  return makeError(
    "ActionTimeoutError",
    `Timed out after ${timeoutMs}ms waiting to "${action}" on "${selector}". ` +
      `The element may be hidden, disabled, covered by another element, or never appeared.`,
    { selector, action, timeoutMs }
  );
}

/** Element was found but not in an actionable state (disabled, hidden). */
export function elementStateError(
  selector: string,
  action: string,
  detail: string
): FrameworkError {
  return makeError(
    "ElementStateError",
    `Element "${selector}" is not in an actionable state for "${action}": ${detail}`,
    { selector, action }
  );
}
