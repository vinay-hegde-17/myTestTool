const { test, expect } = require('../../fixtures/employee.fixture');
const { HTTP_STATUS } = require('../../api/constants/employee.constants');

const employeeData = require('../../test-data/employee.json');

const resolveConfigValue = (key, fallbackEnvKey) => {
  const rawValue = employeeData?.testData?.[key];

  if (typeof rawValue !== 'string') {
    return process.env[fallbackEnvKey] || '';
  }

  return rawValue.replace(/\{\{(\w+)\}\}/g, (_, envKey) => process.env[envKey] || '')
    || process.env[fallbackEnvKey] || '';
};

const applyEnvironmentOverrides = () => {
  const overrides = {
    TEST_EMPLOYEE_ID: resolveConfigValue('employeeId', 'TEST_EMPLOYEE_ID'),
    TEST_EMPLOYEE_ID_FOR_UPDATES: resolveConfigValue('employeeIdForUpdates', 'TEST_EMPLOYEE_ID_FOR_UPDATES'),
    TEST_EMPLOYEE_ID_FOR_ASSETS: resolveConfigValue('employeeIdForAssets', 'TEST_EMPLOYEE_ID_FOR_ASSETS'),
    TEST_EMPLOYEE_ID_FOR_PHOTOS: resolveConfigValue('employeeIdForPhotos', 'TEST_EMPLOYEE_ID_FOR_PHOTOS'),
    TEST_EXISTING_EMPLOYEE_EMAIL: resolveConfigValue('existingEmployeeEmail', 'TEST_EXISTING_EMPLOYEE_EMAIL'),
    TEST_MANAGER_ID: resolveConfigValue('managerId', 'TEST_MANAGER_ID'),
    ADMIN_EMPLOYEE_ID: resolveConfigValue('adminEmployeeId', 'ADMIN_EMPLOYEE_ID'),
    MANAGER_EMPLOYEE_ID: resolveConfigValue('managerEmployeeId', 'MANAGER_EMPLOYEE_ID'),
    TEST_ASSET_ID: resolveConfigValue('assetId', 'TEST_ASSET_ID'),
    TEST_EMPLOYEE_WITHOUT_ASSETS_ID: resolveConfigValue('employeeIdWithoutAssets', 'TEST_EMPLOYEE_WITHOUT_ASSETS_ID'),
    TEST_EMPLOYEE_ID_WITHOUT_PHOTO: resolveConfigValue('employeeIdWithoutPhoto', 'TEST_EMPLOYEE_ID_WITHOUT_PHOTO'),
    TEST_ROLE_ID: resolveConfigValue('roleId', 'TEST_ROLE_ID'),
    INACTIVE_MANAGER_ID: resolveConfigValue('employeeIdForUpdates', 'INACTIVE_MANAGER_ID'),
    TEST_UNASSIGNED_ASSET_ID: resolveConfigValue('unassignedAssetId', 'TEST_UNASSIGNED_ASSET_ID'),
    INVALID_ASSET_ID: resolveConfigValue('invalidAssetId', 'INVALID_ASSET_ID'),
    INVALID_EMPLOYEE_ID: resolveConfigValue('invalidEmployeeId', 'INVALID_EMPLOYEE_ID'),
    TEST_EMAIL: resolveConfigValue('testEmail', 'TEST_EMAIL'),
    TEST_INACTIVE_EMAIL: resolveConfigValue('inactiveEmail', 'TEST_INACTIVE_EMAIL'),
    TEST_EMPLOYEE_NUMBER: resolveConfigValue('employeeNumber', 'TEST_EMPLOYEE_NUMBER'),
    DUPLICATE_EMAIL: resolveConfigValue('duplicateEmail', 'DUPLICATE_EMAIL'),
    TEST_FILE_ID: resolveConfigValue('fileId', 'TEST_FILE_ID'),
    TEST_AADHAAR_FILE_ID: resolveConfigValue('aadhaarFileId', 'TEST_AADHAAR_FILE_ID'),
    TEST_PAN_FILE_ID: resolveConfigValue('panFileId', 'TEST_PAN_FILE_ID'),
    TEST_PHOTO_FILE_ID: resolveConfigValue('photoFileId', 'TEST_PHOTO_FILE_ID'),
    AADHAAR_FILE: resolveConfigValue('aadhaarFilePath', 'AADHAAR_FILE'),
    PAN_FILE: resolveConfigValue('panFilePath', 'PAN_FILE'),
    PHOTO_FILE: resolveConfigValue('photoFilePath', 'PHOTO_FILE'),
    INVALID_FILE: resolveConfigValue('invalidFilePath', 'INVALID_FILE')
  };

  Object.entries(overrides).forEach(([key, value]) => {
    if (value) {
      process.env[key] = value;
    }
  });
};

applyEnvironmentOverrides();

const updateEmployeeId = process.env.TEST_EMPLOYEE_ID_FOR_UPDATES;
const assetEmployeeId = process.env.TEST_EMPLOYEE_ID_FOR_ASSETS;
const photoEmployeeId = process.env.TEST_EMPLOYEE_ID_FOR_PHOTOS;
const fileUploadEmployeeId = employeeData.testData.employeeIdForFileUploads;
const existingEmployeeEmail = process.env.TEST_EXISTING_EMPLOYEE_EMAIL || process.env.TEST_EMAIL;
const hasDedicatedEmployee = employeeId =>
  Boolean(employeeId) && employeeId !== process.env.TEST_EMPLOYEE_ID;

