const {
  test,
  expect
} = require('../../fixtures/employee.fixture');

const {
  HTTP_STATUS
} = require('../../api/constants/employee.constants');

const employeeData = require('../../test-data/employee.json');

test.describe('Employee List APIs', () => {

  test('TC01 Get Employee List', async ({
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

});

test.describe('Employee Profile APIs', () => {

  test('TC05 Get Employee Profile Details',
    async ({ employeeClient }) => {

      const response =
        await employeeClient
          .getProfileDetails(
            process.env
              .TEST_EMPLOYEE_ID
          );

      expect(response.status())
        .toBe(HTTP_STATUS.OK);

      const body =
        await response.json();

      expect(body)
        .toHaveProperty(
          'firstName'
        );

      expect(body)
        .toHaveProperty(
          'lastName'
        );

      expect(body)
        .toHaveProperty(
          'emailId'
        );
    });

  test('TC06 Invalid Employee Profile',
    async ({ employeeClient }) => {

      const response =
        await employeeClient
          .getProfileDetails(
            process.env.INVALID_EMPLOYEE_ID
          );

      expect([404, 500])
        .toContain(
          response.status()
        );
    });

  test('TC07 Get Employee Names',
    async ({ employeeClient }) => {

      const response =
        await employeeClient
          .getEmployeeNames();

      expect(response.status())
        .toBe(HTTP_STATUS.OK);

      const body =
        await response.json();

      expect(Array.isArray(body))
        .toBeTruthy();
    });

});

test.describe('Employee Asset APIs', () => {

  test('TC08 Get Employees For Assets',
    async ({ employeeClient }) => {

      const response =
        await employeeClient
          .getEmployeesForAssets();

      expect(response.status())
        .toBe(HTTP_STATUS.OK);
    });

  test('TC09 Get Employee Assets',
    async ({ employeeClient }) => {

      const response =
        await employeeClient
          .getEmployeeAssets(
            process.env
              .TEST_EMPLOYEE_ID
          );

      expect(response.status())
        .toBe(HTTP_STATUS.OK);
    });

  test('TC10 Invalid Employee Assets',
    async ({ employeeClient }) => {

      const response =
        await employeeClient
          .getEmployeeAssets(
            process.env.INVALID_EMPLOYEE_ID
          );

      expect([404, 500])
        .toContain(
          response.status()
        );
    });
});

test.describe('Employee Utility APIs', () => {

  test('TC11 Get Employee For Edit', async ({
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

  test('TC12 Invalid Employee For Edit', async ({
    employeeClient
  }) => {

    const response =
      await employeeClient.getEmployeeForEdit(
        process.env.INVALID_EMPLOYEE_ID
      );

    expect([200, 404, 500])
      .toContain(response.status());

  });

  test('TC13 Get Employee By Email', async ({
    employeeClient
  }) => {

    const response =
      await employeeClient.getEmployeeByEmail(
        process.env.TEST_EMAIL
      );

    expect([200, 204])
      .toContain(response.status());

  });

  test('TC14 Get Employees By Role', async ({
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

  test('TC15 Invalid Role Search', async ({
    employeeClient
  }) => {

    const response =
      await employeeClient.getEmployeesByRole({
        role: employeeData.validation.invalidRoleId
      });

    expect([200, 204, 404])
      .toContain(response.status());
  });

  test('TC16 Check Existing Email', async ({
    employeeClient
  }) => {

    const response =
      await employeeClient.checkEmail(
        process.env.TEST_EMAIL
      );

    expect(response.status())
      .toBe(HTTP_STATUS.OK);

  });

  test('TC17 Check Non Existing Email', async ({
    employeeClient
  }) => {

    const response =
      await employeeClient.checkEmail(
        `dummy${Date.now()}@test.com`
      );

    expect(response.status())
      .toBe(HTTP_STATUS.NOT_FOUND);

  });

});

test.describe('Employee Dashboard APIs', () => {

  let employeeClient;

  test.beforeEach(async ({
    employeeClient: fixtureEmployeeClient
  }) => {

    employeeClient =
      fixtureEmployeeClient;
  });

  test('TC18 Get New Joinees', async () => {

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

  test('TC19 Get Long Service Employees', async () => {

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

  test('TC20 Get Employee Hierarchy', async () => {

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

  test('TC21 Invalid Employee Hierarchy', async () => {

    const response =
      await employeeClient.getHierarchy(
        employeeData.validation.invalidHierarchyId
      );

    expect(response.status())
      .toBe(400);
  });

  test('TC22 Fetch File Invalid Id', async () => {

    const response =
      await employeeClient.fetchFile(
        process.env.INVALID_EMPLOYEE_ID
      );

    expect([404, 500])
      .toContain(response.status());
  });

  test('TC23 Fetch File Success', async () => {

    const response =
      await employeeClient.fetchFile(
        process.env.TEST_FILE_ID
      );

    expect(response.status())
      .toBe(HTTP_STATUS.OK);

    expect(
      response.headers()['content-type']
    ).toBeTruthy();
  });

});

test.describe('Employee Management APIs', () => {

  let employeeClient;

  test.beforeEach(async ({
    employeeClient: fixtureEmployeeClient
  }) => {

    employeeClient =
      fixtureEmployeeClient;
  });

  test('TC24 Create Employee Success', async () => {

    const payload = {
      ...employeeData.createEmployee,
      emailId: `auto${Date.now()}@test.com`,
      employeeNumber: `AUTO${Date.now()}`,
      assignedRoleId: process.env.TEST_ROLE_ID || employeeData.createEmployee.assignedRoleId
    };

    const response =
      await employeeClient.createEmployee(
        payload
      );

    expect(response.status())
      .toBe(201);
  });

  test('TC25 Duplicate Employee Email Validation', async () => {

    const payload = {
      ...employeeData.createEmployee,
      emailId: process.env.TEST_EMAIL,
      employeeNumber: `AUTO${Date.now()}`,
      assignedRoleId: process.env.TEST_ROLE_ID || employeeData.createEmployee.assignedRoleId
    };

    const response =
      await employeeClient.createEmployee(
        payload
      );

    expect(response.status())
      .toBe(400);
  });

  test('TC26 Update Employee Success', async () => {

    const response =
      await employeeClient.updateEmployee(
        process.env.TEST_EMPLOYEE_ID,
        employeeData.updateEmployee
      );

    expect(response.status())
      .toBe(200);
  });

  test('TC27 Update Invalid Employee', async () => {

    const response =
      await employeeClient.updateEmployee(
        process.env.INVALID_EMPLOYEE_ID,
        employeeData.updateEmployee
      );

    expect([404, 500])
      .toContain(response.status());
  });

  test('TC28 Assign Asset To Employee', async () => {

    const response =
      await employeeClient.updateAssignedIds({
        existingEmpId: null,
        newEmpId:
          process.env.TEST_EMPLOYEE_ID,
        assignedId:
          process.env.TEST_ASSET_ID
      });

    expect(response.status())
      .toBe(200);
  });

  test('TC29 Assign Asset Invalid Employee', async () => {

    const response =
      await employeeClient.updateAssignedIds({
        existingEmpId: null,
        newEmpId:
          process.env.INVALID_EMPLOYEE_ID,
        assignedId:
          process.env.TEST_ASSET_ID
      });

    expect([200, 500])
      .toContain(response.status());
  });

  test('TC30 Unassign Asset', async () => {

    const response =
      await employeeClient.unassignAsset(
        process.env.TEST_EMPLOYEE_ID,
        process.env.TEST_ASSET_ID
      );

    expect(response.status())
      .toBe(200);
  });

test('TC31 Unassign Asset Invalid Employee', async () => {

    const response =
        await employeeClient.unassignAsset(
            process.env.INVALID_EMPLOYEE_ID,
            process.env.TEST_ASSET_ID
        );

    expect([200, 404, 500])
        .toContain(response.status());
});

  test('TC32 Remove Employee Photo', async () => {

    const response =
      await employeeClient.removePhoto(
        process.env.TEST_EMPLOYEE_ID
      );

    expect(response.status())
      .toBe(200);
  });

  test('TC33 Remove Employee Photo Invalid Employee', async () => {

    const response =
      await employeeClient.removePhoto(
        process.env.INVALID_EMPLOYEE_ID
      );

    expect([404, 500])
      .toContain(response.status());
  });

});
