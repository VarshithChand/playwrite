# RxAsset Purchase History Test

## Test File

`src/tests/rxapps/rxasset/rxasset.purchase-history.test.ts`

## Purpose

This test verifies that the user can open Purchase History from the RxAsset sidebar.

## Process

1. Log in with MFA.
2. Confirm the user avatar is visible.
3. Open RxAsset.
4. Click `Purchase History`.
5. Verify the `Purchase History` heading is visible.
6. Capture screenshot evidence as `rxasset-purchase-history`.

## Run Command

```bash
npx playwright test rxapps/rxasset/rxasset.purchase-history.test.ts
```