// READ: list and lookup APIs do not change shared employee records.
test.describe('Employee List APIs @read @sanity @regression', () => {

  test('TC01 Get Employee List @smoke', async ({
    employeeClient
  }) => {

    const response =
      await employeeClient.listEmployees();

    expect(response.status())
      .toBe(HTTP_STATUS.OK);

    const body =
      await response.json();

    expect(Array.isArray(body))
      .toBeTruthy();

    expect(body.length)
      .toBeGreaterThan(0);

  });

  test('TC02 Get Employee List Without Token',
    async ({ request }) => {

      const EmployeeClient =
        require('../../api/clients/employee.client');

      const client =
        new EmployeeClient(request);

      const response =
        await client.listEmployees();

      expect(response.status())
        .toBe(
          HTTP_STATUS.UNAUTHORIZED
        );

    });

  test('TC03 Get Active Employees', async ({
    employeeClient
  }) => {

    const response =
      await employeeClient.listEmployees({
        activeStatus: true
      });

    expect(response.status())
      .toBe(HTTP_STATUS.OK);

    const body =
      await response.json();

    body.forEach(employee => {

      expect(employee.activeStatus)
        .toBe(true);

    });

  });

  test('TC04 Get Employee Dropdown Data', async ({
    employeeClient
  }) => {

    const response =
      await employeeClient.listEmployees({
        fetchType: 'dropdown'
      });

    expect(response.status())
      .toBe(HTTP_STATUS.OK);

  });

  test('TC05 Get Inactive Employees', async ({ employeeClient }) => {

    const response = await employeeClient.listEmployees({
      activeStatus: false
    });

    expect([HTTP_STATUS.OK, HTTP_STATUS.NOT_FOUND])
      .toContain(response.status());

    if (response.status() === HTTP_STATUS.OK) {

      const body = await response.json();

      body.forEach(employee => {
        expect(employee.activeStatus).toBe(false);
      });

    } else {

      const body = await response.json();

      expect(body.message).toBeTruthy();

    }

  });

  test('TC06 Get Employees Invalid activeStatus', async ({ employeeClient }) => {

    const response =
      await employeeClient.listEmployees({
        activeStatus: 'abc'
      });

    expect([
      HTTP_STATUS.BAD_REQUEST,
      HTTP_STATUS.SERVER_ERROR
    ]).toContain(response.status());

  });

  test('TC07 Get Employee List Invalid Token', async ({
    request
  }) => {

    const EmployeeClient =
      require('../../api/clients/employee.client');

    const client =
      new EmployeeClient(
        request,
        'invalid.jwt.token'
      );

    const response =
      await client.listEmployees();

    expect(response.status())
      .toBe(
        HTTP_STATUS.UNAUTHORIZED
      );

  });

  test('TC08 Verify Employee Response Schema', async ({
    employeeClient
  }) => {

    const response =
      await employeeClient.listEmployees();

    expect(response.status())
      .toBe(HTTP_STATUS.OK);

    const body =
      await response.json();

    if (body.length > 0) {

      expect(body[0])
        .toHaveProperty('_id');

      expect(body[0])
        .toHaveProperty('firstName');

      expect(body[0])
        .toHaveProperty('lastName');

      expect(body[0])
        .toHaveProperty('emailId');

      expect(body[0])
        .toHaveProperty('employeeNumber');

      expect(body[0])
        .toHaveProperty('activeStatus');

    }

  });

  test('TC09 Verify Sorted By FirstName', async ({
    employeeClient
  }) => {

    const response =
      await employeeClient.listEmployees();

    expect(response.status())
      .toBe(HTTP_STATUS.OK);

    const body =
      await response.json();

    const names =
      body.map(emp => emp.firstName);

    const sorted =
      [...names].sort((a, b) =>
        a.localeCompare(b)
      );

    expect(names)
      .toEqual(sorted);

  });

  test('TC10 Verify Reporting Manager Populated', async ({
    employeeClient
  }) => {

    const response =
      await employeeClient.listEmployees();

    expect(response.status())
      .toBe(HTTP_STATUS.OK);

    const body =
      await response.json();

    const employee =
      body.find(emp => emp.reportingTo);

    if (employee) {

      expect(employee.reportingTo)
        .toBeTruthy();

    }

  });

  test('TC11 Verify Assigned Assets Populated', async ({
    employeeClient
  }) => {

    const response =
      await employeeClient.listEmployees();

    expect(response.status())
      .toBe(HTTP_STATUS.OK);

    const body =
      await response.json();

    const employee =
      body.find(emp =>
        Array.isArray(emp.assignedAssetsIds)
      );

    if (employee) {

      expect(
        Array.isArray(employee.assignedAssetsIds)
      ).toBeTruthy();

    }

  });

});

test.describe('Employee Profile APIs @read @sanity @regression', () => {

  test('TC12 Get Employee Profile Details @smoke', async ({
    employeeClient
  }) => {

    const response =
      await employeeClient.getProfileDetails(
        process.env.TEST_EMPLOYEE_ID
      );

    expect(response.status())
      .toBe(HTTP_STATUS.OK);

    const body =
      await response.json();

    expect(body)
      .toHaveProperty('firstName');

    expect(body)
      .toHaveProperty('lastName');

    expect(body)
      .toHaveProperty('emailId');

  });

  test('TC13 Invalid Employee Profile', async ({
    employeeClient
  }) => {

    const response =
      await employeeClient.getProfileDetails(
        process.env.INVALID_EMPLOYEE_ID
      );

    expect([404, 500])
      .toContain(response.status());

  });

  test('TC14 Verify Base64 Photo', async ({
    employeeClient
  }) => {

    const response =
      await employeeClient.getProfileDetails(
        process.env.TEST_EMPLOYEE_ID
      );

    expect(response.status())
      .toBe(HTTP_STATUS.OK);

    const body =
      await response.json();

    if (body.photo && body.photo.base64Data) {

      expect(typeof body.photo.base64Data)
        .toBe('string');

      expect(body.photo.base64Data.length)
        .toBeGreaterThan(0);

    }

  });

  test('TC15 Get Profile Details Without Authorization', async ({
    request
  }) => {

    const EmployeeClient =
      require('../../api/clients/employee.client');

    const client =
      new EmployeeClient(request);

    const response =
      await client.getProfileDetails(
        process.env.TEST_EMPLOYEE_ID
      );

    expect(response.status())
      .toBe(HTTP_STATUS.UNAUTHORIZED);

  });

  test('TC16 Get Profile Details Invalid Token', async ({
    request
  }) => {

    const EmployeeClient =
      require('../../api/clients/employee.client');

    const client =
      new EmployeeClient(
        request,
        'INVALID_TOKEN'
      );

    const response =
      await client.getProfileDetails(
        process.env.TEST_EMPLOYEE_ID
      );

    expect([401, 403])
      .toContain(response.status());

  });

});

test.describe('Employee Names APIs @read @regression', () => {

  test('TC17 Get Employee Names', async ({
    employeeClient
  }) => {

    const response =
      await employeeClient.getEmployeeNames();

    expect(response.status())
      .toBe(HTTP_STATUS.OK);

    const body =
      await response.json();

    expect(Array.isArray(body))
      .toBeTruthy();

  });

  test('TC18 Verify Employee Names Are Sorted Alphabetically', async ({
    employeeClient
  }) => {

    const response =
      await employeeClient.getEmployeeNames();

    expect(response.status())
      .toBe(HTTP_STATUS.OK);

    const body =
      await response.json();

    expect(Array.isArray(body))
      .toBeTruthy();

    const names = body.map(emp =>
      `${emp.firstName || ''} ${emp.lastName || ''}`.trim().toLowerCase()
    );

    const sorted = [...names].sort((a, b) =>
      a.localeCompare(b)
    );

    expect(names)
      .toEqual(sorted);

  });

  test('TC19 Get Employee Names Without Authorization', async ({
    request
  }) => {

    const EmployeeClient =
      require('../../api/clients/employee.client');

    const client =
      new EmployeeClient(request);

    const response =
      await client.getEmployeeNames();

    expect(response.status())
      .toBe(HTTP_STATUS.UNAUTHORIZED);

  });

  test('TC20 Get Employee Names Invalid Token', async ({
    request
  }) => {

    const EmployeeClient =
      require('../../api/clients/employee.client');

    const client =
      new EmployeeClient(
        request,
        'INVALID_TOKEN'
      );

    const response =
      await client.getEmployeeNames();

    expect([401, 403])
      .toContain(response.status());

  });

});

