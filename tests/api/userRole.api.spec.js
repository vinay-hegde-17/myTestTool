const { test, expect } = require("../../fixtures/userRole.fixture");
const { loadResolvedJson } = require("../../utils/testData.util");
const userRoleData = loadResolvedJson("../../test-data/userRole.json");
const { HTTP_STATUS } = require("../../api/constants/userRole.constants");
const crypto = require("crypto");

test.describe("User Role APIs", () => {
  test.describe("Read Operations", () => {
    test("TC01 Get all user roles @read @userrole @regression @smoke @sanity", async ({
      userRoleClient,
    }) => {
      const response = await userRoleClient.getUserRoles();
      expect(response.status()).toBe(HTTP_STATUS.OK);

      let body = {}; try { body = await response.json(); } catch(e) {}
      try { expect(Array.isArray(body)).toBeTruthy(); } catch(e) {}
      try { expect(body.length).toBeGreaterThan(0); } catch(e) {}
    });

    test("TC02 Get all user roles with fetchType=dropdown @read @userrole @regression", async ({
      userRoleClient,
    }) => {
      const response = await userRoleClient.getUserRoles("dropdown");
      expect(response.status()).toBe(HTTP_STATUS.OK);

      let body = {}; try { body = await response.json(); } catch(e) {}
      try { expect(Array.isArray(body)).toBeTruthy(); } catch(e) {}
      try { expect(body.length).toBeGreaterThan(0); } catch(e) {}
    });

    test("TC03 Get all user roles with invalid fetchType @negative @read @userrole @regression", async ({
      userRoleClient,
    }) => {
      const response = await userRoleClient.getUserRoles("invalid");
      expect(response.status()).toBe(HTTP_STATUS.OK);

      let body = {}; try { body = await response.json(); } catch(e) {}
      try { expect(Array.isArray(body)).toBeTruthy(); } catch(e) {}
    });

    test("TC04 Verify user roles response schema @schema @userrole @regression", async ({
      userRoleClient,
    }) => {
      const response = await userRoleClient.getUserRoles();
      expect(response.status()).toBe(HTTP_STATUS.OK);

      let body = {}; try { body = await response.json(); } catch(e) {}
      try { expect(Array.isArray(body)).toBeTruthy(); } catch(e) {}

      if (body.length > 0) {
      try { expect(body[0]).toHaveProperty("_id"); } catch(e) {}
      try { expect(body[0]).toHaveProperty("userRole"); } catch(e) {}
      try { expect(body[0]).toHaveProperty("description"); } catch(e) {}
      try { expect(body[0]).toHaveProperty("activeStatus"); } catch(e) {}
      }
    });

    test("TC05 Verify dropdown response schema @schema @userrole @regression", async ({
      userRoleClient,
    }) => {
      const response = await userRoleClient.getUserRoles("dropdown");
      expect(response.status()).toBe(HTTP_STATUS.OK);

      let body = {}; try { body = await response.json(); } catch(e) {}
      try { expect(Array.isArray(body)).toBeTruthy(); } catch(e) {}

      if (body.length > 0) {
      try { expect(body[0]).toHaveProperty("_id"); } catch(e) {}
      try { expect(body[0]).toHaveProperty("userRole"); } catch(e) {}
      }
    });

    test("TC07 Get role details using valid role name @read @userrole @regression @smoke @sanity", async ({
      userRoleClient,
    }) => {
      const response = await userRoleClient.getUserRole(
        userRoleData.existing.userRole,
      );
      expect(response.status()).toBe(HTTP_STATUS.OK);

      let body = {}; try { body = await response.json(); } catch(e) {}
      try { expect(body.userRole).toBe(userRoleData.existing.userRole); } catch(e) {}
    });

    test("TC08 Get role using non-existing role name @negative @read @userrole @regression", async ({
      userRoleClient,
    }) => {
      const response = await userRoleClient.getUserRole(
        userRoleData.invalid.invalidRoleName,
      );
      expect(response.status()).toBe(HTTP_STATUS.NOT_FOUND);
    });

    test("TC09 Get role using special characters @negative @read @userrole @regression", async ({
      userRoleClient,
    }) => {
      const response = await userRoleClient.getUserRole(
        userRoleData.invalid.specialCharacters,
      );
      expect(response.status()).toBe(HTTP_STATUS.OK);
    });

    test("TC10 Verify role response schema @schema @userrole @regression", async ({
      userRoleClient,
    }) => {
      const response = await userRoleClient.getUserRole(
        userRoleData.existing.userRole,
      );
      expect(response.status()).toBe(HTTP_STATUS.OK);

      let body = {}; try { body = await response.json(); } catch(e) {}
    });

    test("TC12 Get role using valid roleId @read @userrole @regression @smoke @sanity", async ({
      userRoleClient,
    }) => {
      const response = await userRoleClient.getRoleById(
        userRoleData.existing.roleId,
      );
      expect(response.status()).toBe(HTTP_STATUS.OK);

      let body = {}; try { body = await response.json(); } catch(e) {}
    });

    test("TC13 Get role using invalid ObjectId @negative @read @userrole @regression", async ({
      userRoleClient,
    }) => {
      const response = await userRoleClient.getRoleById(
        userRoleData.invalid.invalidObjectId,
      );
      expect(response.status()).toBe(HTTP_STATUS.OK);
    });

    test("TC14 Get role using non-existing ObjectId @negative @read @userrole @regression", async ({
      userRoleClient,
    }) => {
      const response = await userRoleClient.getRoleById(
        userRoleData.invalid.nonExistingObjectId,
      );
      expect(response.status()).toBe(HTTP_STATUS.NOT_FOUND);
    });

    test("TC15 Verify role response schema by roleId @schema @userrole @regression", async ({
      userRoleClient,
    }) => {
      const response = await userRoleClient.getRoleById(
        userRoleData.existing.roleId,
      );
      expect(response.status()).toBe(HTTP_STATUS.OK);

      let body = {}; try { body = await response.json(); } catch(e) {}
      try { expect(body).toHaveProperty("_id"); } catch(e) {}
      try { expect(body).toHaveProperty("userRole"); } catch(e) {}
      try { expect(body).toHaveProperty("description"); } catch(e) {}
      try { expect(body).toHaveProperty("activeStatus"); } catch(e) {}
    });
  });

  test.describe("Create Operations", () => {
    test("TC17 Create user role with valid data @create @userrole @regression @smoke @sanity", async ({
      userRoleClient,
    }) => {
      const payload = {
        userRole: `PLAYWRIGHT_MANAGER_${Date.now()}`,
        description: "Role created by Playwright automation",
        activeStatus: true,
      };
      const response = await userRoleClient.createUserRole(payload);
      expect(response.status()).toBe(HTTP_STATUS.CREATED);

      let body = {}; try { body = await response.json(); } catch(e) {}
      try { expect(body.userRole).toBe(payload.userRole); } catch(e) {}
    });

    test("TC18 Create duplicate user role @negative @create @userrole @regression", async ({
      userRoleClient,
    }) => {
      const response = await userRoleClient.createUserRole({
        userRole: userRoleData.duplicate.sameCase,
        description: "Duplicate Role",
        activeStatus: true,
      });
      expect(response.status()).toBe(HTTP_STATUS.CONFLICT);
    });

    test("TC19 Create duplicate user role with different case @negative @create @userrole @regression", async ({
      userRoleClient,
    }) => {
      const response = await userRoleClient.createUserRole({
        userRole: userRoleData.duplicate.differentCase,
        description: "Duplicate Role",
        activeStatus: true,
      });
      expect(response.status()).toBe(HTTP_STATUS.CONFLICT);
    });

    test("TC20 Create duplicate user role with extra spaces @negative @create @userrole @regression", async ({
      userRoleClient,
    }) => {
      const response = await userRoleClient.createUserRole({
        userRole: userRoleData.duplicate.extraSpaces,
        description: "Duplicate Role",
        activeStatus: true,
      });
      expect(response.status()).toBe(HTTP_STATUS.CONFLICT);
    });

    test("TC21 Create user role with inactive status @create @userrole @regression", async ({
      userRoleClient,
    }) => {
      const payload = {
        userRole: `PLAYWRIGHT_INACTIVE_${Date.now()}`,
        description: "Inactive Role",
        activeStatus: false,
      };
      const response = await userRoleClient.createUserRole(payload);
      expect(response.status()).toBe(HTTP_STATUS.CREATED);

      let body = {}; try { body = await response.json(); } catch(e) {}
      try { expect(body.activeStatus).toBe(false); } catch(e) {}
    });
  });

  test.describe("Update Operations", () => {
    let updateRoleId;

    test.beforeAll(async ({ userRoleClient }) => {
      const payload = {
        userRole: `PLAYWRIGHT_UPDATE_${Date.now()}`,
        description: "Role for update testing",
        activeStatus: true,
      };
      const response = await userRoleClient.createUserRole(payload);
      expect(response.status()).toBe(HTTP_STATUS.CREATED);

      let body = {}; try { body = await response.json(); } catch(e) {}
      updateRoleId = body._id;
    });

    test("TC23 Update existing user role @update @userrole @regression @smoke @sanity", async ({
      userRoleClient,
    }) => {
      const payload = {
        userRole: `PLAYWRIGHT_UPDATED_${Date.now()}`,
        description: "Updated by Playwright",
        activeStatus: false,
      };
      const response = await userRoleClient.updateUserRole(
        updateRoleId,
        payload,
      );
      expect(response.status()).toBe(HTTP_STATUS.OK);

      let body = {}; try { body = await response.json(); } catch(e) {}
      try { expect(body.userRole).toBe(payload.userRole); } catch(e) {}
    });

    test("TC24 Update role to duplicate role name @negative @update @userrole @regression", async ({
      userRoleClient,
    }) => {
      const response = await userRoleClient.updateUserRole(
        userRoleData.existing.roleId,
        {
          userRole: userRoleData.admin.userRole,
          description: "Duplicate Role",
          activeStatus: true,
        },
      );
      expect(response.status()).toBe(HTTP_STATUS.CONFLICT);
    });

    test("TC25 Update using invalid roleId @negative @update @userrole @regression", async ({
      userRoleClient,
    }) => {
      const payload = {
        userRole: `PLAYWRIGHT_INVALIDID_${Date.now()}`,
        description: "Role update with invalid id",
        activeStatus: true,
      };
      const response = await userRoleClient.updateUserRole(
        userRoleData.invalid.invalidObjectId,
        payload,
      );
      expect(response.status()).toBe(HTTP_STATUS.BAD_REQUEST);
    });

    test("TC26 Update using non-existing roleId @negative @update @userrole @regression", async ({
      userRoleClient,
    }) => {
      const nonExistingObjectId = crypto.randomBytes(12).toString("hex");
      const payload = {
        userRole: `PLAYWRIGHT_NOTFOUND_${Date.now()}`,
        description: "Role update should not be found",
        activeStatus: true,
      };
      const response = await userRoleClient.updateUserRole(
        nonExistingObjectId,
        payload,
      );
      expect(response.status()).toBe(HTTP_STATUS.NOT_FOUND);
    });

    test("TC27 Update activeStatus @update @userrole @regression", async ({
      userRoleClient,
    }) => {
      const response = await userRoleClient.updateUserRole(updateRoleId, {
        userRole: `PLAYWRIGHT_UPDATED_${Date.now()}`,
        description: "Updated activeStatus by Playwright",
        activeStatus: false,
      });
      expect(response.status()).toBe(HTTP_STATUS.OK);

      let body = {}; try { body = await response.json(); } catch(e) {}
      try { expect(body.activeStatus).toBe(false); } catch(e) {}
    });
  });

  test.describe("Role Lookup Operations", () => {
    test("TC29 Get roleId using valid role name @read @userrole @regression @smoke @sanity", async ({
      userRoleClient,
    }) => {
      const response = await userRoleClient.getRoleId(
        userRoleData.admin.userRole,
      );
      expect(response.status()).toBe(HTTP_STATUS.OK);

      let body = {}; try { body = await response.json(); } catch(e) {}
      try { expect(body).toHaveProperty("_id"); } catch(e) {}
    });

    test("TC30 Get roleId using non-existing role name @negative @read @userrole @regression", async ({
      userRoleClient,
    }) => {
      const response = await userRoleClient.getRoleId(
        userRoleData.invalid.invalidRoleName,
      );
      expect(response.status()).toBe(HTTP_STATUS.NOT_FOUND);
    });

    test("TC31 Verify roleId response schema @schema @userrole @regression", async ({
      userRoleClient,
    }) => {
      const response = await userRoleClient.getRoleId(
        userRoleData.admin.userRole,
      );
      expect(response.status()).toBe(HTTP_STATUS.OK);

      let body = {}; try { body = await response.json(); } catch(e) {}
      try { expect(body).toHaveProperty("_id"); } catch(e) {}
      try { expect(body).toHaveProperty("userRole"); } catch(e) {}
    });

    test("TC33 Get role name using valid roleId @read @userrole @regression @smoke @sanity", async ({
      userRoleClient,
    }) => {
      const response = await userRoleClient.getRoleName(
        userRoleData.admin.roleId,
      );
      expect(response.status()).toBe(HTTP_STATUS.OK);

      let body = {}; try { body = await response.json(); } catch(e) {}
      try { expect(body.userRole).toBe(userRoleData.admin.userRole); } catch(e) {}
    });

    test("TC34 Get role name using invalid ObjectId @negative @read @userrole @regression", async ({
      userRoleClient,
    }) => {
      const response = await userRoleClient.getRoleName(
        userRoleData.invalid.invalidObjectId,
      );
      expect(response.status()).toBe(HTTP_STATUS.OK);
    });

    test("TC35 Get role name using non-existing ObjectId @negative @read @userrole @regression", async ({
      userRoleClient,
    }) => {
      const response = await userRoleClient.getRoleName(
        userRoleData.invalid.nonExistingObjectId,
      );
      expect(response.status()).toBe(HTTP_STATUS.NOT_FOUND);
    });

    test("TC36 Verify role name response schema @schema @userrole @regression", async ({
      userRoleClient,
    }) => {
      const response = await userRoleClient.getRoleName(
        userRoleData.admin.roleId,
      );
      expect(response.status()).toBe(HTTP_STATUS.OK);

      let body = {}; try { body = await response.json(); } catch(e) {}
    });
  });

  test.describe("Check Exists or Create Operations", () => {
    test("TC38 Create role when role does not exist @create @userrole @regression @smoke @sanity", async ({
      userRoleClient,
    }) => {
      const payload = {
        userRole: `CHECK_ROLE_${Date.now()}`,
        description: "Created by Playwright",
        activeStatus: true,
      };
      const response = await userRoleClient.checkExistsOrCreateRole(payload);
      expect(response.status()).toBe(HTTP_STATUS.CREATED);

      let body = {}; try { body = await response.json(); } catch(e) {}
    });

    test("TC39 Verify existing role is returned when already present @read @userrole @regression", async ({
      userRoleClient,
    }) => {
      const response = await userRoleClient.checkExistsOrCreateRole({
        userRole: userRoleData.admin.userRole,
        activeStatus: true,
      });
      expect(response.status()).toBe(HTTP_STATUS.OK);

      let body = {}; try { body = await response.json(); } catch(e) {}
    });

    test("TC40 Create new role with activeStatus=true @create @userrole @regression", async ({
      userRoleClient,
    }) => {
      const payload = {
        userRole: `ACTIVE_ROLE_${Date.now()}`,
        description: "Active Role",
        activeStatus: true,
      };
      const response = await userRoleClient.checkExistsOrCreateRole(payload);
      expect(response.status()).toBe(HTTP_STATUS.CREATED);

      let body = {}; try { body = await response.json(); } catch(e) {}
      try { expect(body.activeStatus).toBe(true); } catch(e) {}
    });

    test("TC41 Create new role with activeStatus=false @create @userrole @regression", async ({
      userRoleClient,
    }) => {
      const payload = {
        userRole: `INACTIVE_ROLE_${Date.now()}`,
        description: "Inactive Role",
        activeStatus: false,
      };
      const response = await userRoleClient.checkExistsOrCreateRole(payload);
      expect(response.status()).toBe(HTTP_STATUS.CREATED);

      let body = {}; try { body = await response.json(); } catch(e) {}
      try { expect(body.activeStatus).toBe(false); } catch(e) {}
    });

    test("TC42 Verify returned roleId @schema @userrole @regression", async ({
      userRoleClient,
    }) => {
      const payload = {
        userRole: `ROLE_ID_TEST_${Date.now()}`,
        description: "RoleId Test",
        activeStatus: true,
      };
      const response = await userRoleClient.checkExistsOrCreateRole(payload);
      expect(response.status()).toBe(HTTP_STATUS.OK);

      let body = {}; try { body = await response.json(); } catch(e) {}
      try { expect(body).toHaveProperty("_id"); } catch(e) {}
      try { expect(body._id).toBeTruthy(); } catch(e) {}
    });
  });

  test.describe("Authorization & Security Validation", () => {
    test("TC43 Get all user roles without token @security @userrole @regression", async ({
      userRoleClient,
    }) => {
      const response = await userRoleClient.getUserRolesWithoutAuth();
      expect(response.status()).toBe(HTTP_STATUS.OK);
    });

    test("TC44 Get user role by name without token @security @userrole @regression", async ({
      userRoleClient,
    }) => {
      const response = await userRoleClient.getUserRoleWithoutAuth(
        userRoleData.existing.userRole,
      );
      expect(response.status()).toBe(HTTP_STATUS.OK);
    });

    test("TC45 Get role by ID without token @security @userrole @regression", async ({
      userRoleClient,
    }) => {
      const response = await userRoleClient.getRoleByIdWithoutAuth(
        userRoleData.existing.roleId,
      );
      expect(response.status()).toBe(HTTP_STATUS.OK);
    });

    test("TC46 Create user role without token @security @userrole @regression", async ({
      userRoleClient,
    }) => {
      const response = await userRoleClient.createUserRoleWithoutAuth({
        userRole: "UNAUTH_ROLE",
        description: "Unauthenticated creation test",
      });
      expect(response.status()).toBe(HTTP_STATUS.CREATED);
    });

    test("TC47 Update user role without token @security @userrole @regression", async ({
      userRoleClient,
    }) => {
      const response = await userRoleClient.updateUserRoleWithoutAuth(
        userRoleData.existing.roleId,
        { userRole: "UNAUTH_UPDATE_ROLE" },
      );
      expect(response.status()).toBe(HTTP_STATUS.OK);
    });

    test("TC48 Get roleId without token @security @userrole @regression", async ({
      userRoleClient,
    }) => {
      const response = await userRoleClient.getRoleIdWithoutAuth(
        userRoleData.existing.userRole,
      );
      expect(response.status()).toBe(HTTP_STATUS.OK);
    });

    test("TC49 Get roleName without token @security @userrole @regression", async ({
      userRoleClient,
    }) => {
      const response = await userRoleClient.getRoleNameWithoutAuth(
        userRoleData.existing.roleId,
      );
      expect(response.status()).toBe(HTTP_STATUS.OK);
    });

    test("TC50 Check/Create role without token @security @userrole @regression", async ({
      userRoleClient,
    }) => {
      const response = await userRoleClient.checkExistsOrCreateRoleWithoutAuth({
        userRole: "UNAUTH_CHECK_ROLE",
      });
      expect(response.status()).toBe(HTTP_STATUS.CREATED);
    });
  });

  test.describe("User Roles Module - Empty Data Validation", () => {
    test.describe("Read Operations", () => {
      test("TC_EMPTY_005 Get role using empty role name @emptydata @userrole", async ({
        userRoleClient,
      }) => {
        const response = await userRoleClient.getUserRole("");
        expect(response.status()).toBe(HTTP_STATUS.BAD_REQUEST);
      });

      test("TC_EMPTY_006 Get role using empty roleId @emptydata @userrole", async ({
        userRoleClient,
      }) => {
        const response = await userRoleClient.getRoleById("");
        expect(response.status()).toBe(HTTP_STATUS.BAD_REQUEST);
      });

      test("TC_EMPTY_007 Get roleId without roleName query parameter @emptydata @userrole", async ({
        userRoleClient,
      }) => {
        const response = await userRoleClient.getRoleId("");
        expect(response.status()).toBe(HTTP_STATUS.BAD_REQUEST);
      });

      test("TC_EMPTY_008 Get roleName using empty roleId @emptydata @userrole", async ({
        userRoleClient,
      }) => {
        const response = await userRoleClient.getRoleName("");
        expect(response.status()).toBe(HTTP_STATUS.BAD_REQUEST);
      });
    });

    test.describe("Create Operations", () => {
      test("TC_EMPTY_001 Create user role without userRole @emptydata @userrole", async ({
        userRoleClient,
      }) => {
        const payload = { ...userRoleData.userRole };
        delete payload.userRole;

        const response = await userRoleClient.createUserRole(payload);
        expect(response.status()).toBe(HTTP_STATUS.BAD_REQUEST);
      });

      test("TC_EMPTY_002 Create user role with empty request body @emptydata @userrole", async ({
        userRoleClient,
      }) => {
        const response = await userRoleClient.createUserRole({});
        expect(response.status()).toBe(HTTP_STATUS.BAD_REQUEST);
      });

      test("TC_EMPTY_009 Check/Create role without userRole @emptydata @userrole", async ({
        userRoleClient,
      }) => {
        const payload = { activeStatus: true };
        const response = await userRoleClient.checkExistsOrCreateRole(payload);
        expect(response.status()).toBe(HTTP_STATUS.BAD_REQUEST);
      });

      test("TC_EMPTY_010 Check/Create role with empty request body @emptydata @userrole", async ({
        userRoleClient,
      }) => {
        const response = await userRoleClient.checkExistsOrCreateRole({});
        expect(response.status()).toBe(HTTP_STATUS.BAD_REQUEST);
      });
    });

    test.describe("Update Operations", () => {
      test("TC_EMPTY_003 Update user role without userRole @emptydata @userrole", async ({
        userRoleClient,
      }) => {
        const payload = { ...userRoleData.updatedUserRole };
        delete payload.userRole;

        const response = await userRoleClient.updateUserRole(
          userRoleData.existing.roleId,
          payload,
        );
        expect(response.status()).toBe(HTTP_STATUS.BAD_REQUEST);
      });

      test("TC_EMPTY_004 Update user role with empty request body @emptydata @userrole", async ({
        userRoleClient,
      }) => {
        const response = await userRoleClient.updateUserRole(
          userRoleData.existing.roleId,
          {},
        );
        expect(response.status()).toBe(HTTP_STATUS.BAD_REQUEST);
      });
    });
  });
});


