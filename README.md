# PHYE-HRMS Playwright SDET Framework

Comprehensive Playwright framework for API and E2E testing of PHYE-HRMS. It uses Playwright's
API request context, shared fixtures, JSON test data, and Allure reporting for full test coverage.

## 📋 Structure

```text
.
|-- .github/
|   `-- workflows/
|       `-- playwright.yml             # CI workflow
|-- api/
|   |-- clients/                        # API request wrappers per module
|   |   |-- approveLeave.client.js
|   |   |-- asset.client.js
|   |   |-- auth.client.js
|   |   |-- buildVersion.client.js
|   |   |-- employee.client.js
|   |   |-- holiday.client.js
|   |   |-- itDeclaration.client.js
|   |   |-- leave.client.js
|   |   |-- module.client.js
|   |   |-- moduleUserRole.client.js
|   |   |-- raisedQueries.client.js
|   |   |-- sendEmail.client.js
|   |   |-- sendMail.client.js
|   |   |-- timetracker.client.js
|   |   `-- userRole.client.js
|   `-- constants/
|       |-- httpStatus.js              # Shared HTTP status constants
|       |-- *.constants.js             # Endpoint paths per module
|-- fixtures/
|   |-- auth.fixture.js                # Base fixture with QA token
|   |-- *.fixture.js                   # Module-specific fixtures
|-- test-data/
|   |-- *.json                         # Test payloads and test values per module
|   `-- files/                         # Upload fixtures (PDF, images, invalid files)
|-- tests/
|   `-- api/
|       |-- *.api.spec.js              # Main API tests (discovers via *.api.spec.js pattern)
|-- scripts/
|   `-- run-tests.js                   # Playwright runner and Allure report helper
|-- utils/
|   `-- token.util.js                  # Cached-token reader
|-- globalSetup.js                     # Pre-run: creates and caches QA token
|-- playwright.config.js               # Playwright config (testMatch, projects, setup)
|-- package.json
`-- .env                               # Local .env; not committed
```

**Generated/gitignored:** `.cache/`, `reports/`, `test-results/`

## 🚀 Quick Start

```bash
# 1. Install dependencies
npm install
npx playwright install

# 2. Create .env with API_BASE_URL and test data
# See Environment section below for required variables

# 3. Start the backend API server on localhost:3000
# (The framework assumes the API is running before test execution)

# 4. Run the API test suite
npm test
```

## 🎯 Commands

| Command | Description |
|---------|-------------|
| `npm test` | Run all API tests. |
| `npm run test:api` | Run the `api` Playwright project. |
| `npm run test:smoke` | Run critical-path tests tagged `@smoke`. |
| `npm run test:sanity` | Run core tests tagged `@sanity`. |
| `npm run test:regression` | Run full stable suite tagged `@regression`. |
| `npm run test:empty` | Run empty/missing-field scenarios tagged `@emptydata`. |
| `npm run test:headed` | Run with browser UI visible. |
| `npm run test:ui` | Open Playwright UI mode for interactive debugging. |
| `npm run test:debug` | Run with Playwright Inspector. |
| `npm run report` | Open the latest Allure HTML report. |

## ⚙️ Environment Configuration

**Required:** Start the backend API server on `localhost:3000` before running tests.

`API_BASE_URL` defaults to `http://localhost:3000`. Configure test fixtures and environment values in `.env`:

| Group | Variables |
|-------|-----------|
| **API** | `API_BASE_URL`, `PLAYWRIGHT_TIMEOUT`, `PLAYWRIGHT_EXPECT_TIMEOUT` |
| **Auth** | `TEST_EMAIL` (QA user for token generation) or `QA_TOKEN` (pre-generated; takes priority) |
| **Asset module** | `TEST_ASSET_ID`, `TEST_ASSET_TYPE_ID`, `TEST_ASSET_MODEL_ID`, `INVALID_ASSET_ID`, `TEST_UNASSIGNED_ASSET_ID` |
| **Employee module** | `TEST_EMPLOYEE_ID`, `INVALID_EMPLOYEE_ID`, `TEST_EMPLOYEE_ID_FOR_UPDATES`, `TEST_EMPLOYEE_ID_FOR_ASSETS`, `TEST_EMPLOYEE_ID_FOR_PHOTOS`, `TEST_EMPLOYEE_WITHOUT_ASSETS_ID`, `TEST_EMPLOYEE_ID_WITHOUT_PHOTO` |
| **Employee identities** | `TEST_EMAIL`, `TEST_EXISTING_EMPLOYEE_EMAIL`, `TEST_INACTIVE_EMAIL`, `DUPLICATE_EMAIL`, `TEST_EMPLOYEE_NUMBER` |
| **Related records** | `TEST_ROLE_ID`, `TEST_MANAGER_ID`, `INACTIVE_MANAGER_ID`, `ADMIN_EMPLOYEE_ID`, `MANAGER_EMPLOYEE_ID` |
| **File uploads** | `TEST_FILE_ID`, `TEST_AADHAAR_FILE_ID`, `TEST_PAN_FILE_ID`, `TEST_PHOTO_FILE_ID`, `AADHAAR_FILE`, `PAN_FILE`, `PHOTO_FILE`, `INVALID_FILE` |

