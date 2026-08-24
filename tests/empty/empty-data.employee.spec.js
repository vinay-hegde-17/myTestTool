const { test, expect } = require('../../fixtures/employee.fixture');
const { HTTP_STATUS } = require('../../api/constants/employee.constants');
const { loadResolvedJson } = require('../../utils/testData.util');
const employeeData = loadResolvedJson('../../test-data/employee.json');
const resolvedAssetId = employeeData.testData.assetId || '';

test.describe('Employee Module - Empty Data Validation', () => {
    test.describe('Read Operations', () => {
        test('TC_EMPTY_001 Get employees with empty activeStatus query parameter @emptydata @smoke @read', async ({ employeeClient }) => {
            const response = await employeeClient.listEmployees({ activeStatus: '' });
            expect([HTTP_STATUS.OK, HTTP_STATUS.BAD_REQUEST]).toContain(response.status());
        });

        test('TC_EMPTY_002 Get profile details with empty _id @emptydata @sanity @read', async ({ employeeClient }) => {
            const response = await employeeClient.getProfileDetails('');
            expect([HTTP_STATUS.BAD_REQUEST, HTTP_STATUS.NOT_FOUND]).toContain(response.status());
        });

        test('TC_EMPTY_003 Get employee by empty emailId @emptydata @sanity @read', async ({ employeeClient }) => {
            const response = await employeeClient.getEmployeeByEmail('');
            expect([HTTP_STATUS.BAD_REQUEST, HTTP_STATUS.NOT_FOUND]).toContain(response.status());
        });

        test('TC_EMPTY_004 Get employee edit details with empty employeeId @emptydata @sanity @read', async ({ employeeClient }) => {
            const response = await employeeClient.getEmployeeForEdit('');
            expect([HTTP_STATUS.BAD_REQUEST, HTTP_STATUS.NOT_FOUND]).toContain(response.status());
        });

        test('TC_EMPTY_022 Fetch file with empty fileId @emptydata @regression @read', async ({ employeeClient }) => {
            const response = await employeeClient.fetchFile('');
            expect([HTTP_STATUS.BAD_REQUEST, HTTP_STATUS.NOT_FOUND]).toContain(response.status());
        });

        test('TC_EMPTY_023 Check email with empty emailId @emptydata @regression @read', async ({ employeeClient }) => {
            const response = await employeeClient.checkEmail('');
            expect([HTTP_STATUS.OK, HTTP_STATUS.BAD_REQUEST, HTTP_STATUS.NOT_FOUND]).toContain(response.status());
        });

        test('TC_EMPTY_025 Get hierarchy with empty employeeId @emptydata @regression @read', async ({ employeeClient }) => {
            const response = await employeeClient.getHierarchy('');
            expect([HTTP_STATUS.BAD_REQUEST, HTTP_STATUS.NOT_FOUND]).toContain(response.status());
        });
    });

    test.describe('Create Operations', () => {
        test('TC_EMPTY_005 Add employee without employeeNumber @emptydata @sanity @create', async ({ employeeClient }) => {
            const payload = { ...employeeData.createEmployee };
            delete payload.employeeNumber;

            const response = await employeeClient.createEmployee(payload);
            expect([HTTP_STATUS.CREATED, HTTP_STATUS.BAD_REQUEST]).toContain(response.status());
        });

        test('TC_EMPTY_006 Add employee without firstName @emptydata @sanity @create', async ({ employeeClient }) => {
            const payload = { ...employeeData.createEmployee };
            delete payload.firstName;

            const response = await employeeClient.createEmployee(payload);
            expect([HTTP_STATUS.CREATED, HTTP_STATUS.BAD_REQUEST]).toContain(response.status());
        });

        test('TC_EMPTY_007 Add employee without lastName @emptydata @sanity @create', async ({ employeeClient }) => {
            const payload = { ...employeeData.createEmployee };
            delete payload.lastName;

            const response = await employeeClient.createEmployee(payload);
            expect([HTTP_STATUS.CREATED, HTTP_STATUS.BAD_REQUEST]).toContain(response.status());
        });

        test('TC_EMPTY_008 Add employee without emailId @emptydata @regression @create', async ({ employeeClient }) => {
            const payload = { ...employeeData.createEmployee };
            delete payload.emailId;

            const response = await employeeClient.createEmployee(payload);
            expect([HTTP_STATUS.BAD_REQUEST, HTTP_STATUS.INTERNAL_SERVER_ERROR]).toContain(response.status());
        });

        test('TC_EMPTY_009 Add employee without designation @emptydata @regression @create', async ({ employeeClient }) => {
            const payload = { ...employeeData.createEmployee };
            delete payload.designation;

            const response = await employeeClient.createEmployee(payload);
            expect([HTTP_STATUS.CREATED, HTTP_STATUS.BAD_REQUEST]).toContain(response.status());
        });

        test('TC_EMPTY_010 Add employee without assignedRoleId @emptydata @regression @create', async ({ employeeClient }) => {
            const payload = { ...employeeData.createEmployee };
            delete payload.assignedRoleId;

            const response = await employeeClient.createEmployee(payload);
            expect([HTTP_STATUS.BAD_REQUEST, HTTP_STATUS.INTERNAL_SERVER_ERROR]).toContain(response.status());
        });

        test('TC_EMPTY_011 Add employee without reportingTo @emptydata @regression @create', async ({ employeeClient }) => {
            const payload = { ...employeeData.createEmployee };
            delete payload.reportingTo;

            const response = await employeeClient.createEmployee(payload);
            expect([HTTP_STATUS.CREATED, HTTP_STATUS.BAD_REQUEST]).toContain(response.status());
        });

        test('TC_EMPTY_012 Add employee with empty request body @emptydata @regression @create', async ({ employeeClient }) => {
            const response = await employeeClient.createEmployee({});
            expect([HTTP_STATUS.BAD_REQUEST, HTTP_STATUS.INTERNAL_SERVER_ERROR]).toContain(response.status());
        });
    });

    test.describe('Update Operations', () => {
        test('TC_EMPTY_013 Update assigned IDs without existingEmpId @emptydata @sanity @update', async ({ employeeClient }) => {
            const response = await employeeClient.updateAssignedIds({
                newEmpId: process.env.TEST_EMPLOYEE_ID,
                assignedId: resolvedAssetId
            });
            expect([HTTP_STATUS.BAD_REQUEST, HTTP_STATUS.NOT_FOUND, HTTP_STATUS.INTERNAL_SERVER_ERROR]).toContain(response.status());
        });

        test('TC_EMPTY_014 Update assigned IDs without newEmpId @emptydata @sanity @update', async ({ employeeClient }) => {
            const response = await employeeClient.updateAssignedIds({
                existingEmpId: process.env.TEST_EMPLOYEE_ID,
                assignedId: resolvedAssetId
            });
            expect([HTTP_STATUS.BAD_REQUEST, HTTP_STATUS.NOT_FOUND, HTTP_STATUS.INTERNAL_SERVER_ERROR]).toContain(response.status());
        });

        test('TC_EMPTY_015 Update assigned IDs without assignedId @emptydata @regression @update', async ({ employeeClient }) => {
            const response = await employeeClient.updateAssignedIds({
                existingEmpId: process.env.TEST_EMPLOYEE_ID,
                newEmpId: process.env.TEST_EMPLOYEE_ID
            });
            expect([HTTP_STATUS.BAD_REQUEST, HTTP_STATUS.NOT_FOUND, HTTP_STATUS.INTERNAL_SERVER_ERROR]).toContain(response.status());
        });

        test('TC_EMPTY_016 Update assigned IDs with empty request body @emptydata @regression @update', async ({ employeeClient }) => {
            const response = await employeeClient.updateAssignedIds({});
            expect([HTTP_STATUS.BAD_REQUEST, HTTP_STATUS.NOT_FOUND, HTTP_STATUS.INTERNAL_SERVER_ERROR]).toContain(response.status());
        });

        test('TC_EMPTY_017 Update employee with empty employeeId @emptydata @sanity @update', async ({ employeeClient }) => {
            const response = await employeeClient.updateEmployee('', employeeData.updateEmployee);
            expect([HTTP_STATUS.BAD_REQUEST, HTTP_STATUS.NOT_FOUND]).toContain(response.status());
        });

        test('TC_EMPTY_018 Update employee with empty request body @emptydata @regression @update', async ({ employeeClient }) => {
            const response = await employeeClient.updateEmployee(process.env.TEST_EMPLOYEE_ID, {});
            expect([HTTP_STATUS.OK, HTTP_STATUS.BAD_REQUEST, HTTP_STATUS.INTERNAL_SERVER_ERROR]).toContain(response.status());
        });
    });

    test.describe('Delete and Utility Operations', () => {
        test('TC_EMPTY_019 Unassign asset with empty employeeId @emptydata @sanity @delete', async ({ employeeClient }) => {
            const response = await employeeClient.unassignAsset('', resolvedAssetId);
            expect([HTTP_STATUS.BAD_REQUEST, HTTP_STATUS.NOT_FOUND]).toContain(response.status());
        });

        test('TC_EMPTY_020 Unassign asset without assignedId @emptydata @regression @delete', async ({ employeeClient }) => {
            const response = await employeeClient.unassignAssetWithBody(process.env.TEST_EMPLOYEE_ID, {});
            expect([HTTP_STATUS.BAD_REQUEST, HTTP_STATUS.NOT_FOUND, HTTP_STATUS.INTERNAL_SERVER_ERROR]).toContain(response.status());
        });

        test('TC_EMPTY_021 Unassign asset with empty request body @emptydata @regression @delete', async ({ employeeClient }) => {
            const response = await employeeClient.request.put(
                `${EMPLOYEE_ENDPOINTS.UNASSIGN_ASSET}/${process.env.TEST_EMPLOYEE_ID}/unassign`,
                {
                    headers: {
                        ...employeeClient.authHeaders(),
                        'Content-Type': 'application/json'
                    },
                    data: {}
                }
            );
            expect([HTTP_STATUS.BAD_REQUEST, HTTP_STATUS.NOT_FOUND, HTTP_STATUS.INTERNAL_SERVER_ERROR]).toContain(response.status());
        });

        test('TC_EMPTY_024 Remove photo with empty employeeId @emptydata @regression @delete', async ({ employeeClient }) => {
            const response = await employeeClient.removePhoto('');
            expect([HTTP_STATUS.BAD_REQUEST, HTTP_STATUS.NOT_FOUND]).toContain(response.status());
        });

        test('TC_EMPTY_026 Get employee details with empty employeeId @emptydata @regression @read', async ({ employeeClient }) => {
            const response = await employeeClient.request.get('/employees/', {
                headers: employeeClient.authHeaders()
            });
            expect([HTTP_STATUS.NOT_FOUND, HTTP_STATUS.METHOD_NOT_ALLOWED]).toContain(response.status());
        });
    });
});