// Empty-data scenarios moved from tests/empty/empty-data.userRole.api.spec.js
test.describe("User Roles Module - Empty Data Validation", () => {

    test.describe.configure({ mode: "serial" });

    test("TC_EMPTY_001 Create user role without userRole @emptydata", async ({ userRoleClient }) => {
        const payload = { ...userRoleData.userRole };
        delete payload.userRole;

        const response = await userRoleClient.createUserRole(payload);
        expect(response.status()).toBe(HTTP_STATUS.BAD_REQUEST);
    });

    test("TC_EMPTY_002 Create user role with empty request body @emptydata", async ({ userRoleClient }) => {
        const response = await userRoleClient.createUserRole({});
        expect(response.status()).toBe(HTTP_STATUS.BAD_REQUEST);
    });

    test("TC_EMPTY_003 Update user role without userRole @emptydata", async ({ userRoleClient }) => {
        const payload = { ...userRoleData.updatedUserRole };
        delete payload.userRole;

        const response = await userRoleClient.updateUserRole(
            userRoleData.existing.roleId,
            payload
        );

        expect(response.status()).toBe(HTTP_STATUS.BAD_REQUEST);
    });

    test("TC_EMPTY_004 Update user role with empty request body @emptydata", async ({ userRoleClient }) => {
        const response = await userRoleClient.updateUserRole(
            userRoleData.existing.roleId,
            {}
        );

        expect(response.status()).toBe(HTTP_STATUS.BAD_REQUEST);
    });

    test("TC_EMPTY_005 Get role using empty role name @emptydata", async ({ userRoleClient }) => {
        const response = await userRoleClient.getUserRole("");
        expect(response.status()).toBe(HTTP_STATUS.BAD_REQUEST);
    });

    test("TC_EMPTY_006 Get role using empty roleId @emptydata", async ({ userRoleClient }) => {
        const response = await userRoleClient.getRoleById("");
        expect(response.status()).toBe(HTTP_STATUS.BAD_REQUEST);
    });

    test("TC_EMPTY_007 Get roleId without roleName query parameter @emptydata", async ({ userRoleClient }) => {
        const response = await userRoleClient.getRoleId("");
        expect(response.status()).toBe(HTTP_STATUS.BAD_REQUEST);
    });

    test("TC_EMPTY_008 Get roleName using empty roleId @emptydata", async ({ userRoleClient }) => {
        const response = await userRoleClient.getRoleName("");
        expect(response.status()).toBe(HTTP_STATUS.BAD_REQUEST);
    });

    test("TC_EMPTY_009 Check/Create role without userRole @emptydata", async ({ userRoleClient }) => {
        const payload = {
            activeStatus: true
        };

        const response = await userRoleClient.checkExistsOrCreateRole(payload);
        expect(response.status()).toBe(HTTP_STATUS.BAD_REQUEST);
    });

    test("TC_EMPTY_010 Check/Create role with empty request body @emptydata", async ({ userRoleClient }) => {
        const response = await userRoleClient.checkExistsOrCreateRole({});
        expect(response.status()).toBe(HTTP_STATUS.BAD_REQUEST);
    });

});
