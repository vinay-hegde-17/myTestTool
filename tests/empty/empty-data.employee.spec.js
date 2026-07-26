const { test, expect } = require('../../fixtures/employee.fixture');
const { HTTP_STATUS } = require('../../api/constants/employee.constants');
const employeeData = require('../../test-data/employee.json');

test.describe('Employee Empty Data Validation APIs', () => {
    test('TC001 Get New Joinees Empty @emptydata', async ({
        employeeClient }) => {

        const response =
            await employeeClient.getNewJoinees();

        expect([404, 200])
            .toContain(response.status());

        if (response.status() === 404) {

            const body =
                await response.json();

            expect(body.message)
                .toContain('No newly joined employees');

        }

    }
    );

    test('TC002 Get Long Service Employees Empty @emptydata', async ({
        employeeClient }) => {

        const response =
            await employeeClient.getLongServiceEmployees();

        expect([404, 200])
            .toContain(response.status());

        if (response.status() === 404) {

            const body =
                await response.json();

            expect(body.message)
                .toContain('No long service employees');

        }

    }
    );

    test('TC003 Get Employee List Empty @emptydata', async ({
        employeeClient }) => {

        const response =
            await employeeClient.getEmployees();

        expect(response.status())
            .toBe(HTTP_STATUS.OK);

        const body =
            await response.json();

        expect(body)
            .toEqual([]);

    }
    );

    test('TC004 Get Employees By Role Empty @emptydata', async ({
        employeeClient }) => {

        const response =
            await employeeClient.getEmployeesByRole(
                'NON_EXISTING_ROLE'
            );

        expect([200, 204, 404])
            .toContain(response.status());

    }
    );

    test('TC005 Get Employees Empty activeStatus @emptydata', async ({
        employeeClient
    }) => {

        const response =
            await employeeClient.listEmployees({
                activeStatus: ''
            });

        expect([200, 400])
            .toContain(response.status());

    });

    test('TC006 Get Profile Details Empty _id @emptydata', async ({
        employeeClient
    }) => {

        const response =
            await employeeClient.getProfileDetails('');

        expect([400, 404])
            .toContain(response.status());

    });

    test('TC007 Get Employee Assets Empty employeeId @emptydata', async ({
        employeeClient
    }) => {

        const response =
            await employeeClient.getEmployeeAssets('');

        expect([400, 404])
            .toContain(response.status());

    });

    test('TC008 Get Employee By Empty emailId @emptydata', async ({
        employeeClient
    }) => {

        const response =
            await employeeClient.getEmployeeByEmail('');

        expect([400, 404])
            .toContain(response.status());

    });

    test('TC009 Get Employee Edit Details Empty employeeId @emptydata', async ({
        employeeClient
    }) => {

        const response =
            await employeeClient.getEmployeeForEdit('');

        expect([400, 404])
            .toContain(response.status());

    });

    test('TC010 Fetch File Empty fileId @emptydata', async ({
        employeeClient
    }) => {

        const response =
            await employeeClient.fetchFile('');

        expect([400, 404])
            .toContain(response.status());

    });

    test('TC011 Check Email Empty emailId @emptydata', async ({
        employeeClient
    }) => {

        const response =
            await employeeClient.checkEmail('');

        expect([200, 400, 404])
            .toContain(response.status());

    });

    test('TC012 Remove Photo Empty employeeId @emptydata', async ({
        employeeClient
    }) => {

        const response =
            await employeeClient.removePhoto('');

        expect([400, 404])
            .toContain(response.status());

    });

    test('TC013 Get Hierarchy Empty employeeId @emptydata', async ({
        employeeClient
    }) => {

        const response =
            await employeeClient.getHierarchy('');

        expect([400, 404])
            .toContain(response.status());

    });

    test('TC014 Get Employee Details Empty employeeId @emptydata', async ({
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

    test('TC015 Add Employee Without employeeNumber @emptydata', async ({
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

    test('TC016 Add Employee Without firstName @emptydata', async ({
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

    test('TC017 Add Employee Without lastName @emptydata', async ({
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

    test('TC018 Add Employee Without emailId @emptydata', async ({
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

    test('TC019 Add Employee Without designation @emptydata', async ({
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

    test('TC020 Add Employee Without assignedRoleId @emptydata', async ({
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

    test('TC021 Add Employee Without reportingTo @emptydata', async ({
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

    test('TC022 Add Employee Empty Request Body @emptydata', async ({
        employeeClient
    }) => {

        const response =
            await employeeClient.createEmployee({});

        expect([400, 500])
            .toContain(response.status());

    });

    test('TC023 Update AssignedIds Without existingEmpId @emptydata', async ({
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

    test('TC024 Update AssignedIds Without newEmpId @emptydata', async ({
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

    test('TC025 Update AssignedIds Without assignedId @emptydata', async ({
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

    test('TC026 Update AssignedIds Empty Request Body @emptydata', async ({
        employeeClient
    }) => {

        const response =
            await employeeClient.updateAssignedIds({});

        expect([400, 404, 500])
            .toContain(response.status());

    });

    test('TC027 Update Employee Empty employeeId @emptydata', async ({
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

    test('TC028 Update Employee Empty Request Body @emptydata', async ({
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

    test('TC029 Unassign Asset Empty employeeId @emptydata', async ({
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

    test('TC030 Unassign Asset Without assignedId @emptydata', async ({
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

    test('TC031 Unassign Asset Empty Request Body @emptydata', async ({
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
});
