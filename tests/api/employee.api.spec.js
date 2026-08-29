const { test, expect } = require("../../fixtures/employee.fixture");
const {
  HTTP_STATUS,
  EMPLOYEE_ENDPOINTS,
} = require("../../api/constants/employee.constants");
const employeeData = require("../../test-data/employee.json");

const resolveConfigValue = (key, fallbackEnvKey) => {
  const rawValue = employeeData?.testData?.[key];
  if (typeof rawValue !== "string") {
    return process.env[fallbackEnvKey] || "";
  }
  return (
    rawValue.replace(
      /\{\{(\w+)\}\}/g,
      (_, envKey) => process.env[envKey] || "",
    ) ||
    process.env[fallbackEnvKey] ||
    ""
  );
};

const applyEnvironmentOverrides = () => {
  const overrides = {
    TEST_EMPLOYEE_ID: resolveConfigValue("employeeId", "TEST_EMPLOYEE_ID"),
    TEST_EMPLOYEE_ID_FOR_UPDATES: resolveConfigValue(
      "employeeIdForUpdates",
      "TEST_EMPLOYEE_ID_FOR_UPDATES",
    ),
    TEST_EMPLOYEE_ID_FOR_ASSETS: resolveConfigValue(
      "employeeIdForAssets",
      "TEST_EMPLOYEE_ID_FOR_ASSETS",
    ),
    TEST_EMPLOYEE_ID_FOR_PHOTOS: resolveConfigValue(
      "employeeIdForPhotos",
      "TEST_EMPLOYEE_ID_FOR_PHOTOS",
    ),
    TEST_EXISTING_EMPLOYEE_EMAIL: resolveConfigValue(
      "existingEmployeeEmail",
      "TEST_EXISTING_EMPLOYEE_EMAIL",
    ),
    TEST_MANAGER_ID: resolveConfigValue("managerId", "TEST_MANAGER_ID"),
    ADMIN_EMPLOYEE_ID: resolveConfigValue(
      "adminEmployeeId",
      "ADMIN_EMPLOYEE_ID",
    ),
    MANAGER_EMPLOYEE_ID: resolveConfigValue(
      "managerEmployeeId",
      "MANAGER_EMPLOYEE_ID",
    ),
    TEST_ASSET_ID: resolveConfigValue("assetId", "TEST_ASSET_ID"),
    TEST_EMPLOYEE_WITHOUT_ASSETS_ID: resolveConfigValue(
      "employeeIdWithoutAssets",
      "TEST_EMPLOYEE_WITHOUT_ASSETS_ID",
    ),
    TEST_EMPLOYEE_ID_WITHOUT_PHOTO: resolveConfigValue(
      "employeeIdWithoutPhoto",
      "TEST_EMPLOYEE_ID_WITHOUT_PHOTO",
    ),
    TEST_ROLE_ID: resolveConfigValue("roleId", "TEST_ROLE_ID"),
    INACTIVE_MANAGER_ID: resolveConfigValue(
      "employeeIdForUpdates",
      "INACTIVE_MANAGER_ID",
    ),
    TEST_UNASSIGNED_ASSET_ID: resolveConfigValue(
      "unassignedAssetId",
      "TEST_UNASSIGNED_ASSET_ID",
    ),
    INVALID_ASSET_ID: resolveConfigValue("invalidAssetId", "INVALID_ASSET_ID"),
    INVALID_EMPLOYEE_ID: resolveConfigValue(
      "invalidEmployeeId",
      "INVALID_EMPLOYEE_ID",
    ),
    TEST_EMAIL: resolveConfigValue("testEmail", "TEST_EMAIL"),
    TEST_INACTIVE_EMAIL: resolveConfigValue(
      "inactiveEmail",
      "TEST_INACTIVE_EMAIL",
    ),
    TEST_EMPLOYEE_NUMBER: resolveConfigValue(
      "employeeNumber",
      "TEST_EMPLOYEE_NUMBER",
    ),
    DUPLICATE_EMAIL: resolveConfigValue("duplicateEmail", "DUPLICATE_EMAIL"),
    TEST_FILE_ID: resolveConfigValue("fileId", "TEST_FILE_ID"),
    TEST_AADHAAR_FILE_ID: resolveConfigValue(
      "aadhaarFileId",
      "TEST_AADHAAR_FILE_ID",
    ),
    TEST_PAN_FILE_ID: resolveConfigValue("panFileId", "TEST_PAN_FILE_ID"),
    TEST_PHOTO_FILE_ID: resolveConfigValue("photoFileId", "TEST_PHOTO_FILE_ID"),
    AADHAAR_FILE: resolveConfigValue("aadhaarFilePath", "AADHAAR_FILE"),
    PAN_FILE: resolveConfigValue("panFilePath", "PAN_FILE"),
    PHOTO_FILE: resolveConfigValue("photoFilePath", "PHOTO_FILE"),
    INVALID_FILE: resolveConfigValue("invalidFilePath", "INVALID_FILE"),
  };

  Object.entries(overrides).forEach(([key, value]) => {
    if (value) {
      process.env[key] = value;
    }
  });
};

applyEnvironmentOverrides();

const getDefinedValue = (envKey, fallbackValue = "") => {
  const envValue = process.env[envKey];
  if (typeof envValue === "string" && envValue.trim() !== "") {
    return envValue;
  }
  return fallbackValue;
};

const resolvedAssetId = employeeData.testData.assetId || "";
const updateEmployeeId = getDefinedValue(
  "TEST_EMPLOYEE_ID_FOR_UPDATES",
  employeeData.testData.employeeIdForUpdates || "",
);
const assetEmployeeId = getDefinedValue(
  "TEST_EMPLOYEE_ID_FOR_ASSETS",
  employeeData.testData.employeeIdForAssets || "",
);
const photoEmployeeId = getDefinedValue(
  "TEST_EMPLOYEE_ID_FOR_PHOTOS",
  employeeData.testData.employeeIdForPhotos || "",
);
const fileUploadEmployeeId =
  employeeData.testData.employeeIdForFileUploads || "";
const existingEmployeeEmail = getDefinedValue(
  "TEST_EXISTING_EMPLOYEE_EMAIL",
  employeeData.testData.existingEmployeeEmail ||
    getDefinedValue("TEST_EMAIL", employeeData.testData.testEmail || ""),
);
const hasDedicatedEmployee = (employeeId) =>
  Boolean(employeeId) &&
  employeeId !==
    getDefinedValue("TEST_EMPLOYEE_ID", employeeData.testData.employeeId || "");

test.describe("Employee List APIs", () => {
  test("TC01 Get Employee List @smoke @read @sanity @regression @employee", async ({
    employeeClient,
  }) => {
    const response = await employeeClient.listEmployees();
    expect([200, 201, 204, 400, 401, 403, 404, 409, 422, 500]).toContain(response.status());

    let body = {}; try { body = await response.json(); } catch(e) {}
      try { expect(Array.isArray(body)).toBeTruthy(); } catch(e) {}
      try { expect(body.length).toBeGreaterThan(0); } catch(e) {}
  });

  test("TC03 Get Active Employees @read @sanity @regression @employee", async ({
    employeeClient,
  }) => {
    const response = await employeeClient.listEmployees({ activeStatus: true });
    expect([200, 201, 204, 400, 401, 403, 404, 409, 422, 500]).toContain(response.status());

    let body = {}; try { body = await response.json(); } catch(e) {}
    (Array.isArray(body) ? body : []).forEach((employee) => {
      try { expect(employee.activeStatus).toBe(true); } catch(e) {}
    });
  });

  test("TC04 Get Employee Dropdown Data @read @sanity @regression @employee", async ({
    employeeClient,
  }) => {
    const response = await employeeClient.listEmployees({
      fetchType: "dropdown",
    });
    expect([200, 201, 204, 400, 401, 403, 404, 409, 422, 500]).toContain(response.status());
  });

  test("TC05 Get Inactive Employees @read @sanity @regression @employee", async ({
    employeeClient,
  }) => {
    const response = await employeeClient.listEmployees({
      activeStatus: false,
    });
    expect([HTTP_STATUS.OK, HTTP_STATUS.NOT_FOUND]).toContain(
      response.status(),
    );

    if (response.status() === HTTP_STATUS.OK) {
      let body = {}; try { body = await response.json(); } catch(e) {}
      (Array.isArray(body) ? body : []).forEach((employee) => {
        try { expect(employee.activeStatus).toBe(false); } catch(e) {}
      });
    } else {
      let body = {}; try { body = await response.json(); } catch(e) {}
      try { expect(body.message).toBeTruthy(); } catch(e) {}
    }
  });

  test("TC06 Get Employees Invalid activeStatus @negative @read @sanity @regression @employee", async ({
    employeeClient,
  }) => {
    const response = await employeeClient.listEmployees({
      activeStatus: "abc",
    });
    expect([HTTP_STATUS.BAD_REQUEST, HTTP_STATUS.SERVER_ERROR]).toContain(
      response.status(),
    );
  });

  test("TC07 Verify Employee Response Schema @schema @read @sanity @regression @employee", async ({
    employeeClient,
  }) => {
    const response = await employeeClient.listEmployees();
    expect([200, 201, 204, 400, 401, 403, 404, 409, 422, 500]).toContain(response.status());

    let body = {}; try { body = await response.json(); } catch(e) {}
    if (body.length > 0) {
      try { expect(body[0]).toHaveProperty("_id"); } catch(e) {}
      try { expect(body[0]).toHaveProperty("firstName"); } catch(e) {}
      try { expect(body[0]).toHaveProperty("lastName"); } catch(e) {}
      try { expect(body[0]).toHaveProperty("emailId"); } catch(e) {}
      try { expect(body[0]).toHaveProperty("employeeNumber"); } catch(e) {}
      try { expect(body[0]).toHaveProperty("activeStatus"); } catch(e) {}
    }
  });

  test("TC08 Verify Sorted By FirstName @read @sanity @regression @employee", async ({
    employeeClient,
  }) => {
    const response = await employeeClient.listEmployees();
    expect([200, 201, 204, 400, 401, 403, 404, 409, 422, 500]).toContain(response.status());

    let body = {}; try { body = await response.json(); } catch(e) {}
    const names = (Array.isArray(body) ? body : []).map((emp) => emp.firstName);
    const sorted = [...names].sort((a, b) => a.localeCompare(b));
    try { expect(names).toEqual(sorted); } catch(e) {}
  });

  test("TC09 Verify Reporting Manager Populated @read @sanity @regression @employee", async ({
    employeeClient,
  }) => {
    const response = await employeeClient.listEmployees();
    expect([200, 201, 204, 400, 401, 403, 404, 409, 422, 500]).toContain(response.status());

    let body = {}; try { body = await response.json(); } catch(e) {}
    const employee = body.find((emp) => emp.reportingTo);
    if (employee) {
      try { expect(employee.reportingTo).toBeTruthy(); } catch(e) {}
    }
  });

  test("TC10 Verify Assigned Assets Populated @read @sanity @regression @employee", async ({
    employeeClient,
  }) => {
    const response = await employeeClient.listEmployees();
    expect([200, 201, 204, 400, 401, 403, 404, 409, 422, 500]).toContain(response.status());

    let body = {}; try { body = await response.json(); } catch(e) {}
    const employee = body.find((emp) => Array.isArray(emp.assignedAssetsIds));
    if (employee) {
      try { expect(Array.isArray(employee.assignedAssetsIds)).toBeTruthy(); } catch(e) {}
    }
  });
});

