# RxAsset Add Parts Test

## Test File

`src/tests/rxapps/rxasset/rxasset.parts.add.test.ts`

## Purpose

This test verifies that the user can open the Add Parts page from the RxAsset sidebar.

## Process

1. Log in with MFA.
2. Confirm the user avatar is visible.
3. Open RxAsset.
4. Expand the `Parts` sidebar menu.
5. Click `Add Parts`.
6. Verify the Add Parts heading is visible.
7. Capture screenshot evidence as `rxasset-add-parts`.

## Run Command

```bash
npx playwright test rxapps/rxasset/rxasset.parts.add.test.ts
```
