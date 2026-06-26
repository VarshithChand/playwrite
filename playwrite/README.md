# Quick Start Guide — RxApps360 Automation Testing

## Installation

### Step 1: Install Node.js dependencies
```bash
npm install
```

### Step 2: Install Playwright browsers
```bash
npx playwright install chromium
```

### Step 3: Configure credentials in `.env`
Update the `.env` file with your test account credentials:

```env
APP_USER=your-email@example.com
APP_PASSWORD=your-password
MFA_SECRET=your-totp-secret-base32
LOG_LEVEL=info
```

> **How to get MFA_SECRET:** During 2FA setup, copy the Base32 code shown in your authenticator app setup screen.

---

## Running Tests

### Run all tests (headless mode — fastest)
```bash
npm test
```

### Run all tests with browser visible
```bash
npx playwright test --headed
```

### Run only RxApps tests
```bash
npm run test:rxapps -- --headed
```

### Run a specific test file
```bash
npx playwright test src/tests/rxapps/login.test.ts --headed
npx playwright test src/tests/rxapps/rxorder.test.ts --headed
npx playwright test src/tests/rxapps/rxplan.test.ts --headed
npx playwright test src/tests/rxapps/rxactivate.test.ts --headed
npx playwright test src/tests/rxapps/rxasset.test.ts --headed
```

### Run tests by name pattern
```bash
npx playwright test -g "login page loads" --headed
npx playwright test -g "MFA" --headed
```

### Run in debug mode (step through each action)
```bash
npm run test:debug
```

---

## Viewing Test Reports

### HTML Report (latest run)
```bash
npm run report:html
```

### Allure Report (rich analytics)
```bash
npm run allure:report
```

---

## Available npm Scripts

| Command | Purpose |
|---------|---------|
| `npm test` | Run all tests headless |
| `npm run test:headed` | Run all tests with browser visible |
| `npm run test:debug` | Debug mode (step through) |
| `npm run test:rxapps` | Run only RxApps360 tests |
| `npm run test:login` | Run only login tests |
| `npm run test:mfa` | Run only MFA tests |
| `npm run test:logout` | Run only logout tests |
| `npm run report:html` | View HTML test report |
| `npm run allure:report` | Generate and view Allure report |

---

## Project Structure

```
src/
├── core/
│   ├── ElementActions.ts   # Reusable interactions (click, type, dropdown, etc.)
│   └── errors.ts           # Custom error classes
├── pages/
│   ├── BasePage.ts         # Base class with shared methods
│   └── rxapps/
│       ├── RxLoginPage.ts
│       └── RxHomePage.ts
├── tests/
│   └── rxapps/
│       ├── login.test.ts
│       ├── logout.test.ts
│       ├── rxorder.test.ts
│       ├── rxplan.test.ts
│       ├── rxactivate.test.ts
│       └── rxasset.test.ts
└── utils/
    ├── logger.ts           # Structured logging
    ├── mfa.ts              # TOTP generation
    └── helpers.ts          # Generic utilities

config/
├── env.config.ts           # Environment configuration
└── timeouts.ts             # Centralized timeout values
```

---

## Key Features

✅ **Page Object Model** — Clean, maintainable test structure  
✅ **Reusable Actions** — Consistent wait/click/type logic across all tests  
✅ **MFA Support** — Automatic TOTP code generation for 2FA login  
✅ **Allure Reporting** — Rich visual analytics and trends  
✅ **Screenshots** — Auto-captured at key test steps  
✅ **Error Handling** — Descriptive, named errors (ElementNotFound, Timeout, etc.)  
✅ **CI/CD Ready** — GitHub Actions workflow included  

---

## Troubleshooting

**Problem:** `'playwright' is not recognized`
```bash
# Solution: Install dependencies first
npm install
npx playwright install
```

**Problem:** Tests are timing out
```bash
# Increase timeout in playwright.config.ts or for a specific test:
await expect(page).toHaveURL(/login/, { timeout: 30_000 });
```

**Problem:** MFA code is invalid
```bash
# Verify MFA_SECRET in .env matches your authenticator app
# The code regenerates every 30 seconds — sync your system clock
```

**Problem:** Tests can't find elements
```bash
# Run in debug mode to inspect the page:
npm run test:debug
```

---

## Next Steps

1. ✅ Complete installation steps above
2. ✅ Update `.env` with your credentials
3. ✅ Run `npm test` to verify setup
4. ✅ Explore test files in `src/tests/rxapps/`
5. ✅ Add your own tests following the same pattern

For detailed documentation, see [README.md](README.md).