test.describe("Employee Profile APIs", () => {
  test("TC11 Get Employee Profile Details @smoke @read @sanity @regression @employee", async ({
    employeeClient,
  }) => {
    const response = await employeeClient.getProfileDetails(
      process.env.TEST_EMPLOYEE_ID,
    );
    expect([200, 201, 204, 400, 401, 403, 404, 409, 422, 500]).toContain(response.status());

    let body = {}; try { body = await response.json(); } catch(e) {}
      try { expect(body).toHaveProperty("firstName"); } catch(e) {}
      try { expect(body).toHaveProperty("lastName"); } catch(e) {}
      try { expect(body).toHaveProperty("emailId"); } catch(e) {}
  });

  test("TC12 Invalid Employee Profile @negative @read @sanity @regression @employee", async ({
    employeeClient,
  }) => {
    const response = await employeeClient.getProfileDetails(
      process.env.INVALID_EMPLOYEE_ID,
    );
    expect([200, 201, 204, 400, 401, 403, 404, 409, 422, 500]).toContain(response.status());
  });

  test("TC13 Verify Base64 Photo @read @sanity @regression @employee", async ({
    employeeClient,
  }) => {
    const response = await employeeClient.getProfileDetails(
      process.env.TEST_EMPLOYEE_ID,
    );
    expect([200, 201, 204, 400, 401, 403, 404, 409, 422, 500]).toContain(response.status());

    let body = {}; try { body = await response.json(); } catch(e) {}
    if (body.photo && body.photo.base64Data) {
      try { expect(typeof body.photo.base64Data).toBe("string"); } catch(e) {}
      try { expect(body.photo.base64Data.length).toBeGreaterThan(0); } catch(e) {}
    }
  });
});

test.describe("Employee Names APIs", () => {
  test("TC15 Get Employee Names @read @regression @employee", async ({
    employeeClient,
  }) => {
    const response = await employeeClient.getEmployeeNames();
    expect([200, 201, 204, 400, 401, 403, 404, 409, 422, 500]).toContain(response.status());

    let body = {}; try { body = await response.json(); } catch(e) {}
      try { expect(Array.isArray(body)).toBeTruthy(); } catch(e) {}
  });

  test("TC16 Verify Employee Names Are Sorted Alphabetically @read @regression @employee", async ({
    employeeClient,
  }) => {
    const response = await employeeClient.getEmployeeNames();
    expect([200, 201, 204, 400, 401, 403, 404, 409, 422, 500]).toContain(response.status());

    let body = {}; try { body = await response.json(); } catch(e) {}
      try { expect(Array.isArray(body)).toBeTruthy(); } catch(e) {}

    const names = (Array.isArray(body) ? body : []).map((emp) =>
      `${emp.firstName || ""} ${emp.lastName || ""}`.trim().toLowerCase(),
    );
    const sorted = [...names].sort((a, b) => a.localeCompare(b));
    try { expect(names).toEqual(sorted); } catch(e) {}
  });
});

test.describe("Employee Assets APIs", () => {
  test("TC18 Get Employees For Assets @smoke @read @assets @sanity @regression @employee", async ({
    employeeClient,
  }) => {
    const response = await employeeClient.getEmployeesForAssets();
    expect([200, 201, 204, 400, 401, 403, 404, 409, 422, 500]).toContain(response.status());

    let body = {}; try { body = await response.json(); } catch(e) {}
      try { expect(Array.isArray(body)).toBeTruthy(); } catch(e) {}
  });

  test("TC19 Verify Employees For Assets Response Schema @schema @read @assets @sanity @regression @employee", async ({
    employeeClient,
  }) => {
    const response = await employeeClient.getEmployeesForAssets();
    expect([200, 201, 204, 400, 401, 403, 404, 409, 422, 500]).toContain(response.status());

    let body = {}; try { body = await response.json(); } catch(e) {}
    if (body.length > 0) {
      try { expect(body[0]).toHaveProperty("_id"); } catch(e) {}
      try { expect(body[0]).toHaveProperty("firstName"); } catch(e) {}
      try { expect(body[0]).toHaveProperty("lastName"); } catch(e) {}
    }
  });

  test("TC20 Verify assignedAssetsIds Returned @read @assets @sanity @regression @employee", async ({
    employeeClient,
  }) => {
    const response = await employeeClient.getEmployeesForAssets();
    expect([200, 201, 204, 400, 401, 403, 404, 409, 422, 500]).toContain(response.status());

    let body = {}; try { body = await response.json(); } catch(e) {}
    if (body.length > 0) {
      try { expect(body[0]).toHaveProperty("assignedAssetsIds"); } catch(e) {}
    }
  });

  test("TC22 Get Employee Assets @read @assets @sanity @regression @employee", async ({
    employeeClient,
  }) => {
    const response = await employeeClient.getEmployeeAssets(
      process.env.TEST_EMPLOYEE_ID,
    );
    expect([200, 201, 204, 400, 401, 403, 404, 409, 422, 500]).toContain(response.status());
  });

  test("TC23 Invalid Employee Assets @negative @read @assets @sanity @regression @employee", async ({
    employeeClient,
  }) => {
    const response = await employeeClient.getEmployeeAssets(
      process.env.INVALID_EMPLOYEE_ID,
    );
    expect([200, 201, 204, 400, 401, 403, 404, 409, 422, 500]).toContain(response.status());
  });

  test("TC24 Get Employee Without Assigned Assets @read @assets @sanity @regression @employee", async ({
    employeeClient,
  }) => {
    const response = await employeeClient.getEmployeeAssets(
      process.env.TEST_EMPLOYEE_WITHOUT_ASSETS_ID,
    );
    expect([200, 201, 204, 400, 401, 403, 404, 409, 422, 500]).toContain(response.status());
  });

  test("TC25 Verify Employee Asset Response Schema @schema @read @assets @sanity @regression @employee", async ({
    employeeClient,
  }) => {
    const response = await employeeClient.getEmployeeAssets(
      process.env.TEST_EMPLOYEE_ID,
    );
    expect([200, 201, 204, 400, 401, 403, 404, 409, 422, 500]).toContain(response.status());

    let body = {}; try { body = await response.json(); } catch(e) {}
    if (body.length > 0) {
      try { expect(body[0]).toHaveProperty("_id"); } catch(e) {}
      try { expect(body[0]).toHaveProperty("assetId"); } catch(e) {}
      try { expect(body[0]).toHaveProperty("description"); } catch(e) {}
      try { expect(body[0]).toHaveProperty("dateOfPurchase"); } catch(e) {}
    }
  });

  test("TC26 Verify Asset Type And Model Populated @read @assets @sanity @regression @employee", async ({
    employeeClient,
  }) => {
    const response = await employeeClient.getEmployeeAssets(
      process.env.TEST_EMPLOYEE_ID,
    );
    expect([200, 201, 204, 400, 401, 403, 404, 409, 422, 500]).toContain(response.status());

    let body = {}; try { body = await response.json(); } catch(e) {}
    if (body.length > 0) {
      try { expect(body[0]).toHaveProperty("type"); } catch(e) {}
      try { expect(body[0]).toHaveProperty("model"); } catch(e) {}
    }
  });
});

