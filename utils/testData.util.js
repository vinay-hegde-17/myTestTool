const path = require('path');

const DEFAULT_ENV_FALLBACKS = {
  TEST_EMPLOYEE_ID: '',
  TEST_EMPLOYEE_ID_FOR_UPDATES: '',
  TEST_EMPLOYEE_ID_FOR_ASSETS: '',
  TEST_EMPLOYEE_ID_FOR_PHOTOS: '',
  TEST_MANAGER_ID: '',
  ADMIN_EMPLOYEE_ID: '',
  MANAGER_EMPLOYEE_ID: '',
  TEST_ASSET_ID: '',
  TEST_ASSET_TYPE_ID: '',
  TEST_ASSET_MODEL_ID: '',
  TEST_EMPLOYEE_WITHOUT_ASSETS_ID: '',
  TEST_EMPLOYEE_ID_WITHOUT_PHOTO: '',
  TEST_ROLE_ID: '',
  TEST_UNASSIGNED_ASSET_ID: '',
  TEST_FILE_ID: '',
  TEST_AADHAAR_FILE_ID: '',
  TEST_PAN_FILE_ID: '',
  TEST_PHOTO_FILE_ID: '',
  TEST_EMAIL: 'qa.user@company.com',
  TEST_EXISTING_EMPLOYEE_EMAIL: '',
  TEST_INACTIVE_EMAIL: '',
  TEST_EMPLOYEE_NUMBER: '1',
  DUPLICATE_EMAIL: '',
  INVALID_EMPLOYEE_ID: '685000000000000000000001',
  INVALID_ASSET_ID: '66ffffffffffffffffffffff',
  INVALID_FILE: 'test-data/files/sample.exe',
  TEST_QUERY_TYPE_ID: '',
  TEST_SECOND_QUERY_TYPE_ID: '',
  TEST_EXISTING_QUERY_ID: '',
  TEST_LEAVE_ID: '',
  TEST_APPROVER_ID: '',
  TEST_MODULE_ID: '',
  TEST_SECOND_MODULE_ID: '',
  TEST_THIRD_MODULE_ID: '',
  TEST_HOLIDAY_ID: '',
  TEST_USER_ROLE_ID: '',
  TEST_ROLE_NAME: 'ADMIN'
};

const resolveTemplateString = (value) => {
  if (typeof value !== 'string') {
    return value;
  }

  return value.replace(/\{\{(\w+)\}\}/g, (_, key) => {
    const envValue = process.env[key];
    if (envValue !== undefined && envValue !== null && String(envValue).trim() !== '') {
      return envValue;
    }

    return DEFAULT_ENV_FALLBACKS[key] || '';
  });
};

const resolveTemplateValues = (value) => {
  if (Array.isArray(value)) {
    return value.map(resolveTemplateValues);
  }

  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value).map(([key, nestedValue]) => [key, resolveTemplateValues(nestedValue)])
    );
  }

  if (typeof value === 'string') {
    return resolveTemplateString(value);
  }

  return value;
};

const resolveProjectJsonPath = (filePath) => {
  const normalizedPath = filePath.replace(/\\/g, '/');
  const testDataIndex = normalizedPath.indexOf('test-data/');

  if (testDataIndex !== -1) {
    return path.resolve(process.cwd(), normalizedPath.slice(testDataIndex));
  }

  return path.isAbsolute(filePath)
    ? filePath
    : path.resolve(process.cwd(), filePath);
};

// Load JSON from the project root even when callers pass paths like
// '../test-data/employee.json' or '../../test-data/employee.json'.
const loadResolvedJson = (filePath) => {
  const resolvedPath = resolveProjectJsonPath(filePath);
  return resolveTemplateValues(require(resolvedPath));
};

module.exports = {
  DEFAULT_ENV_FALLBACKS,
  resolveProjectJsonPath,
  resolveTemplateString,
  resolveTemplateValues,
  loadResolvedJson
};