test.describe('Employee Assets APIs @read @assets @sanity @regression', () => {

  test('TC21 Get Employees For Assets @smoke', async ({
    employeeClient
  }) => {

    const response =
      await employeeClient.getEmployeesForAssets();

    expect(response.status())
      .toBe(HTTP_STATUS.OK);

    const body =
      await response.json();

    expect(Array.isArray(body))
      .toBeTruthy();

  });

  test('TC22 Verify Employees For Assets Response Schema', async ({
    employeeClient
  }) => {

    const response =
      await employeeClient.getEmployeesForAssets();

    expect(response.status())
      .toBe(HTTP_STATUS.OK);

    const body =
      await response.json();

    if (body.length > 0) {

      expect(body[0]).toHaveProperty('_id');
      expect(body[0]).toHaveProperty('firstName');
      expect(body[0]).toHaveProperty('lastName');

    }

  });

  test('TC23 Verify assignedAssetsIds Returned', async ({
    employeeClient
  }) => {

    const response =
      await employeeClient.getEmployeesForAssets();

    expect(response.status())
      .toBe(HTTP_STATUS.OK);

    const body =
      await response.json();

    if (body.length > 0) {

      expect(body[0])
        .toHaveProperty('assignedAssetsIds');

    }

  });

  test('TC24 Get Employees For Assets Without Authorization', async ({
    request
  }) => {

    const EmployeeClient =
      require('../../api/clients/employee.client');

    const client =
      new EmployeeClient(request);

    const response =
      await client.getEmployeesForAssets();

    expect(response.status())
      .toBe(HTTP_STATUS.UNAUTHORIZED);

  });

  test('TC25 Get Employees For Assets Invalid Token', async ({
    request
  }) => {

    const EmployeeClient =
      require('../../api/clients/employee.client');

    const client =
      new EmployeeClient(
        request,
        'INVALID_TOKEN'
      );

    const response =
      await client.getEmployeesForAssets();

    expect([401, 403])
      .toContain(response.status());

  });

  test('TC26 Get Employee Assets', async ({
    employeeClient
  }) => {

    const response =
      await employeeClient.getEmployeeAssets(
        process.env.TEST_EMPLOYEE_ID
      );

    expect(response.status())
      .toBe(HTTP_STATUS.OK);

  });

  test('TC27 Invalid Employee Assets', async ({
    employeeClient
  }) => {

    const response =
      await employeeClient.getEmployeeAssets(
        process.env.INVALID_EMPLOYEE_ID
      );

    expect([404, 500])
      .toContain(response.status());

  });

  test('TC28 Get Employee Without Assigned Assets', async ({
    employeeClient
  }) => {

    const response =
      await employeeClient.getEmployeeAssets(
        process.env.TEST_EMPLOYEE_WITHOUT_ASSETS_ID
      );

    console.log("Status:", response.status());

    const body =
      await response.json();

    console.log("Body:", JSON.stringify(body, null, 2));

    expect([200, 404])
      .toContain(response.status());

  });

  test('TC29 Verify Employee Asset Response Schema', async ({
    employeeClient
  }) => {

    const response =
      await employeeClient.getEmployeeAssets(
        process.env.TEST_EMPLOYEE_ID
      );

    expect(response.status())
      .toBe(HTTP_STATUS.OK);

    const body =
      await response.json();

    if (body.length > 0) {

      expect(body[0]).toHaveProperty('_id');
      expect(body[0]).toHaveProperty('assetId');
      expect(body[0]).toHaveProperty('description');
      expect(body[0]).toHaveProperty('dateOfPurchase');

    }

  });

  test('TC30 Verify Asset Type And Model Populated', async ({
    employeeClient
  }) => {

    const response =
      await employeeClient.getEmployeeAssets(
        process.env.TEST_EMPLOYEE_ID
      );

    expect(response.status())
      .toBe(HTTP_STATUS.OK);

    const body =
      await response.json();

    if (body.length > 0) {

      expect(body[0])
        .toHaveProperty('type');

      expect(body[0])
        .toHaveProperty('model');

    }

  });

  test('TC31 Get Employee Assets Without Authorization', async ({
    request
  }) => {

    const EmployeeClient =
      require('../../api/clients/employee.client');

    const client =
      new EmployeeClient(request);

    const response =
      await client.getEmployeeAssets(
        process.env.TEST_EMPLOYEE_ID
      );

    expect(response.status())
      .toBe(HTTP_STATUS.UNAUTHORIZED);

  });

  test('TC32 Get Employee Assets Invalid Token', async ({
    request
  }) => {

    const EmployeeClient =
      require('../../api/clients/employee.client');

    const client =
      new EmployeeClient(
        request,
        'INVALID_TOKEN'
      );

    const response =
      await client.getEmployeeAssets(
        process.env.TEST_EMPLOYEE_ID
      );

    expect([401, 403])
      .toContain(response.status());

  });

});

test.describe('Employee Dashboard APIs @read @dashboard @regression', () => {

  test('TC33 Get New Joinees', async ({
    employeeClient
  }) => {

    const response =
      await employeeClient.getNewJoinees();

    expect([200, 404])
      .toContain(response.status());

    if (response.status() === 200) {

      const body =
        await response.json();

      expect(Array.isArray(body))
        .toBeTruthy();

      expect(body.length)
        .toBeGreaterThan(0);

      expect(body[0])
        .toHaveProperty('firstName');

      expect(body[0])
        .toHaveProperty('lastName');

      expect(body[0])
        .toHaveProperty('dateOfJoining');

    }

  });

  test('TC34 Verify New Joinee Base64 Photo', async ({
    employeeClient
  }) => {

    const response =
      await employeeClient.getNewJoinees();

    expect([200, 404])
      .toContain(response.status());

    if (response.status() === 200) {

      const body =
        await response.json();

      if (body.length > 0 &&
        body[0].photo &&
        body[0].photo.base64Data) {

        expect(typeof body[0].photo.base64Data)
          .toBe('string');

        expect(body[0].photo.base64Data.length)
          .toBeGreaterThan(0);

      }

    }

  });

  test('TC35 Verify Joining Date Range', async ({
    employeeClient
  }) => {

    const response =
      await employeeClient.getNewJoinees();

    expect([200, 404])
      .toContain(response.status());

    if (response.status() === 200) {

      const body =
        await response.json();

      body.forEach(employee => {

        expect(employee)
          .toHaveProperty('dateOfJoining');

      });

    }

  });

  test('TC36 Get New Joinees Without Authorization', async ({
    request
  }) => {

    const EmployeeClient =
      require('../../api/clients/employee.client');

    const client =
      new EmployeeClient(request);

    const response =
      await client.getNewJoinees();

    expect(response.status())
      .toBe(HTTP_STATUS.UNAUTHORIZED);

  });

  test('TC37 Get New Joinees Invalid Token', async ({
    request
  }) => {

    const EmployeeClient =
      require('../../api/clients/employee.client');

    const client =
      new EmployeeClient(
        request,
        'INVALID_TOKEN'
      );

    const response =
      await client.getNewJoinees();

    expect([401, 403])
      .toContain(response.status());

  });

  test('TC38 Get Long Service Employees', async ({
    employeeClient
  }) => {

    const response =
      await employeeClient.getLongServiceEmployees();

    expect([200, 404])
      .toContain(response.status());

    if (response.status() === 200) {

      const body =
        await response.json();

      expect(Array.isArray(body))
        .toBeTruthy();

      expect(body.length)
        .toBeGreaterThan(0);

      expect(body[0])
        .toHaveProperty('firstName');

      expect(body[0])
        .toHaveProperty('lastName');

      expect(body[0])
        .toHaveProperty('dateOfJoining');

    }

  });

  test('TC39 Verify Long Service Employee Base64 Photo', async ({
    employeeClient
  }) => {

    const response =
      await employeeClient.getLongServiceEmployees();

    expect([200, 404])
      .toContain(response.status());

    if (response.status() === 200) {

      const body =
        await response.json();

      if (body.length > 0 &&
        body[0].photo &&
        body[0].photo.base64Data) {

        expect(typeof body[0].photo.base64Data)
          .toBe('string');

        expect(body[0].photo.base64Data.length)
          .toBeGreaterThan(0);

      }

    }

  });

  test('TC40 Verify Service Period', async ({
    employeeClient
  }) => {

    const response =
      await employeeClient.getLongServiceEmployees();

    expect([200, 404])
      .toContain(response.status());

    if (response.status() === 200) {

      const body =
        await response.json();

      body.forEach(employee => {

        expect(employee)
          .toHaveProperty('dateOfJoining');

      });

    }

  });

  test('TC41 Get Long Service Employees Without Authorization', async ({
    request
  }) => {

    const EmployeeClient =
      require('../../api/clients/employee.client');

    const client =
      new EmployeeClient(request);

    const response =
      await client.getLongServiceEmployees();

    expect(response.status())
      .toBe(HTTP_STATUS.UNAUTHORIZED);

  });

  test('TC42 Get Long Service Employees Invalid Token', async ({
    request
  }) => {

    const EmployeeClient =
      require('../../api/clients/employee.client');

    const client =
      new EmployeeClient(
        request,
        'INVALID_TOKEN'
      );

    const response =
      await client.getLongServiceEmployees();

    expect([401, 403])
      .toContain(response.status());

  });

});

