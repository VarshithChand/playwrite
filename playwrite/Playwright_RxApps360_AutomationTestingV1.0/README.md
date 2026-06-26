# Playwright TypeScript Automation Framework

A clean, ready-to-use test automation framework built with **Playwright** and **TypeScript**, following the **Page Object Model** pattern, with **Allure** reporting baked in.

---

## Table of Contents

1. [Project Structure](#project-structure)
2. [Prerequisites](#prerequisites)
3. [Installation](#installation)
4. [Running Tests](#running-tests)
5. [Viewing Reports](#viewing-reports)
6. [Switching Environments](#switching-environments)
7. [MFA (TOTP) Login — Automated](#mfa-totp-login--automated)
8. [How to Add Your Own Tests](#how-to-add-your-own-tests)
9. [Key Concepts Explained](#key-concepts-explained)

---

## Project Structure

```
playwright-framework/
│
├── .github/
│   └── workflows/
│       └── playwright.yml    # GitHub Actions CI pipeline (test + Allure publish)
│
├── config/
│   ├── env.config.ts         # Reads .env files and exports typed config
│   └── timeouts.ts           # Centralised timeout values
│
├── src/
│   ├── core/                 # Framework engine (the "enterprise" layer)
│   │   ├── ElementActions.ts # Reusable interactions: type/click/dropdown/checkbox/combo
│   │   └── errors.ts         # Custom error classes (ElementNotFound, Timeout, etc.)
│   │
│   ├── pages/                # Page Object classes (one file per page/feature)
│   │   ├── BasePage.ts       # Exposes the `actions` layer — all pages extend this
│   │   └── rxapps/           # Page objects for the RxApps360 app under test
│   │       └── RxLoginPage.ts
│   │
│   ├── tests/                # Test files
│   │   └── rxapps/           # Tests for the RxApps360 app
│   │       └── login.test.ts
│   │
│   └── utils/
│       ├── logger.ts         # Structured logger (LOG_LEVEL controlled)
│       └── helpers.ts        # Generic utility functions
│
├── .env                      # Default environment variables
├── .env.staging              # Staging environment variables
├── playwright.config.ts      # Playwright configuration (browsers, reporters, base URL)
├── tsconfig.json             # TypeScript compiler settings
└── package.json              # npm scripts and dependencies
```

---

## The Reusable Actions Layer (`src/core/ElementActions.ts`)

Every interaction in the framework goes through **one class** instead of calling Playwright directly. This gives you consistent waiting, logging, and exception handling everywhere.

```typescript
// Inside any page object, `basePage = createBasePage(page)` exposes these directly:
await basePage.enterText(selector, "hello");     // clears + types, waits for visible
await basePage.click(selector);                  // waits for actionable, then clicks
await basePage.selectByValue(selector, "1");     // native <select> by value
await basePage.selectByLabel(selector, "Option 2"); // native <select> by label
await basePage.selectByIndex(selector, 0);       // native <select> by index
await basePage.selectFromComboBox(trigger, "Item"); // custom div/ul combo box
await basePage.setCheckbox(selector, true);      // idempotent check/uncheck
await basePage.selectRadio(selector);            // radio button
await basePage.isVisible(selector);              // SAFE check — never throws
await basePage.getText(selector);                // trimmed inner text
await basePage.getValue(selector);               // input/select current value
await basePage.waitForHidden(spinner);           // wait for spinner to disappear
```

### Exception handling

The actions layer translates Playwright's generic `TimeoutError` into **descriptive, named errors** (in `src/core/errors.ts`):

| Situation | Error thrown | Meaning |
|-----------|--------------|---------|
| Selector matched 0 elements | `ElementNotFoundError` | Equivalent to Selenium's `NoSuchElement` |
| Element exists but disabled | `ElementStateError` | Found, but not actionable |
| Element never became actionable in time | `ActionTimeoutError` | The timeout window elapsed |

Each error message includes the **selector** and the **action** that was attempted, so CI logs tell you exactly what broke and where. Safe checks like `isVisible()` deliberately **return `false` instead of throwing**, so optional elements (cookie banners, conditional warnings) don't fail your test.

---

## Continuous Integration (GitHub Actions)

The pipeline at `.github/workflows/playwright.yml` runs automatically on every push / PR to `main`:

1. Installs dependencies with `npm ci` (reproducible, uses `package-lock.json`)
2. Installs Playwright browsers
3. Runs the full suite across **Node 20 and 22** (matrix build)
4. Uploads Allure results + the Playwright HTML report as **artifacts** (kept 30 days)
5. On `main`, **publishes the Allure report to GitHub Pages** with trend history

To enable the GitHub Pages publish step: in your repo go to **Settings → Pages** and set the source to the `gh-pages` branch (it's created automatically on the first run).

---

## Prerequisites

| Tool    | Minimum version | Check command      |
|---------|-----------------|--------------------|
| Node.js | 18 or higher    | `node --version`   |
| npm     | 8 or higher     | `npm --version`    |
| Allure CLI | any recent  | `allure --version` |

### Installing the Allure CLI (one-time setup)

Allure needs a separate CLI tool to turn the raw result files into a pretty HTML report.

**Windows (using Scoop):**
```bash
# Install Scoop first if you don't have it:
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
Invoke-RestMethod -Uri https://get.scoop.sh | Invoke-Expression

# Then install Allure:
scoop install allure
```

**Mac:**
```bash
brew install allure
```

**Any OS (via npm, no extra install needed):**
```bash
npx allure generate allure-results --clean -o allure-report
npx allure open allure-report
```
> The npm scripts in this project use `allure` directly — if it isn't on your PATH, swap every `allure` call in `package.json` with `npx allure`.

---

## Installation

Run these commands once on a fresh machine:

```bash
# 1. Clone / copy the project, then enter the folder
cd "playwright-framework"

# 2. Install all npm packages
npm install

# 3. Download the Playwright browser binaries (only needed once)
npx playwright install chromium
```

That's it — no other global installs required.

---

## Running Tests

### Run all tests (headless, fastest)
```bash
npm test
```

### Run all tests with the browser visible (great for watching / debugging)
```bash
npm run test:headed
```

### Run tests in Playwright's interactive debug mode (step through each action)
```bash
npm run test:debug
```

### Run only the RxApps360 app tests
```bash
npm run test:rxapps
```

### Run only the login tests
```bash
npm run test:login
```

### Run a specific test by name
```bash
npx playwright test --grep "login page loads"
```

---

## Viewing Reports

### Allure Report (rich, interactive)

```bash
# Step 1 – Generate the HTML report from the raw result files
npm run allure:generate

# Step 2 – Open the report in your browser
npm run allure:open
```

Or do both in one command:
```bash
npm run allure:report
```

> **Note:** `allure-results/` is written automatically every time you run `npm test`.
> Always run `allure:generate` after a test run before opening the report.

### Playwright Built-in HTML Report

```bash
npm run report:html
```

---

## Switching Environments

The base URL and credentials are loaded from `.env` files.

| Command | Env file loaded |
|---------|-----------------|
| `npm test` | `.env` (default) |
| `npm run test:staging` | `.env.staging` |

To add a new environment (e.g. `production`):
1. Create `.env.production` with the right values.
2. Add a script to `package.json`:
   ```json
   "test:production": "cross-env ENV=production playwright test"
   ```

---

## MFA (TOTP) Login — Automated

The framework logs in through **TOTP multi-factor authentication** (the authenticator-app kind) **without a phone**. It computes the 6-digit code itself, types it into the OTP field, and clicks Verify.

### How it works
A TOTP code is just `code = f(secret, currentTime)`. Given the account's **secret** (the Base32 key from MFA enrollment), the framework generates the exact code an authenticator app would show — live, at runtime. This lives in:
- `src/utils/mfa.ts` — `generateMfaCode(secret)` (waits for a fresh 30-second window if the current code is about to expire)
- `RxLoginPage.loginWithMfa(email, password, secret)` — password → generate code → enter → verify

### One-time setup: get the TOTP secret
You only need the secret **once**; after that, no phone is ever required.

> ⚠️ If you enrolled MFA by scanning a QR with your phone, the secret is trapped on the phone. The authenticator app won't reveal it — so you must re-register once to see it.

1. Log into the app → **Security / MFA settings**.
2. Choose **"Reset" / "Reconfigure authenticator."**
3. On the setup screen, click **"Can't scan? Enter this code manually."** That key (e.g. `JBSWY3DPEHPK3PXP`) **is the secret**.
4. Paste it into `.env`:
   ```ini
   MFA_SECRET=JBSWY3DPEHPK3PXP
   ```
5. Finish enrollment (use your phone this one last time, or let the framework's generated code complete it).

### Run the MFA test
```bash
npm run test:mfa
```
Runs only the MFA login test, in headed mode so you can watch it. It **auto-skips** unless `APP_USER`, `APP_PASSWORD`, **and** `MFA_SECRET` are all set in `.env`.

### Security
- `MFA_SECRET` is as sensitive as a password — **never commit it.** `.env` is already git-ignored.
- In CI, store it as a **GitHub Actions Secret** (injected as the `MFA_SECRET` env var), not in the repo.

### Notes
- `otplib` is pinned to **v12** (v13 is an incompatible rewrite that removed the `authenticator` API).
- Defaults match Google/Microsoft/Authy (30-second window, 6 digits, SHA-1). If your app uses non-standard settings, tune `authenticator.options` in `src/utils/mfa.ts`.

---

## How to Add Your Own Tests

### 1. Create a Page Object (factory function — no class, no `this`)

Create a new file in `src/pages/rxapps/`, for example `DashboardPage.ts`:

```typescript
import { Page } from "@playwright/test";
import { createBasePage } from "../BasePage";

export function createDashboardPage(page: Page) {
  const basePage = createBasePage(page);

  // Locators — defined once
  const searchBox    = "#search";
  const profileMenu  = '[data-test="profile-menu"]';

  // Actions — describe user intent (interaction methods are right on basePage)
  async function search(term: string) {
    await basePage.enterText(searchBox, term, { description: "search box" });
  }
  async function openProfile() {
    await basePage.click(profileMenu, { description: "profile menu" });
  }

  return { ...basePage, search, openProfile };
}

export type DashboardPage = ReturnType<typeof createDashboardPage>;
```

### 2. Write the test

Create `src/tests/rxapps/dashboard.test.ts`:

```typescript
import { test, expect } from "@playwright/test";
import { createDashboardPage } from "../../pages/rxapps/DashboardPage";

test("user can search from the dashboard", async ({ page }) => {
  const dashboard = createDashboardPage(page);
  await dashboard.goto("/dashboard");   // goto comes from createBasePage
  await dashboard.search("invoices");
  // ... assertions
});
```

---

## Key Concepts Explained

### Page Object Model (POM) — factory-function style
Each web page gets its own factory function (e.g. `createRxLoginPage(page)`) that holds the locators and user-action methods for that page. Tests call methods like `loginPage.loginAs(user, pass)` instead of repeating `page.fill(...)` everywhere. This means if the app changes a selector, you fix it in **one place**.

We use **factory functions with closures instead of classes**, so there is no `this` keyword anywhere in the framework. `page` is captured in the closure, and pages **compose** `createBasePage` rather than `extends BasePage`. This avoids `this`-binding pitfalls and keeps the code uniform.

### Base Page
`createBasePage(page)` returns one flat object that carries **both** the reusable interaction methods (`enterText`, `click`, `selectByValue`, …) **and** the shared page helpers (`goto`, `assertVisible`, `assertUrlContains`). Page objects spread it into their own return value (`return { ...basePage, ...myMethods }`) so everything is callable directly — e.g. `loginPage.enterText(...)` with no nested `.actions.`.

### Environment Config
`config/env.config.ts` reads from `.env` files so you never hard-code a URL or password in a test. Change environments by setting the `ENV` variable — no test code changes required.

### Allure Reporter
`allure-playwright` writes XML result files to `allure-results/` after every test run. The Allure CLI then converts those XML files into a rich HTML dashboard with screenshots, timelines, and pass/fail history.
