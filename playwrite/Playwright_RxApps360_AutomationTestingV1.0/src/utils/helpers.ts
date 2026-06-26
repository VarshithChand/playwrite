// ─────────────────────────────────────────────────────────────────────────────
// helpers.ts – pure utility functions with no Playwright dependencies.
// Keep this file free of Page / Locator imports so it is easy to unit-test.
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Pause execution for `ms` milliseconds.
 * Prefer Playwright's built-in waitFor* methods over this in tests —
 * use it only for genuinely time-based waits (e.g. rate-limit windows).
 */
export const sleep = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Pick a random element from an array.
 * Useful for data-driven tests that need non-deterministic input.
 */
export function randomPick<T>(items: T[]): T {
  return items[Math.floor(Math.random() * items.length)];
}

/**
 * Generate a unique string with an optional prefix.
 * Handy for creating unique usernames / emails in tests.
 * e.g.  uniqueId("user") → "user_1718123456789"
 */
export function uniqueId(prefix = "id"): string {
  return `${prefix}_${Date.now()}`;
}

/**
 * Format a Date as "YYYY-MM-DD" — useful for date picker tests.
 */
export function formatDate(date: Date): string {
  return date.toISOString().split("T")[0];
}