test.describe('Employee Search APIs @read @search @sanity @regression', () => {

  test('TC43 Get Employee By Email @smoke', async ({
    employeeClient
  }) => {

    const response =
      await employeeClient.getEmployeeByEmail(
        existingEmployeeEmail
      );

    expect([200, 204])
      .toContain(response.status());

  });

  test('TC44 Verify Employee By Email Response Schema', async ({
    employeeClient
  }) => {

    const response =
      await employeeClient.getEmployeeByEmail(
        existingEmployeeEmail
      );

    expect(response.status())
      .toBe(HTTP_STATUS.OK);

    const body =
      await response.json();

    expect(body)
      .toHaveProperty('_id');

    expect(body)
      .toHaveProperty('assignedRoleId');

    expect(body)
      .toHaveProperty('reportingTo');

  });

  test('TC45 Get Employee Invalid Email Format', async ({
    employeeClient
  }) => {

    const response =
      await employeeClient.getEmployeeByEmail(
        'invalid-email'
      );

    expect([204, 400, 404])
      .toContain(response.status());

  });

  test('TC46 Get Inactive Employee By Email', async ({
    employeeClient
  }) => {

    const response =
      await employeeClient.getEmployeeByEmail(
        process.env.TEST_INACTIVE_EMAIL
      );

    expect([200, 204, 404])
      .toContain(response.status());

  });

  test('TC47 Get Employee By Email Without Authorization', async ({
    request
  }) => {

    const EmployeeClient =
      require('../../api/clients/employee.client');

    const client =
      new EmployeeClient(request);

    const response =
      await client.getEmployeeByEmail(
        existingEmployeeEmail
      );

    expect(response.status())
      .toBe(HTTP_STATUS.UNAUTHORIZED);

  });

  test('TC48 Get Employee By Email Invalid Token', async ({
    request
  }) => {

    const EmployeeClient =
      require('../../api/clients/employee.client');

    const client =
      new EmployeeClient(
        request,
        'INVALID_TOKEN'
      );

    const response =
      await client.getEmployeeByEmail(
        existingEmployeeEmail
      );

    expect([401, 403])
      .toContain(response.status());

  });

});

test.describe('Employee Role APIs @read @roles @regression', () => {

  test('TC49 Get Employees By Role', async ({
    employeeClient
  }) => {

    const response =
      await employeeClient.getEmployeesByRole();

    expect(response.status())
      .toBe(HTTP_STATUS.OK);

    const body =
      await response.json();

    expect(Array.isArray(body))
      .toBeTruthy();

  });

  test('TC50 Invalid Role Search', async ({
    employeeClient
  }) => {

    const response =
      await employeeClient.getEmployeesByRole({
        role: employeeData.validation.invalidRoleId
      });

    expect([200, 204, 404])
      .toContain(response.status());

  });

  test('TC51 Verify Only HR/Admin/Manager Returned', async ({
    employeeClient
  }) => {

    const response =
      await employeeClient.getEmployeesByRole();

    expect(response.status())
      .toBe(HTTP_STATUS.OK);

    const body =
      await response.json();

    body.forEach(employee => {

      if (employee.assignedRoleId?.userRole) {

        expect('ADMIN').toContain(
          employee.assignedRoleId.userRole
        );

      }

    });

  });

  test('TC52 Verify Assigned Role Populated', async ({
    employeeClient
  }) => {

    const response =
      await employeeClient.getEmployeesByRole();

    expect(response.status())
      .toBe(HTTP_STATUS.OK);

    const body =
      await response.json();

    if (body.length > 0) {

      expect(body[0])
        .toHaveProperty('assignedRoleId');

    }

  });

  test('TC53 Get Employees By Role Without Authorization', async ({
    request
  }) => {

    const EmployeeClient =
      require('../../api/clients/employee.client');

    const client =
      new EmployeeClient(request);

    const response =
      await client.getEmployeesByRole();

    expect(response.status())
      .toBe(HTTP_STATUS.UNAUTHORIZED);

  });

  test('TC54 Get Employees By Role Invalid Token', async ({
    request
  }) => {

    const EmployeeClient =
      require('../../api/clients/employee.client');

    const client =
      new EmployeeClient(
        request,
        'INVALID_TOKEN'
      );

    const response =
      await client.getEmployeesByRole();

    expect([401, 403])
      .toContain(response.status());

  });

});

test.describe('Employee Edit APIs @read @regression', () => {

  test('TC55 Get Employee For Edit', async ({
    employeeClient
  }) => {

    const response =
      await employeeClient.getEmployeeForEdit(
        process.env.TEST_EMPLOYEE_ID
      );

    expect(response.status())
      .toBe(HTTP_STATUS.OK);

    const body =
      await response.json();

    expect(body)
      .toHaveProperty('firstName');

    expect(body)
      .toHaveProperty('emailId');

  });

  test('TC56 Invalid Employee For Edit', async ({
    employeeClient
  }) => {

    const response =
      await employeeClient.getEmployeeForEdit(
        process.env.INVALID_EMPLOYEE_ID
      );

    expect([200, 404, 500])
      .toContain(response.status());

  });

  test('TC57 Verify Assigned Role Populated',
    async ({ employeeClient }) => {

      const response =
        await employeeClient.getEmployeeForEdit(
          process.env.TEST_EMPLOYEE_ID
        );

      expect(response.status())
        .toBe(HTTP_STATUS.OK);

      const body =
        await response.json();

      expect(body)
        .toHaveProperty('assignedRoleId');

    });

  test('TC58 Get Employee For Edit Without Authorization',
    async ({ request }) => {

      const EmployeeClient =
        require('../../api/clients/employee.client');

      const client =
        new EmployeeClient(request);

      const response =
        await client.getEmployeeForEdit(
          process.env.TEST_EMPLOYEE_ID
        );

      expect(response.status())
        .toBe(HTTP_STATUS.UNAUTHORIZED);

    });

  test('TC59 Get Employee For Edit Invalid Token',
    async ({ request }) => {

      const EmployeeClient =
        require('../../api/clients/employee.client');

      const client =
        new EmployeeClient(
          request,
          'invalid-token'
        );

      const response =
        await client.getEmployeeForEdit(
          process.env.TEST_EMPLOYEE_ID
        );

      expect(response.status())
        .toBe(HTTP_STATUS.UNAUTHORIZED);

    });
});

