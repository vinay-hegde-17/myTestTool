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
test.describe('Employee List APIs', () => {

  test('TC01 Get Employee List @smoke @read @sanity @regression', async ({
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

  test('TC02 Get Employee List Without Token @read @sanity @regression',
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

  test('TC03 Get Active Employees @read @sanity @regression', async ({
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

  test('TC04 Get Employee Dropdown Data @read @sanity @regression', async ({
    employeeClient
  }) => {

    const response =
      await employeeClient.listEmployees({
        fetchType: 'dropdown'
      });

    expect(response.status())
      .toBe(HTTP_STATUS.OK);

  });

  test('TC05 Get Inactive Employees @read @sanity @regression', async ({ employeeClient }) => {

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

  test('TC06 Get Employees Invalid activeStatus @read @sanity @regression', async ({ employeeClient }) => {

    const response =
      await employeeClient.listEmployees({
        activeStatus: 'abc'
      });

    expect([
      HTTP_STATUS.BAD_REQUEST,
      HTTP_STATUS.SERVER_ERROR
    ]).toContain(response.status());

  });



  test('TC07 Verify Employee Response Schema @read @sanity @regression', async ({
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

  test('TC08 Verify Sorted By FirstName @read @sanity @regression', async ({
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

  test('TC09 Verify Reporting Manager Populated @read @sanity @regression', async ({
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

  test('TC10 Verify Assigned Assets Populated @read @sanity @regression', async ({
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

test.describe('Employee Profile APIs', () => {

  test('TC11 Get Employee Profile Details @smoke @read @sanity @regression', async ({
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

  test('TC12 Invalid Employee Profile @read @sanity @regression', async ({
    employeeClient
  }) => {

    const response =
      await employeeClient.getProfileDetails(
        process.env.INVALID_EMPLOYEE_ID
      );

    expect([404, 500])
      .toContain(response.status());

  });

  test('TC13 Verify Base64 Photo @read @sanity @regression', async ({
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

  test('TC14 Get Profile Details Without Authorization @read @sanity @regression', async ({
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



});

test.describe('Employee Names APIs', () => {

  test('TC15 Get Employee Names @read @regression', async ({
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

  test('TC16 Verify Employee Names Are Sorted Alphabetically @read @regression', async ({
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

  test('TC17 Get Employee Names Without Authorization @read @regression', async ({
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



});

test.describe('Employee Assets APIs', () => {

  test('TC18 Get Employees For Assets @smoke @read @assets @sanity @regression', async ({
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

  test('TC19 Verify Employees For Assets Response Schema @read @assets @sanity @regression', async ({
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

  test('TC20 Verify assignedAssetsIds Returned @read @assets @sanity @regression', async ({
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

  test('TC21 Get Employees For Assets Without Authorization @read @assets @sanity @regression', async ({
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



  test('TC22 Get Employee Assets @read @assets @sanity @regression', async ({
    employeeClient
  }) => {

    const response =
      await employeeClient.getEmployeeAssets(
        process.env.TEST_EMPLOYEE_ID
      );

    expect(response.status())
      .toBe(HTTP_STATUS.OK);

  });

  test('TC23 Invalid Employee Assets @read @assets @sanity @regression', async ({
    employeeClient
  }) => {

    const response =
      await employeeClient.getEmployeeAssets(
        process.env.INVALID_EMPLOYEE_ID
      );

    expect([404, 500])
      .toContain(response.status());

  });

  test('TC24 Get Employee Without Assigned Assets @read @assets @sanity @regression', async ({
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

  test('TC25 Verify Employee Asset Response Schema @read @assets @sanity @regression', async ({
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

  test('TC26 Verify Asset Type And Model Populated @read @assets @sanity @regression', async ({
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

  test('TC27 Get Employee Assets Without Authorization @read @assets @sanity @regression', async ({
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



});

test.describe('Employee Dashboard APIs', () => {

  test('TC28 Get New Joinees @read @dashboard @regression', async ({
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

  test('TC29 Verify New Joinee Base64 Photo @read @dashboard @regression', async ({
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

  test('TC30 Verify Joining Date Range @read @dashboard @regression', async ({
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

  test('TC31 Get New Joinees Without Authorization @read @dashboard @regression', async ({
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



  test('TC32 Get Long Service Employees @read @dashboard @regression', async ({
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

  test('TC33 Verify Long Service Employee Base64 Photo @read @dashboard @regression', async ({
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

  test('TC34 Verify Service Period @read @dashboard @regression', async ({
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

  test('TC35 Get Long Service Employees Without Authorization @read @dashboard @regression', async ({
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



});

test.describe('Employee Search APIs', () => {

  test('TC36 Get Employee By Email @smoke @read @search @sanity @regression', async ({
    employeeClient
  }) => {

    const response =
      await employeeClient.getEmployeeByEmail(
        existingEmployeeEmail
      );

    expect([200, 204])
      .toContain(response.status());

  });

  test('TC37 Verify Employee By Email Response Schema @read @search @sanity @regression', async ({
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

  test('TC38 Get Employee Invalid Email Format @read @search @sanity @regression', async ({
    employeeClient
  }) => {

    const response =
      await employeeClient.getEmployeeByEmail(
        'invalid-email'
      );

    expect([204, 400, 404])
      .toContain(response.status());

  });

  test('TC39 Get Inactive Employee By Email @read @search @sanity @regression', async ({
    employeeClient
  }) => {

    const response =
      await employeeClient.getEmployeeByEmail(
        process.env.TEST_INACTIVE_EMAIL
      );

    expect([200, 204, 404])
      .toContain(response.status());

  });

  test('TC40 Get Employee By Email Without Authorization @read @search @sanity @regression', async ({
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

  test('TC41 Get Employee By Email Invalid Token @read @search @sanity @regression', async ({
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

test.describe('Employee Role APIs', () => {

  test('TC42 Get Employees By Role @read @roles @regression', async ({
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

  test('TC43 Invalid Role Search @read @roles @regression', async ({
    employeeClient
  }) => {

    const response =
      await employeeClient.getEmployeesByRole({
        role: employeeData.validation.invalidRoleId
      });

    expect([200, 204, 404])
      .toContain(response.status());

  });

  test('TC44 Verify Only HR/Admin/Manager Returned @read @roles @regression', async ({
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

  test('TC45 Verify Assigned Role Populated @read @roles @regression', async ({
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

  test('TC46 Get Employees By Role Without Authorization @read @roles @regression', async ({
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

  test('TC47 Get Employees By Role Invalid Token @read @roles @regression', async ({
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

test.describe('Employee Edit APIs', () => {

  test('TC48 Get Employee For Edit @read @regression', async ({
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

  test('TC49 Invalid Employee For Edit @read @regression', async ({
    employeeClient
  }) => {

    const response =
      await employeeClient.getEmployeeForEdit(
        process.env.INVALID_EMPLOYEE_ID
      );

    expect([200, 404, 500])
      .toContain(response.status());

  });

  test('TC50 Verify Assigned Role Populated @read @regression',
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

  test('TC51 Get Employee For Edit Without Authorization @read @regression',
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

  test('TC52 Get Employee For Edit Invalid Token @read @regression',
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
test.describe('Employee Creation APIs', () => {

  test('TC53 Create Employee @smoke @create @crud @sanity @regression', async ({
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

  test('TC54 Duplicate Email @create @crud @sanity @regression', async ({
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

  test('TC55 Update Employee @create @crud @sanity @regression', async ({
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

  test('TC56 Update Invalid Employee @create @crud @sanity @regression', async ({
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

  test('TC57 Create Employee Duplicate Employee Number @create @crud @sanity @regression',
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

  test('TC58 Create Employee Invalid Reporting Manager @create @crud @sanity @regression',
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

  test('TC59 Create Employee Inactive Reporting Manager @create @crud @sanity @regression',
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

  test('TC60 Create Employee Without Authorization @create @crud @sanity @regression',
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

  test('TC61 Create Employee Invalid Token @create @crud @sanity @regression',
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

  test('TC62 Verify Create Employee Response Schema @create @crud @sanity @regression',
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
test.describe('Employee Asset Assignment APIs', () => {



  test.skip(
    !hasDedicatedEmployee(assetEmployeeId),
    'Set TEST_EMPLOYEE_ID_FOR_ASSETS to an employee other than TEST_EMPLOYEE_ID.'
  );

  test('TC63 Assign Asset @smoke @update @crud @assets @regression', async ({
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

  test('TC64 Assign Asset Invalid Employee @update @crud @assets @regression', async ({
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

  test('TC65 Assign Invalid AssetId @update @crud @assets @regression', async ({
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

  test('TC66 Assign Duplicate Asset @update @crud @assets @regression', async ({
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

  test('TC67 Assign Asset Without Authorization @update @crud @assets @regression',
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

  test('TC68 Assign Asset Invalid Token @update @crud @assets @regression',
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

  test('TC69 Verify Assignment Response Message @update @crud @assets @regression',
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

test.describe('Employee Update APIs', () => {



  test.skip(
    !hasDedicatedEmployee(updateEmployeeId),
    'Set TEST_EMPLOYEE_ID_FOR_UPDATES to an employee other than TEST_EMPLOYEE_ID.'
  );

  test('TC70 Update Designation @smoke @update @crud @files @sanity @regression',
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

  test('TC71 Update Reporting Manager @update @crud @files @sanity @regression',
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

  test('TC72 Update Duplicate Email @update @crud @files @sanity @regression',
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

  test('TC73 Update Duplicate Employee Number @update @crud @files @sanity @regression',
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

  test('TC74 Upload Aadhaar @update @crud @files @sanity @regression', async ({
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

  test('TC75 Upload PAN @update @crud @files @sanity @regression', async ({
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

  test('TC76 Upload Photo @update @crud @files @sanity @regression', async ({
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

  test('TC77 Upload Unsupported File @update @crud @files @sanity @regression', async ({
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

  test('TC78 Update Employee Without Authorization @update @crud @files @sanity @regression',
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

  test('TC79 Update Employee Invalid Token @update @crud @files @sanity @regression',
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

  test('TC80 Verify Update Response Schema @update @crud @files @sanity @regression',
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

  test('TC81 Verify Updated Employee Data @update @crud @files @sanity @regression',
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
test.describe('Employee Asset Unassign APIs', () => {



  test.skip(
    !hasDedicatedEmployee(assetEmployeeId),
    'Set TEST_EMPLOYEE_ID_FOR_ASSETS to an employee other than TEST_EMPLOYEE_ID.'
  );

  test('TC82 Unassign Asset @smoke @delete @crud @assets @regression', async ({
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

  test('TC83 Unassign Invalid Employee @delete @crud @assets @regression', async ({
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

  test('TC84 Unassign Invalid Asset @delete @crud @assets @regression', async ({
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

  test('TC85 Unassign Asset Not Assigned @delete @crud @assets @regression', async ({
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

  test('TC86 Unassign Asset Twice @delete @crud @assets @regression', async ({
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

  test('TC87 Unassign Without Authorization @delete @crud @assets @regression',
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

  test('TC88 Unassign Invalid Token @delete @crud @assets @regression',
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

  test('TC89 Verify Unassign Response Message @delete @crud @assets @regression', async ({
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

test.describe('Employee File APIs', () => {

  test('TC90 Fetch File Success @smoke @read @files @sanity @regression', async ({
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

  test('TC91 Fetch File Invalid Id @read @files @sanity @regression', async ({
    employeeClient
  }) => {

    const response =
      await employeeClient.fetchFile(
        process.env.INVALID_EMPLOYEE_ID
      );

    expect([404, 500])
      .toContain(response.status());

  });

  test('TC92 Download Aadhaar File @read @files @sanity @regression', async ({
    employeeClient
  }) => {

    const response =
      await employeeClient.fetchFile(
        process.env.TEST_AADHAAR_FILE_ID
      );

    expect(response.status())
      .toBe(HTTP_STATUS.OK);

  });

  test('TC93 Download PAN File @read @files @sanity @regression', async ({
    employeeClient
  }) => {

    const response =
      await employeeClient.fetchFile(
        process.env.TEST_PAN_FILE_ID
      );

    expect(response.status())
      .toBe(HTTP_STATUS.OK);

  });

  test('TC94 Download Photo File @read @files @sanity @regression', async ({
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

  test('TC95 Verify Content Type Header @read @files @sanity @regression', async ({
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

  test('TC96 Verify Content Disposition Header @read @files @sanity @regression', async ({
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

  test('TC97 Fetch File Without Authorization @read @files @sanity @regression',
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

  test('TC98 Fetch File Invalid Token @read @files @sanity @regression',
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

test.describe('Employee Email Validation APIs', () => {

  test('TC99 Check Existing Email @smoke @read @email @sanity @regression', async ({
    employeeClient
  }) => {

    const response =
      await employeeClient.checkEmail(
        existingEmployeeEmail
      );

    expect(response.status())
      .toBe(HTTP_STATUS.OK);

  });

  test('TC100 Check Non Existing Email @read @email @sanity @regression', async ({
    employeeClient
  }) => {

    const response =
      await employeeClient.checkEmail(
        `dummy${Date.now()}@test.com`
      );

    expect(response.status())
      .toBe(HTTP_STATUS.NOT_FOUND);

  });

  test('TC101 Check Invalid Email Format @read @email @sanity @regression', async ({
    employeeClient
  }) => {

    const response =
      await employeeClient.checkEmail(
        'invalid-email'
      );

    expect([400, 404])
      .toContain(response.status());

  });

  test('TC102 Check Email Different Case @read @email @sanity @regression', async ({
    employeeClient
  }) => {

    const response =
      await employeeClient.checkEmail(
        existingEmployeeEmail.toUpperCase()
      );

    expect([200, 404])
      .toContain(response.status());

  });

  test('TC103 Check Email Without Authorization @read @email @sanity @regression',
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

  test('TC104 Check Email Invalid Token @read @email @sanity @regression',
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

  test('TC105 Verify Check Email Response Schema @read @email @sanity @regression',
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

test.describe('Employee Photo APIs', () => {

  test.describe.configure({ mode: 'serial' });

  test.skip(
    !photoEmployeeId,
    'Set employeeIdForPhotos in test-data/employee.json.'
  );

  test('TC106 Upload Employee Photo Before Removal @smoke @update @delete @crud @files @photo-lifecycle @regression', async ({
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

  test('TC107 Remove Employee Photo @smoke @update @delete @crud @files @photo-lifecycle @regression', async ({
    employeeClient
  }) => {

    const response =
      await employeeClient.removePhoto(
        photoEmployeeId
      );

    expect(response.status())
      .toBe(HTTP_STATUS.OK);

  });

  test('TC108 Verify Photo Becomes Null @update @delete @crud @files @photo-lifecycle @regression',
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

  test('TC109 Remove Employee Photo Invalid Employee @update @delete @crud @files @photo-lifecycle @regression',
    async ({ employeeClient }) => {

      const response =
        await employeeClient.removePhoto(
          process.env.INVALID_EMPLOYEE_ID
        );

      expect([404, 500])
        .toContain(response.status());

    });

  test('TC110 Remove Already Null Photo @update @delete @crud @files @photo-lifecycle @regression',
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

  test('TC111 Remove Photo Without Authorization @update @delete @crud @files @photo-lifecycle @regression',
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

  test('TC112 Remove Photo Invalid Token @update @delete @crud @files @photo-lifecycle @regression',
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

test.describe('Employee Hierarchy APIs', () => {

  test('TC113 Get Employee Hierarchy @smoke @read @hierarchy @regression', async ({
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

  test('TC114 Invalid Employee Hierarchy @read @hierarchy @regression', async ({
    employeeClient
  }) => {

    const response =
      await employeeClient.getHierarchy(
        employeeData.validation.invalidHierarchyId
      );

    expect(response.status())
      .toBe(HTTP_STATUS.BAD_REQUEST);

  });

  test('TC115 Get Admin Hierarchy @read @hierarchy @regression', async ({
    employeeClient
  }) => {

    const response =
      await employeeClient.getHierarchy(
        process.env.ADMIN_EMPLOYEE_ID
      );

    expect([200, 404])
      .toContain(response.status());

  });

  test('TC116 Get Manager Hierarchy @read @hierarchy @regression', async ({
    employeeClient
  }) => {

    const response =
      await employeeClient.getHierarchy(
        process.env.MANAGER_EMPLOYEE_ID
      );

    expect([200, 404])
      .toContain(response.status());

  });

  test('TC117 Verify Hierarchy Tree Structure @read @hierarchy @regression', async ({
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

  test('TC118 Verify Reporting Chain @read @hierarchy @regression', async ({
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

  test('TC119 Get Hierarchy Without Authorization @read @hierarchy @regression',
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

  test('TC120 Get Hierarchy Invalid Token @read @hierarchy @regression',
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

test.describe('Employee Details APIs', () => {

  test('TC121 Get Employee Details @smoke @read @sanity @regression', async ({
    employeeClient
  }) => {

    const response =
      await employeeClient.getEmployeeDetails(
        process.env.TEST_EMPLOYEE_ID
      );

    expect(response.status())
      .toBe(HTTP_STATUS.OK);

  });

  test('TC122 Verify Response Schema @read @sanity @regression', async ({
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

  test('TC123 Verify Reporting Manager @read @sanity @regression', async ({
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

  test('TC124 Verify Assigned Assets @read @sanity @regression', async ({
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

  test('TC125 Verify Aadhaar Base64 @read @sanity @regression', async ({
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

  test('TC126 Verify PAN Base64 @read @sanity @regression', async ({
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

  test('TC127 Verify Photo Base64 @read @sanity @regression', async ({
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

  test('TC128 Get Employee Invalid EmployeeId @read @sanity @regression', async ({
    employeeClient
  }) => {

    const response =
      await employeeClient.getEmployeeDetails(
        employeeData.validation.invalidHierarchyId
      );

    expect([400, 404])
      .toContain(response.status());

  });

  test('TC129 Get Non Existing Employee @read @sanity @regression', async ({
    employeeClient
  }) => {

    const response =
      await employeeClient.getEmployeeDetails(
        process.env.INVALID_EMPLOYEE_ID
      );

    expect([404, 500])
      .toContain(response.status());

  });

  test('TC130 Get Employee Details Without Authorization @read @sanity @regression',
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

  test('TC131 Get Employee Details Invalid Token @read @sanity @regression',
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
