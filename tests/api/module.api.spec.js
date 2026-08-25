const { test, expect } = require("../../fixtures/module.fixture");
const { HTTP_STATUS } = require("../../api/constants/module.constants");
const { loadResolvedJson } = require("../../utils/testData.util");
const moduleData = loadResolvedJson("../../test-data/module.json");

function uniqueModulePayload(overrides = {}) {
  return {
    ...moduleData.valid.createModule,
    name: `Playwright Module ${Date.now()}_${Math.random().toString(16).slice(2)}`,
    ...overrides,
  };
}

test.describe("Module APIs", () => {
  test.describe("Module Read Operations", () => {
    test("TC01 Get all modules @read @module @regression @smoke @sanity", async ({
      moduleClient,
    }) => {
      const response = await moduleClient.getAllModules();
      expect(response.status()).toBe(HTTP_STATUS.OK);

      const body = await response.json();
      expect(Array.isArray(body)).toBeTruthy();
    });

    test("TC04 Verify menuItem details are populated @schema @read @module @regression", async ({
      moduleClient,
    }) => {
      const response = await moduleClient.getAllModules();
      expect(response.status()).toBe(HTTP_STATUS.OK);

      const body = await response.json();
      const withMenuItem = body.filter((m) => m.menuItem);
      for (const module of withMenuItem) {
        expect(typeof module.menuItem).toBe("string");
        expect(module.menuItem.length).toBeGreaterThan(0);
      }
    });

    test("TC05 Verify response schema @schema @module @regression", async ({
      moduleClient,
    }) => {
      const response = await moduleClient.getAllModules();
      expect(response.status()).toBe(HTTP_STATUS.OK);

      const body = await response.json();
      for (const module of body) {
        expect(module).toHaveProperty("_id");
        expect(module).toHaveProperty("name");
        expect(module).toHaveProperty("description");
        expect(module).toHaveProperty("activeStatus");
      }
    });

    test("TC07 Get active modules for permission @read @module @regression", async ({
      moduleClient,
    }) => {
      const response = await moduleClient.getModulesForPermission();
      expect(response.status()).toBe(HTTP_STATUS.OK);

      const body = await response.json();
      expect(Array.isArray(body)).toBeTruthy();
    });

    test("TC08 Verify only active modules are returned @read @module @regression", async ({
      moduleClient,
    }) => {
      const allResponse = await moduleClient.getAllModules();
      expect(allResponse.status()).toBe(HTTP_STATUS.OK);

      const allModules = await allResponse.json();
      const activeIds = new Set(
        allModules.filter((m) => m.activeStatus === true).map((m) => m._id),
      );

      const response = await moduleClient.getModulesForPermission();
      expect(response.status()).toBe(HTTP_STATUS.OK);

      const body = await response.json();
      for (const module of body) {
        expect(activeIds.has(module._id)).toBeTruthy();
      }
    });

    test("TC10 Verify selected fields are returned @schema @read @module @regression", async ({
      moduleClient,
    }) => {
      const response = await moduleClient.getModulesForPermission();
      expect(response.status()).toBe(HTTP_STATUS.OK);

      const body = await response.json();
      for (const module of body) {
        expect(module).toHaveProperty("_id");
        expect(module).toHaveProperty("name");
      }
    });

    test("TC11 Verify response schema @schema @module @regression", async ({
      moduleClient,
    }) => {
      const response = await moduleClient.getModulesForPermission();
      expect(response.status()).toBe(HTTP_STATUS.OK);

      const body = await response.json();
      expect(Array.isArray(body)).toBeTruthy();
    });
  });

  test.describe("Module Create Operations", () => {
    test("TC13 Create new module @create @module @regression @smoke @sanity", async ({
      moduleClient,
    }) => {
      const payload = uniqueModulePayload();
      const response = await moduleClient.createModule(payload);
      expect(response.status()).toBe(HTTP_STATUS.CREATED);

      const body = await response.json();
      expect(body).toHaveProperty("_id");
      expect(body.name).toBe(payload.name);
      expect(body.description).toBe(payload.description);
    });

    test("TC15 Reject duplicate module name @negative @create @module @regression", async ({
      moduleClient,
    }) => {
      const baseline = uniqueModulePayload({
        name: `Dup Module ${Date.now()}`,
      });

      const firstCreate = await moduleClient.createModule(baseline);
      expect(firstCreate.status()).toBe(HTTP_STATUS.CREATED);

      const duplicateResponse = await moduleClient.createModule(baseline);
      expect(duplicateResponse.status()).toBe(HTTP_STATUS.CONFLICT);
    });

    test("TC16 Reject duplicate module name with different case @negative @create @module @regression", async ({
      moduleClient,
    }) => {
      const baseName = `Case Dup ${Date.now()}`;

      const firstCreate = await moduleClient.createModule(
        uniqueModulePayload({ name: baseName }),
      );
      expect(firstCreate.status()).toBe(HTTP_STATUS.CREATED);

      const duplicateResponse = await moduleClient.createModule(
        uniqueModulePayload({ name: baseName.toUpperCase() }),
      );
      expect(duplicateResponse.status()).toBe(HTTP_STATUS.CONFLICT);
    });

    test("TC17 Reject duplicate module name with extra spaces @negative @create @module @regression", async ({
      moduleClient,
    }) => {
      const baseName = `Space Dup ${Date.now()}`;

      const firstCreate = await moduleClient.createModule(
        uniqueModulePayload({ name: baseName }),
      );
      expect(firstCreate.status()).toBe(HTTP_STATUS.CREATED);

      const duplicateResponse = await moduleClient.createModule(
        uniqueModulePayload({ name: `   ${baseName}   ` }),
      );
      expect(duplicateResponse.status()).toBe(HTTP_STATUS.CONFLICT);
    });

    test("TC18 Create module using invalid menuItem @negative @create @module @regression", async ({
      moduleClient,
    }) => {
      const payload = uniqueModulePayload({
        menuItem: moduleData.invalid.invalidMenuItemId,
      });
      const response = await moduleClient.createModule(payload);

      expect(response.status()).toBe(HTTP_STATUS.CREATED);

      const body = await response.json();
      expect(body.menuItem).toBe(moduleData.invalid.invalidMenuItemId);
    });
  });

  test.describe("Module Update Operations", () => {
    async function seedModule(moduleClient, overrides = {}) {
      const createResponse = await moduleClient.createModule(
        uniqueModulePayload(overrides),
      );
      expect(createResponse.status()).toBe(HTTP_STATUS.CREATED);

      const created = await createResponse.json();
      return created._id;
    }

    test("TC20 Update existing module @update @module @regression @smoke @sanity", async ({
      moduleClient,
    }) => {
      const moduleId = await seedModule(moduleClient);
      const payload = {
        ...moduleData.valid.updateModule,
        name: `Updated Module ${Date.now()}`,
      };

      const response = await moduleClient.updateModule(moduleId, payload);
      expect(response.status()).toBe(HTTP_STATUS.OK);

      const body = await response.json();
      expect(body.name).toBe(payload.name);
    });

    test("TC21 Update module description @update @module @regression", async ({
      moduleClient,
    }) => {
      const moduleId = await seedModule(moduleClient);
      const description = `Updated description ${Date.now()}`;

      const response = await moduleClient.updateModule(moduleId, {
        description,
      });
      expect(response.status()).toBe(HTTP_STATUS.OK);

      const body = await response.json();
      expect(body.description).toBe(description);
    });

    test("TC22 Update module activeStatus @update @module @regression", async ({
      moduleClient,
    }) => {
      const moduleId = await seedModule(moduleClient, { activeStatus: true });

      const response = await moduleClient.updateModule(moduleId, {
        activeStatus: false,
      });
      expect(response.status()).toBe(HTTP_STATUS.OK);

      const body = await response.json();
      expect(body.activeStatus).toBe(false);
    });

    test("TC23 Update module menuItem @update @module @regression", async ({
      moduleClient,
    }) => {
      const moduleId = await seedModule(moduleClient);

      const response = await moduleClient.updateModule(moduleId, {
        menuItem: moduleData.valid.secondMenuItemId,
      });
      expect(response.status()).toBe(HTTP_STATUS.OK);

      const body = await response.json();
      expect(body.menuItem).toBe(moduleData.valid.secondMenuItemId);
    });

    test("TC24 Update using invalid moduleId @negative @update @module @regression", async ({
      moduleClient,
    }) => {
      const response = await moduleClient.updateModule(
        moduleData.invalid.invalidModuleId,
        { description: "Invalid ID update" },
      );

      expect([
        HTTP_STATUS.BAD_REQUEST,
        HTTP_STATUS.INTERNAL_SERVER_ERROR,
      ]).toContain(response.status());
    });

    test("TC25 Update non-existing module @negative @update @module @regression", async ({
      moduleClient,
    }) => {
      const response = await moduleClient.updateModule(
        moduleData.invalid.nonExistingModuleId,
        { description: "Non existing update" },
      );

      expect(response.status()).toBe(HTTP_STATUS.NOT_FOUND);
    });
  });

  test.describe("Menu and Lookup Operations", () => {
    async function seedModule(moduleClient, overrides = {}) {
      const createResponse = await moduleClient.createModule(
        uniqueModulePayload(overrides),
      );
      expect(createResponse.status()).toBe(HTTP_STATUS.CREATED);

      const created = await createResponse.json();
      return created._id;
    }

    test("TC27 Get menu modules @read @module @regression @smoke @sanity", async ({
      moduleClient,
    }) => {
      const response = await moduleClient.getMenuModules();
      expect(response.status()).toBe(HTTP_STATUS.OK);

      const body = await response.json();
      expect(Array.isArray(body)).toBeTruthy();
    });

    test("TC30 Verify menu response schema @schema @read @module @regression", async ({
      moduleClient,
    }) => {
      const response = await moduleClient.getMenuModules();
      expect(response.status()).toBe(HTTP_STATUS.OK);

      const body = await response.json();
      for (const module of body) {
        expect(module).toHaveProperty("_id");
        expect(module).toHaveProperty("name");
      }
    });

    test("TC32 Get modules using valid moduleIds @read @module @regression @smoke @sanity", async ({
      moduleClient,
    }) => {
      const moduleId = await seedModule(moduleClient);

      const response = await moduleClient.getModulesByIds([moduleId]);
      expect(response.status()).toBe(HTTP_STATUS.OK);

      const body = await response.json();
      expect(Array.isArray(body)).toBeTruthy();
      expect(body.some((m) => m._id === moduleId)).toBeTruthy();
    });

    test("TC33 Get modules using multiple moduleIds @read @module @regression", async ({
      moduleClient,
    }) => {
      const firstId = await seedModule(moduleClient);
      const secondId = await seedModule(moduleClient);

      const response = await moduleClient.getModulesByIds([firstId, secondId]);
      expect(response.status()).toBe(HTTP_STATUS.OK);

      const body = await response.json();
      const returnedIds = body.map((m) => m._id);
      expect(returnedIds).toEqual(expect.arrayContaining([firstId, secondId]));
    });

    test("TC34 Get modules when some IDs do not exist @read @module @regression", async ({
      moduleClient,
    }) => {
      const existingId = await seedModule(moduleClient);

      const response = await moduleClient.getModulesByIds([
        existingId,
        moduleData.invalid.nonExistingModuleId,
      ]);

      expect(response.status()).toBe(HTTP_STATUS.OK);

      const body = await response.json();
      expect(body.some((m) => m._id === existingId)).toBeTruthy();
      expect(body.length).toBe(1);
    });

    test("TC35 Get modules when all IDs do not exist @negative @read @module @regression", async ({
      moduleClient,
    }) => {
      const response = await moduleClient.getModulesByIds([
        moduleData.invalid.nonExistingModuleId,
      ]);

      expect(response.status()).toBe(HTTP_STATUS.NOT_FOUND);

      const body = await response.json();
      expect(body).toHaveProperty("message", "No modules found");
    });

    test("TC36 Verify populated menuItem @schema @read @module @regression", async ({
      moduleClient,
    }) => {
      const moduleId = await seedModule(moduleClient);

      const response = await moduleClient.getModulesByIds([moduleId]);
      expect(response.status()).toBe(HTTP_STATUS.OK);

      const body = await response.json();
      const module = body.find((m) => m._id === moduleId);
      expect(typeof module.menuItem).toBe("string");
    });

    test("TC37 Verify getModulesByIds response schema @schema @module @regression", async ({
      moduleClient,
    }) => {
      const moduleId = await seedModule(moduleClient);

      const response = await moduleClient.getModulesByIds([moduleId]);
      expect(response.status()).toBe(HTTP_STATUS.OK);

      const body = await response.json();
      for (const module of body) {
        expect(module).toHaveProperty("_id");
        expect(module).toHaveProperty("name");
      }
    });
  });

  test.describe("Authorization & Security Validation", () => {
    test("TC38 Get all modules without token @security @module @regression", async ({
      moduleClient,
    }) => {
      const response = await moduleClient.getAllModulesWithoutAuth();
      expect([HTTP_STATUS.UNAUTHORIZED, HTTP_STATUS.FORBIDDEN]).toContain(
        response.status(),
      );
    });

    test("TC39 Get modules for permission without token @security @module @regression", async ({
      moduleClient,
    }) => {
      const response = await moduleClient.getModulesForPermissionWithoutAuth();
      expect([HTTP_STATUS.UNAUTHORIZED, HTTP_STATUS.FORBIDDEN]).toContain(
        response.status(),
      );
    });

    test("TC40 Create module without token @security @module @regression", async ({
      moduleClient,
    }) => {
      const response = await moduleClient.createModuleWithoutAuth(
        uniqueModulePayload(),
      );
      expect([HTTP_STATUS.UNAUTHORIZED, HTTP_STATUS.FORBIDDEN]).toContain(
        response.status(),
      );
    });

    test("TC41 Update module without token @security @module @regression", async ({
      moduleClient,
    }) => {
      const response = await moduleClient.updateModuleWithoutAuth(
        "INVALID_ID",
        { description: "NO_AUTH" },
      );
      expect([HTTP_STATUS.UNAUTHORIZED, HTTP_STATUS.FORBIDDEN]).toContain(
        response.status(),
      );
    });

    test("TC42 Get menu modules without token @security @module @regression", async ({
      moduleClient,
    }) => {
      const response = await moduleClient.getMenuModulesWithoutAuth();
      expect([HTTP_STATUS.UNAUTHORIZED, HTTP_STATUS.FORBIDDEN]).toContain(
        response.status(),
      );
    });

    test("TC43 Get modules by IDs without token @security @module @regression", async ({
      moduleClient,
    }) => {
      const response = await moduleClient.getModulesByIdsWithoutAuth([]);
      expect([HTTP_STATUS.UNAUTHORIZED, HTTP_STATUS.FORBIDDEN]).toContain(
        response.status(),
      );
    });
  });

  test.describe("Modules Module - Empty Data Validation", () => {
    test.describe("Read Operations", () => {
      test("TC_EMPTY_007 Get modules by IDs without moduleIds @emptydata @module @regression @read", async ({
        moduleClient,
      }) => {
        const response = await moduleClient.postModulesByIdsRaw({});
        expect([
          HTTP_STATUS.BAD_REQUEST,
          HTTP_STATUS.INTERNAL_SERVER_ERROR,
        ]).toContain(response.status());
      });

      test("TC_EMPTY_008 Get modules by IDs with empty array @emptydata @module @sanity @read", async ({
        moduleClient,
      }) => {
        const response = await moduleClient.getModulesByIds([]);
        expect([
          HTTP_STATUS.OK,
          HTTP_STATUS.NO_CONTENT,
          HTTP_STATUS.BAD_REQUEST,
        ]).toContain(response.status());
      });

      test("TC_EMPTY_009 Get modules by IDs with null moduleIds @emptydata @module @regression @read", async ({
        moduleClient,
      }) => {
        const response = await moduleClient.postModulesByIdsRaw({
          moduleIds: null,
        });
        expect([
          HTTP_STATUS.BAD_REQUEST,
          HTTP_STATUS.INTERNAL_SERVER_ERROR,
        ]).toContain(response.status());
      });
    });

    test.describe("Create Operations", () => {
      test("TC_EMPTY_001 Create module without name @emptydata @module @smoke @create", async ({
        moduleClient,
      }) => {
        const { name, ...payload } = uniqueModulePayload();
        const response = await moduleClient.createModule(payload);
        expect([
          HTTP_STATUS.BAD_REQUEST,
          HTTP_STATUS.INTERNAL_SERVER_ERROR,
        ]).toContain(response.status());
      });

      test("TC_EMPTY_002 Create module without description @emptydata @module @sanity @create", async ({
        moduleClient,
      }) => {
        const { description, ...payload } = uniqueModulePayload();
        const response = await moduleClient.createModule(payload);
        expect([
          HTTP_STATUS.CREATED,
          HTTP_STATUS.BAD_REQUEST,
          HTTP_STATUS.INTERNAL_SERVER_ERROR,
        ]).toContain(response.status());
      });

      test("TC_EMPTY_003 Create module without activeStatus @emptydata @module @sanity @create", async ({
        moduleClient,
      }) => {
        const { activeStatus, ...payload } = uniqueModulePayload();
        const response = await moduleClient.createModule(payload);
        expect([
          HTTP_STATUS.CREATED,
          HTTP_STATUS.BAD_REQUEST,
          HTTP_STATUS.INTERNAL_SERVER_ERROR,
        ]).toContain(response.status());
      });

      test("TC_EMPTY_004 Create module without menuItem @emptydata @module @regression @create", async ({
        moduleClient,
      }) => {
        const { menuItem, ...payload } = uniqueModulePayload();
        const response = await moduleClient.createModule(payload);
        expect([
          HTTP_STATUS.CREATED,
          HTTP_STATUS.BAD_REQUEST,
          HTTP_STATUS.INTERNAL_SERVER_ERROR,
        ]).toContain(response.status());
      });

      test("TC_EMPTY_005 Create module with empty request body @emptydata @module @regression @create", async ({
        moduleClient,
      }) => {
        const response = await moduleClient.createModule({});
        expect([
          HTTP_STATUS.BAD_REQUEST,
          HTTP_STATUS.INTERNAL_SERVER_ERROR,
        ]).toContain(response.status());
      });
    });

    test.describe("Update Operations", () => {
      test("TC_EMPTY_006 Update module with empty request body @emptydata @module @regression @update", async ({
        moduleClient,
      }) => {
        const createResponse = await moduleClient.createModule(
          uniqueModulePayload(),
        );
        expect(createResponse.status()).toBe(HTTP_STATUS.CREATED);

        const created = await createResponse.json();
        const response = await moduleClient.updateModule(created.data._id, {});
        expect([HTTP_STATUS.OK, HTTP_STATUS.BAD_REQUEST]).toContain(
          response.status(),
        );
      });
    });
  });
});
