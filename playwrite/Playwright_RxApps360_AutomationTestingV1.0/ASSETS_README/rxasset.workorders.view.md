# RxAsset View Work Orders Test

## Test File

`src/tests/rxapps/rxasset/rxasset.workorders.view.test.ts`

## Purpose

This test verifies that the user can open the View Work Orders page from the RxAsset sidebar.

## Process

1. Log in with MFA.
2. Confirm the user avatar is visible.
3. Open RxAsset.
4. Expand the `Work Orders` sidebar menu.
5. Click `View Work Orders`.
6. Verify a Work Orders heading is visible.
7. Capture screenshot evidence as `rxasset-view-work-orders`.

## Run Command

```bash
npx playwright test rxapps/rxasset/rxasset.workorders.view.test.ts
```
