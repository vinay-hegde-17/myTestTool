# API Test Framework Implementation Guide

This document explains how the PHYE-HRMS API test framework is built and how
to extend it consistently. It is also a reusable instruction set for an AI tool
when adding a new API module and its test cases.

## 1. Purpose and design

The project is a CommonJS Playwright API-testing framework. It separates API
knowledge, test data, authentication, and test assertions so that tests remain
readable and maintainable.

```text
Test spec -> Fixture -> API client -> Endpoint constants -> Application API
     |          |             |
     |          |             `-> request method, headers, body
     |          `-> authenticated client and shared Playwright fixtures
     `-> JSON test data, test case tags, assertions
```

The implemented modules are:

| Module | Client | Test spec | Test data |
|--------|--------|-----------|-----------|
| Auth | `api/clients/auth.client.js` | `tests/api/auth.api.spec.js` | `test-data/auth.json` |
| Asset | `api/clients/asset.client.js` | `tests/api/asset.api.spec.js` | `test-data/asset.json` |
| Employee | `api/clients/employee.client.js` | `tests/api/employee.api.spec.js` | `test-data/employee.json` |
| Leave | `api/clients/leave.client.js` | `tests/api/leave.api.spec.js` | `test-data/leave.json` |

## 2. Directory responsibilities

```text
api/constants/       Endpoint paths and reusable HTTP status constants
api/clients/         One request-wrapper class per API module
fixtures/            Playwright fixtures; creates clients and supplies auth
test-data/           Non-secret JSON payloads, invalid values, and IDs
test-data/files/     File-upload fixtures
tests/api/           Main API tests
tests/empty/         Empty/missing-field scenarios
utils/               Small shared helpers, such as cached-token access
globalSetup.js       Creates the cached QA token before the test run
scripts/run-tests.js Runs Playwright and prepares Allure output
.github/workflows/   CI configuration
```

Keep these responsibilities separate. Do not put endpoint URLs in a spec,
credentials in JSON, or raw request logic repeatedly in test files.

## 3. Authentication strategy

Most protected endpoints need `Authorization: Bearer <token>`.

1. `globalSetup.js` first checks for `QA_TOKEN`.
2. If `QA_TOKEN` is absent, it calls `/auth/qa-token` using `TEST_EMAIL`.
3. The token is stored only at runtime in `.cache/token.json`.
4. `fixtures/auth.fixture.js` reads the cached token as `qaToken`.
5. Module fixtures create their clients with `request` and `qaToken`.
6. Every protected client method uses `authHeaders()`.

Use a GitHub repository secret for `QA_TOKEN` (without the `Bearer ` prefix) or
a repository variable for `TEST_EMAIL`. Never commit a token, password, or
private API credential.

### Fixture pattern

Every protected module fixture extends the auth fixture:

```js
const { test: base, expect } = require('./auth.fixture');
const ModuleClient = require('../api/clients/module.client');

const test = base.extend({
  moduleClient: async ({ request, qaToken }, use) => {
    await use(new ModuleClient(request, qaToken));
  },
});

module.exports = { test, expect };
```

## 4. API constants and client pattern

### Constants

Create `api/constants/<module>.constants.js`. It contains only reusable status
codes and endpoint paths.

```js
const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
};

const MODULE_ENDPOINTS = {
  LIST: '/modules',
  CREATE: '/modules',
  UPDATE: '/modules',
};

module.exports = { HTTP_STATUS, MODULE_ENDPOINTS };
```

### Client

Create `api/clients/<module>.client.js`. A method represents a meaningful API
operation, not one variation of the same operation for every possible token or
empty body. Pass a token to the constructor and use the shared header helper.

```js
const { MODULE_ENDPOINTS } = require('../constants/module.constants');

class ModuleClient {
  constructor(request, token = null) {
    this.request = request;
    this.token = token;
  }

  authHeaders() {
    return this.token ? { Authorization: `Bearer ${this.token}` } : {};
  }

  listModules(params = {}) {
    return this.request.get(MODULE_ENDPOINTS.LIST, {
      headers: this.authHeaders(),
      params,
    });
  }