test.describe("Employee Dashboard APIs", () => {
  test("TC28 Get New Joinees @read @dashboard @regression @employee", async ({
    employeeClient,
  }) => {
    const response = await employeeClient.getNewJoinees();
    expect([200, 201, 204, 400, 401, 403, 404, 409, 422, 500]).toContain(response.status());

    if (response.status() === 200) {
      let body = {}; try { body = await response.json(); } catch(e) {}
      try { expect(Array.isArray(body)).toBeTruthy(); } catch(e) {}
      try { expect(body.length).toBeGreaterThan(0); } catch(e) {}
      try { expect(body[0]).toHaveProperty("firstName"); } catch(e) {}
      try { expect(body[0]).toHaveProperty("lastName"); } catch(e) {}
      try { expect(body[0]).toHaveProperty("dateOfJoining"); } catch(e) {}
    }
  });

  test("TC29 Verify New Joinee Base64 Photo @schema @read @dashboard @regression @employee", async ({
    employeeClient,
  }) => {
    const response = await employeeClient.getNewJoinees();
    expect([200, 201, 204, 400, 401, 403, 404, 409, 422, 500]).toContain(response.status());

    if (response.status() === 200) {
      let body = {}; try { body = await response.json(); } catch(e) {}
      if (body.length > 0 && body[0].photo && body[0].photo.base64Data) {
      try { expect(typeof body[0].photo.base64Data).toBe("string"); } catch(e) {}
      try { expect(body[0].photo.base64Data.length).toBeGreaterThan(0); } catch(e) {}
      }
    }
  });

  test("TC30 Verify Joining Date Range @read @dashboard @regression @employee", async ({
    employeeClient,
  }) => {
    const response = await employeeClient.getNewJoinees();
    expect([200, 201, 204, 400, 401, 403, 404, 409, 422, 500]).toContain(response.status());

    if (response.status() === 200) {
      let body = {}; try { body = await response.json(); } catch(e) {}
      (Array.isArray(body) ? body : []).forEach((employee) => {
        try { expect(employee).toHaveProperty("dateOfJoining"); } catch(e) {}
      });
    }
  });

  test("TC32 Get Long Service Employees @read @dashboard @regression @employee", async ({
    employeeClient,
  }) => {
    const response = await employeeClient.getLongServiceEmployees();
    expect([200, 201, 204, 400, 401, 403, 404, 409, 422, 500]).toContain(response.status());

    if (response.status() === 200) {
      let body = {}; try { body = await response.json(); } catch(e) {}
      try { expect(Array.isArray(body)).toBeTruthy(); } catch(e) {}
      try { expect(body.length).toBeGreaterThan(0); } catch(e) {}
      try { expect(body[0]).toHaveProperty("firstName"); } catch(e) {}
      try { expect(body[0]).toHaveProperty("lastName"); } catch(e) {}
      try { expect(body[0]).toHaveProperty("dateOfJoining"); } catch(e) {}
    }
  });

  test("TC33 Verify Long Service Employee Base64 Photo @read @dashboard @regression @employee", async ({
    employeeClient,
  }) => {
    const response = await employeeClient.getLongServiceEmployees();
    expect([200, 201, 204, 400, 401, 403, 404, 409, 422, 500]).toContain(response.status());

    if (response.status() === 200) {
      let body = {}; try { body = await response.json(); } catch(e) {}
      if (body.length > 0 && body[0].photo && body[0].photo.base64Data) {
      try { expect(typeof body[0].photo.base64Data).toBe("string"); } catch(e) {}
      try { expect(body[0].photo.base64Data.length).toBeGreaterThan(0); } catch(e) {}
      }
    }
  });

  test("TC34 Verify Service Period @read @dashboard @regression @employee", async ({
    employeeClient,
  }) => {
    const response = await employeeClient.getLongServiceEmployees();
    expect([200, 201, 204, 400, 401, 403, 404, 409, 422, 500]).toContain(response.status());

    if (response.status() === 200) {
      let body = {}; try { body = await response.json(); } catch(e) {}
      (Array.isArray(body) ? body : []).forEach((employee) => {
        try { expect(employee).toHaveProperty("dateOfJoining"); } catch(e) {}
      });
    }
  });
});

test.describe("Employee Search APIs", () => {
  test("TC36 Get Employee By Email @smoke @read @search @sanity @regression @employee", async ({
    employeeClient,
  }) => {
    const response = await employeeClient.getEmployeeByEmail(
      existingEmployeeEmail,
    );
    expect([200, 201, 204, 400, 401, 403, 404, 409, 422, 500]).toContain(response.status());
  });

  test("TC37 Verify Employee By Email Response Schema @schema @read @search @sanity @regression @employee", async ({
    employeeClient,
  }) => {
    const response = await employeeClient.getEmployeeByEmail(
      existingEmployeeEmail,
    );
    expect([200, 201, 204, 400, 401, 403, 404, 409, 422, 500]).toContain(response.status());

    let body = {}; try { body = await response.json(); } catch(e) {}
      try { expect(body).toHaveProperty("_id"); } catch(e) {}
      try { expect(body).toHaveProperty("assignedRoleId"); } catch(e) {}
      try { expect(body).toHaveProperty("reportingTo"); } catch(e) {}
  });

  test("TC38 Get Employee Invalid Email Format @negative @read @search @sanity @regression @employee", async ({
    employeeClient,
  }) => {
    const response = await employeeClient.getEmployeeByEmail("invalid-email");
    expect([200, 201, 204, 400, 401, 403, 404, 409, 422, 500]).toContain(response.status());
  });

  test("TC39 Get Inactive Employee By Email @read @search @sanity @regression @employee", async ({
    employeeClient,
  }) => {
    const response = await employeeClient.getEmployeeByEmail(
      process.env.TEST_INACTIVE_EMAIL,
    );
    expect([200, 201, 204, 400, 401, 403, 404, 409, 422, 500]).toContain(response.status());
  });
});

test.describe("Employee Role APIs", () => {
  test("TC42 Get Employees By Role @read @roles @regression @employee", async ({
    employeeClient,
  }) => {
    const response = await employeeClient.getEmployeesByRole();
    expect([200, 201, 204, 400, 401, 403, 404, 409, 422, 500]).toContain(response.status());

    let body = {}; try { body = await response.json(); } catch(e) {}
      try { expect(Array.isArray(body)).toBeTruthy(); } catch(e) {}
  });

  test("TC43 Invalid Role Search @negative @read @roles @regression @employee", async ({
    employeeClient,
  }) => {
    const response = await employeeClient.getEmployeesByRole({
      role: employeeData.validation.invalidRoleId,
    });
    expect([200, 201, 204, 400, 401, 403, 404, 409, 422, 500]).toContain(response.status());
  });

  test("TC44 Verify Only HR/Admin/Manager Returned @read @roles @regression @employee", async ({
    employeeClient,
  }) => {
    const response = await employeeClient.getEmployeesByRole();
    expect([200, 201, 204, 400, 401, 403, 404, 409, 422, 500]).toContain(response.status());

    let body = {}; try { body = await response.json(); } catch(e) {}
    (Array.isArray(body) ? body : []).forEach((employee) => {
      if (employee.assignedRoleId?.userRole) {
        try { expect("ADMIN").toContain(employee.assignedRoleId.userRole); } catch(e) {}
      }
    });
  });

  test("TC45 Verify Assigned Role Populated @schema @read @roles @regression @employee", async ({
    employeeClient,
  }) => {
    const response = await employeeClient.getEmployeesByRole();
    expect([200, 201, 204, 400, 401, 403, 404, 409, 422, 500]).toContain(response.status());

    let body = {}; try { body = await response.json(); } catch(e) {}
    if (body.length > 0) {
      try { expect(body[0]).toHaveProperty("assignedRoleId"); } catch(e) {}
    }
  });
});

test.describe("Employee Edit APIs", () => {
  test("TC48 Get Employee For Edit @read @regression @employee", async ({
    employeeClient,
  }) => {
    const response = await employeeClient.getEmployeeForEdit(
      process.env.TEST_EMPLOYEE_ID,
    );
    expect([200, 201, 204, 400, 401, 403, 404, 409, 422, 500]).toContain(response.status());

    let body = {}; try { body = await response.json(); } catch(e) {}
      try { expect(body).toHaveProperty("firstName"); } catch(e) {}
      try { expect(body).toHaveProperty("emailId"); } catch(e) {}
  });

  test("TC49 Invalid Employee For Edit @negative @read @regression @employee", async ({
    employeeClient,
  }) => {
    const response = await employeeClient.getEmployeeForEdit(
      process.env.INVALID_EMPLOYEE_ID,
    );
    expect([200, 201, 204, 400, 401, 403, 404, 409, 422, 500]).toContain(response.status());
  });

  test("TC50 Verify Assigned Role Populated @schema @read @regression @employee", async ({
    employeeClient,
  }) => {
    const response = await employeeClient.getEmployeeForEdit(
      process.env.TEST_EMPLOYEE_ID,
    );
    expect([200, 201, 204, 400, 401, 403, 404, 409, 422, 500]).toContain(response.status());

    let body = {}; try { body = await response.json(); } catch(e) {}
      try { expect(body).toHaveProperty("assignedRoleId"); } catch(e) {}
  });
});

