# RxApps360 - User Management Test

## Overview

This Playwright automation test verifies that a user can:

1. Log in to RxApps360 using username, password, and MFA (TOTP).
2. Successfully access the application dashboard.
3. Open the RxAsset™ module.
4. Navigate to the **User Management** page.
5. Verify that the User Management page is displayed.
6. Capture a screenshot for test evidence.

---

## Test File

```ts
rxasset.admin.user-management.test.ts
```

---

## Environment Configuration

Create a `.env` file in the project root:

```env
APP_USER=your_username
APP_PASSWORD=your_password
MFA_SECRET=your_totp_secret
```

---

## Test Flow

### Step 1: Login with MFA

```ts
const loginPage = createRxLoginPage(page);

await loginPage.navigate();

await loginPage.loginWithMfa(
  ENV_CONFIG.appUser,
  ENV_CONFIG.appPassword,
  ENV_CONFIG.mfaSecret
);
```

#### Description

* Opens the RxApps360 login page.
* Enters username and password.
* Generates a TOTP code using the MFA secret.
* Completes MFA authentication.

---

### Step 2: Verify Successful Login

```ts
const home = createRxHomePage(page);

expect(await home.isAvatarVisible()).toBe(true);
```

#### Description

* Verifies that the user avatar is visible.
* Confirms successful login and dashboard access.

---

### Step 3: Open RxAsset™

```ts
await home.openRxAsset();
```

#### Description

* Opens the RxAsset™ module from the application dashboard.

---

### Step 4: Open User Management Page

```ts
const assetPage = createRxAssetPage(page);

await assetPage.enterUserManagementView();
```

#### Description

* Navigates to the User Management section under RxAsset Administration.
* Loads the user administration and access management page.

---

### Step 5: Validate User Management Page

```ts
await expect(
  page.locator("main").getByRole("heading", {
    name: /User Management/i,
  })
).toBeVisible({
  timeout: 30000,
});
```

#### Validation

Verifies that:

* User Management page loads successfully.
* User Management heading is visible.
* User is navigated to the correct page.

---

### Step 6: Capture Screenshot

```ts
await assetPage.screenshot("rxasset-user-management");
```

#### Screenshot

```text
rxasset-user-management.png
```

---

## Running the Test

Run all tests:

```bash
npx playwright test
```

Run only this test:

```bash
npx playwright test rxasset.admin.user-management.test.ts
```

Run in headed mode:

```bash
npx playwright test --headed
```

Run using Playwright UI:

```bash
npx playwright test --ui
```

---

## Expected Result

✅ User successfully logs in using MFA.

✅ RxAsset™ module opens successfully.

✅ User Management page loads successfully.

✅ User Management heading is visible.

✅ Screenshot is captured successfully.

---

## Framework Components Used

### RxLoginPage

Handles:

* Navigation to login page.
* Username and password authentication.
* MFA verification.

### RxHomePage

Handles:

* Dashboard interactions.
* User validation.
* Navigation to RxAsset™.

### RxAssetPage

Handles:

* Asset Administration navigation.
* Opening the User Management page.
* Screenshot capture.

---

## Notes

* The test automatically skips if required environment variables are missing.
* MFA authentication is generated dynamically using the configured secret key.
* Screenshots are captured for execution evidence and debugging.
* Uses the Page Object Model (POM) design pattern for maintainability and reusability.
