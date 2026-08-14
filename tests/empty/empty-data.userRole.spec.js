const { test, expect } = require("../../fixtures/userRole.fixture");
const { loadResolvedJson } = require("../../utils/testData.util");
const userRoleData = loadResolvedJson("../../test-data/userRole.json");
const { HTTP_STATUS } = require("../../api/constants/userRole.constants");

test.describe("User Roles Module - Empty Data Validation", () => {
    test.describe.configure({ mode: "serial" });

    test.describe('Create Operations', () => {
        test("TC_EMPTY_001 Create user role without userRole @emptydata @smoke @create", async ({ userRoleClient }) => {
            const payload = { ...userRoleData.userRole };
            delete payload.userRole;

            const response = await userRoleClient.createUserRole(payload);
            expect(response.status()).toBe(HTTP_STATUS.BAD_REQUEST);
        });

        test("TC_EMPTY_002 Create user role with empty request body @emptydata @regression @create", async ({ userRoleClient }) => {
            const response = await userRoleClient.createUserRole({});
            expect(response.status()).toBe(HTTP_STATUS.BAD_REQUEST);
        });
    });

    test.describe('Update Operations', () => {
        test("TC_EMPTY_003 Update user role without userRole @emptydata @sanity @update", async ({ userRoleClient }) => {
            const payload = { ...userRoleData.updatedUserRole };
            delete payload.userRole;

            const response = await userRoleClient.updateUserRole(userRoleData.existing.roleId, payload);
            expect(response.status()).toBe(HTTP_STATUS.BAD_REQUEST);
        });

        test("TC_EMPTY_004 Update user role with empty request body @emptydata @regression @update", async ({ userRoleClient }) => {
            const response = await userRoleClient.updateUserRole(userRoleData.existing.roleId, {});
            expect(response.status()).toBe(HTTP_STATUS.BAD_REQUEST);
        });
    });

    test.describe('Read Operations', () => {
        test("TC_EMPTY_005 Get role using empty role name @emptydata @sanity @read", async ({ userRoleClient }) => {
            const response = await userRoleClient.getUserRole("");
            expect(response.status()).toBe(HTTP_STATUS.BAD_REQUEST);
        });

        test("TC_EMPTY_006 Get role using empty roleId @emptydata @sanity @read", async ({ userRoleClient }) => {
            const response = await userRoleClient.getRoleById("");
            expect(response.status()).toBe(HTTP_STATUS.BAD_REQUEST);
        });

        test("TC_EMPTY_007 Get roleId without roleName query parameter @emptydata @regression @read", async ({ userRoleClient }) => {
            const response = await userRoleClient.getRoleId("");
            expect(response.status()).toBe(HTTP_STATUS.BAD_REQUEST);
        });

        test("TC_EMPTY_008 Get roleName using empty roleId @emptydata @regression @read", async ({ userRoleClient }) => {
            const response = await userRoleClient.getRoleName("");
            expect(response.status()).toBe(HTTP_STATUS.BAD_REQUEST);
        });
    });

    test.describe('Utility Operations', () => {
        test("TC_EMPTY_009 Check/Create role without userRole @emptydata @regression @create", async ({ userRoleClient }) => {
            const payload = { activeStatus: true };
            const response = await userRoleClient.checkExistsOrCreateRole(payload);
            expect(response.status()).toBe(HTTP_STATUS.BAD_REQUEST);
        });

        test("TC_EMPTY_010 Check/Create role with empty request body @emptydata @regression @create", async ({ userRoleClient }) => {
            const response = await userRoleClient.checkExistsOrCreateRole({});
            expect(response.status()).toBe(HTTP_STATUS.BAD_REQUEST);
        });
    });
});