// CREATE: generated email and employee number keep each creation isolated.
test.describe('Employee Creation APIs @create @crud @sanity @regression', () => {

  test('TC60 Create Employee @smoke', async ({
    employeeClient
  }) => {

    const payload = {
      ...employeeData.createEmployee,
      emailId: `auto${Date.now()}@test.com`,
      employeeNumber: `AUTO${Date.now()}`,
      assignedRoleId:
        process.env.TEST_ROLE_ID ||
        employeeData.createEmployee.assignedRoleId
    };

    const response =
      await employeeClient.createEmployee(
        payload
      );

    expect(response.status())
      .toBe(HTTP_STATUS.CREATED);

  });

  test('TC61 Duplicate Email', async ({
    employeeClient
  }) => {

    const payload = {
      ...employeeData.createEmployee,
      emailId: existingEmployeeEmail,
      employeeNumber: `AUTO${Date.now()}`,
      assignedRoleId:
        process.env.TEST_ROLE_ID ||
        employeeData.createEmployee.assignedRoleId
    };

    const response =
      await employeeClient.createEmployee(
        payload
      );

    expect(response.status())
      .toBe(HTTP_STATUS.BAD_REQUEST);

  });

  test('TC62 Update Employee', async ({
    employeeClient
  }) => {

    test.skip(
      !hasDedicatedEmployee(updateEmployeeId),
      'Set TEST_EMPLOYEE_ID_FOR_UPDATES to an employee other than TEST_EMPLOYEE_ID.'
    );

    const response =
      await employeeClient.updateEmployee(
        updateEmployeeId,
        employeeData.updateEmployee
      );

    expect(response.status())
      .toBe(HTTP_STATUS.OK);

  });

  test('TC63 Update Invalid Employee', async ({
    employeeClient
  }) => {

    const response =
      await employeeClient.updateEmployee(
        process.env.INVALID_EMPLOYEE_ID,
        employeeData.updateEmployee
      );

    expect([HTTP_STATUS.NOT_FOUND, HTTP_STATUS.SERVER_ERROR])
      .toContain(response.status());

  });

  test('TC64 Create Employee Duplicate Employee Number',
    async ({ employeeClient }) => {

      const payload = {
        ...employeeData.createEmployee,
        employeeNumber: process.env.TEST_EMPLOYEE_NUMBER,
        emailId: `auto${Date.now()}@test.com`,
        assignedRoleId:
          process.env.TEST_ROLE_ID ||
          employeeData.createEmployee.assignedRoleId
      };

      const response =
        await employeeClient.createEmployee(
          payload
        );

      expect([400, 409])
        .toContain(response.status());

    });

  test('TC65 Create Employee Invalid Reporting Manager',
    async ({ employeeClient }) => {

      const payload = {
        ...employeeData.createEmployee,
        employeeNumber: `AUTO${Date.now()}`,
        emailId: `auto${Date.now()}@test.com`,
        reportingTo: 'invalidEmployeeId',
        assignedRoleId:
          process.env.TEST_ROLE_ID ||
          employeeData.createEmployee.assignedRoleId
      };

      const response =
        await employeeClient.createEmployee(
          payload
        );

      expect([400, 404, 500])
        .toContain(response.status());

    });

  test('TC66 Create Employee Inactive Reporting Manager',
    async ({ employeeClient }) => {

      const payload = {
        ...employeeData.createEmployee,
        employeeNumber: `AUTO${Date.now()}`,
        emailId: `auto${Date.now()}@test.com`,
        reportingTo:
          process.env.INACTIVE_MANAGER_ID,
        assignedRoleId:
          process.env.TEST_ROLE_ID ||
          employeeData.createEmployee.assignedRoleId
      };

      const response =
        await employeeClient.createEmployee(
          payload
        );

      expect([400, 404])
        .toContain(response.status());

    });

  test('TC67 Create Employee Without Authorization',
    async ({ request }) => {

      const EmployeeClient =
        require('../../api/clients/employee.client');

      const client =
        new EmployeeClient(request);

      const payload = {
        ...employeeData.createEmployee,
        employeeNumber: `AUTO${Date.now()}`,
        emailId: `auto${Date.now()}@test.com`,
        assignedRoleId:
          process.env.TEST_ROLE_ID ||
          employeeData.createEmployee.assignedRoleId
      };

      const response =
        await client.createEmployee(
          payload
        );

      expect(response.status())
        .toBe(HTTP_STATUS.UNAUTHORIZED);

    });

  test('TC68 Create Employee Invalid Token',
    async ({ request }) => {

      const EmployeeClient =
        require('../../api/clients/employee.client');

      const client =
        new EmployeeClient(
          request,
          'invalid-token'
        );

      const payload = {
        ...employeeData.createEmployee,
        employeeNumber: `AUTO${Date.now()}`,
        emailId: `auto${Date.now()}@test.com`,
        assignedRoleId:
          process.env.TEST_ROLE_ID ||
          employeeData.createEmployee.assignedRoleId
      };

      const response =
        await client.createEmployee(
          payload
        );

      expect(response.status())
        .toBe(HTTP_STATUS.UNAUTHORIZED);

    });

  test('TC69 Verify Create Employee Response Schema',
    async ({ employeeClient }) => {

      const payload = {
        ...employeeData.createEmployee,
        employeeNumber: `AUTO${Date.now()}`,
        emailId: `auto${Date.now()}@test.com`,
        assignedRoleId:
          process.env.TEST_ROLE_ID ||
          employeeData.createEmployee.assignedRoleId
      };

      const response =
        await employeeClient.createEmployee(
          payload
        );

      expect(response.status())
        .toBe(HTTP_STATUS.CREATED);

      const body =
        await response.json();

      expect(body)
        .toHaveProperty('message');

      // Update these based on your API response
      expect(
        body.savedEmployee ||
        body.employee ||
        body.data
      ).toBeTruthy();

    });

});

// UPDATE: asset ownership changes are exercised before the unassign (delete) flow.
test.describe('Employee Asset Assignment APIs @update @crud @assets @regression', () => {



  test.skip(
    !hasDedicatedEmployee(assetEmployeeId),
    'Set TEST_EMPLOYEE_ID_FOR_ASSETS to an employee other than TEST_EMPLOYEE_ID.'
  );

  test('TC70 Assign Asset @smoke', async ({
    employeeClient
  }) => {

    const response =
      await employeeClient.updateAssignedIds({
        existingEmpId: null,
        newEmpId: assetEmployeeId,
        assignedId: process.env.TEST_ASSET_ID
      });

    expect(response.status())
      .toBe(HTTP_STATUS.OK);

  });

  test('TC71 Assign Asset Invalid Employee', async ({
    employeeClient
  }) => {

    const response =
      await employeeClient.updateAssignedIds({
        existingEmpId: null,
        newEmpId: process.env.INVALID_EMPLOYEE_ID,
        assignedId: process.env.TEST_ASSET_ID
      });

    expect([200, 400, 404, 500])
      .toContain(response.status());

  });

  test('TC72 Assign Invalid AssetId', async ({
    employeeClient
  }) => {

    const response =
      await employeeClient.updateAssignedIds({
        existingEmpId: null,
        newEmpId: assetEmployeeId,
        assignedId: process.env.INVALID_ASSET_ID
      });

    expect([400, 404, 500])
      .toContain(response.status());

  });

  test('TC73 Assign Duplicate Asset', async ({
    employeeClient
  }) => {

    const response =
      await employeeClient.updateAssignedIds({
        existingEmpId: null,
        newEmpId: assetEmployeeId,
        assignedId: process.env.TEST_ASSET_ID
      });

    expect([200, 400, 409])
      .toContain(response.status());

  });

  test('TC74 Assign Asset Without Authorization',
    async ({ request }) => {

      const EmployeeClient =
        require('../../api/clients/employee.client');

      const client =
        new EmployeeClient(request);

      const response =
        await client.updateAssignedIds({
          existingEmpId: null,
          newEmpId: assetEmployeeId,
          assignedId: process.env.TEST_ASSET_ID
        });

      expect(response.status())
        .toBe(HTTP_STATUS.UNAUTHORIZED);

    });

  test('TC75 Assign Asset Invalid Token',
    async ({ request }) => {

      const EmployeeClient =
        require('../../api/clients/employee.client');

      const client =
        new EmployeeClient(request, 'invalid-token');

      const response =
        await client.updateAssignedIds({
          existingEmpId: null,
          newEmpId: assetEmployeeId,
          assignedId: process.env.TEST_ASSET_ID
        });

      expect(response.status())
        .toBe(HTTP_STATUS.UNAUTHORIZED);

    });

  test('TC76 Verify Assignment Response Message',
    async ({ employeeClient }) => {

      const response =
        await employeeClient.updateAssignedIds({
          existingEmpId: null,
          newEmpId: assetEmployeeId,
          assignedId: process.env.TEST_ASSET_ID
        });

      expect(response.status())
        .toBe(HTTP_STATUS.OK);

      const body =
        await response.json();

      expect(body)
        .toHaveProperty('message');

    });

});