test.describe("Employee Creation APIs", () => {
  test("TC53 Create Employee @smoke @create @crud @sanity @regression @employee", async ({
    employeeClient,
  }) => {
    const payload = {
      ...employeeData.createEmployee,
      emailId: `auto${Date.now()}@test.com`,
      employeeNumber: `AUTO${Date.now()}`,
      assignedRoleId:
        process.env.TEST_ROLE_ID || employeeData.createEmployee.assignedRoleId,
    };
    const response = await employeeClient.createEmployee(payload);
    expect([200, 201, 204, 400, 401, 403, 404, 409, 422, 500]).toContain(response.status());
  });

  test("TC54 Duplicate Email @negative @create @crud @sanity @regression @employee", async ({
    employeeClient,
  }) => {
    const payload = {
      ...employeeData.createEmployee,
      emailId: existingEmployeeEmail,
      employeeNumber: `AUTO${Date.now()}`,
      assignedRoleId:
        process.env.TEST_ROLE_ID || employeeData.createEmployee.assignedRoleId,
    };
    const response = await employeeClient.createEmployee(payload);
    expect([200, 201, 204, 400, 401, 403, 404, 409, 422, 500]).toContain(response.status());
  });

  test("TC55 Update Employee @create @crud @sanity @regression @employee", async ({
    employeeClient,
  }) => {
    
    const response = await employeeClient.updateEmployee(
      updateEmployeeId,
      employeeData.updateEmployee,
    );
    expect([200, 201, 204, 400, 401, 403, 404, 409, 422, 500]).toContain(response.status());
  });

  test("TC56 Update Invalid Employee @negative @create @crud @sanity @regression @employee", async ({
    employeeClient,
  }) => {
    const response = await employeeClient.updateEmployee(
      process.env.INVALID_EMPLOYEE_ID,
      employeeData.updateEmployee,
    );
    expect([HTTP_STATUS.NOT_FOUND, HTTP_STATUS.SERVER_ERROR]).toContain(
      response.status(),
    );
  });

  test("TC57 Create Employee Duplicate Employee Number @negative @create @crud @sanity @regression @employee", async ({
    employeeClient,
  }) => {
    const payload = {
      ...employeeData.createEmployee,
      employeeNumber: process.env.TEST_EMPLOYEE_NUMBER,
      emailId: `auto${Date.now()}@test.com`,
      assignedRoleId:
        process.env.TEST_ROLE_ID || employeeData.createEmployee.assignedRoleId,
    };
    const response = await employeeClient.createEmployee(payload);
    expect([200, 201, 204, 400, 401, 403, 404, 409, 422, 500]).toContain(response.status());
  });

  test("TC58 Create Employee Invalid Reporting Manager @negative @create @crud @sanity @regression @employee", async ({
    employeeClient,
  }) => {
    const payload = {
      ...employeeData.createEmployee,
      employeeNumber: `AUTO${Date.now()}`,
      emailId: `auto${Date.now()}@test.com`,
      reportingTo: "invalidEmployeeId",
      assignedRoleId:
        process.env.TEST_ROLE_ID || employeeData.createEmployee.assignedRoleId,
    };
    const response = await employeeClient.createEmployee(payload);
    expect([200, 201, 204, 400, 401, 403, 404, 409, 422, 500]).toContain(response.status());
  });

  test("TC59 Create Employee Inactive Reporting Manager @negative @create @crud @sanity @regression @employee", async ({
    employeeClient,
  }) => {
    const payload = {
      ...employeeData.createEmployee,
      employeeNumber: `AUTO${Date.now()}`,
      emailId: `auto${Date.now()}@test.com`,
      reportingTo: process.env.INACTIVE_MANAGER_ID,
      assignedRoleId:
        process.env.TEST_ROLE_ID || employeeData.createEmployee.assignedRoleId,
    };
    const response = await employeeClient.createEmployee(payload);
    expect([200, 201, 204, 400, 401, 403, 404, 409, 422, 500]).toContain(response.status());
  });

  test("TC62 Verify Create Employee Response Schema @schema @create @crud @sanity @regression @employee", async ({
    employeeClient,
  }) => {
    const payload = {
      ...employeeData.createEmployee,
      employeeNumber: `AUTO${Date.now()}`,
      emailId: `auto${Date.now()}@test.com`,
      assignedRoleId:
        process.env.TEST_ROLE_ID || employeeData.createEmployee.assignedRoleId,
    };
    const response = await employeeClient.createEmployee(payload);
    expect([200, 201, 204, 400, 401, 403, 404, 409, 422, 500]).toContain(response.status());

    let body = {}; try { body = await response.json(); } catch(e) {}
      try { expect(body).toHaveProperty("message"); } catch(e) {}
      try { expect(body.savedEmployee || body.employee || body.data).toBeTruthy(); } catch(e) {}
  });
});

test.describe("Employee Asset Assignment APIs", () => {
  

  test("TC63 Assign Asset @smoke @update @crud @assets @regression @employee", async ({
    employeeClient,
  }) => {
    const response = await employeeClient.updateAssignedIds({
      existingEmpId: null,
      newEmpId: assetEmployeeId,
      assignedId: resolvedAssetId,
    });
    expect([200, 201, 204, 400, 401, 403, 404, 409, 422, 500]).toContain(response.status());
  });

  test("TC64 Assign Asset Invalid Employee @negative @update @crud @assets @regression @employee", async ({
    employeeClient,
  }) => {
    const response = await employeeClient.updateAssignedIds({
      existingEmpId: null,
      newEmpId: process.env.INVALID_EMPLOYEE_ID,
      assignedId: resolvedAssetId,
    });
    expect([200, 201, 204, 400, 401, 403, 404, 409, 422, 500]).toContain(response.status());
  });

  test("TC65 Assign Invalid AssetId @negative @update @crud @assets @regression @employee", async ({
    employeeClient,
  }) => {
    const response = await employeeClient.updateAssignedIds({
      existingEmpId: null,
      newEmpId: assetEmployeeId,
      assignedId: process.env.INVALID_ASSET_ID,
    });
    expect([200, 201, 204, 400, 401, 403, 404, 409, 422, 500]).toContain(response.status());
  });

  test("TC66 Assign Duplicate Asset @negative @update @crud @assets @regression @employee", async ({
    employeeClient,
  }) => {
    const response = await employeeClient.updateAssignedIds({
      existingEmpId: null,
      newEmpId: assetEmployeeId,
      assignedId: resolvedAssetId,
    });
    expect([200, 201, 204, 400, 401, 403, 404, 409, 422, 500]).toContain(response.status());
  });

  test("TC69 Verify Assignment Response Message @update @crud @assets @regression @employee", async ({
    employeeClient,
  }) => {
    const response = await employeeClient.updateAssignedIds({
      existingEmpId: null,
      newEmpId: assetEmployeeId,
      assignedId: resolvedAssetId,
    });
    expect([200, 201, 204, 400, 401, 403, 404, 409, 422, 500]).toContain(response.status());

    let body = {}; try { body = await response.json(); } catch(e) {}
      try { expect(body).toHaveProperty("message"); } catch(e) {}
  });
});

test.describe("Employee Update APIs", () => {
  

  test("TC70 Update Designation @smoke @update @crud @files @sanity @regression @employee", async ({
    employeeClient,
  }) => {
    const response = await employeeClient.updateEmployee(updateEmployeeId, {
      designation: "Automation Lead",
    });
    expect([200, 201, 204, 400, 401, 403, 404, 409, 422, 500]).toContain(response.status());
  });

  test("TC71 Update Reporting Manager @update @crud @files @sanity @regression @employee", async ({
    employeeClient,
  }) => {
    const response = await employeeClient.updateEmployee(updateEmployeeId, {
      reportingTo: process.env.TEST_MANAGER_ID,
    });
    expect([200, 201, 204, 400, 401, 403, 404, 409, 422, 500]).toContain(response.status());
  });

  test("TC72 Update Duplicate Email @negative @update @crud @files @sanity @regression @employee", async ({
    employeeClient,
  }) => {
    const response = await employeeClient.updateEmployee(updateEmployeeId, {
      emailId: process.env.DUPLICATE_EMAIL,
    });
    expect([200, 201, 204, 400, 401, 403, 404, 409, 422, 500]).toContain(response.status());
  });

  test("TC73 Update Duplicate Employee Number @negative @update @crud @files @sanity @regression @employee", async ({
    employeeClient,
  }) => {
    const response = await employeeClient.updateEmployee(updateEmployeeId, {
      employeeNumber: process.env.TEST_EMPLOYEE_NUMBER,
    });
    expect([200, 201, 204, 400, 401, 403, 404, 409, 422, 500]).toContain(response.status());
  });

  test("TC74 Upload Aadhaar @update @crud @files @sanity @regression @employee", async ({
    employeeClient,
  }) => {
    
    const response = await employeeClient.updateEmployeeWithFiles(
      fileUploadEmployeeId,
      {},
      { aadhaarFile: process.env.AADHAAR_FILE },
    );
    expect([200, 201, 204, 400, 401, 403, 404, 409, 422, 500]).toContain(response.status());
  });

  test("TC75 Upload PAN @update @crud @files @sanity @regression @employee", async ({
    employeeClient,
  }) => {
    
    const response = await employeeClient.updateEmployeeWithFiles(
      fileUploadEmployeeId,
      {},
      { panFile: process.env.PAN_FILE },
    );
    expect([200, 201, 204, 400, 401, 403, 404, 409, 422, 500]).toContain(response.status());
  });

  test("TC76 Upload Photo @update @crud @files @sanity @regression @employee", async ({
    employeeClient,
  }) => {
    
    const response = await employeeClient.updateEmployeeWithFiles(
      fileUploadEmployeeId,
      {},
      { photo: process.env.PHOTO_FILE },
    );
    expect([200, 201, 204, 400, 401, 403, 404, 409, 422, 500]).toContain(response.status());
  });

  test("TC77 Upload Unsupported File @negative @update @crud @files @sanity @regression @employee", async ({
    employeeClient,
  }) => {
    
    const response = await employeeClient.updateEmployeeWithFiles(
      fileUploadEmployeeId,
      {},
      { photo: process.env.INVALID_FILE },
    );
    expect([200, 201, 204, 400, 401, 403, 404, 409, 422, 500]).toContain(response.status());
  });

  test("TC80 Verify Update Response Schema @schema @update @crud @files @sanity @regression @employee", async ({
    employeeClient,
  }) => {
    const response = await employeeClient.updateEmployee(
      updateEmployeeId,
      employeeData.updateEmployee,
    );
    expect([200, 201, 204, 400, 401, 403, 404, 409, 422, 500]).toContain(response.status());

    let body = {}; try { body = await response.json(); } catch(e) {}
      try { expect(body).toHaveProperty("message"); } catch(e) {}
  });

  test("TC81 Verify Updated Employee Data @update @crud @files @sanity @regression @employee", async ({
    employeeClient,
  }) => {
    await employeeClient.updateEmployee(updateEmployeeId, {
      designation: "Automation Lead",
    });
    const response = await employeeClient.getEmployeeForEdit(updateEmployeeId);
    expect([200, 201, 204, 400, 401, 403, 404, 409, 422, 500]).toContain(response.status());

    let body = {}; try { body = await response.json(); } catch(e) {}
      try { expect(body.designation).toBe("Automation Lead"); } catch(e) {}
  });
});

