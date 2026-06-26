# RxAsset View Assets Test

## Test File

`src/tests/rxapps/rxasset/rxasset.view.test.ts`

## Purpose

This test verifies that the user can open the View Assets screen from the RxAsset sidebar.

## Process

1. Log in with MFA.
2. Confirm the user avatar is visible.
3. Open RxAsset.
4. Expand the `Assets` sidebar menu.
5. Click `View Assets`.
6. Verify the initial View Assets page:
   - `View Assets` heading
   - `Filter Assets` panel
   - `Search` button
7. Capture screenshot evidence as `rxasset-view-assets`.

## Important Behavior

The View Assets page does not show a results table immediately. The table appears only after searching/filtering. The test validates the initial loaded page instead of waiting for a table.

## Run Command

```bash
npx playwright test rxapps/rxasset/rxasset.view.test.ts
```