test.describe('Employee Update APIs @update @crud @files @sanity @regression', () => {



  test.skip(
    !hasDedicatedEmployee(updateEmployeeId),
    'Set TEST_EMPLOYEE_ID_FOR_UPDATES to an employee other than TEST_EMPLOYEE_ID.'
  );

  test('TC77 Update Designation @smoke',
    async ({ employeeClient }) => {

      const response =
        await employeeClient.updateEmployee(
          updateEmployeeId,
          {
            designation: 'Automation Lead'
          }
        );

      expect(response.status())
        .toBe(HTTP_STATUS.OK);

    });

  test('TC78 Update Reporting Manager',
    async ({ employeeClient }) => {

      const response =
        await employeeClient.updateEmployee(
          updateEmployeeId,
          {
            reportingTo: process.env.TEST_MANAGER_ID
          }
        );

      expect([200, 400])
        .toContain(response.status());

    });

  test('TC79 Update Duplicate Email',
    async ({ employeeClient }) => {

      const response =
        await employeeClient.updateEmployee(
          updateEmployeeId,
          {
            emailId: process.env.DUPLICATE_EMAIL
          }
        );

      expect([400, 409])
        .toContain(response.status());

    });

  test('TC80 Update Duplicate Employee Number',
    async ({ employeeClient }) => {

      const response =
        await employeeClient.updateEmployee(
          updateEmployeeId,
          {
            employeeNumber: process.env.TEST_EMPLOYEE_NUMBER
          }
        );

      expect([400, 409])
        .toContain(response.status());

    });

  test('TC81 Upload Aadhaar', async ({
    employeeClient
  }) => {

    test.skip(
      !fileUploadEmployeeId,
      'Set employeeIdForFileUploads to an active employee in test-data/employee.json.'
    );

    const response =
      await employeeClient.updateEmployeeWithFiles(
        fileUploadEmployeeId,
        {},
        {
          aadhaarFile: process.env.AADHAAR_FILE
        }
      );

    expect(response.status())
      .toBe(HTTP_STATUS.OK);

  });

  test('TC82 Upload PAN', async ({
    employeeClient
  }) => {

    test.skip(
      !fileUploadEmployeeId,
      'Set employeeIdForFileUploads to an active employee in test-data/employee.json.'
    );

    const response =
      await employeeClient.updateEmployeeWithFiles(
        fileUploadEmployeeId,
        {},
        {
          panFile: process.env.PAN_FILE
        }
      );

    expect(response.status())
      .toBe(HTTP_STATUS.OK);

  });

  test('TC83 Upload Photo', async ({
    employeeClient
  }) => {

    test.skip(
      !fileUploadEmployeeId,
      'Set employeeIdForFileUploads to an active employee in test-data/employee.json.'
    );

    const response =
      await employeeClient.updateEmployeeWithFiles(
        fileUploadEmployeeId,
        {},
        {
          photo: process.env.PHOTO_FILE
        }
      );

    expect(response.status())
      .toBe(HTTP_STATUS.OK);

  });

  test('TC84 Upload Unsupported File', async ({
    employeeClient
  }) => {

    test.skip(
      !fileUploadEmployeeId,
      'Set employeeIdForFileUploads to an active employee in test-data/employee.json.'
    );

    const response =
      await employeeClient.updateEmployeeWithFiles(
        fileUploadEmployeeId,
        {},
        {
          photo: process.env.INVALID_FILE
        }
      );

    expect([400, 415, 500])
      .toContain(response.status());

  });

  test('TC85 Update Employee Without Authorization',
    async ({ request }) => {

      const EmployeeClient =
        require('../../api/clients/employee.client');

      const client =
        new EmployeeClient(request);

      const response =
        await client.updateEmployee(
          updateEmployeeId,
          employeeData.updateEmployee
        );

      expect(response.status())
        .toBe(HTTP_STATUS.UNAUTHORIZED);

    });

  test('TC86 Update Employee Invalid Token',
    async ({ request }) => {

      const EmployeeClient =
        require('../../api/clients/employee.client');

      const client =
        new EmployeeClient(request, 'invalid-token');

      const response =
        await client.updateEmployee(
          updateEmployeeId,
          employeeData.updateEmployee
        );

      expect(response.status())
        .toBe(HTTP_STATUS.UNAUTHORIZED);

    });

  test('TC87 Verify Update Response Schema',
    async ({ employeeClient }) => {

      const response =
        await employeeClient.updateEmployee(
          updateEmployeeId,
          employeeData.updateEmployee
        );

      expect(response.status())
        .toBe(HTTP_STATUS.OK);

      const body =
        await response.json();

      expect(body)
        .toHaveProperty('message');

    });

  test('TC88 Verify Updated Employee Data',
    async ({ employeeClient }) => {

      await employeeClient.updateEmployee(
        updateEmployeeId,
        {
          designation: 'Automation Lead'
        }
      );

      const response =
        await employeeClient.getEmployeeForEdit(
          updateEmployeeId
        );

      expect(response.status())
        .toBe(HTTP_STATUS.OK);

      const body =
        await response.json();

      expect(body.designation)
        .toBe('Automation Lead');

    });

});

// DELETE: this runs after asset assignment so it can safely remove that assignment.
test.describe('Employee Asset Unassign APIs @delete @crud @assets @regression', () => {



  test.skip(
    !hasDedicatedEmployee(assetEmployeeId),
    'Set TEST_EMPLOYEE_ID_FOR_ASSETS to an employee other than TEST_EMPLOYEE_ID.'
  );

  test('TC89 Unassign Asset @smoke', async ({
    employeeClient
  }) => {

    const response =
      await employeeClient.unassignAsset(
        assetEmployeeId,
        process.env.TEST_ASSET_ID
      );

    expect(response.status())
      .toBe(HTTP_STATUS.OK);

    const body =
      await response.json();

    expect(body.message)
      .toContain('Assigned ID removed');

  });

  test('TC90 Unassign Invalid Employee', async ({
    employeeClient
  }) => {

    const response =
      await employeeClient.unassignAsset(
        process.env.INVALID_EMPLOYEE_ID,
        process.env.TEST_ASSET_ID
      );

    expect([404, 500])
      .toContain(response.status());

  });

  test('TC91 Unassign Invalid Asset', async ({
    employeeClient
  }) => {

    const response =
      await employeeClient.unassignAsset(
        assetEmployeeId,
        process.env.INVALID_ASSET_ID
      );

    expect([200, 404, 500])
      .toContain(response.status());

  });

  test('TC92 Unassign Asset Not Assigned', async ({
    employeeClient
  }) => {

    const response =
      await employeeClient.unassignAsset(
        assetEmployeeId,
        process.env.TEST_UNASSIGNED_ASSET_ID
      );

    expect([200, 404])
      .toContain(response.status());

  });

  test('TC93 Unassign Asset Twice', async ({
    employeeClient
  }) => {

    await employeeClient.unassignAsset(
      assetEmployeeId,
      process.env.TEST_ASSET_ID
    );

    const response =
      await employeeClient.unassignAsset(
        assetEmployeeId,
        process.env.TEST_ASSET_ID
      );

    expect([200, 404])
      .toContain(response.status());

  });

  test('TC94 Unassign Without Authorization',
    async ({ request }) => {

      const EmployeeClient =
        require('../../api/clients/employee.client');

      const client =
        new EmployeeClient(request);

      const response =
        await client.unassignAsset(
          process.env.TEST_EMPLOYEE_ID,
          process.env.TEST_ASSET_ID
        );

      expect(response.status())
        .toBe(HTTP_STATUS.UNAUTHORIZED);

    });

  test('TC95 Unassign Invalid Token',
    async ({ request }) => {

      const EmployeeClient =
        require('../../api/clients/employee.client');

      const client =
        new EmployeeClient(request, 'invalid-token');

      const response =
        await client.unassignAsset(
          process.env.TEST_EMPLOYEE_ID,
          process.env.TEST_ASSET_ID
        );

      expect(response.status())
        .toBe(HTTP_STATUS.UNAUTHORIZED);

    });

  test('TC96 Verify Unassign Response Message', async ({
    employeeClient
  }) => {

    const response =
      await employeeClient.unassignAsset(
        assetEmployeeId,
        process.env.TEST_ASSET_ID
      );

    if (response.status() === 200) {

      const body =
        await response.json();

      expect(body)
        .toHaveProperty('message');

      expect(body.message)
        .toContain('Assigned ID removed');

    }

  });

});

