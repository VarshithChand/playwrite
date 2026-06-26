import { authenticator } from "otplib";
import { logger } from "./logger";

// ─────────────────────────────────────────────────────────────────────────────
// mfa.ts – Time-based One-Time Password (TOTP) helper.
//
// A TOTP authenticator app is just a function: code = TOTP(secret, currentTime).
// Given the same Base32 secret your app stored at enrollment, we compute the
// exact 6-digit code the authenticator would show right now.
// ─────────────────────────────────────────────────────────────────────────────

const SAFETY_MARGIN = 5; // if fewer seconds remain in the window, wait for a fresh code

/**
 * Generate the current valid TOTP code for a secret.
 *
 * Robustness: a code rotates every 30s. If we're within the last few seconds of
 * the current window, the code could expire before the form submits — so we wait
 * for the next window and generate a fresh code instead.
 */
export async function generateMfaCode(secret: string): Promise<string> {
  if (!secret) {
    throw new Error(
      "MFA secret is empty — set MFA_SECRET in your .env to use TOTP login."
    );
  }

  const remaining = authenticator.timeRemaining(); // seconds left in this window
  if (remaining < SAFETY_MARGIN) {
    const waitMs = (remaining + 1) * 1000;
    logger.info(`MFA code expires in ${remaining}s — waiting ${waitMs}ms for a fresh window`);
    await new Promise((resolve) => setTimeout(resolve, waitMs));
  }

  const code = authenticator.generate(secret);
  logger.info(`MFA code generated (valid for ~${authenticator.timeRemaining()}s)`);
  return code;
}

/** Verify a code against the secret — handy for assertions/debugging. */
export function isValidMfaCode(secret: string, token: string): boolean {
  return authenticator.check(token, secret);
}
