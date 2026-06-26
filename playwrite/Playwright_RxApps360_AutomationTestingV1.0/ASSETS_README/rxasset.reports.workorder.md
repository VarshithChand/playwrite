# RxAsset Work Order Reports Test

## Test File

`src/tests/rxapps/rxasset/rxasset.reports.workorder.test.ts`

## Purpose

This test verifies that the user can open Work Order Reports from the Reports sidebar menu.

## Process

1. Log in with MFA.
2. Confirm the user avatar is visible.
3. Open RxAsset.
4. Expand the `Reports` sidebar menu.
5. Click `Work Order Reports`.
6. Verify the `Work Order Reports` heading is visible.
7. Capture screenshot evidence as `rxasset-work-order-reports`.

## Run Command

```bash
npx playwright test rxapps/rxasset/rxasset.reports.workorder.test.ts
```