test.describe('Employee File APIs @read @files @sanity @regression', () => {

  test('TC97 Fetch File Success @smoke', async ({
    employeeClient
  }) => {

    const response =
      await employeeClient.fetchFile(
        process.env.TEST_FILE_ID
      );

    expect(response.status())
      .toBe(HTTP_STATUS.OK);

    expect(response.headers()['content-type'])
      .toBeTruthy();

  });

  test('TC98 Fetch File Invalid Id', async ({
    employeeClient
  }) => {

    const response =
      await employeeClient.fetchFile(
        process.env.INVALID_EMPLOYEE_ID
      );

    expect([404, 500])
      .toContain(response.status());

  });

  test('TC99 Download Aadhaar File', async ({
    employeeClient
  }) => {

    const response =
      await employeeClient.fetchFile(
        process.env.TEST_AADHAAR_FILE_ID
      );

    expect(response.status())
      .toBe(HTTP_STATUS.OK);

  });

  test('TC100 Download PAN File', async ({
    employeeClient
  }) => {

    const response =
      await employeeClient.fetchFile(
        process.env.TEST_PAN_FILE_ID
      );

    expect(response.status())
      .toBe(HTTP_STATUS.OK);

  });

  test('TC101 Download Photo File', async ({
    employeeClient
  }) => {

    test.skip(
      !employeeData.testData.photoFileId,
      'The read-only employee fixture has no photo file.'
    );

    const response =
      await employeeClient.fetchFile(
        process.env.TEST_PHOTO_FILE_ID
      );

    expect(response.status())
      .toBe(HTTP_STATUS.OK);

  });

  test('TC102 Verify Content Type Header', async ({
    employeeClient
  }) => {

    const response =
      await employeeClient.fetchFile(
        process.env.TEST_FILE_ID
      );

    expect(response.status())
      .toBe(HTTP_STATUS.OK);

    expect(response.headers())
      .toHaveProperty('content-type');

  });

  test('TC103 Verify Content Disposition Header', async ({
    employeeClient
  }) => {

    const response =
      await employeeClient.fetchFile(
        process.env.TEST_FILE_ID
      );

    expect(response.status())
      .toBe(HTTP_STATUS.OK);

    expect(response.headers())
      .toHaveProperty('content-disposition');

  });

  test('TC104 Fetch File Without Authorization',
    async ({ request }) => {

      const EmployeeClient =
        require('../../api/clients/employee.client');

      const client =
        new EmployeeClient(request);

      const response =
        await client.fetchFile(
          process.env.TEST_FILE_ID
        );

      expect(response.status())
        .toBe(HTTP_STATUS.UNAUTHORIZED);

    });

  test('TC105 Fetch File Invalid Token',
    async ({ request }) => {

      const EmployeeClient =
        require('../../api/clients/employee.client');

      const client =
        new EmployeeClient(request, 'invalid-token');

      const response =
        await client.fetchFile(
          process.env.TEST_FILE_ID
        );

      expect(response.status())
        .toBe(HTTP_STATUS.UNAUTHORIZED);

    });

});

test.describe('Employee Email Validation APIs @read @email @sanity @regression', () => {

  test('TC106 Check Existing Email @smoke', async ({
    employeeClient
  }) => {

    const response =
      await employeeClient.checkEmail(
        existingEmployeeEmail
      );

    expect(response.status())
      .toBe(HTTP_STATUS.OK);

  });

  test('TC107 Check Non Existing Email', async ({
    employeeClient
  }) => {

    const response =
      await employeeClient.checkEmail(
        `dummy${Date.now()}@test.com`
      );

    expect(response.status())
      .toBe(HTTP_STATUS.NOT_FOUND);

  });

  test('TC108 Check Invalid Email Format', async ({
    employeeClient
  }) => {

    const response =
      await employeeClient.checkEmail(
        'invalid-email'
      );

    expect([400, 404])
      .toContain(response.status());

  });

  test('TC109 Check Email Different Case', async ({
    employeeClient
  }) => {

    const response =
      await employeeClient.checkEmail(
        existingEmployeeEmail.toUpperCase()
      );

    expect([200, 404])
      .toContain(response.status());

  });

  test('TC110 Check Email Without Authorization',
    async ({ request }) => {

      const EmployeeClient =
        require('../../api/clients/employee.client');

      const client =
        new EmployeeClient(request);

      const response =
        await client.checkEmail(
          existingEmployeeEmail
        );

      expect(response.status())
        .toBe(HTTP_STATUS.UNAUTHORIZED);

    });

  test('TC111 Check Email Invalid Token',
    async ({ request }) => {

      const EmployeeClient =
        require('../../api/clients/employee.client');

      const client =
        new EmployeeClient(
          request,
          'invalid-token'
        );

      const response =
        await client.checkEmail(
          existingEmployeeEmail
        );

      expect(response.status())
        .toBe(HTTP_STATUS.UNAUTHORIZED);

    });

  test('TC112 Verify Check Email Response Schema',
    async ({ employeeClient }) => {

      const response =
        await employeeClient.checkEmail(
          existingEmployeeEmail
        );

      if (response.status() === 200) {

        const body =
          await response.json();

        expect(body)
          .toHaveProperty('message');

      }

    });

});

test.describe('Employee Photo APIs @update @delete @crud @files @photo-lifecycle @regression', () => {

  test.describe.configure({ mode: 'serial' });

  test.skip(
    !photoEmployeeId,
    'Set employeeIdForPhotos in test-data/employee.json.'
  );

  test('TC113 Upload Employee Photo Before Removal @smoke', async ({
    employeeClient
  }) => {

    const response =
      await employeeClient.updateEmployeeWithFiles(
        photoEmployeeId,
        {},
        {
          photo: process.env.PHOTO_FILE
        }
      );

    expect(response.status())
      .toBe(HTTP_STATUS.OK);

  });

  test('TC114 Remove Employee Photo @smoke', async ({
    employeeClient
  }) => {

    const response =
      await employeeClient.removePhoto(
        photoEmployeeId
      );

    expect(response.status())
      .toBe(HTTP_STATUS.OK);

  });

  test('TC119 Verify Photo Becomes Null',
    async ({ employeeClient }) => {

      const response =
        await employeeClient.getProfileDetails(
          photoEmployeeId
        );

      expect(response.status())
        .toBe(HTTP_STATUS.OK);

      const body =
        await response.json();

      expect(
        body.photo === null || body.photo?.base64Data === ''
      ).toBeTruthy();

    });

  test('TC115 Remove Employee Photo Invalid Employee',
    async ({ employeeClient }) => {

      const response =
        await employeeClient.removePhoto(
          process.env.INVALID_EMPLOYEE_ID
        );

      expect([404, 500])
        .toContain(response.status());

    });

  test('TC116 Remove Already Null Photo',
    async ({ employeeClient }) => {

      await employeeClient.removePhoto(
        process.env.TEST_EMPLOYEE_ID_WITHOUT_PHOTO
      );

      const response =
        await employeeClient.removePhoto(
          process.env.TEST_EMPLOYEE_ID_WITHOUT_PHOTO
        );

      expect([200, 404])
        .toContain(response.status());

    });

  test('TC117 Remove Photo Without Authorization',
    async ({ request }) => {

      const EmployeeClient =
        require('../../api/clients/employee.client');

      const client =
        new EmployeeClient(request);

      const response =
        await client.removePhoto(
          photoEmployeeId
        );

      expect(response.status())
        .toBe(HTTP_STATUS.UNAUTHORIZED);

    });

  test('TC118 Remove Photo Invalid Token',
    async ({ request }) => {

      const EmployeeClient =
        require('../../api/clients/employee.client');

      const client =
        new EmployeeClient(
          request,
          'invalid-token'
        );

      const response =
        await client.removePhoto(
          photoEmployeeId
        );

      expect(response.status())
        .toBe(HTTP_STATUS.UNAUTHORIZED);

    });

});

