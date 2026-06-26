import { Page } from "@playwright/test";
import { createBasePage } from "../BasePage";

export function createRxAssetPage(page: Page) {
  const basePage = createBasePage(page);

  const sidebar = page.locator("aside, [role='complementary']").first();
  const sidebarNavigation = sidebar.locator("nav").first();

  const assetNavButton = sidebarNavigation.getByRole("button", { name: /^Assets$/i });
  const viewAssetsButton = sidebarNavigation.getByRole("button", { name: /^View Assets$/i });
  const addAssetButton = sidebarNavigation.getByRole("button", { name: /^Add Asset$/i });
  const assetRequestsButton = sidebarNavigation.getByRole("button", { name: /^Asset Requests$/i });
  const incomingAssetsButton = sidebarNavigation.getByRole("button", { name: /^Incoming Assets$/i });
  const workOrdersNavButton = sidebarNavigation.getByRole("button", { name: /^Work Orders$/i });
  const createWorkOrderButton = sidebarNavigation.getByRole("button", { name: /^Create Work Order$/i });
  const viewWorkOrdersButton = sidebarNavigation.getByRole("button", { name: /^View Work Orders$/i });
  const partsNavButton = sidebarNavigation.getByRole("button", { name: /^Parts$/i });
  const addPartsButton = sidebarNavigation.getByRole("button", { name: /^Add Parts$/i });
  const viewPartsButton = sidebarNavigation.getByRole("button", { name: /^View Parts$/i });
  const transfersButton = sidebarNavigation.getByRole("button", { name: /^Transfers$/i });
  const archivesNavButton = sidebarNavigation.getByRole("button", { name: /^Archives$/i });
  const archivedAssetsButton = sidebarNavigation.getByRole("button", { name: /^Archived Assets$/i });
  const archiveApprovalsButton = sidebarNavigation.getByRole("button", { name: /^Archive Approvals$/i });
  const purchaseHistoryButton = sidebarNavigation.getByRole("button", { name: /^Purchase History$/i });
  const incomingPoButton = sidebarNavigation.getByRole("button", { name: /^Incoming PO$/i });
  const reportsNavButton = sidebarNavigation.getByRole("button", { name: /^Reports$/i });
  const assetReportsButton = sidebarNavigation.getByRole("button", { name: /^Asset Reports$/i });
  const workOrderReportsButton = sidebarNavigation.getByRole("button", { name: /^Work Order Reports$/i });
  const costReportsButton = sidebarNavigation.getByRole("button", { name: /^Cost Reports$/i });
  const partsReportsButton = sidebarNavigation.getByRole("button", { name: /^Parts Reports$/i });
  const userManagementButton = sidebarNavigation.getByRole("button", { name: /^User Management$/i });
  const rolesPermissionsButton = sidebarNavigation.getByRole("button", { name: /^Roles & Permissions$/i });
  const contractorsButton = sidebarNavigation.getByRole("button", { name: /^Contractors$/i });
  const dashboardDefaultsButton = sidebarNavigation.getByRole("button", { name: /^Dashboard Defaults$/i });
  const rateConfigurationButton = sidebarNavigation.getByRole("button", { name: /^Rate Configuration$/i });

  const viewAssetsHeading = page.locator("main").getByRole("heading", { name: /^(Assets|View Assets)$/i });
  const viewAssetsFilterPanel = page.locator("main").getByText("Filter Assets", { exact: true });
  const viewAssetsSearchButton = page.locator("main").getByRole("button", { name: /^Search$/i });
  const addAssetHeading = page.locator("main").getByRole("heading", { name: /Add.*Asset/i });
  const incomingAssetsHeading = page.locator("main").getByRole("heading", { name: "Incoming Assets" });
  const incomingAssetsTable = page.locator("main").getByRole("table");
  const createWorkOrderHeading = page.locator("main").getByRole("heading", { name: /Create.*Work Order/i });
  const viewWorkOrdersHeading = page.locator("main").getByRole("heading", { name: /Work Orders|View Work Orders/i });
  const addPartsHeading = page.locator("main").getByRole("heading", { name: /Add.*Parts?/i });
  const viewPartsHeading = page.locator("main").getByRole("heading", { name: /Parts|View Parts/i });
  const transfersHeading = page.locator("main").getByRole("heading", { name: /Transfers/i });
  const archivedAssetsHeading = page.locator("main").getByRole("heading", { name: /Archived Assets/i });
  const archiveApprovalsHeading = page.locator("main").getByRole("heading", { name: /Archive Approvals/i });
  const purchaseHistoryHeading = page.locator("main").getByRole("heading", { name: /Purchase History/i });
  const incomingPoHeading = page.locator("main").getByRole("heading", { name: /Incoming PO/i });
  const assetReportsHeading = page.locator("main").getByRole("heading", { name: /Asset Reports/i });
  const workOrderReportsHeading = page.locator("main").getByRole("heading", { name: /Work Order Reports/i });
  const costReportsHeading = page.locator("main").getByRole("heading", { name: /Cost Reports/i });
  const partsReportsHeading = page.locator("main").getByRole("heading", { name: /Parts Reports/i });
  const userManagementHeading = page.locator("main").getByRole("heading", { name: /User Management/i });
  const rolesPermissionsHeading = page.locator("main").getByRole("heading", { name: /Roles & Permissions/i });
  const contractorsHeading = page.locator("main").getByRole("heading", { name: /Contractors/i });
  const dashboardDefaultsHeading = page.locator("main").getByRole("heading", { name: /Dashboard Defaults/i });
  const rateConfigurationHeading = page.locator("main").getByRole("heading", { name: /Rate Configuration/i });

  const sidebarToggle = page.locator(
    'button[aria-label="Open menu"], button[aria-label="Expand sidebar"], button[aria-label="Collapse sidebar"]'
  ).first();

  async function ensureAssetsMenuOpen(): Promise<void> {
    if (!(await basePage.isVisible(assetNavButton, { timeout: 3000 }))) {
      await basePage.click(sidebarToggle, { description: "open/expand sidebar" });
      await basePage.waitForVisible(assetNavButton, { description: "Assets navigation button", timeout: 30_000 });
    }

    const assetsSubMenuVisible =
      (await basePage.isVisible(viewAssetsButton, { timeout: 1000 })) ||
      (await basePage.isVisible(addAssetButton, { timeout: 1000 })) ||
      (await basePage.isVisible(assetRequestsButton, { timeout: 1000 })) ||
      (await basePage.isVisible(incomingAssetsButton, { timeout: 1000 }));

    if (!assetsSubMenuVisible) {
      await basePage.click(assetNavButton, { description: "Assets navigation button" });
      await basePage.waitForVisible(viewAssetsButton, { description: "View Assets button", timeout: 30_000 });
    }
  }

  async function ensureSidebarMenuOpen(
    menuButton: ReturnType<Page["locator"]>,
    firstSubmenuButton: ReturnType<Page["locator"]>,
    menuDescription: string,
    firstSubmenuDescription: string
  ): Promise<void> {
    if (!(await basePage.isVisible(menuButton, { timeout: 3000 }))) {
      await basePage.click(sidebarToggle, { description: "open/expand sidebar" });
      await basePage.waitForVisible(menuButton, { description: menuDescription, timeout: 30_000 });
    }

    if (!(await basePage.isVisible(firstSubmenuButton, { timeout: 1000 }))) {
      await basePage.click(menuButton, { description: menuDescription });
      await basePage.waitForVisible(firstSubmenuButton, { description: firstSubmenuDescription, timeout: 30_000 });
    }
  }

  async function ensureSidebarButtonVisible(
    button: ReturnType<Page["locator"]>,
    description: string
  ): Promise<void> {
    if (!(await basePage.isVisible(button, { timeout: 3000 }))) {
      await basePage.click(sidebarToggle, { description: "open/expand sidebar" });
      await basePage.waitForVisible(button, { description, timeout: 30_000 });
    }
  }

  async function waitForAssetPageLoaded(): Promise<void> {
    const loadingIndicators = page.locator(
      '[aria-busy="true"], [role="progressbar"], [class*="loading"], [class*="spinner"], [class*="skeleton"]'
    );

    await page.waitForLoadState("domcontentloaded");
    await basePage.waitForNetworkIdle();

    if (await loadingIndicators.first().isVisible({ timeout: 1000 }).catch(() => false)) {
      await loadingIndicators.first().waitFor({ state: "hidden", timeout: 30_000 });
    }

    await basePage.wait(1);
  }

  async function enterAssetsView(): Promise<void> {
    await ensureAssetsMenuOpen();
    await basePage.waitForVisible(viewAssetsButton, { description: "View Assets button", timeout: 30_000 });
    await basePage.click(viewAssetsButton, { description: "View Assets button" });
    await waitForAssetPageLoaded();
    await basePage.waitForVisible(viewAssetsHeading, { description: "View Assets heading", timeout: 30_000 });
    await basePage.waitForVisible(viewAssetsFilterPanel, { description: "View Assets filter panel", timeout: 30_000 });
    await basePage.waitForVisible(viewAssetsSearchButton, { description: "View Assets search button", timeout: 30_000 });
  }

  async function enterAddAssetView(): Promise<void> {
    await ensureAssetsMenuOpen();
    await basePage.waitForVisible(addAssetButton, { description: "Add Asset button", timeout: 30_000 });
    await basePage.click(addAssetButton, { description: "Add Asset button" });
    await waitForAssetPageLoaded();
    await basePage.waitForVisible(addAssetHeading, { description: "Add Asset heading", timeout: 30_000 });
  }

  async function enterAssetRequestsView(): Promise<void> {
    await ensureAssetsMenuOpen();
    await basePage.waitForVisible(assetRequestsButton, { description: "Asset Requests button", timeout: 30_000 });
    await basePage.click(assetRequestsButton, { description: "Asset Requests button" });
    await waitForAssetPageLoaded();
  }

  async function enterIncomingAssetsView(): Promise<void> {
    await ensureAssetsMenuOpen();
    await basePage.waitForVisible(incomingAssetsButton, { description: "Incoming Assets button", timeout: 30_000 });
    await basePage.click(incomingAssetsButton, { description: "Incoming Assets button" });
    await waitForAssetPageLoaded();
    await basePage.waitForVisible(incomingAssetsHeading, { description: "Incoming Assets heading", timeout: 30_000 });
    await basePage.waitForVisible(incomingAssetsTable, { description: "Incoming Assets table", timeout: 30_000 });
  }

  async function enterCreateWorkOrderView(): Promise<void> {
    await ensureSidebarMenuOpen(
      workOrdersNavButton,
      createWorkOrderButton,
      "Work Orders navigation button",
      "Create Work Order button"
    );
    await basePage.click(createWorkOrderButton, { description: "Create Work Order button" });
    await waitForAssetPageLoaded();
    await basePage.waitForVisible(createWorkOrderHeading, { description: "Create Work Order heading", timeout: 30_000 });
  }

  async function enterViewWorkOrdersView(): Promise<void> {
    await ensureSidebarMenuOpen(
      workOrdersNavButton,
      createWorkOrderButton,
      "Work Orders navigation button",
      "Create Work Order button"
    );
    await basePage.waitForVisible(viewWorkOrdersButton, { description: "View Work Orders button", timeout: 30_000 });
    await basePage.click(viewWorkOrdersButton, { description: "View Work Orders button" });
    await waitForAssetPageLoaded();
    await basePage.waitForVisible(viewWorkOrdersHeading, { description: "View Work Orders heading", timeout: 30_000 });
  }

  async function enterAddPartsView(): Promise<void> {
    await ensureSidebarMenuOpen(partsNavButton, addPartsButton, "Parts navigation button", "Add Parts button");
    await basePage.click(addPartsButton, { description: "Add Parts button" });
    await waitForAssetPageLoaded();
    await basePage.waitForVisible(addPartsHeading, { description: "Add Parts heading", timeout: 30_000 });
  }

  async function enterViewPartsView(): Promise<void> {
    await ensureSidebarMenuOpen(partsNavButton, addPartsButton, "Parts navigation button", "Add Parts button");
    await basePage.waitForVisible(viewPartsButton, { description: "View Parts button", timeout: 30_000 });
    await basePage.click(viewPartsButton, { description: "View Parts button" });
    await waitForAssetPageLoaded();
    await basePage.waitForVisible(viewPartsHeading, { description: "View Parts heading", timeout: 30_000 });
  }

  async function enterTransfersView(): Promise<void> {
    await ensureSidebarButtonVisible(transfersButton, "Transfers button");
    await basePage.click(transfersButton, { description: "Transfers button" });
    await waitForAssetPageLoaded();
    await basePage.waitForVisible(transfersHeading, { description: "Transfers heading", timeout: 30_000 });
  }

  async function enterArchivedAssetsView(): Promise<void> {
    await ensureSidebarMenuOpen(archivesNavButton, archivedAssetsButton, "Archives navigation button", "Archived Assets button");
    await basePage.click(archivedAssetsButton, { description: "Archived Assets button" });
    await waitForAssetPageLoaded();
    await basePage.waitForVisible(archivedAssetsHeading, { description: "Archived Assets heading", timeout: 30_000 });
  }

  async function enterArchiveApprovalsView(): Promise<void> {
    await ensureSidebarMenuOpen(archivesNavButton, archivedAssetsButton, "Archives navigation button", "Archived Assets button");
    await basePage.waitForVisible(archiveApprovalsButton, { description: "Archive Approvals button", timeout: 30_000 });
    await basePage.click(archiveApprovalsButton, { description: "Archive Approvals button" });
    await waitForAssetPageLoaded();
    await basePage.waitForVisible(archiveApprovalsHeading, { description: "Archive Approvals heading", timeout: 30_000 });
  }

  async function enterPurchaseHistoryView(): Promise<void> {
    await ensureSidebarButtonVisible(purchaseHistoryButton, "Purchase History button");
    await basePage.click(purchaseHistoryButton, { description: "Purchase History button" });
    await waitForAssetPageLoaded();
    await basePage.waitForVisible(purchaseHistoryHeading, { description: "Purchase History heading", timeout: 30_000 });
  }

  async function enterIncomingPoView(): Promise<void> {
    await ensureSidebarButtonVisible(incomingPoButton, "Incoming PO button");
    await basePage.click(incomingPoButton, { description: "Incoming PO button" });
    await waitForAssetPageLoaded();
    await basePage.waitForVisible(incomingPoHeading, { description: "Incoming PO heading", timeout: 30_000 });
  }

  async function enterAssetReportsView(): Promise<void> {
    await ensureSidebarMenuOpen(reportsNavButton, assetReportsButton, "Reports navigation button", "Asset Reports button");
    await basePage.click(assetReportsButton, { description: "Asset Reports button" });
    await waitForAssetPageLoaded();
    await basePage.waitForVisible(assetReportsHeading, { description: "Asset Reports heading", timeout: 30_000 });
  }

  async function enterWorkOrderReportsView(): Promise<void> {
    await ensureSidebarMenuOpen(reportsNavButton, assetReportsButton, "Reports navigation button", "Asset Reports button");
    await basePage.waitForVisible(workOrderReportsButton, { description: "Work Order Reports button", timeout: 30_000 });
    await basePage.click(workOrderReportsButton, { description: "Work Order Reports button" });
    await waitForAssetPageLoaded();
    await basePage.waitForVisible(workOrderReportsHeading, { description: "Work Order Reports heading", timeout: 30_000 });
  }

  async function enterCostReportsView(): Promise<void> {
    await ensureSidebarMenuOpen(reportsNavButton, assetReportsButton, "Reports navigation button", "Asset Reports button");
    await basePage.waitForVisible(costReportsButton, { description: "Cost Reports button", timeout: 30_000 });
    await basePage.click(costReportsButton, { description: "Cost Reports button" });
    await waitForAssetPageLoaded();
    await basePage.waitForVisible(costReportsHeading, { description: "Cost Reports heading", timeout: 30_000 });
  }

  async function enterPartsReportsView(): Promise<void> {
    await ensureSidebarMenuOpen(reportsNavButton, assetReportsButton, "Reports navigation button", "Asset Reports button");
    await basePage.waitForVisible(partsReportsButton, { description: "Parts Reports button", timeout: 30_000 });
    await basePage.click(partsReportsButton, { description: "Parts Reports button" });
    await waitForAssetPageLoaded();
    await basePage.waitForVisible(partsReportsHeading, { description: "Parts Reports heading", timeout: 30_000 });
  }

  async function enterUserManagementView(): Promise<void> {
    await ensureSidebarButtonVisible(userManagementButton, "User Management button");
    await basePage.click(userManagementButton, { description: "User Management button" });
    await waitForAssetPageLoaded();
    await basePage.waitForVisible(userManagementHeading, { description: "User Management heading", timeout: 30_000 });
  }

  async function enterRolesPermissionsView(): Promise<void> {
    await ensureSidebarButtonVisible(rolesPermissionsButton, "Roles & Permissions button");
    await basePage.click(rolesPermissionsButton, { description: "Roles & Permissions button" });
    await waitForAssetPageLoaded();
    await basePage.waitForVisible(rolesPermissionsHeading, { description: "Roles & Permissions heading", timeout: 30_000 });
  }

  async function enterContractorsView(): Promise<void> {
    await ensureSidebarButtonVisible(contractorsButton, "Contractors button");
    await basePage.click(contractorsButton, { description: "Contractors button" });
    await waitForAssetPageLoaded();
    await basePage.waitForVisible(contractorsHeading, { description: "Contractors heading", timeout: 30_000 });
  }

  async function enterDashboardDefaultsView(): Promise<void> {
    await ensureSidebarButtonVisible(dashboardDefaultsButton, "Dashboard Defaults button");
    await basePage.click(dashboardDefaultsButton, { description: "Dashboard Defaults button" });
    await waitForAssetPageLoaded();
    await basePage.waitForVisible(dashboardDefaultsHeading, { description: "Dashboard Defaults heading", timeout: 30_000 });
  }

  async function enterRateConfigurationView(): Promise<void> {
    await ensureSidebarButtonVisible(rateConfigurationButton, "Rate Configuration button");
    await basePage.click(rateConfigurationButton, { description: "Rate Configuration button" });
    await waitForAssetPageLoaded();
    await basePage.waitForVisible(rateConfigurationHeading, { description: "Rate Configuration heading", timeout: 30_000 });
  }

  return {
    ...basePage,
    enterAssetsView,
    enterAddAssetView,
    enterAssetRequestsView,
    enterIncomingAssetsView,
    enterCreateWorkOrderView,
    enterViewWorkOrdersView,
    enterAddPartsView,
    enterViewPartsView,
    enterTransfersView,
    enterArchivedAssetsView,
    enterArchiveApprovalsView,
    enterPurchaseHistoryView,
    enterIncomingPoView,
    enterAssetReportsView,
    enterWorkOrderReportsView,
    enterCostReportsView,
    enterPartsReportsView,
    enterUserManagementView,
    enterRolesPermissionsView,
    enterContractorsView,
    enterDashboardDefaultsView,
    enterRateConfigurationView,
  };
}

export type RxAssetPage = ReturnType<typeof createRxAssetPage>;
