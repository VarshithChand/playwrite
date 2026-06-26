# RxAsset Dashboard Test

## Test File

`src/tests/rxapps/rxasset/rxasset.test.ts`

## Purpose

This test verifies that a user can log in with MFA, open the RxAsset module, and land on the RxAsset dashboard.

## Process

1. Navigate to the login page.
2. Log in with `APP_USER`, `APP_PASSWORD`, and `MFA_SECRET`.
3. Confirm login by checking the user avatar.
4. Open the RxAsset module from the home dashboard.
5. Verify the RxAsset dashboard content:
   - `Dashboard` heading
   - enterprise asset performance text
   - `Pending Approvals` section
6. Capture screenshot evidence as `rxasset-dashboard`.

## Run Command

```bash
npx playwright test rxapps/rxasset/rxasset.test.ts
```

## Notes

This is the base smoke test for RxAsset. It does not open any sidebar submenu.