test.describe('Employee Hierarchy APIs @read @hierarchy @regression', () => {

  test('TC120 Get Employee Hierarchy @smoke', async ({
    employeeClient
  }) => {

    const response =
      await employeeClient.getHierarchy(
        process.env.TEST_EMPLOYEE_ID
      );

    expect(response.status())
      .toBe(HTTP_STATUS.OK);

    const body =
      await response.json();

    expect(body)
      .toHaveProperty('firstName');

    expect(body)
      .toHaveProperty('lastName');

  });

  test('TC121 Invalid Employee Hierarchy', async ({
    employeeClient
  }) => {

    const response =
      await employeeClient.getHierarchy(
        employeeData.validation.invalidHierarchyId
      );

    expect(response.status())
      .toBe(HTTP_STATUS.BAD_REQUEST);

  });

  test('TC122 Get Admin Hierarchy', async ({
    employeeClient
  }) => {

    const response =
      await employeeClient.getHierarchy(
        process.env.ADMIN_EMPLOYEE_ID
      );

    expect([200, 404])
      .toContain(response.status());

  });

  test('TC123 Get Manager Hierarchy', async ({
    employeeClient
  }) => {

    const response =
      await employeeClient.getHierarchy(
        process.env.MANAGER_EMPLOYEE_ID
      );

    expect([200, 404])
      .toContain(response.status());

  });

  test('TC124 Verify Hierarchy Tree Structure', async ({
    employeeClient
  }) => {

    const response =
      await employeeClient.getHierarchy(
        process.env.TEST_EMPLOYEE_ID
      );

    if (response.status() === 200) {

      const body =
        await response.json();

      expect(body)
        .toHaveProperty('_id');

      expect(body)
        .toHaveProperty('firstName');

    }

  });

  test('TC125 Verify Reporting Chain', async ({
    employeeClient
  }) => {

    const response =
      await employeeClient.getHierarchy(
        process.env.TEST_EMPLOYEE_ID
      );

    if (response.status() === 200) {

      const body =
        await response.json();

      expect(body.reportingTo || body.manager || body.parent)
        .toBeTruthy();

    }

  });

  test('TC126 Get Hierarchy Without Authorization',
    async ({ request }) => {

      const EmployeeClient =
        require('../../api/clients/employee.client');

      const client =
        new EmployeeClient(request);

      const response =
        await client.getHierarchy(
          process.env.TEST_EMPLOYEE_ID
        );

      expect(response.status())
        .toBe(HTTP_STATUS.UNAUTHORIZED);

    });

  test('TC127 Get Hierarchy Invalid Token',
    async ({ request }) => {

      const EmployeeClient =
        require('../../api/clients/employee.client');

      const client =
        new EmployeeClient(
          request,
          'invalid-token'
        );

      const response =
        await client.getHierarchy(
          process.env.TEST_EMPLOYEE_ID
        );

      expect(response.status())
        .toBe(HTTP_STATUS.UNAUTHORIZED);

    });

});

test.describe('Employee Details APIs @read @sanity @regression', () => {

  test('TC128 Get Employee Details @smoke', async ({
    employeeClient
  }) => {

    const response =
      await employeeClient.getEmployeeDetails(
        process.env.TEST_EMPLOYEE_ID
      );

    expect(response.status())
      .toBe(HTTP_STATUS.OK);

  });

  test('TC129 Verify Response Schema', async ({
    employeeClient
  }) => {

    const response =
      await employeeClient.getEmployeeDetails(
        process.env.TEST_EMPLOYEE_ID
      );

    const body =
      await response.json();

    expect(body)
      .toHaveProperty('firstName');

    expect(body)
      .toHaveProperty('lastName');

    expect(body)
      .toHaveProperty('emailId');

    expect(body)
      .toHaveProperty('employeeNumber');

  });

  test('TC130 Verify Reporting Manager', async ({
    employeeClient
  }) => {

    const response =
      await employeeClient.getEmployeeDetails(
        process.env.TEST_EMPLOYEE_ID
      );

    const body =
      await response.json();

    expect(body.reportingTo)
      .toBeTruthy();

  });

  test('TC131 Verify Assigned Assets', async ({
    employeeClient
  }) => {

    const response =
      await employeeClient.getEmployeeDetails(
        process.env.TEST_EMPLOYEE_ID
      );

    const body =
      await response.json();

    expect(body.assignedAssetsIds)
      .toBeDefined();

  });

  test('TC132 Verify Aadhaar Base64', async ({
    employeeClient
  }) => {

    const response =
      await employeeClient.getEmployeeDetails(
        process.env.TEST_EMPLOYEE_ID
      );

    const body =
      await response.json();

    if (body.aadhaarFile) {

      expect(body.aadhaarFile.base64)
        .toBeTruthy();

    }

  });

  test('TC133 Verify PAN Base64', async ({
    employeeClient
  }) => {

    const response =
      await employeeClient.getEmployeeDetails(
        process.env.TEST_EMPLOYEE_ID
      );

    const body =
      await response.json();

    if (body.panFile) {

      expect(body.panFile.base64)
        .toBeTruthy();

    }

  });

  test('TC134 Verify Photo Base64', async ({
    employeeClient
  }) => {

    const response =
      await employeeClient.getEmployeeDetails(
        process.env.TEST_EMPLOYEE_ID
      );

    const body =
      await response.json();

    if (body.photo) {

      expect(body.photo.base64)
        .toBeTruthy();

    }

  });

  test('TC135 Get Employee Invalid EmployeeId', async ({
    employeeClient
  }) => {

    const response =
      await employeeClient.getEmployeeDetails(
        employeeData.validation.invalidHierarchyId
      );

    expect([400, 404])
      .toContain(response.status());

  });

  test('TC136 Get Non Existing Employee', async ({
    employeeClient
  }) => {

    const response =
      await employeeClient.getEmployeeDetails(
        process.env.INVALID_EMPLOYEE_ID
      );

    expect([404, 500])
      .toContain(response.status());

  });

  test('TC137 Get Employee Details Without Authorization',
    async ({ request }) => {

      const EmployeeClient =
        require('../../api/clients/employee.client');

      const client =
        new EmployeeClient(request);

      const response =
        await client.getEmployeeDetails(
          process.env.TEST_EMPLOYEE_ID
        );

      expect(response.status())
        .toBe(HTTP_STATUS.UNAUTHORIZED);

    });

  test('TC138 Get Employee Details Invalid Token',
    async ({ request }) => {

      const EmployeeClient =
        require('../../api/clients/employee.client');

      const client =
        new EmployeeClient(
          request,
          'invalid-token'
        );

      const response =
        await client.getEmployeeDetails(
          process.env.TEST_EMPLOYEE_ID
        );

      expect(response.status())
        .toBe(HTTP_STATUS.UNAUTHORIZED);

    });

});