  createModule(payload) {
    return this.request.post(MODULE_ENDPOINTS.CREATE, {
      headers: {
        ...this.authHeaders(),
        'Content-Type': 'application/json',
      },
      data: payload,
    });
  }
}

module.exports = ModuleClient;
```

For intentional unauthenticated tests, create a client with no token in the
spec or make the raw request there. Do not create redundant `WithToken` and
`WithoutAuth` methods when the normal client constructor already supports both.

## 5. Test-data strategy

Store reusable, non-secret values in `test-data/<module>.json`.

```json
{
  "createModule": {
    "name": "Automation Module",
    "active": true
  },
  "updateModule": {
    "name": "Updated Automation Module"
  },
  "invalid": {
    "moduleId": "invalid-id"
  },
  "messages": {
    "duplicate": "Module already exists"
  }
}
```

Rules:

- Keep a complete valid baseline payload. Empty-data tests clone it and delete
  one field at a time.
- Put environment-specific or changing IDs in `.env` / GitHub variables, not
  committed JSON, when they cannot be stable test data.
- Use unique values for create tests when the API enforces uniqueness.
- Keep files used for multipart uploads under `test-data/files/`.
- Do not store tokens, passwords, or production personal data in JSON.

## 6. Test-case implementation strategy

Each test imports only its module fixture, HTTP status constants, and its JSON
test data.

```js
const { test, expect } = require('../../fixtures/module.fixture');
const { HTTP_STATUS } = require('../../api/constants/module.constants');
const moduleData = require('../../test-data/module.json');

test.describe('Module APIs', () => {
  test('TC01 List modules @read @module @smoke @sanity @regression', async ({
    moduleClient,
  }) => {
    const response = await moduleClient.listModules();

    expect(response.status()).toBe(HTTP_STATUS.OK);
    expect(await response.json()).toBeInstanceOf(Array);
  });
});
```

### Required test groups

For each new module, add the applicable cases:

1. Happy-path read operations.
2. Response status, body shape, and important field assertions.
3. Valid create/update/delete flow where supported.
4. Invalid ID, invalid input, missing mandatory fields, and duplicate data.
5. Unauthorized and invalid-token behavior where the API supports it.
6. Filter, query parameter, sorting, pagination, or role-specific behavior.
7. Empty-data scenarios in `tests/empty/` when meaningful.

Do not assert a status that is not supported by the API contract. When an
endpoint has environment-dependent validation, use an intentional allowed list
of statuses only when that variation is expected and documented.

## 7. Test tags and selection

Tags belong on each `test(...)` title, not on `test.describe(...)`. This lets
CI and developers choose exact test cases with `--grep`.

### Standard tags

| Tag | Meaning |
|-----|---------|
| `@smoke` | Small critical path; run after a deployment. |
| `@sanity` | Core endpoint coverage; runs on the `dev` CI workflow. |
| `@regression` | Full stable suite coverage. |
| `@read` | Read-only request, normally `GET`. |
| `@create` | Create operation, normally `POST`. |
| `@update` | Update operation, normally `PUT` or `PATCH`. |
| `@delete` | Delete operation, normally `DELETE`. |
| `@crud` | A create, update, or delete workflow. |

Add a module/domain tag too, for example `@auth`, `@assets`, `@leave`,
`@files`, or `@roles`.

Every main API test must include `@regression`. Mark a limited number of stable,
independent critical tests with `@smoke`. Mark the core tests that should run on
every `dev` change with `@sanity`.

Examples:

```text
TC01 List modules @read @module @smoke @sanity @regression
TC02 Create module @create @crud @module @sanity @regression
TC03 Reject invalid module ID @read @module @regression
TC04 Delete module @delete @crud @module @regression
```

Use the existing commands:

```bash
npm run test:smoke
npm run test:sanity
npm run test:regression
```

## 8. Empty-data tests

Place missing-field and empty-input cases in
`tests/empty/empty-data.<module>.spec.js`, tagged `@emptydata`.

```js
const payload = { ...moduleData.createModule };
delete payload.name;