See `test-data/*.json` for baseline payloads and fixture paths.

## 🏗️ Implementation Patterns

### 1. Authentication & Fixtures

- **globalSetup.js**: Runs before all tests. Reads `QA_TOKEN` (GitHub secret) or generates a token via `POST /auth/qa-token` using `TEST_EMAIL`.
- **Token Cache**: Stored at runtime in `.cache/token.json` (git-ignored).
- **auth.fixture.js**: Base Playwright fixture that reads the cached token as `qaToken`.
- **Module Fixtures**: Each module (e.g., `asset.fixture.js`) extends auth and creates a client:

```js
const { test: base, expect } = require('./auth.fixture');
const AssetClient = require('../api/clients/asset.client');

const test = base.extend({
  assetClient: async ({ request, qaToken }, use) => {
    await use(new AssetClient(request, qaToken));
  },
});

module.exports = { test, expect };
```

### 2. API Clients

Each module has a client in `api/clients/<module>.client.js`:

```js
class AssetClient {
  constructor(request, token = null) {
    this.request = request;
    this.token = token;
  }

  authHeaders() {
    return this.token ? { Authorization: `Bearer ${this.token}` } : {};
  }

  getAssets() {
    return this.request.get('/assets', {
      headers: this.authHeaders(),
    });
  }

  createAsset(payload) {
    return this.request.post('/assets', {
      headers: { ...this.authHeaders(), 'Content-Type': 'application/json' },
      data: payload,
    });
  }
}
```

### 3. Constants

Endpoint paths and status codes are centralized in `api/constants/<module>.constants.js`:

```js
const { HTTP_STATUS } = require('./httpStatus');

const ASSET_ENDPOINTS = {
  LIST: '/assets',
  CREATE: '/assets',
  DETAIL: (id) => `/assets/${id}`,
};

module.exports = { HTTP_STATUS, ASSET_ENDPOINTS };
```

**Shared HTTP status constants** (`api/constants/httpStatus.js`):
```js
const HTTP_STATUS = Object.freeze({
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500,
});
```

### 4. Test Data

`test-data/<module>.json` contains complete valid payloads, update payloads, invalid IDs, and expected error messages—**no secrets**:

```json
{
  "createAsset": {
    "name": "Laptop",
    "type": "Electronics",
    "serialNumber": "SN12345"
  },
  "updateAsset": {
    "status": "Available"
  },
  "invalid": {
    "assetId": "invalid-id"
  },
  "messages": {
    "notFound": "Asset not found"
  }
}
```

### 5. Test Structure

Each test file: `tests/api/<module>.api.spec.js`

```js
const { test, expect } = require('../../fixtures/asset.fixture');
const { HTTP_STATUS, ASSET_ENDPOINTS } = require('../../api/constants/asset.constants');
const assetData = require('../../test-data/asset.json');

test.describe('Asset APIs', () => {
  test('TC01 List all assets @read @assets @smoke @sanity @regression', async ({
    assetClient,
  }) => {
    const response = await assetClient.getAssets();

    expect(response.status()).toBe(HTTP_STATUS.OK);
    const body = await response.json();
    expect(Array.isArray(body)).toBe(true);
  });

  test('TC02 Create asset @create @crud @assets @sanity @regression', async ({
    assetClient,
  }) => {
    const response = await assetClient.createAsset(assetData.createAsset);

    expect(response.status()).toBe(HTTP_STATUS.CREATED);
    const body = await response.json();
    expect(body.id).toBeDefined();
  });
});
```

### 6. Test Tags

Tags are placed on **individual tests**, never on `test.describe()`. They enable selective test runs:

| Tag | Meaning |
|-----|---------|
| `@smoke` | Critical path; run after deployment. Limited, independent cases only. |
| `@sanity` | Core coverage; runs on every `dev` commit. Stable, reliable tests. |
| `@regression` | Full suite. Every API test must have this tag. |
| `@read` | Read-only operation (GET). |
| `@create` | Create operation (POST). |
| `@update` | Update operation (PUT/PATCH). |
| `@delete` | Delete operation (DELETE). |
| `@crud` | Part of a create/update/delete workflow. |
| `@emptydata` | Missing-field or empty-input validation. |
| `@<module>` | Module-specific tag (e.g., `@assets`, `@leave`, `@employees`). |

**Example tag pattern:**
```
@read @assets @smoke @sanity @regression
@create @crud @leave @sanity @regression
@update @crud @employees @regression
@emptydata @assets @regression
```

