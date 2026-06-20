# PHYE-HRMS Playwright SDET Framework

Lean Playwright-only test framework for API testing (E2E-ready). No Jest or extra runners.

## Structure

```
├── .github/
│   └── workflows/
│       └── playwright.yml    # CI: run tests on push/PR
├── api/
│   ├── clients/
│   │   ├── auth.client.js        # Auth API client
│   │   └── employee.client.js    # Employee API client
│   └── constants/
│       ├── auth.constants.js     # Auth endpoints, status codes
│       └── employee.constants.js # Employee endpoints, payloads
├── fixtures/
│   └── auth.fixture.js       # Playwright fixture (QA token)
├── scripts/
│   └── run-tests.js          # Test runner + Allure report generation
├── test-data/
│   └── auth.json             # JSON-driven auth test inputs
├── tests/
│   └── api/
│       ├── auth.api.spec.js      # Auth API tests
│       └── employee.api.spec.js  # Employee API tests
├── utils/
│   └── token.util.js         # Token read/write cache helper
├── globalSetup.js            # Pre-run auth token cache
├── playwright.config.js
├── package.json
└── .env                        # Local env (not committed; see Environment)
```

Generated at runtime (gitignored): `.cache/`, `reports/`, `test-results/`.

## Quick start

```bash
npm install
npx playwright install
# Create .env with API_BASE_URL and TEST_EMAIL (see Environment)
npm test
```

## Commands

| Command | Description |
|---------|-------------|
| `npm test` | Run all tests |
| `npm run test:api` | Run API project only |
| `npm run test:ui` | Playwright UI mode |
| `npm run test:debug` | Debug with Inspector |
| `npm run report` | Open latest Allure report |

## Environment

| Variable | Default | Description |
|----------|---------|-------------|
| `API_BASE_URL` | `http://localhost:3000` | Backend base URL |
| `TEST_EMAIL` | `qa.user@company.com` | Allowed QA email for token generation |

## Adding tests

1. Add endpoints/constants in `api/constants/`.
2. Add client methods in `api/clients/`.
3. Create `tests/api/<feature>.api.spec.js`.
4. Use `fixtures/auth.fixture.js` when tests need a QA token.

## CI

GitHub Actions runs `npm test` on push/PR to `main`/`master`. Set repository variables/secrets for `API_BASE_URL` and `TEST_EMAIL` when running against a deployed backend.
