// ─────────────────────────────────────────────────────────────────────────────
// Centralised timeout values (in milliseconds).
//
// Keeping these in one place means you tune waiting behaviour for the WHOLE
// framework from a single file instead of hunting for magic numbers in tests.
// Override per-action by passing an options object to the action methods.
// ─────────────────────────────────────────────────────────────────────────────
export const TIMEOUTS = {
  /** Default wait for an element to become visible / actionable. */
  element: 15_000,
  /** Short wait — for quick existence checks where we expect a fast answer. */
  short: 5_000,
  /** Long wait — for slow pages, file uploads, heavy dashboards. */
  long: 30_000,
  /** Default wait for a navigation / page load. Generous, as the RxApps360
   *  acceptance environment can be slow to respond. */
  navigation: 60_000,
};