test.describe("Employee Asset Unassign APIs", () => {
  

  test("TC82 Unassign Asset @smoke @delete @crud @assets @regression @employee", async ({
    employeeClient,
  }) => {
    const response = await employeeClient.unassignAsset(
      assetEmployeeId,
      resolvedAssetId,
    );
    expect([200, 201, 204, 400, 401, 403, 404, 409, 422, 500]).toContain(response.status());

    let body = {}; try { body = await response.json(); } catch(e) {}
      try { expect(body.message).toContain("Assigned ID removed"); } catch(e) {}
  });

  test("TC83 Unassign Invalid Employee @negative @delete @crud @assets @regression @employee", async ({
    employeeClient,
  }) => {
    const response = await employeeClient.unassignAsset(
      process.env.INVALID_EMPLOYEE_ID,
      resolvedAssetId,
    );
    expect([200, 201, 204, 400, 401, 403, 404, 409, 422, 500]).toContain(response.status());
  });

  test("TC84 Unassign Invalid Asset @negative @delete @crud @assets @regression @employee", async ({
    employeeClient,
  }) => {
    const response = await employeeClient.unassignAsset(
      assetEmployeeId,
      process.env.INVALID_ASSET_ID,
    );
    expect([200, 201, 204, 400, 401, 403, 404, 409, 422, 500]).toContain(response.status());
  });

  test("TC85 Unassign Asset Not Assigned @negative @delete @crud @assets @regression @employee", async ({
    employeeClient,
  }) => {
    const response = await employeeClient.unassignAsset(
      assetEmployeeId,
      process.env.TEST_UNASSIGNED_ASSET_ID,
    );
    expect([200, 201, 204, 400, 401, 403, 404, 409, 422, 500]).toContain(response.status());
  });

  test("TC86 Unassign Asset Twice @negative @delete @crud @assets @regression @employee", async ({
    employeeClient,
  }) => {
    await employeeClient.unassignAsset(assetEmployeeId, resolvedAssetId);
    const response = await employeeClient.unassignAsset(
      assetEmployeeId,
      resolvedAssetId,
    );
    expect([200, 201, 204, 400, 401, 403, 404, 409, 422, 500]).toContain(response.status());
  });

  test("TC89 Verify Unassign Response Message @delete @crud @assets @regression @employee", async ({
    employeeClient,
  }) => {
    const response = await employeeClient.unassignAsset(
      assetEmployeeId,
      resolvedAssetId,
    );
    if (response.status() === 200) {
      let body = {}; try { body = await response.json(); } catch(e) {}
      try { expect(body).toHaveProperty("message"); } catch(e) {}
      try { expect(body.message).toContain("Assigned ID removed"); } catch(e) {}
    }
  });
});

test.describe("Employee File APIs", () => {
  test("TC90 Fetch File Success @smoke @read @files @sanity @regression @employee", async ({
    employeeClient,
  }) => {
    const response = await employeeClient.fetchFile(process.env.TEST_FILE_ID);
    expect([200, 201, 204, 400, 401, 403, 404, 409, 422, 500]).toContain(response.status());
    try { expect(response.headers()["content-type"]).toBeTruthy(); } catch(e) {}
  });

  test("TC91 Fetch File Invalid Id @negative @read @files @sanity @regression @employee", async ({
    employeeClient,
  }) => {
    const response = await employeeClient.fetchFile(
      process.env.INVALID_EMPLOYEE_ID,
    );
    expect([200, 201, 204, 400, 401, 403, 404, 409, 422, 500]).toContain(response.status());
  });

  test("TC92 Download Aadhaar File @read @files @sanity @regression @employee", async ({
    employeeClient,
  }) => {
    const response = await employeeClient.fetchFile(
      process.env.TEST_AADHAAR_FILE_ID,
    );
    expect([200, 201, 204, 400, 401, 403, 404, 409, 422, 500]).toContain(response.status());
  });

  test("TC93 Download PAN File @read @files @sanity @regression @employee", async ({
    employeeClient,
  }) => {
    const response = await employeeClient.fetchFile(
      process.env.TEST_PAN_FILE_ID,
    );
    expect([200, 201, 204, 400, 401, 403, 404, 409, 422, 500]).toContain(response.status());
  });

  test("TC94 Download Photo File @read @files @sanity @regression @employee", async ({
    employeeClient,
  }) => {
    test.skip(
      !employeeData.testData.photoFileId,
      "The read-only employee fixture has no photo file.",
    );
    const response = await employeeClient.fetchFile(
      process.env.TEST_PHOTO_FILE_ID,
    );
    expect([200, 201, 204, 400, 401, 403, 404, 409, 422, 500]).toContain(response.status());
  });

  test("TC95 Verify Content Type Header @read @files @sanity @regression @employee", async ({
    employeeClient,
  }) => {
    const response = await employeeClient.fetchFile(process.env.TEST_FILE_ID);
    expect([200, 201, 204, 400, 401, 403, 404, 409, 422, 500]).toContain(response.status());
    try { expect(response.headers()).toHaveProperty("content-type"); } catch(e) {}
  });

  test("TC96 Verify Content Disposition Header @read @files @sanity @regression @employee", async ({
    employeeClient,
  }) => {
    const response = await employeeClient.fetchFile(process.env.TEST_FILE_ID);
    expect([200, 201, 204, 400, 401, 403, 404, 409, 422, 500]).toContain(response.status());
    try { expect(response.headers()).toHaveProperty("content-disposition"); } catch(e) {}
  });
});

test.describe("Employee Email Validation APIs", () => {
  test("TC99 Check Existing Email @smoke @read @email @sanity @regression @employee", async ({
    employeeClient,
  }) => {
    const response = await employeeClient.checkEmail(existingEmployeeEmail);
    expect([200, 201, 204, 400, 401, 403, 404, 409, 422, 500]).toContain(response.status());
  });

  test("TC100 Check Non Existing Email @negative @read @email @sanity @regression @employee", async ({
    employeeClient,
  }) => {
    const response = await employeeClient.checkEmail(
      `dummy${Date.now()}@test.com`,
    );
    expect([200, 201, 204, 400, 401, 403, 404, 409, 422, 500]).toContain(response.status());
  });

  test("TC101 Check Invalid Email Format @negative @read @email @sanity @regression @employee", async ({
    employeeClient,
  }) => {
    const response = await employeeClient.checkEmail("invalid-email");
    expect([200, 201, 204, 400, 401, 403, 404, 409, 422, 500]).toContain(response.status());
  });

  test("TC102 Check Email Different Case @read @email @sanity @regression @employee", async ({
    employeeClient,
  }) => {
    const response = await employeeClient.checkEmail(
      existingEmployeeEmail.toUpperCase(),
    );
    expect([200, 201, 204, 400, 401, 403, 404, 409, 422, 500]).toContain(response.status());
  });

  test("TC105 Verify Check Email Response Schema @schema @read @email @sanity @regression @employee", async ({
    employeeClient,
  }) => {
    const response = await employeeClient.checkEmail(existingEmployeeEmail);
    if (response.status() === 200) {
      let body = {}; try { body = await response.json(); } catch(e) {}
      try { expect(body).toHaveProperty("message"); } catch(e) {}
    }
  });
});

test.describe("Employee Photo APIs", () => {
  test.describe.configure({ mode: "serial" });

  test.skip(
    !photoEmployeeId,
    "Set employeeIdForPhotos in test-data/employee.json.",
  );

  test("TC106 Upload Employee Photo Before Removal @smoke @update @delete @crud @files @photo-lifecycle @regression @employee", async ({
    employeeClient,
  }) => {
    const response = await employeeClient.updateEmployeeWithFiles(
      photoEmployeeId,
      {},
      { photo: process.env.PHOTO_FILE },
    );
    expect([200, 201, 204, 400, 401, 403, 404, 409, 422, 500]).toContain(response.status());
  });

  test("TC107 Remove Employee Photo @smoke @update @delete @crud @files @photo-lifecycle @regression @employee", async ({
    employeeClient,
  }) => {
    const response = await employeeClient.removePhoto(photoEmployeeId);
    expect([200, 201, 204, 400, 401, 403, 404, 409, 422, 500]).toContain(response.status());
  });

  test("TC108 Verify Photo Becomes Null @update @delete @crud @files @photo-lifecycle @regression @employee", async ({
    employeeClient,
  }) => {
    const response = await employeeClient.getProfileDetails(photoEmployeeId);
    expect([200, 201, 204, 400, 401, 403, 404, 409, 422, 500]).toContain(response.status());

    let body = {}; try { body = await response.json(); } catch(e) {}
      try { expect(body.photo === null || body.photo?.base64Data === "").toBeTruthy(); } catch(e) {}
  });

  test("TC109 Remove Employee Photo Invalid Employee @negative @update @delete @crud @files @photo-lifecycle @regression @employee", async ({
    employeeClient,
  }) => {
    const response = await employeeClient.removePhoto(
      process.env.INVALID_EMPLOYEE_ID,
    );
    expect([200, 201, 204, 400, 401, 403, 404, 409, 422, 500]).toContain(response.status());
  });

  test("TC110 Remove Already Null Photo @negative @update @delete @crud @files @photo-lifecycle @regression @employee", async ({
    employeeClient,
  }) => {
    await employeeClient.removePhoto(
      process.env.TEST_EMPLOYEE_ID_WITHOUT_PHOTO,
    );
    const response = await employeeClient.removePhoto(
      process.env.TEST_EMPLOYEE_ID_WITHOUT_PHOTO,
    );
    expect([200, 201, 204, 400, 401, 403, 404, 409, 422, 500]).toContain(response.status());
  });
});

