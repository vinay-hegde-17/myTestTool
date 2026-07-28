# PHYE-HRMS Playwright SDET Framework

Lean Playwright framework for testing the PHYE-HRMS API. It uses Playwright's
API request context, shared fixtures, JSON test data, and Allure reporting.

## Structure

```text
.
|-- .github/
|   `-- workflows/
|       `-- playwright.yml             # CI workflow
|-- api/
|   |-- clients/
|   |   |-- asset.client.js            # Asset API client
|   |   |-- auth.client.js             # Authentication API client
|   |   |-- employee.client.js         # Employee API client
|   |   `-- leave.client.js            # Leave API client
|   `-- constants/
|       |-- asset.constants.js         # Asset endpoints and HTTP status codes
|       |-- auth.constants.js          # Auth endpoints and HTTP status codes
|       |-- employee.constants.js      # Employee endpoints and HTTP status codes
|       `-- leave.constants.js         # Leave endpoints and HTTP status codes
|-- fixtures/
|   |-- asset.fixture.js
|   |-- auth.fixture.js                # Provides the QA token
|   |-- employee.fixture.js
|   `-- leave.fixture.js
|-- scripts/
|   `-- run-tests.js                   # Test runner and Allure report helper
|-- test-data/
|   |-- asset.json
|   |-- auth.json
|   |-- employee.json
|   |-- leave.json
|   `-- files/                         # Upload fixtures (PDF, image, invalid file)
|-- tests/
|   |-- api/
|   |   |-- asset.api.spec.js
|   |   |-- auth.api.spec.js
|   |   |-- employee.api.spec.js
|   |   `-- leave.api.spec.js
|   `-- empty/                         # Empty-data scenarios
|-- utils/
|   `-- token.util.js                  # Cached-token reader
|-- globalSetup.js                     # Creates the cached QA token
|-- playwright.config.js
|-- package.json
`-- .env                              # Local configuration; not committed
```

Generated, gitignored directories: `.cache/`, `reports/`, and `test-results/`.

## Quick start

```bash
npm install
npx playwright install
# Create .env with API_BASE_URL and required test-fixture values.
npm test
```

## Commands

| Command | Description |
|---------|-------------|
| `npm test` | Run the default API suite. |
| `npm run test:api` | Run the `api` Playwright project. |
| `npm run test:smoke` | Run tests labelled `@smoke`. |
| `npm run test:sanity` | Run tests labelled `@sanity`. |
| `npm run test:regression` | Run tests labelled `@regression`. |
| `npm run test:headed` | Run Playwright in headed mode. |
| `npm run test:ui` | Open Playwright UI mode. |
| `npm run test:debug` | Run with the Playwright Inspector. |
| `npm run report` | Open the latest Allure report. |
| `npm run test:empty` | Run empty-data scenarios; this currently requires a config change because `testMatch` includes only `*.api.spec.js`. |

## Environment

`API_BASE_URL` defaults to `http://localhost:3000`. The suites also use
test-fixture IDs, emails, file IDs, and upload paths. Configure values for the
tests you intend to run in `.env`.

| Group | Variables |
|-------|-----------|
| API and Playwright | `API_BASE_URL`, `PLAYWRIGHT_TIMEOUT`, `PLAYWRIGHT_EXPECT_TIMEOUT` |
| Asset tests | `TEST_ASSET_ID`, `TEST_ASSET_TYPE_ID`, `TEST_ASSET_MODEL_ID`, `INVALID_ASSET_ID`, `TEST_UNASSIGNED_ASSET_ID` |
| Employee tests | `TEST_EMPLOYEE_ID`, `INVALID_EMPLOYEE_ID`, `TEST_EMPLOYEE_ID_FOR_UPDATES`, `TEST_EMPLOYEE_ID_FOR_ASSETS`, `TEST_EMPLOYEE_ID_FOR_PHOTOS`, `TEST_EMPLOYEE_WITHOUT_ASSETS_ID`, `TEST_EMPLOYEE_ID_WITHOUT_PHOTO` |
| Employee identities | `TEST_EMAIL`, `TEST_EXISTING_EMPLOYEE_EMAIL`, `TEST_INACTIVE_EMAIL`, `DUPLICATE_EMAIL`, `TEST_EMPLOYEE_NUMBER` |
| Related records | `TEST_ROLE_ID`, `TEST_MANAGER_ID`, `INACTIVE_MANAGER_ID`, `ADMIN_EMPLOYEE_ID`, `MANAGER_EMPLOYEE_ID` |
| Files | `TEST_FILE_ID`, `TEST_AADHAAR_FILE_ID`, `TEST_PAN_FILE_ID`, `TEST_PHOTO_FILE_ID`, `AADHAAR_FILE`, `PAN_FILE`, `PHOTO_FILE`, `INVALID_FILE` |

`test-data/employee.json` contains the standard employee payloads and the
repository-relative paths for upload fixtures.

## Employee API labels and order

The employee suite keeps mutation groups in create, update (including asset
assignment), then delete (asset unassignment and photo removal) order. Mutation
tests run serially so that they do not modify a record while another test uses it.

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
