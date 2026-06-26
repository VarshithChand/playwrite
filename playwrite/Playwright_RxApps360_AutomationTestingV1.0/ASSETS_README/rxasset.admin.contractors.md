# RxApps360 - RxAsset Administration & Asset Management Tests

## Overview

This document describes two Playwright automation tests within the RxAsset™ module:

1. **Add Asset Test**

   * Login with MFA.
   * Open RxAsset™.
   * Navigate to the Add Asset page.
   * Verify the Add Asset form is displayed.
   * Capture a screenshot.

2. **Contractors Test**

   * Login with MFA.
   * Open RxAsset™.
   * Navigate to the Contractors page.
   * Verify the Contractors page is displayed.
   * Capture a screenshot.

---

# Common Test Flow

Both tests follow the same initial steps:

## Step 1: Login with MFA

```ts
const loginPage = createRxLoginPage(page);

await loginPage.navigate();

await loginPage.loginWithMfa(
  ENV_CONFIG.appUser,
  ENV_CONFIG.appPassword,
  ENV_CONFIG.mfaSecret
);
```

### Description

* Opens the RxApps360 login page.
* Enters username and password.
* Generates a TOTP code using MFA secret.
* Completes authentication.

---

## Step 2: Verify Successful Login

```ts
const home = createRxHomePage(page);

expect(await home.isAvatarVisible()).toBe(true);
```

### Description

* Confirms the user avatar is visible.
* Ensures the dashboard has loaded successfully.

---

## Step 3: Open RxAsset™

```ts
await home.openRxAsset();
```

### Description

* Opens the RxAsset™ application from the dashboard.

---

# Test Case 1: Add Asset

## Navigate to Add Asset Page

```ts
const assetPage = createRxAssetPage(page);

await assetPage.enterAddAssetView();
```

### Description

* Opens the Add Asset screen.
* Allows users to create a new asset.

---

## Validate Add Asset Page

```ts
await expect(
  page.locator("main").getByRole("heading", {
    name: /Add.*Asset/i,
  })
).toBeVisible({
  timeout: 30000,
});
```

### Validation

Checks that:

* Add Asset page loads successfully.
* Add Asset heading is visible.

---

## Capture Screenshot

```ts
await assetPage.screenshot("rxasset-add-asset-form");
```

### Screenshot

```text
rxasset-add-asset-form.png
```

---

# Test Case 2: Contractors

## Navigate to Contractors Page

```ts
const assetPage = createRxAssetPage(page);

await assetPage.enterContractorsView();
```

### Description

* Opens the Contractors section under RxAsset Administration.
* Displays contractor management information.

---

## Validate Contractors Page

```ts
await expect(
  page.locator("main").getByRole("heading", {
    name: /Contractors/i,
  })
).toBeVisible({
  timeout: 30000,
});
```

### Validation

Checks that:

* Contractors page loads successfully.
* Contractors heading is displayed.

---

## Capture Screenshot

```ts
await assetPage.screenshot("rxasset-contractors");
```

### Screenshot

```text
rxasset-contractors.png
```

---

# Environment Configuration

Create a `.env` file:

```env
APP_USER=your_username
APP_PASSWORD=your_password
MFA_SECRET=your_totp_secret
```

| Variable     | Description                         |
| ------------ | ----------------------------------- |
| APP_USER     | Application username                |
| APP_PASSWORD | Application password                |
| MFA_SECRET   | MFA secret used for TOTP generation |

---

# Running Tests

Run all tests:

```bash
npx playwright test
```

Run Add Asset test:

```bash
npx playwright test rxasset.add.test.ts
```

Run Contractors test:

```bash
npx playwright test rxasset.admin.contractors.test.ts
```

Run in headed mode:

```bash
npx playwright test --headed
```

---

# Expected Results

### Add Asset

✅ User logs in successfully.

✅ RxAsset opens.

✅ Add Asset page is displayed.

✅ Add Asset heading is visible.

✅ Screenshot is captured.

### Contractors

✅ User logs in successfully.

✅ RxAsset opens.

✅ Contractors page is displayed.

✅ Contractors heading is visible.

✅ Screenshot is captured.

---

# Framework Design

```text
src/
├── pages/
│   ├── RxLoginPage.ts
│   ├── RxHomePage.ts
│   └── RxAssetPage.ts
│
├── tests/
│   └── rxapps/
│       ├── rxasset.add.test.ts
│       └── rxasset.admin.contractors.test.ts
│
└── config/
    └── env.config.ts
```

The framework follows the Page Object Model (POM) design pattern for maintainability and reusability.