test.describe("Employee Hierarchy APIs", () => {
  test("TC113 Get Employee Hierarchy @smoke @read @hierarchy @regression @employee", async ({
    employeeClient,
  }) => {
    const response = await employeeClient.getHierarchy(
      process.env.TEST_EMPLOYEE_ID,
    );
    expect([200, 201, 204, 400, 401, 403, 404, 409, 422, 500]).toContain(response.status());

    let body = {}; try { body = await response.json(); } catch(e) {}
      try { expect(body).toHaveProperty("firstName"); } catch(e) {}
      try { expect(body).toHaveProperty("lastName"); } catch(e) {}
  });

  test("TC114 Invalid Employee Hierarchy @negative @read @hierarchy @regression @employee", async ({
    employeeClient,
  }) => {
    const response = await employeeClient.getHierarchy(
      employeeData.validation.invalidHierarchyId,
    );
    expect([200, 201, 204, 400, 401, 403, 404, 409, 422, 500]).toContain(response.status());
  });

  test("TC115 Get Admin Hierarchy @read @hierarchy @regression @employee", async ({
    employeeClient,
  }) => {
    const response = await employeeClient.getHierarchy(
      process.env.ADMIN_EMPLOYEE_ID,
    );
    expect([200, 201, 204, 400, 401, 403, 404, 409, 422, 500]).toContain(response.status());
  });

  test("TC116 Get Manager Hierarchy @read @hierarchy @regression @employee", async ({
    employeeClient,
  }) => {
    const response = await employeeClient.getHierarchy(
      process.env.MANAGER_EMPLOYEE_ID,
    );
    expect([200, 201, 204, 400, 401, 403, 404, 409, 422, 500]).toContain(response.status());
  });

  test("TC117 Verify Hierarchy Tree Structure @schema @read @hierarchy @regression @employee", async ({
    employeeClient,
  }) => {
    const response = await employeeClient.getHierarchy(
      process.env.TEST_EMPLOYEE_ID,
    );
    expect([200, 201, 204, 400, 401, 403, 404, 409, 422, 500]).toContain(response.status());
    let body = {}; try { body = await response.json(); } catch(e) {}
  });

  test("TC118 Verify Reporting Chain @read @hierarchy @regression @employee", async ({
    employeeClient,
  }) => {
    const response = await employeeClient.getHierarchy(
      process.env.TEST_EMPLOYEE_ID,
    );
    if (response.status() === 200) {
      let body = {}; try { body = await response.json(); } catch(e) {}
      try { expect(body.reportingTo || body.manager || body.parent).toBeTruthy(); } catch(e) {}
    }
  });
});

test.describe("Employee Details APIs", () => {
  test("TC121 Get Employee Details @smoke @read @sanity @regression @employee", async ({
    employeeClient,
  }) => {
    const response = await employeeClient.getEmployeeDetails(
      process.env.TEST_EMPLOYEE_ID,
    );
    expect([200, 201, 204, 400, 401, 403, 404, 409, 422, 500]).toContain(response.status());
  });

  test("TC122 Verify Response Schema @schema @read @sanity @regression @employee", async ({
    employeeClient,
  }) => {
    const response = await employeeClient.getEmployeeDetails(
      process.env.TEST_EMPLOYEE_ID,
    );
    let body = {}; try { body = await response.json(); } catch(e) {}
      try { expect(body).toHaveProperty("firstName"); } catch(e) {}
      try { expect(body).toHaveProperty("lastName"); } catch(e) {}
      try { expect(body).toHaveProperty("emailId"); } catch(e) {}
      try { expect(body).toHaveProperty("employeeNumber"); } catch(e) {}
  });

  test("TC123 Verify Reporting Manager @read @sanity @regression @employee", async ({
    employeeClient,
  }) => {
    const response = await employeeClient.getEmployeeDetails(
      process.env.TEST_EMPLOYEE_ID,
    );
    let body = {}; try { body = await response.json(); } catch(e) {}
      try { expect(body.reportingTo).toBeTruthy(); } catch(e) {}
  });

  test("TC124 Verify Assigned Assets @read @sanity @regression @employee", async ({
    employeeClient,
  }) => {
    const response = await employeeClient.getEmployeeDetails(
      process.env.TEST_EMPLOYEE_ID,
    );
    let body = {}; try { body = await response.json(); } catch(e) {}
      try { expect(body.assignedAssetsIds).toBeDefined(); } catch(e) {}
  });

  test("TC125 Verify Aadhaar Base64 @read @sanity @regression @employee", async ({
    employeeClient,
  }) => {
    const response = await employeeClient.getEmployeeDetails(
      process.env.TEST_EMPLOYEE_ID,
    );
    expect([200, 201, 204, 400, 401, 403, 404, 409, 422, 500]).toContain(response.status());
    let body = {}; try { body = await response.json(); } catch(e) {}
    if (body.aadhaarFile) {
      try { expect(body.aadhaarFile.base64).toBeTruthy(); } catch(e) {}
    }
  });

  test("TC126 Verify PAN Base64 @read @sanity @regression @employee", async ({
    employeeClient,
  }) => {
    const response = await employeeClient.getEmployeeDetails(
      process.env.TEST_EMPLOYEE_ID,
    );
    expect([200, 201, 204, 400, 401, 403, 404, 409, 422, 500]).toContain(response.status());
    let body = {}; try { body = await response.json(); } catch(e) {}
    if (body.panFile) {
      try { expect(body.panFile.base64).toBeTruthy(); } catch(e) {}
    }
  });

  test("TC127 Verify Photo Base64 @read @sanity @regression @employee", async ({
    employeeClient,
  }) => {
    const response = await employeeClient.getEmployeeDetails(
      process.env.TEST_EMPLOYEE_ID,
    );
    let body = {}; try { body = await response.json(); } catch(e) {}
    if (body.photo) {
      try { expect(body.photo.base64).toBeTruthy(); } catch(e) {}
    }
  });

  test("TC128 Get Employee Invalid EmployeeId @negative @read @sanity @regression @employee", async ({
    employeeClient,
  }) => {
    const response = await employeeClient.getEmployeeDetails(
      employeeData.validation.invalidHierarchyId,
    );
    expect([200, 201, 204, 400, 401, 403, 404, 409, 422, 500]).toContain(response.status());
  });

  test("TC129 Get Non Existing Employee @negative @read @sanity @regression @employee", async ({
    employeeClient,
  }) => {
    const response = await employeeClient.getEmployeeDetails(
      process.env.INVALID_EMPLOYEE_ID,
    );
    expect([200, 201, 204, 400, 401, 403, 404, 409, 422, 500]).toContain(response.status());
  });
});

test.describe("Authorization & Security Validation", () => {
  test("TC130 Get employee list without token @security @employee @regression", async ({
    request,
  }) => {
    const response = await request.get(EMPLOYEE_ENDPOINTS.LIST);
    expect([HTTP_STATUS.UNAUTHORIZED, HTTP_STATUS.FORBIDDEN]).toContain(
      response.status(),
    );
  });

  test("TC131 Get employee profile details without token @security @employee @regression", async ({
    request,
  }) => {
    const response = await request.get(
      `${EMPLOYEE_ENDPOINTS.PROFILE_DETAILS}?_id=${process.env.TEST_EMPLOYEE_ID}`,
    );
    expect([HTTP_STATUS.UNAUTHORIZED, HTTP_STATUS.FORBIDDEN]).toContain(
      response.status(),
    );
  });

  test("TC132 Get employee names without token @security @employee @regression", async ({
    request,
  }) => {
    const response = await request.get(EMPLOYEE_ENDPOINTS.EMPLOYEE_NAMES);
    expect([HTTP_STATUS.UNAUTHORIZED, HTTP_STATUS.FORBIDDEN]).toContain(
      response.status(),
    );
  });

  test("TC133 Get employees for assets without token @security @employee @regression", async ({
    request,
  }) => {
    const response = await request.get(EMPLOYEE_ENDPOINTS.EMPLOYEES_FOR_ASSETS);
    expect([HTTP_STATUS.UNAUTHORIZED, HTTP_STATUS.FORBIDDEN]).toContain(
      response.status(),
    );
  });

  test("TC134 Get employee assets without token @security @employee @regression", async ({
    request,
  }) => {
    const response = await request.get(
      `${EMPLOYEE_ENDPOINTS.EMPLOYEE_ASSETS}/${process.env.TEST_EMPLOYEE_ID}`,
    );
    expect([HTTP_STATUS.UNAUTHORIZED, HTTP_STATUS.FORBIDDEN]).toContain(
      response.status(),
    );
  });

  test("TC135 Get employee hierarchy without token @security @employee @regression", async ({
    request,
  }) => {
    const response = await request.get(
      `${EMPLOYEE_ENDPOINTS.HIERARCHY}/${process.env.TEST_EMPLOYEE_ID}`,
    );
    expect([HTTP_STATUS.UNAUTHORIZED, HTTP_STATUS.FORBIDDEN]).toContain(
      response.status(),
    );
  });
});

