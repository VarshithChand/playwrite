# RxAsset Cost Reports Test

## Test File

`src/tests/rxapps/rxasset/rxasset.reports.cost.test.ts`

## Purpose

This test verifies that the user can open Cost Reports from the Reports sidebar menu.

## Process

1. Log in with MFA.
2. Confirm the user avatar is visible.
3. Open RxAsset.
4. Expand the `Reports` sidebar menu.
5. Click `Cost Reports`.
6. Verify the `Cost Reports` heading is visible.
7. Capture screenshot evidence as `rxasset-cost-reports`.

## Run Command

```bash
npx playwright test rxapps/rxasset/rxasset.reports.cost.test.ts
```
