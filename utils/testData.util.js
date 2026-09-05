const path = require("path");

const DEFAULT_ENV_FALLBACKS = {
  TEST_EMPLOYEE_ID: "6a1f0bd1c9ce1caed4279c13",
  TEST_EMPLOYEE_ID_FOR_UPDATES: "6a1f0bd1c9ce1caed4279c13",
  TEST_EMPLOYEE_ID_FOR_ASSETS: "6a1f0bd1c9ce1caed4279c13",
  TEST_EMPLOYEE_ID_FOR_PHOTOS: "6a1f0bd1c9ce1caed4279c13",
  TEST_MANAGER_ID: "6a1f0bd1c9ce1caed4279c14",
  ADMIN_EMPLOYEE_ID: "6a1f0bd1c9ce1caed4279c13",
  MANAGER_EMPLOYEE_ID: "6a1f0bd1c9ce1caed4279c14",
  TEST_ASSET_ID: "6a369484acba6340369d61a0",
  TEST_ASSET_TYPE_ID: "6a369460acba6340369d6198",
  TEST_ASSET_MODEL_ID: "6a369467acba6340369d619c",
  TEST_EMPLOYEE_WITHOUT_ASSETS_ID: "6a1f0bd1c9ce1caed4279c14",
  TEST_EMPLOYEE_ID_WITHOUT_PHOTO: "6a1f0bd1c9ce1caed4279c14",
  TEST_ROLE_ID: "66a77ce670bd6b1f721cc20b",
  TEST_UNASSIGNED_ASSET_ID: "6a3b3add53bc11092b6af66b",
  TEST_FILE_ID: "6a645a17f2ad573d14f113fa",
  TEST_AADHAAR_FILE_ID: "6a5700f8b80d0148087eb444",
  TEST_PAN_FILE_ID: "6a3684020265bbdc86fae63b",
  TEST_PHOTO_FILE_ID: "6a645a17f2ad573d14f113fa",
  TEST_EMAIL: "vinayhegde0824@gmail.com",
  TEST_EXISTING_EMPLOYEE_EMAIL: "vinayhegde0824@gmail.com",
  TEST_INACTIVE_EMAIL: "inactive@gmail.com",
  TEST_EMPLOYEE_NUMBER: "1",
  DUPLICATE_EMAIL: "vinayhegde0824@gmail.com",
  INVALID_EMPLOYEE_ID: "685000000000000000000001",
  INVALID_ASSET_ID: "66ffffffffffffffffffffff",
  INVALID_FILE: "test-data/files/sample.exe",
  TEST_QUERY_TYPE_ID: "67cfff7d000d3f90fa78a2be",
  TEST_SECOND_QUERY_TYPE_ID: "67cfff7d000d3f90fa78a2be",
  TEST_EXISTING_QUERY_ID: "6a68e26a245f4ee9786ebd9c",
  TEST_LEAVE_ID: "6a46902aea79d955be3ce913",
  TEST_APPROVER_ID: "6a1f0bd1c9ce1caed4279c13",
  TEST_MODULE_ID: "665f0000000000000000aa01",
  TEST_SECOND_MODULE_ID: "665f0000000000000000aa02",
  TEST_THIRD_MODULE_ID: "665f0000000000000000aa03",
  TEST_HOLIDAY_ID: "6a6e27f62eb13ddee671e3d1",
  TEST_USER_ROLE_ID: "66a77ce670bd6b1f721cc20b",
  TEST_MUTABLE_ROLE_ID: "66a77ce670bd6b1f721cc20c",
  TEST_ROLE_NAME: "ADMIN",
};

const ensureEnvDefaults = () => {
  for (const [key, value] of Object.entries(DEFAULT_ENV_FALLBACKS)) {
    if (!process.env[key] || process.env[key].trim() === "") {
      process.env[key] = value;
    }
  }
};

ensureEnvDefaults();

const resolveTemplateString = (value) => {
  if (typeof value !== "string") {
    return value;
  }

  return value.replace(/\{\{(\w+)\}\}/g, (_, key) => {
    const envValue = process.env[key];
    if (
      envValue !== undefined &&
      envValue !== null &&
      String(envValue).trim() !== ""
    ) {
      return envValue;
    }

    return DEFAULT_ENV_FALLBACKS[key] || "";
  });
};

const resolveTemplateValues = (value) => {
  if (Array.isArray(value)) {
    return value.map(resolveTemplateValues);
  }

  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value).map(([key, nestedValue]) => [
        key,
        resolveTemplateValues(nestedValue),
      ]),
    );
  }

  if (typeof value === "string") {
    return resolveTemplateString(value);
  }

  return value;
};

const resolveProjectJsonPath = (filePath) => {
  const normalizedPath = filePath.replace(/\\/g, "/");
  const testDataIndex = normalizedPath.indexOf("test-data/");

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
  loadResolvedJson,
};
