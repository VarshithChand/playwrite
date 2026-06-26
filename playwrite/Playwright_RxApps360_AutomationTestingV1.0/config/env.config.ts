import * as dotenv from "dotenv";
import * as path from "path";
import * as fs from "fs";

// ─────────────────────────────────────────────────────────────────────────────
// Load the right .env file based on the ENV environment variable.
//   ENV=staging  → loads .env.staging
//   (default)    → loads .env
// ─────────────────────────────────────────────────────────────────────────────
const env = process.env.ENV ?? "default";
const envFile = env === "default" ? ".env" : `.env.${env}`;
const envPath = path.resolve(process.cwd(), envFile);

if (fs.existsSync(envPath)) {
  dotenv.config({ path: envPath });
} else {
  // Fall back to the base .env so the framework never crashes silently
  dotenv.config({ path: path.resolve(process.cwd(), ".env") });
  console.warn(`⚠  Env file "${envFile}" not found — fell back to .env`);
}

// Export typed config so every file gets safe, autocompleted values
export const ENV_CONFIG = {
  // Base URL of the app under test (RxApps360 / Masstcs)
  baseUrl: process.env.BASE_URL ?? "https://masstcs.acpt.rxapps360.com",

  // Credentials for the app under test
  appUser: process.env.APP_USER ?? "",
  appPassword: process.env.APP_PASSWORD ?? "",

  // TOTP secret for the test account's authenticator app (for MFA login)
  mfaSecret: process.env.MFA_SECRET ?? "",
};