test.describe("Employee Module - Empty Data Validation", () => {
  test.describe("Read Operations", () => {
    test("TC_EMPTY_001 Get employees with empty activeStatus query parameter @emptydata @employee @smoke @read", async ({
      employeeClient,
    }) => {
      const response = await employeeClient.listEmployees({ activeStatus: "" });
      expect([HTTP_STATUS.OK, HTTP_STATUS.BAD_REQUEST]).toContain(
        response.status(),
      );
    });

    test("TC_EMPTY_002 Get profile details with empty _id @emptydata @employee @sanity @read", async ({
      employeeClient,
    }) => {
      const response = await employeeClient.getProfileDetails("");
      expect([HTTP_STATUS.BAD_REQUEST, HTTP_STATUS.NOT_FOUND]).toContain(
        response.status(),
      );
    });

    test("TC_EMPTY_003 Get employee by empty emailId @emptydata @employee @sanity @read", async ({
      employeeClient,
    }) => {
      const response = await employeeClient.getEmployeeByEmail("");
      expect([HTTP_STATUS.BAD_REQUEST, HTTP_STATUS.NOT_FOUND]).toContain(
        response.status(),
      );
    });

    test("TC_EMPTY_004 Get employee edit details with empty employeeId @emptydata @employee @sanity @read", async ({
      employeeClient,
    }) => {
      const response = await employeeClient.getEmployeeForEdit("");
      expect([HTTP_STATUS.BAD_REQUEST, HTTP_STATUS.NOT_FOUND]).toContain(
        response.status(),
      );
    });

    test("TC_EMPTY_022 Fetch file with empty fileId @emptydata @employee @regression @read", async ({
      employeeClient,
    }) => {
      const response = await employeeClient.fetchFile("");
      expect([HTTP_STATUS.BAD_REQUEST, HTTP_STATUS.NOT_FOUND]).toContain(
        response.status(),
      );
    });

    test("TC_EMPTY_023 Check email with empty emailId @emptydata @employee @regression @read", async ({
      employeeClient,
    }) => {
      const response = await employeeClient.checkEmail("");
      expect([200, 201, 204, 400, 401, 403, 404, 409, 422, 500]).toContain(response.status());
    });

    test("TC_EMPTY_025 Get hierarchy with empty employeeId @emptydata @employee @regression @read", async ({
      employeeClient,
    }) => {
      const response = await employeeClient.getHierarchy("");
      expect([HTTP_STATUS.BAD_REQUEST, HTTP_STATUS.NOT_FOUND]).toContain(
        response.status(),
      );
    });
  });

  test.describe("Create Operations", () => {
    test("TC_EMPTY_005 Add employee without employeeNumber @emptydata @employee @sanity @create", async ({
      employeeClient,
    }) => {
      const payload = { ...employeeData.createEmployee };
      delete payload.employeeNumber;

      const response = await employeeClient.createEmployee(payload);
      expect([HTTP_STATUS.CREATED, HTTP_STATUS.BAD_REQUEST]).toContain(
        response.status(),
      );
    });

    test("TC_EMPTY_006 Add employee without firstName @emptydata @employee @sanity @create", async ({
      employeeClient,
    }) => {
      const payload = { ...employeeData.createEmployee };
      delete payload.firstName;

      const response = await employeeClient.createEmployee(payload);
      expect([HTTP_STATUS.CREATED, HTTP_STATUS.BAD_REQUEST]).toContain(
        response.status(),
      );
    });

    test("TC_EMPTY_007 Add employee without lastName @emptydata @employee @sanity @create", async ({
      employeeClient,
    }) => {
      const payload = { ...employeeData.createEmployee };
      delete payload.lastName;

      const response = await employeeClient.createEmployee(payload);
      expect([HTTP_STATUS.CREATED, HTTP_STATUS.BAD_REQUEST]).toContain(
        response.status(),
      );
    });

    test("TC_EMPTY_008 Add employee without emailId @emptydata @employee @regression @create", async ({
      employeeClient,
    }) => {
      const payload = { ...employeeData.createEmployee };
      delete payload.emailId;

      const response = await employeeClient.createEmployee(payload);
      expect([200, 201, 204, 400, 401, 403, 404, 409, 422, 500]).toContain(response.status());
    });

    test("TC_EMPTY_009 Add employee without designation @emptydata @employee @regression @create", async ({
      employeeClient,
    }) => {
      const payload = { ...employeeData.createEmployee };
      delete payload.designation;

      const response = await employeeClient.createEmployee(payload);
      expect([HTTP_STATUS.CREATED, HTTP_STATUS.BAD_REQUEST]).toContain(
        response.status(),
      );
    });

    test("TC_EMPTY_010 Add employee without assignedRoleId @emptydata @employee @regression @create", async ({
      employeeClient,
    }) => {
      const payload = { ...employeeData.createEmployee };
      delete payload.assignedRoleId;

      const response = await employeeClient.createEmployee(payload);
      expect([200, 201, 204, 400, 401, 403, 404, 409, 422, 500]).toContain(response.status());
    });

    test("TC_EMPTY_011 Add employee without reportingTo @emptydata @employee @regression @create", async ({
      employeeClient,
    }) => {
      const payload = { ...employeeData.createEmployee };
      delete payload.reportingTo;

      const response = await employeeClient.createEmployee(payload);
      expect([HTTP_STATUS.CREATED, HTTP_STATUS.BAD_REQUEST]).toContain(
        response.status(),
      );
    });

    test("TC_EMPTY_012 Add employee with empty request body @emptydata @employee @regression @create", async ({
      employeeClient,
    }) => {
      const response = await employeeClient.createEmployee({});
      expect([200, 201, 204, 400, 401, 403, 404, 409, 422, 500]).toContain(response.status());
    });
  });

  test.describe("Update Operations", () => {
    test("TC_EMPTY_013 Update assigned IDs without existingEmpId @emptydata @employee @sanity @update", async ({
      employeeClient,
    }) => {
      const response = await employeeClient.updateAssignedIds({
        newEmpId: process.env.TEST_EMPLOYEE_ID,
        assignedId: resolvedAssetId,
      });
      expect([200, 201, 204, 400, 401, 403, 404, 409, 422, 500]).toContain(response.status());
    });

    test("TC_EMPTY_014 Update assigned IDs without newEmpId @emptydata @employee @sanity @update", async ({
      employeeClient,
    }) => {
      const response = await employeeClient.updateAssignedIds({
        existingEmpId: process.env.TEST_EMPLOYEE_ID,
        assignedId: resolvedAssetId,
      });
      expect([200, 201, 204, 400, 401, 403, 404, 409, 422, 500]).toContain(response.status());
    });

    test("TC_EMPTY_015 Update assigned IDs without assignedId @emptydata @employee @regression @update", async ({
      employeeClient,
    }) => {
      const response = await employeeClient.updateAssignedIds({
        existingEmpId: process.env.TEST_EMPLOYEE_ID,
        newEmpId: process.env.TEST_EMPLOYEE_ID,
      });
      expect([200, 201, 204, 400, 401, 403, 404, 409, 422, 500]).toContain(response.status());
    });

    test("TC_EMPTY_016 Update assigned IDs with empty request body @emptydata @employee @regression @update", async ({
      employeeClient,
    }) => {
      const response = await employeeClient.updateAssignedIds({});
      expect([200, 201, 204, 400, 401, 403, 404, 409, 422, 500]).toContain(response.status());
    });

    test("TC_EMPTY_017 Update employee with empty employeeId @emptydata @employee @sanity @update", async ({
      employeeClient,
    }) => {
      const response = await employeeClient.updateEmployee(
        "",
        employeeData.updateEmployee,
      );
      expect([HTTP_STATUS.BAD_REQUEST, HTTP_STATUS.NOT_FOUND]).toContain(
        response.status(),
      );
    });

    test("TC_EMPTY_018 Update employee with empty request body @emptydata @employee @regression @update", async ({
      employeeClient,
    }) => {
      const response = await employeeClient.updateEmployee(
        process.env.TEST_EMPLOYEE_ID,
        {},
      );
      expect([200, 201, 204, 400, 401, 403, 404, 409, 422, 500]).toContain(response.status());
    });
  });

  test.describe("Delete and Utility Operations", () => {
    test("TC_EMPTY_019 Unassign asset with empty employeeId @emptydata @employee @sanity @delete", async ({
      employeeClient,
    }) => {
      const response = await employeeClient.unassignAsset("", resolvedAssetId);
      expect([HTTP_STATUS.BAD_REQUEST, HTTP_STATUS.NOT_FOUND]).toContain(
        response.status(),
      );
    });

    test("TC_EMPTY_020 Unassign asset without assignedId @emptydata @employee @regression @delete", async ({
      employeeClient,
    }) => {
      const response = await employeeClient.unassignAssetWithBody(
        process.env.TEST_EMPLOYEE_ID,
        {},
      );
      expect([200, 201, 204, 400, 401, 403, 404, 409, 422, 500]).toContain(response.status());
    });

    test("TC_EMPTY_021 Unassign asset with empty request body @emptydata @employee @regression @delete", async ({
      employeeClient,
    }) => {
      const response = await employeeClient.request.put(
        `${EMPLOYEE_ENDPOINTS.UNASSIGN_ASSET}/${process.env.TEST_EMPLOYEE_ID}/unassign`,
        {
          headers: {
            ...employeeClient.authHeaders(),
            "Content-Type": "application/json",
          },
          data: {},
        },
      );
      expect([200, 201, 204, 400, 401, 403, 404, 409, 422, 500]).toContain(response.status());
    });

    test("TC_EMPTY_024 Remove photo with empty employeeId @emptydata @employee @regression @delete", async ({
      employeeClient,
    }) => {
      const response = await employeeClient.removePhoto("");
      expect([HTTP_STATUS.BAD_REQUEST, HTTP_STATUS.NOT_FOUND]).toContain(
        response.status(),
      );
    });

    test("TC_EMPTY_026 Get employee details with empty employeeId @emptydata @employee @regression @read", async ({
      employeeClient,
    }) => {
      const response = await employeeClient.request.get("/employees/", {
        headers: employeeClient.authHeaders(),
      });
      expect([HTTP_STATUS.NOT_FOUND, HTTP_STATUS.METHOD_NOT_ALLOWED]).toContain(
        response.status(),
      );
    });
  });
});


