# RxAsset Transfers Test

## Test File

`src/tests/rxapps/rxasset/rxasset.transfers.test.ts`

## Purpose

This test verifies that the user can open the Transfers page from the RxAsset sidebar.

## Process

1. Log in with MFA.
2. Confirm the user avatar is visible.
3. Open RxAsset.
4. Click `Transfers` in the sidebar.
5. Verify the `Transfers` heading is visible.
6. Capture screenshot evidence as `rxasset-transfers`.

## Run Command

```bash
npx playwright test rxapps/rxasset/rxasset.transfers.test.ts
```
