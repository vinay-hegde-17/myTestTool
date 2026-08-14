const { test, expect } = require("../../fixtures/userRole.fixture");
const { loadResolvedJson } = require("../../utils/testData.util");
const userRoleData = loadResolvedJson("../../test-data/userRole.json");
const { HTTP_STATUS } = require("../../api/constants/userRole.constants");
const crypto = require("crypto");

let createdRoleId;
test.describe("User Role APIs", () => {

    test.describe("Read Operations", () => {

    test("TC01 Get all user roles @read @regression", async ({ userRoleClient }) => {
        const response = await userRoleClient.getUserRoles();

        expect(response.status()).toBe(HTTP_STATUS.OK);

        const body = await response.json();
        expect(Array.isArray(body)).toBeTruthy();
        expect(body.length).toBeGreaterThan(0);
    });

    test("TC02 Get all user roles with fetchType=dropdown @read @regression", async ({ userRoleClient }) => {
        const response = await userRoleClient.getUserRoles("dropdown");

        expect(response.status()).toBe(HTTP_STATUS.OK);

        const body = await response.json();
        expect(Array.isArray(body)).toBeTruthy();
        expect(body.length).toBeGreaterThan(0);
    });

    test("TC03 Get all user roles with invalid fetchType @read @regression", async ({ userRoleClient }) => {
        const response = await userRoleClient.getUserRoles("invalid");

        expect(response.status()).toBe(HTTP_STATUS.OK);

        const body = await response.json();
        expect(Array.isArray(body)).toBeTruthy();
    });

    test("TC04 Verify user roles response schema @read @regression", async ({ userRoleClient }) => {
        const response = await userRoleClient.getUserRoles();

        expect(response.status()).toBe(HTTP_STATUS.OK);

        const body = await response.json();

        expect(Array.isArray(body)).toBeTruthy();

        if (body.length > 0) {
            expect(body[0]).toHaveProperty("_id");
            expect(body[0]).toHaveProperty("userRole");
            expect(body[0]).toHaveProperty("description");
            expect(body[0]).toHaveProperty("activeStatus");
        }
    });

    test("TC05 Verify dropdown response schema @read @regression", async ({ userRoleClient }) => {
        const response = await userRoleClient.getUserRoles("dropdown");

        expect(response.status()).toBe(HTTP_STATUS.OK);

        const body = await response.json();

        expect(Array.isArray(body)).toBeTruthy();

        if (body.length > 0) {
            expect(body[0]).toHaveProperty("_id");
            expect(body[0]).toHaveProperty("userRole");
        }
    });

    test("TC07 Get role details using valid role name @read @regression", async ({ userRoleClient }) => {
        const response = await userRoleClient.getUserRole(
            userRoleData.existing.userRole
        );

        expect(response.status()).toBe(HTTP_STATUS.OK);

        const body = await response.json();

        expect(body.userRole).toBe(userRoleData.existing.userRole);
    });

    test("TC08 Get role using non-existing role name @read @regression", async ({ userRoleClient }) => {
        const response = await userRoleClient.getUserRole(
            userRoleData.invalid.invalidRoleName
        );

        expect(response.status()).toBe(HTTP_STATUS.NOT_FOUND);
    });

    test("TC09 Get role using special characters @read @regression", async ({ userRoleClient }) => {
        const response = await userRoleClient.getUserRole(
            userRoleData.invalid.specialCharacters
        );

        expect(response.status()).toBe(HTTP_STATUS.NOT_FOUND);
    });

    test("TC10 Verify role response schema @read @regression", async ({ userRoleClient }) => {
        const response = await userRoleClient.getUserRole(
            userRoleData.existing.userRole
        );

        expect(response.status()).toBe(HTTP_STATUS.OK);

        const body = await response.json();

        expect(body).toHaveProperty("_id");
        expect(body).toHaveProperty("userRole");
        expect(body).toHaveProperty("description");
        expect(body).toHaveProperty("activeStatus");
    });

    test("TC12 Get role using valid roleId @read @regression", async ({ userRoleClient }) => {
        const response = await userRoleClient.getRoleById(
            userRoleData.existing.roleId
        );

        expect(response.status()).toBe(HTTP_STATUS.OK);

        const body = await response.json();

        expect(body._id).toBe(userRoleData.existing.roleId);
    });

    test("TC13 Get role using invalid ObjectId @read @regression", async ({ userRoleClient }) => {
        const response = await userRoleClient.getRoleById(
            userRoleData.invalid.invalidObjectId
        );

        expect(response.status()).toBe(HTTP_STATUS.BAD_REQUEST);
    });

    test("TC14 Get role using non-existing ObjectId @read @regression", async ({ userRoleClient }) => {
        const response = await userRoleClient.getRoleById(
            userRoleData.invalid.nonExistingObjectId
        );

        expect(response.status()).toBe(HTTP_STATUS.NOT_FOUND);
    });

    test("TC15 Verify role response schema @read @regression", async ({ userRoleClient }) => {
        const response = await userRoleClient.getRoleById(
            userRoleData.existing.roleId
        );

        expect(response.status()).toBe(HTTP_STATUS.OK);

        const body = await response.json();

        expect(body).toHaveProperty("_id");
        expect(body).toHaveProperty("userRole");
        expect(body).toHaveProperty("description");
        expect(body).toHaveProperty("activeStatus");
    });

});

    });

    test.describe("Create Operations", () => {

    test.describe.configure({ mode: "serial" });

    test("TC17 Create user role with valid data @create @regression", async ({ userRoleClient }) => {

        const payload = {
            userRole: `PLAYWRIGHT_MANAGER_${Date.now()}`,
            description: "Role created by Playwright automation",
            activeStatus: true
        };
        const response = await userRoleClient.createUserRole(payload);

        expect(response.status()).toBe(HTTP_STATUS.CREATED);

        const body = await response.json();

        createdRoleId = body._id;

        expect(body.userRole).toBe(payload.userRole);
    });

    test("TC18 Create duplicate user role @create @regression", async ({ userRoleClient }) => {
        const response = await userRoleClient.createUserRole({
            userRole: userRoleData.duplicate.sameCase,
            description: "Duplicate Role",
            activeStatus: true
        });

        expect(response.status()).toBe(HTTP_STATUS.CONFLICT);
    });

    test("TC19 Create duplicate user role with different case @create @regression", async ({ userRoleClient }) => {
        const response = await userRoleClient.createUserRole({
            userRole: userRoleData.duplicate.differentCase,
            description: "Duplicate Role",
            activeStatus: true
        });

        expect(response.status()).toBe(HTTP_STATUS.CONFLICT);
    });

    test("TC20 Create duplicate user role with extra spaces @create @regression", async ({ userRoleClient }) => {
        const response = await userRoleClient.createUserRole({
            userRole: userRoleData.duplicate.extraSpaces,
            description: "Duplicate Role",
            activeStatus: true
        });

        expect(response.status()).toBe(HTTP_STATUS.CONFLICT);
    });

    test("TC21 Create user role with inactive status @create @regression", async ({ userRoleClient }) => {
        const payload = {
            userRole: `PLAYWRIGHT_INACTIVE_${Date.now()}`,
            description: "Inactive Role",
            activeStatus: false
        };

        const response = await userRoleClient.createUserRole(payload);

        expect(response.status()).toBe(HTTP_STATUS.CREATED);

        const body = await response.json();

        expect(body.activeStatus).toBe(false);
    });

    });

    test.describe("Update Operations", () => {

    test.describe.configure({ mode: "serial" });

    test.beforeAll(async ({ userRoleClient }) => {

        const payload = {
            userRole: `PLAYWRIGHT_UPDATE_${Date.now()}`,
            description: "Role for update testing",
            activeStatus: true
        };

        const response = await userRoleClient.createUserRole(payload);

        expect(response.status()).toBe(HTTP_STATUS.CREATED);

        const body = await response.json();

        createdRoleId = body._id;
    });

    test("TC23 Update existing user role @update @regression", async ({ userRoleClient }) => {
        const payload = {
            userRole: `PLAYWRIGHT_UPDATED_${Date.now()}`,
            description: "Updated by Playwright",
            activeStatus: false
        };

        const response = await userRoleClient.updateUserRole(
            createdRoleId,
            payload
        );

        expect(response.status()).toBe(HTTP_STATUS.OK);

        const body = await response.json();

        expect(body.userRole).toBe(payload.userRole);
    });

    test("TC24 Update role to duplicate role name @update @regression", async ({ userRoleClient }) => {
        const response = await userRoleClient.updateUserRole(
            userRoleData.existing.roleId,
            {
                userRole: userRoleData.admin.userRole,
                description: "Duplicate Role",
                activeStatus: true
            }
        );

        expect(response.status()).toBe(HTTP_STATUS.CONFLICT);
    });

    test("TC25 Update using invalid roleId @update @regression", async ({ userRoleClient }) => {
        const payload = {
            userRole: `PLAYWRIGHT_INVALIDID_${Date.now()}`,
            description: "Role update with invalid id",
            activeStatus: true
        };

        const response = await userRoleClient.updateUserRole(
            userRoleData.invalid.invalidObjectId,
            payload
        );

        expect(response.status()).toBe(HTTP_STATUS.BAD_REQUEST);
    });

    test("TC26 Update using non-existing roleId @update @regression", async ({ userRoleClient }) => {
        // A valid 24-char hex ObjectId that is guaranteed not to exist in the collection.
        const nonExistingObjectId = crypto.randomBytes(12).toString("hex");

        const payload = {
            userRole: `PLAYWRIGHT_NOTFOUND_${Date.now()}`,
            description: "Role update should not be found",
            activeStatus: true
        };

        const response = await userRoleClient.updateUserRole(
            nonExistingObjectId,
            payload
        );

        expect(response.status()).toBe(HTTP_STATUS.NOT_FOUND);
    });

    test("TC27 Update activeStatus @update @regression", async ({ userRoleClient }) => {
        const response = await userRoleClient.updateUserRole(
            userRoleData.existing.roleId,
            {
                userRole: userRoleData.existing.userRole,
                description: userRoleData.existing.description,
                activeStatus: false
            }
        );

        expect(response.status()).toBe(HTTP_STATUS.OK);

        const body = await response.json();

        expect(body.activeStatus).toBe(false);
    });

    });

    test.describe("Role Lookup Operations", () => {
    test("TC29 Get roleId using valid role name @read @regression", async ({ userRoleClient }) => {
        const response = await userRoleClient.getRoleId(
            userRoleData.admin.userRole
        );

        expect(response.status()).toBe(HTTP_STATUS.OK);

        const body = await response.json();

        expect(body).toHaveProperty("_id");
    });

    test("TC30 Get roleId using non-existing role name @read @regression", async ({ userRoleClient }) => {
        const response = await userRoleClient.getRoleId(
            userRoleData.invalid.invalidRoleName
        );

        expect(response.status()).toBe(HTTP_STATUS.NOT_FOUND);
    });

    test("TC31 Verify roleId response @read @regression", async ({ userRoleClient }) => {
        const response = await userRoleClient.getRoleId(
            userRoleData.admin.userRole
        );

        expect(response.status()).toBe(HTTP_STATUS.OK);

        const body = await response.json();

        expect(body).toHaveProperty("_id");
        expect(body).toHaveProperty("userRole");
    });

    test("TC33 Get role name using valid roleId @read @regression", async ({ userRoleClient }) => {
        const response = await userRoleClient.getRoleName(
            userRoleData.admin.roleId
        );

        expect(response.status()).toBe(HTTP_STATUS.OK);

        const body = await response.json();

        expect(body.userRole).toBe(userRoleData.admin.userRole);
    });

    test("TC34 Get role name using invalid ObjectId @read @regression", async ({ userRoleClient }) => {
        const response = await userRoleClient.getRoleName(
            userRoleData.invalid.invalidObjectId
        );

        expect(response.status()).toBe(HTTP_STATUS.BAD_REQUEST);
    });

    test("TC35 Get role name using non-existing ObjectId @read @regression", async ({ userRoleClient }) => {
        const response = await userRoleClient.getRoleName(
            userRoleData.invalid.nonExistingObjectId
        );

        expect(response.status()).toBe(HTTP_STATUS.NOT_FOUND);
    });

    test("TC36 Verify role name response @read @regression", async ({ userRoleClient }) => {
        const response = await userRoleClient.getRoleName(
            userRoleData.admin.roleId
        );

        expect(response.status()).toBe(HTTP_STATUS.OK);

        const body = await response.json();

        expect(body).toHaveProperty("_id");
        expect(body).toHaveProperty("userRole");
        expect(body).toHaveProperty("description");
        expect(body).toHaveProperty("activeStatus");
    });

    });

    test.describe("Check Exists or Create Operations", () => {

    test("TC38 Create role when role does not exist @create @regression", async ({ userRoleClient }) => {
        const payload = {
            userRole: `CHECK_ROLE_${Date.now()}`,
            description: "Created by Playwright",
            activeStatus: true
        };

        const response = await userRoleClient.checkExistsOrCreateRole(payload);

        expect(response.status()).toBe(HTTP_STATUS.CREATED);

        const body = await response.json();

        expect(body.userRole).toBe(payload.userRole);
    });

    test("TC39 Verify existing role is returned when already present @read @regression", async ({ userRoleClient }) => {
        const response = await userRoleClient.checkExistsOrCreateRole({
            userRole: userRoleData.admin.userRole,
            activeStatus: true
        });

        expect(response.status()).toBe(HTTP_STATUS.OK);

        const body = await response.json();

        expect(body.userRole).toBe(userRoleData.admin.userRole);
    });

    test("TC40 Create new role with activeStatus=true @create @regression", async ({ userRoleClient }) => {
        const payload = {
            userRole: `ACTIVE_ROLE_${Date.now()}`,
            description: "Active Role",
            activeStatus: true
        };

        const response = await userRoleClient.checkExistsOrCreateRole(payload);

        expect(response.status()).toBe(HTTP_STATUS.CREATED);

        const body = await response.json();

        expect(body.activeStatus).toBe(true);
    });

    test("TC41 Create new role with activeStatus=false @create @regression", async ({ userRoleClient }) => {
        const payload = {
            userRole: `INACTIVE_ROLE_${Date.now()}`,
            description: "Inactive Role",
            activeStatus: false
        };

        const response = await userRoleClient.checkExistsOrCreateRole(payload);

        expect(response.status()).toBe(HTTP_STATUS.CREATED);

        const body = await response.json();

        expect(body.activeStatus).toBe(false);
    });

    test("TC42 Verify returned roleId @read @regression", async ({ userRoleClient }) => {
        const payload = {
            userRole: `ROLE_ID_TEST_${Date.now()}`,
            description: "RoleId Test",
            activeStatus: true
        };

        const response = await userRoleClient.checkExistsOrCreateRole(payload);

        expect(response.status()).toBe(HTTP_STATUS.CREATED);

        const body = await response.json();

        expect(body).toHaveProperty("_id");
        expect(body._id).toBeTruthy();
    });

});
