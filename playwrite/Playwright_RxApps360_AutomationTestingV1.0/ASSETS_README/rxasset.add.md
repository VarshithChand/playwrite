# RxApps360 - RxAsset™ Add Asset Test

## Overview

This Playwright automated test verifies that a user can:

1. Log in to RxApps360 using username, password, and MFA (TOTP).
2. Successfully access the application dashboard.
3. Open the RxAsset™ module.
4. Navigate to the **Add Asset** page.
5. Verify that the Add Asset form is displayed.
6. Capture a screenshot for test evidence.

---

## Test File

```ts
rxasset-add-asset.spec.ts
```

---

## Prerequisites

### Required Software

* Node.js (v18 or later)
* npm
* Playwright

### Install Dependencies

```bash
npm install
npx playwright install
```

---

## Environment Configuration

Create a `.env` file in the project root and configure the following variables:

```env
APP_USER=your_username
APP_PASSWORD=your_password
MFA_SECRET=your_totp_secret
```

---

## Test Flow

### Step 1: Login

The test:

* Opens the RxApps360 login page.
* Enters username and password.
* Generates a TOTP code using the MFA secret.
* Completes authentication.

```ts
await loginPage.loginWithMfa(
  ENV_CONFIG.appUser,
  ENV_CONFIG.appPassword,
  ENV_CONFIG.mfaSecret
);
```

---

### Step 2: Verify Successful Login

The test confirms successful authentication by checking that the user avatar is visible.

```ts
expect(await home.isAvatarVisible()).toBe(true);
```

---

### Step 3: Open RxAsset™

Navigate to the RxAsset™ module from the application home page.

```ts
await home.openRxAsset();
```

---

### Step 4: Open Add Asset Form

Enter the Add Asset view.

```ts
await assetPage.enterAddAssetView();
```

---

### Step 5: Validate Page

Verify that the Add Asset page heading is displayed.

```ts
await expect(
  page.locator("main").getByRole("heading", {
    name: /Add.*Asset/i,
  })
).toBeVisible();
```

---

### Step 6: Capture Screenshot

Take a screenshot for validation and reporting.

```ts
await assetPage.screenshot("rxasset-add-asset-form");
```

---

## Running the Test

Run all tests:

```bash
npx playwright test
```

Run this specific test file:

```bash
npx playwright test rxasset-add-asset.spec.ts
```

Run in headed mode:

```bash
npx playwright test --headed
```

Run with Playwright UI:

```bash
npx playwright test --ui
```

---

## Expected Result

The test should:

* Successfully authenticate with MFA.
* Open RxAsset™.
* Navigate to the Add Asset page.
* Display the "Add Asset" heading.
* Capture a screenshot named:

```text
rxasset-add-asset-form.png
```

---

## Project Structure

```text
tests/
└── rxasset-add-asset.spec.ts

pages/
├── RxLoginPage.ts
├── RxHomePage.ts
└── RxAssetPage.ts

config/
└── env.config.ts
```

---

## Notes

* The test is automatically skipped if any required environment variable is missing.
* MFA authentication uses a TOTP secret stored in the `.env` file.
* Screenshots are captured for debugging and reporting purposes.
* Page Object Model (POM) design is used for maintainability and reusability.