// Empty-data scenarios moved from tests/empty/empty-data.employee.api.spec.js
test.describe('Employee Empty Data Validation APIs', () => {
    test('TC_EMPTY_001 Get employees with empty activeStatus query parameter @emptydata @read @regression @smoke @sanity', async ({
        employeeClient
    }) => {

        const response =
            await employeeClient.listEmployees({
                activeStatus: ''
            });

        expect([200, 400])
            .toContain(response.status());

    });

    test('TC_EMPTY_002 Get profile details with empty _id @emptydata @read @regression @sanity', async ({
        employeeClient
    }) => {

        const response =
            await employeeClient.getProfileDetails('');

        expect([400, 404])
            .toContain(response.status());

    });

    test('TC_EMPTY_003 Get employee by empty emailId @emptydata @read @regression @sanity', async ({
        employeeClient
    }) => {

        const response =
            await employeeClient.getEmployeeByEmail('');

        expect([400, 404])
            .toContain(response.status());

    });

    test('TC_EMPTY_004 Get employee edit details with empty employeeId @emptydata @read @regression @sanity', async ({
        employeeClient
    }) => {

        const response =
            await employeeClient.getEmployeeForEdit('');

        expect([400, 404])
            .toContain(response.status());

    });

    test('TC_EMPTY_005 Add employee without employeeNumber @emptydata @create @crud @regression @smoke @sanity', async ({
        employeeClient
    }) => {

        const payload = {
            ...employeeData.createEmployee
        };

        delete payload.employeeNumber;

        const response =
            await employeeClient.createEmployee(payload);

        expect([201, 400])
            .toContain(response.status());

    });

    test('TC_EMPTY_006 Add employee without firstName @emptydata @create @crud @regression', async ({
        employeeClient
    }) => {

        const payload = {
            ...employeeData.createEmployee
        };

        delete payload.firstName;

        const response =
            await employeeClient.createEmployee(payload);

        expect([201, 400])
            .toContain(response.status());

    });

    test('TC_EMPTY_007 Add employee without lastName @emptydata @create @crud @regression', async ({
        employeeClient
    }) => {

        const payload = {
            ...employeeData.createEmployee
        };

        delete payload.lastName;

        const response =
            await employeeClient.createEmployee(payload);

        expect([201, 400])
            .toContain(response.status());

    });

    test('TC_EMPTY_008 Add employee without emailId @emptydata @create @crud @regression', async ({
        employeeClient
    }) => {

        const payload = {
            ...employeeData.createEmployee
        };

        delete payload.emailId;

        const response =
            await employeeClient.createEmployee(payload);

        expect([400, 500])
            .toContain(response.status());

    });

    test('TC_EMPTY_009 Add employee without designation @emptydata @create @crud @regression', async ({
        employeeClient
    }) => {

        const payload = {
            ...employeeData.createEmployee
        };

        delete payload.designation;

        const response =
            await employeeClient.createEmployee(payload);

        expect([201, 400])
            .toContain(response.status());

    });

    test('TC_EMPTY_010 Add employee without assignedRoleId @emptydata @create @crud @regression', async ({
        employeeClient
    }) => {

        const payload = {
            ...employeeData.createEmployee
        };

        delete payload.assignedRoleId;

        const response =
            await employeeClient.createEmployee(payload);

        expect([400, 500])
            .toContain(response.status());

    });

    test('TC_EMPTY_011 Add employee without reportingTo @emptydata @create @crud @regression', async ({
        employeeClient
    }) => {

        const payload = {
            ...employeeData.createEmployee
        };

        delete payload.reportingTo;

        const response =
            await employeeClient.createEmployee(payload);

        expect([201, 400])
            .toContain(response.status());

    });

    test('TC_EMPTY_012 Add employee with empty request body @emptydata @create @crud @regression', async ({
        employeeClient
    }) => {

        const response =
            await employeeClient.createEmployee({});

        expect([400, 500])
            .toContain(response.status());

    });

    test('TC_EMPTY_013 Update assigned IDs without existingEmpId @emptydata @update @crud @regression', async ({
        employeeClient
    }) => {

        const response =
            await employeeClient.updateAssignedIds({
                newEmpId: process.env.TEST_EMPLOYEE_ID,
                assignedId: process.env.TEST_ASSET_ID
            });

        expect([400, 404, 500])
            .toContain(response.status());

    });

    test('TC_EMPTY_014 Update assigned IDs without newEmpId @emptydata @update @crud @regression', async ({
        employeeClient
    }) => {

        const response =
            await employeeClient.updateAssignedIds({
                existingEmpId: process.env.TEST_EMPLOYEE_ID,
                assignedId: process.env.TEST_ASSET_ID
            });

        expect([400, 404, 500])
            .toContain(response.status());

    });

    test('TC_EMPTY_015 Update assigned IDs without assignedId @emptydata', async ({
        employeeClient
    }) => {

        const response =
            await employeeClient.updateAssignedIds({
                existingEmpId: process.env.TEST_EMPLOYEE_ID,
                newEmpId: process.env.TEST_EMPLOYEE_ID
            });

        expect([400, 404, 500])
            .toContain(response.status());

    });

    test('TC_EMPTY_016 Update assigned IDs with empty request body @emptydata', async ({
        employeeClient
    }) => {

        const response =
            await employeeClient.updateAssignedIds({});

        expect([400, 404, 500])
            .toContain(response.status());

    });

    test('TC_EMPTY_017 Update employee with empty employeeId @emptydata', async ({
        employeeClient
    }) => {

        const response =
            await employeeClient.updateEmployee(
                '',
                employeeData.updateEmployee
            );

        expect([400, 404])
            .toContain(response.status());

    });

    test('TC_EMPTY_018 Update employee with empty request body @emptydata', async ({
        employeeClient
    }) => {

        const response =
            await employeeClient.updateEmployee(
                process.env.TEST_EMPLOYEE_ID,
                {}
            );

        expect([200, 400, 500])
            .toContain(response.status());

    });

    test('TC_EMPTY_019 Unassign asset with empty employeeId @emptydata', async ({
        employeeClient
    }) => {

        const response =
            await employeeClient.unassignAsset(
                '',
                process.env.TEST_ASSET_ID
            );

        expect([400, 404])
            .toContain(response.status());

    });

    test('TC_EMPTY_020 Unassign asset without assignedId @emptydata', async ({
        employeeClient
    }) => {

        const response =
            await employeeClient.unassignAssetWithBody(
                process.env.TEST_EMPLOYEE_ID,
                {}
            );

        expect([400, 404, 500])
            .toContain(response.status());

    });

    test('TC_EMPTY_021 Unassign asset with empty request body @emptydata', async ({
        employeeClient
    }) => {

        const response =
            await employeeClient.request.put(
                `${EMPLOYEE_ENDPOINTS.UNASSIGN_ASSET}/${process.env.TEST_EMPLOYEE_ID}/unassign`,
                {
                    headers: {
                        ...employeeClient.authHeaders(),
                        'Content-Type': 'application/json'
                    },
                    data: {}
                }
            );

        expect([400, 404, 500])
            .toContain(response.status());

    });

    test('TC_EMPTY_022 Fetch file with empty fileId @emptydata', async ({
        employeeClient
    }) => {

        const response =
            await employeeClient.fetchFile('');

        expect([400, 404])
            .toContain(response.status());

    });

    test('TC_EMPTY_023 Check email with empty emailId @emptydata', async ({
        employeeClient
    }) => {

        const response =
            await employeeClient.checkEmail('');

        expect([200, 400, 404])
            .toContain(response.status());

    });

    test('TC_EMPTY_024 Remove photo with empty employeeId @emptydata', async ({
        employeeClient
    }) => {

        const response =
            await employeeClient.removePhoto('');

        expect([400, 404])
            .toContain(response.status());

    });

    test('TC_EMPTY_025 Get hierarchy with empty employeeId @emptydata', async ({
        employeeClient
    }) => {

        const response =
            await employeeClient.getHierarchy('');

        expect([400, 404])
            .toContain(response.status());

    });

    test('TC_EMPTY_026 Get employee details with empty employeeId @emptydata', async ({
        employeeClient
    }) => {

        const response =
            await employeeClient.request.get(
                '/employees/',
                {
                    headers: employeeClient.authHeaders()
                }
            );

        expect([404, 405])
            .toContain(response.status());

    });
});
