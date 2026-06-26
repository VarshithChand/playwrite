# RxAsset Asset Requests Test

## Test File

`src/tests/rxapps/rxasset/rxasset.requests.test.ts`

## Purpose

This test verifies that the user can open the Asset Requests page from the RxAsset sidebar.

## Process

1. Log in with MFA.
2. Confirm successful login with the user avatar.
3. Open RxAsset.
4. Expand the `Assets` sidebar menu.
5. Click `Asset Requests`.
6. Wait for the page to finish loading.
7. Verify request page content such as request navigation/status controls.
8. Capture screenshot evidence as `rxasset-asset-requests-pending`.

## Run Command

```bash
npx playwright test rxapps/rxasset/rxasset.requests.test.ts
```

## Notes

The test uses visible page content as the reliable load signal.
