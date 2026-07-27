const { test, expect } = require('../../fixtures/employee.fixture');
const { HTTP_STATUS } = require('../../api/constants/employee.constants');
const employeeData = require('../../test-data/employee.json');

test.describe('Employee Empty Data Validation APIs', () => {
    test('TC_EMPTY_001 Get employees with empty activeStatus query parameter @emptydata', async ({
        employeeClient
    }) => {

        const response =
            await employeeClient.listEmployees({
                activeStatus: ''
            });

        expect([200, 400])
            .toContain(response.status());

    });

    test('TC_EMPTY_002 Get profile details with empty _id @emptydata', async ({
        employeeClient
    }) => {

        const response =
            await employeeClient.getProfileDetails('');

        expect([400, 404])
            .toContain(response.status());

    });

    test('TC_EMPTY_003 Get employee by empty emailId @emptydata', async ({
        employeeClient
    }) => {

        const response =
            await employeeClient.getEmployeeByEmail('');

        expect([400, 404])
            .toContain(response.status());

    });

    test('TC_EMPTY_004 Get employee edit details with empty employeeId @emptydata', async ({
        employeeClient
    }) => {

        const response =
            await employeeClient.getEmployeeForEdit('');

        expect([400, 404])
            .toContain(response.status());

    });

    test('TC_EMPTY_005 Add employee without employeeNumber @emptydata', async ({
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

    test('TC_EMPTY_006 Add employee without firstName @emptydata', async ({
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

    test('TC_EMPTY_007 Add employee without lastName @emptydata', async ({
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

    test('TC_EMPTY_008 Add employee without emailId @emptydata', async ({
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

    test('TC_EMPTY_009 Add employee without designation @emptydata', async ({
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

    test('TC_EMPTY_010 Add employee without assignedRoleId @emptydata', async ({
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

    test('TC_EMPTY_011 Add employee without reportingTo @emptydata', async ({
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

    test('TC_EMPTY_012 Add employee with empty request body @emptydata', async ({
        employeeClient
    }) => {

        const response =
            await employeeClient.createEmployee({});

        expect([400, 500])
            .toContain(response.status());

    });

    test('TC_EMPTY_013 Update assigned IDs without existingEmpId @emptydata', async ({
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

    test('TC_EMPTY_014 Update assigned IDs without newEmpId @emptydata', async ({
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