const response = await moduleClient.createModule(payload);
expect(response.status()).toBe(HTTP_STATUS.BAD_REQUEST);
```

The valid JSON baseline must include `name`; otherwise this case would not
actually verify that removing the field changes the request. This is why the
employee base payload includes values such as `designation` and `reportingTo`.

The current Playwright configuration matches `*.api.spec.js` and excludes
`@emptydata` by default. Update the config deliberately before enabling empty
tests in CI; do not accidentally include them in the normal sanity suite.

## 9. CI strategy

The GitHub Actions workflow runs on pushes and pull requests to `dev`.

1. Install Node.js 22, project dependencies, and Playwright browsers.
2. Require `API_BASE_URL` and either `QA_TOKEN` or `TEST_EMAIL`.
3. Run `npm run test:sanity`.
4. Upload `reports/allure-results/` and `test-results/`, including on failure.

CI configuration:

| GitHub setting | Purpose |
|----------------|---------|
| Variable `API_BASE_URL` | API URL reachable from GitHub Actions. |
| Variable `TEST_EMAIL` | QA user email when a token is generated. |
| Secret `QA_TOKEN` | Optional pre-generated token; takes priority over `TEST_EMAIL`. |

## 10. New-module checklist

When adding `<module>`, create or update these files:

```text
api/constants/<module>.constants.js
api/clients/<module>.client.js
fixtures/<module>.fixture.js
test-data/<module>.json
tests/api/<module>.api.spec.js
tests/empty/empty-data.<module>.spec.js       # when empty-data coverage applies
README.md                                      # update the project tree/commands only if needed
FRAMEWORK_IMPLEMENTATION_GUIDE.md              # update this guide if the strategy changes
```

Before finishing, verify:

- Every endpoint comes from a constants file.
- Every protected request obtains a token through the standard fixture.
- No secret is committed.
- Every test has individual tags and `@regression`.
- Smoke and sanity selections contain only reliable, independent cases.
- Each JSON file parses successfully.
- Existing modules and unrelated files are unchanged.

## 11. Reusable AI prompt

Copy the prompt below, replace the bracketed values, and provide the API
contract plus the desired test cases to an AI coding tool.

```text
You are extending the PHYE-HRMS Playwright API framework. Follow the existing
CommonJS framework patterns exactly; inspect related current modules before
editing.

Create the [MODULE_NAME] API module from this contract:
[PASTE ENDPOINTS, METHODS, REQUEST BODIES, RESPONSE EXAMPLES, AUTH RULES,
VALIDATION RULES, AND REQUIRED TEST CASES]

Required implementation:
1. Add api/constants/[module].constants.js with endpoint paths and only needed
   HTTP status constants.
2. Add api/clients/[module].client.js. Use constructor(request, token = null),
   authHeaders(), and one clear method per API operation. Do not add duplicate
   WithToken/WithoutAuth helper methods.
3. Add fixtures/[module].fixture.js extending auth.fixture.js and expose
   [module]Client with the cached QA token.
4. Add test-data/[module].json with complete valid baseline payloads, update
   payloads, invalid IDs, expected messages, and no secrets. Use environment
   variables only for unstable environment-specific values.
5. Add tests/api/[module].api.spec.js. Test each requested case using the client
   and JSON data. Keep endpoint strings out of the spec.
6. Add tests/empty/empty-data.[module].spec.js when missing/empty-field testing
   applies. Clone a complete valid payload, remove one field, and assert the
   documented result.
7. Put tags on every individual test title, never on test.describe. Every test
   must have @regression. Add appropriate operation/module tags. Add @smoke only
   to critical independent happy paths and @sanity only to stable core checks.
8. Preserve existing code and do not alter the GitHub Actions workflow unless
   explicitly requested.

Validate syntax, JSON parsing, tag discovery, and changed-file formatting. Do
not run live API tests unless explicitly asked. Report created/changed files,
tag selections, and any API-contract assumptions.
```

## 12. Information to give an AI tool

For accurate implementation, supply:

- API base path and every endpoint method.
- Authentication requirement for each endpoint.
- Required and optional request fields with example values.
- Success and error response examples with status codes.
- Stable test fixture IDs, or which values must come from environment variables.
- Which test cases are smoke, sanity, regression-only, or intentionally skipped.
- Any test ordering, cleanup, or data-isolation requirement.

Without that contract, an AI tool can create the framework files and test
structure, but it should label endpoint values and expected assertions as
assumptions instead of inventing them.
