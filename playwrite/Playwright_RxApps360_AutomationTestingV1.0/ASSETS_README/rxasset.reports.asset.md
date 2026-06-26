# RxAsset Asset Reports Test

## Test File

`src/tests/rxapps/rxasset/rxasset.reports.asset.test.ts`

## Purpose

This test verifies that the user can open Asset Reports from the Reports sidebar menu.

## Process

1. Log in with MFA.
2. Confirm the user avatar is visible.
3. Open RxAsset.
4. Expand the `Reports` sidebar menu.
5. Click `Asset Reports`.
6. Verify the `Asset Reports` heading is visible.
7. Capture screenshot evidence as `rxasset-asset-reports`.

## Run Command

```bash
npx playwright test rxapps/rxasset/rxasset.reports.asset.test.ts
```