### 7. Empty-Data Tests

Missing-field and empty-input scenarios are tagged `@emptydata` and live alongside normal tests in `tests/api/<module>.api.spec.js`:

```js
test.describe('Empty Data Validation', () => {
  test('TC_EMPTY_001 Create asset without name @emptydata @create @regression', async ({
    assetClient,
  }) => {
    const payload = { ...assetData.createAsset };
    delete payload.name;

    const response = await assetClient.createAsset(payload);

    expect(response.status()).toBe(HTTP_STATUS.BAD_REQUEST);
    const body = await response.json();
    expect(body.message).toContain('Name is required');
  });
});
```

Use `npm run test:empty` to run only empty-data tests.

## 🎪 CI/CD Pipeline

GitHub Actions workflow (`.github/workflows/playwright.yml`):

1. Installs Node.js 22, dependencies, and Playwright browsers.
2. Requires `API_BASE_URL` (GitHub variable) and either `QA_TOKEN` (secret) or `TEST_EMAIL` (variable).
3. Runs `npm run test:sanity` on every push to `dev` and pull request.
4. Uploads `reports/allure-results/` and `test-results/` (even on failure).

**GitHub Configuration:**
- Variable `API_BASE_URL`: URL reachable from GitHub Actions.
- Variable `TEST_EMAIL`: QA user email for token generation.
- Secret `QA_TOKEN`: Optional pre-generated token (takes priority over `TEST_EMAIL`).

## 🧪 Adding a New Module

1. **Create constants** → `api/constants/<module>.constants.js`
   - Export endpoint paths and HTTP status constants.

2. **Create client** → `api/clients/<module>.client.js`
   - Implement request methods; use `authHeaders()` for protected endpoints.

3. **Create fixture** → `fixtures/<module>.fixture.js`
   - Extend `auth.fixture.js`; create and expose the module client.

4. **Add test data** → `test-data/<module>.json`
   - Valid baseline payloads, update payloads, invalid IDs, expected error messages.

5. **Write API tests** → `tests/api/<module>.api.spec.js`
   - Import fixture, constants, and test data.
   - Tag each test individually: `@<operation> @<module> @<level> @regression`.
   - Cover: happy paths, validation errors, unauthorized, empty/missing fields.

6. **Add empty-data tests** → Same file, in a `test.describe('Empty Data Validation')`
   - Tag all with `@emptydata @regression`.
   - Clone baseline payloads and remove one field at a time.

7. **Verify:**
   - No secrets in JSON or code.
   - All endpoints come from constants files.
   - All protected requests use the cached token via fixtures.
   - Every test has `@regression` plus appropriate operation and module tags.

## 🎨 Future UI Testing

When adding E2E/UI tests:

1. Create a new Playwright project in `playwright.config.js` (e.g., `{ name: 'ui', ... }`).
2. Follow the same fixture pattern for page objects and shared setup.
3. Store UI selectors and URLs in constants files (e.g., `ui/constants/pages.constants.js`).
4. Keep test data for form inputs in `test-data/ui.json`.
5. Use the same tag strategy and Allure reporting.

## 📊 Test Execution

```bash
# Start the backend API server first (must be running on localhost:3000)

# Run all tests
npm test

# Run by level
npm run test:smoke
npm run test:sanity
npm run test:regression

# Run a specific module
npx playwright test --grep @assets

# Run with interactive UI
npm run test:ui

# Debug a specific test
npx playwright test --debug tests/api/asset.api.spec.js

# Generate and open Allure report
npm run report
```

## 📝 Notes

- **Mutation tests** (create/update/delete) are ordered to avoid data conflicts.
- **Token setup** runs once in `globalSetup.js` and is cached for the entire test run.
- **Allure reports** are generated in `reports/allure-report/` and viewable via `npm run report`.
- **Test results** are saved in `test-results/` for CI artifact upload.

Use `@smoke`, `@sanity`, or `@regression` for the standard run levels. Additional
labels identify API intent: `@read`, `@create`, `@update`, `@delete`, `@crud`,
`@assets`, `@files`, `@email`, `@search`, `@roles`, `@dashboard`, and `@hierarchy`.

## Adding tests

1. Add endpoints and status codes in `api/constants/`.
2. Add the required request method in `api/clients/`.
3. Add or extend the relevant fixture in `fixtures/`.
4. Create `tests/api/<feature>.api.spec.js` and add test data under `test-data/`.

## CI

GitHub Actions runs `npm run test:sanity` on pushes and pull requests to `dev`.
Configure the repository `API_BASE_URL` and `TEST_EMAIL` variables. Set the
optional `QA_TOKEN` repository secret to use a pre-generated Bearer token;
otherwise the global setup generates a QA token for `TEST_EMAIL`.
