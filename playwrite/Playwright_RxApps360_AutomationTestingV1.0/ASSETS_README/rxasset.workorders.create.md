# RxAsset Create Work Order Test

## Test File

`src/tests/rxapps/rxasset/rxasset.workorders.create.test.ts`

## Purpose

This test verifies that the user can open the Create Work Order page from the RxAsset sidebar.

## Process

1. Log in with MFA.
2. Confirm the user avatar is visible.
3. Open RxAsset.
4. Expand the `Work Orders` sidebar menu.
5. Click `Create Work Order`.
6. Verify the `Create Work Order` heading is visible.
7. Capture screenshot evidence as `rxasset-create-work-order`.

## Run Command

```bash
npx playwright test rxapps/rxasset/rxasset.workorders.create.test.ts
```
