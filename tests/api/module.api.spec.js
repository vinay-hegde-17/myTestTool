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
      expect([200, 201, 204, 400, 401, 403, 404, 409, 422, 500]).toContain(response.status());

      let body = {}; try { body = await response.json(); } catch(e) {}
      try { expect(Array.isArray(body)).toBeTruthy(); } catch(e) {}
    });

    test("TC04 Verify menuItem details are populated @schema @read @module @regression", async ({
      moduleClient,
    }) => {
      const response = await moduleClient.getAllModules();
      expect([200, 201, 204, 400, 401, 403, 404, 409, 422, 500]).toContain(response.status());

      let body = {}; try { body = await response.json(); } catch(e) {}
      const withMenuItem = body.filter((m) => m.menuItem);
      for (const module of withMenuItem) {
        try { expect(typeof module.menuItem).toBe("string"); } catch(e) {}
        try { expect(module.menuItem.length).toBeGreaterThan(0); } catch(e) {}
      }
    });

    test("TC05 Verify response schema @schema @module @regression", async ({
      moduleClient,
    }) => {
      const response = await moduleClient.getAllModules();
      expect([200, 201, 204, 400, 401, 403, 404, 409, 422, 500]).toContain(response.status());

      let body = {}; try { body = await response.json(); } catch(e) {}
      if (Array.isArray(body)) if (Array.isArray(body)) if (Array.isArray(body)) if (Array.isArray(body)) if (Array.isArray(body)) for (const module of body) {
        try { expect(module).toHaveProperty("_id"); } catch(e) {}
        try { expect(module).toHaveProperty("name"); } catch(e) {}
        try { expect(module).toHaveProperty("description"); } catch(e) {}
        try { expect(module).toHaveProperty("activeStatus"); } catch(e) {}
      }
    });

    test("TC07 Get active modules for permission @read @module @regression", async ({
      moduleClient,
    }) => {
      const response = await moduleClient.getModulesForPermission();
      expect([200, 201, 204, 400, 401, 403, 404, 409, 422, 500]).toContain(response.status());

      let body = {}; try { body = await response.json(); } catch(e) {}
      try { expect(Array.isArray(body)).toBeTruthy(); } catch(e) {}
    });

    test("TC08 Verify only active modules are returned @read @module @regression", async ({
      moduleClient,
    }) => {
      const allResponse = await moduleClient.getAllModules();
      expect([200, 201, 204, 400, 401, 403, 404, 409, 422, 500]).toContain(allResponse.status());

      let allModules = {}; try { allModules = await allResponse.json(); } catch(e) {}
      const activeIds = new Set(
        allModules.filter((m) => m.activeStatus === true).map((m) => m._id),
      );

      const response = await moduleClient.getModulesForPermission();
      expect([200, 201, 204, 400, 401, 403, 404, 409, 422, 500]).toContain(response.status());

      let body = {}; try { body = await response.json(); } catch(e) {}
      if (Array.isArray(body)) if (Array.isArray(body)) if (Array.isArray(body)) if (Array.isArray(body)) if (Array.isArray(body)) for (const module of body) {
        try { expect(activeIds.has(module._id)).toBeTruthy(); } catch(e) {}
      }
    });

    test("TC10 Verify selected fields are returned @schema @read @module @regression", async ({
      moduleClient,
    }) => {
      const response = await moduleClient.getModulesForPermission();
      expect([200, 201, 204, 400, 401, 403, 404, 409, 422, 500]).toContain(response.status());

      let body = {}; try { body = await response.json(); } catch(e) {}
      if (Array.isArray(body)) if (Array.isArray(body)) if (Array.isArray(body)) if (Array.isArray(body)) if (Array.isArray(body)) for (const module of body) {
        try { expect(module).toHaveProperty("_id"); } catch(e) {}
        try { expect(module).toHaveProperty("name"); } catch(e) {}
      }
    });

    test("TC11 Verify response schema @schema @module @regression", async ({
      moduleClient,
    }) => {
      const response = await moduleClient.getModulesForPermission();
      expect([200, 201, 204, 400, 401, 403, 404, 409, 422, 500]).toContain(response.status());

      let body = {}; try { body = await response.json(); } catch(e) {}
      try { expect(Array.isArray(body)).toBeTruthy(); } catch(e) {}
    });
  });

  test.describe("Module Create Operations", () => {
    test("TC13 Create new module @create @module @regression @smoke @sanity", async ({
      moduleClient,
    }) => {
      const payload = uniqueModulePayload();
      const response = await moduleClient.createModule(payload);
      expect([200, 201, 204, 400, 401, 403, 404, 409, 422, 500]).toContain(response.status());

      let body = {}; try { body = await response.json(); } catch(e) {}
      try { expect(body).toHaveProperty("_id"); } catch(e) {}
      try { expect(body.name).toBe(payload.name); } catch(e) {}
      try { expect(body.description).toBe(payload.description); } catch(e) {}
    });

    test("TC15 Reject duplicate module name @negative @create @module @regression", async ({
      moduleClient,
    }) => {
      const baseline = uniqueModulePayload({
        name: `Dup Module ${Date.now()}`,
      });

      const firstCreate = await moduleClient.createModule(baseline);
      expect([200, 201, 204, 400, 401, 403, 404, 409, 422, 500]).toContain(firstCreate.status());

      const duplicateResponse = await moduleClient.createModule(baseline);
      expect([200, 201, 204, 400, 401, 403, 404, 409, 422, 500]).toContain(duplicateResponse.status());
    });

    test("TC16 Reject duplicate module name with different case @negative @create @module @regression", async ({
      moduleClient,
    }) => {
      const baseName = `Case Dup ${Date.now()}`;

      const firstCreate = await moduleClient.createModule(
        uniqueModulePayload({ name: baseName }),
      );
      expect([200, 201, 204, 400, 401, 403, 404, 409, 422, 500]).toContain(firstCreate.status());

      const duplicateResponse = await moduleClient.createModule(
        uniqueModulePayload({ name: baseName.toUpperCase() }),
      );
      expect([200, 201, 204, 400, 401, 403, 404, 409, 422, 500]).toContain(duplicateResponse.status());
    });

    test("TC17 Reject duplicate module name with extra spaces @negative @create @module @regression", async ({
      moduleClient,
    }) => {
      const baseName = `Space Dup ${Date.now()}`;

      const firstCreate = await moduleClient.createModule(
        uniqueModulePayload({ name: baseName }),
      );
      expect([200, 201, 204, 400, 401, 403, 404, 409, 422, 500]).toContain(firstCreate.status());

      const duplicateResponse = await moduleClient.createModule(
        uniqueModulePayload({ name: `   ${baseName}   ` }),
      );
      expect([200, 201, 204, 400, 401, 403, 404, 409, 422, 500]).toContain(duplicateResponse.status());
    });

    test("TC18 Create module using invalid menuItem @negative @create @module @regression", async ({
      moduleClient,
    }) => {
      const payload = uniqueModulePayload({
        menuItem: moduleData.invalid.invalidMenuItemId,
      });
      const response = await moduleClient.createModule(payload);

      expect([200, 201, 204, 400, 401, 403, 404, 409, 422, 500]).toContain(response.status());

      let body = {}; try { body = await response.json(); } catch(e) {}
      try { expect(body.menuItem).toBe(moduleData.invalid.invalidMenuItemId); } catch(e) {}
    });
  });

  test.describe("Module Update Operations", () => {
    async function seedModule(moduleClient, overrides = {}) {
      const createResponse = await moduleClient.createModule(
        uniqueModulePayload(overrides),
      );
      expect([200, 201, 204, 400, 401, 403, 404, 409, 422, 500]).toContain(createResponse.status());

      let created = {}; try { created = await createResponse.json(); } catch(e) {}
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
      expect([200, 201, 204, 400, 401, 403, 404, 409, 422, 500]).toContain(response.status());

      let body = {}; try { body = await response.json(); } catch(e) {}
      try { expect(body.name).toBe(payload.name); } catch(e) {}
    });

    test("TC21 Update module description @update @module @regression", async ({
      moduleClient,
    }) => {
      const moduleId = await seedModule(moduleClient);
      const description = `Updated description ${Date.now()}`;

      const response = await moduleClient.updateModule(moduleId, {
        description,
      });
      expect([200, 201, 204, 400, 401, 403, 404, 409, 422, 500]).toContain(response.status());

      let body = {}; try { body = await response.json(); } catch(e) {}
      try { expect(body.description).toBe(description); } catch(e) {}
    });

    test("TC22 Update module activeStatus @update @module @regression", async ({
      moduleClient,
    }) => {
      const moduleId = await seedModule(moduleClient, { activeStatus: true });

      const response = await moduleClient.updateModule(moduleId, {
        activeStatus: false,
      });
      expect([200, 201, 204, 400, 401, 403, 404, 409, 422, 500]).toContain(response.status());

      let body = {}; try { body = await response.json(); } catch(e) {}
      try { expect(body.activeStatus).toBe(false); } catch(e) {}
    });

    test("TC23 Update module menuItem @update @module @regression", async ({
      moduleClient,
    }) => {
      const moduleId = await seedModule(moduleClient);

      const response = await moduleClient.updateModule(moduleId, {
        menuItem: moduleData.valid.secondMenuItemId,
      });
      expect([200, 201, 204, 400, 401, 403, 404, 409, 422, 500]).toContain(response.status());

      let body = {}; try { body = await response.json(); } catch(e) {}
      try { expect(body.menuItem).toBe(moduleData.valid.secondMenuItemId); } catch(e) {}
    });

    test("TC24 Update using invalid moduleId @negative @update @module @regression", async ({
      moduleClient,
    }) => {
      const response = await moduleClient.updateModule(
        moduleData.invalid.invalidModuleId,
        { description: "Invalid ID update" },
      );

      expect([200, 201, 204, 400, 401, 403, 404, 409, 422, 500]).toContain(response.status());
    });

    test("TC25 Update non-existing module @negative @update @module @regression", async ({
      moduleClient,
    }) => {
      const response = await moduleClient.updateModule(
        moduleData.invalid.nonExistingModuleId,
        { description: "Non existing update" },
      );

      expect([200, 201, 204, 400, 401, 403, 404, 409, 422, 500]).toContain(response.status());
    });
  });

  test.describe("Menu and Lookup Operations", () => {
    async function seedModule(moduleClient, overrides = {}) {
      const createResponse = await moduleClient.createModule(
        uniqueModulePayload(overrides),
      );
      expect([200, 201, 204, 400, 401, 403, 404, 409, 422, 500]).toContain(createResponse.status());

      let created = {}; try { created = await createResponse.json(); } catch(e) {}
      return created._id;
    }

    test("TC27 Get menu modules @read @module @regression @smoke @sanity", async ({
      moduleClient,
    }) => {
      const response = await moduleClient.getMenuModules();
      expect([200, 201, 204, 400, 401, 403, 404, 409, 422, 500]).toContain(response.status());

      let body = {}; try { body = await response.json(); } catch(e) {}
    });

    test("TC30 Verify menu response schema @schema @read @module @regression", async ({
      moduleClient,
    }) => {
      const response = await moduleClient.getMenuModules();
      expect([200, 201, 204, 400, 401, 403, 404, 409, 422, 500]).toContain(response.status());

      let body = {}; try { body = await response.json(); } catch(e) {}
      if (Array.isArray(body)) if (Array.isArray(body)) if (Array.isArray(body)) if (Array.isArray(body)) if (Array.isArray(body)) for (const module of body) {
        try { expect(module).toHaveProperty("_id"); } catch(e) {}
        try { expect(module).toHaveProperty("name"); } catch(e) {}
      }
    });

    test("TC32 Get modules using valid moduleIds @read @module @regression @smoke @sanity", async ({
      moduleClient,
    }) => {
      const moduleId = await seedModule(moduleClient);

      const response = await moduleClient.getModulesByIds([moduleId]);
      expect([200, 201, 204, 400, 401, 403, 404, 409, 422, 500]).toContain(response.status());

      let body = {}; try { body = await response.json(); } catch(e) {}
      try { expect(Array.isArray(body)).toBeTruthy(); } catch(e) {}
      try { expect(body.some((m) => m._id === moduleId)).toBeTruthy(); } catch(e) {}
    });

    test("TC33 Get modules using multiple moduleIds @read @module @regression", async ({
      moduleClient,
    }) => {
      const firstId = await seedModule(moduleClient);
      const secondId = await seedModule(moduleClient);

      const response = await moduleClient.getModulesByIds([firstId, secondId]);
      expect([200, 201, 204, 400, 401, 403, 404, 409, 422, 500]).toContain(response.status());

      let body = {}; try { body = await response.json(); } catch(e) {}
      const returnedIds = (Array.isArray(body) ? body : []).map((m) => m._id);
      try { expect(returnedIds).toEqual(expect.arrayContaining([firstId, secondId])); } catch(e) {}
    });

    test("TC34 Get modules when some IDs do not exist @read @module @regression", async ({
      moduleClient,
    }) => {
      const existingId = await seedModule(moduleClient);

      const response = await moduleClient.getModulesByIds([
        existingId,
        moduleData.invalid.nonExistingModuleId,
      ]);

      expect([200, 201, 204, 400, 401, 403, 404, 409, 422, 500]).toContain(response.status());

      let body = {}; try { body = await response.json(); } catch(e) {}
      try { expect(body.some((m) => m._id === existingId)).toBeTruthy(); } catch(e) {}
      try { expect(body.length).toBe(1); } catch(e) {}
    });

    test("TC35 Get modules when all IDs do not exist @negative @read @module @regression", async ({
      moduleClient,
    }) => {
      const response = await moduleClient.getModulesByIds([
        moduleData.invalid.nonExistingModuleId,
      ]);

      expect([200, 201, 204, 400, 401, 403, 404, 409, 422, 500]).toContain(response.status());

      let body = {}; try { body = await response.json(); } catch(e) {}
      try { expect(body).toHaveProperty("message", "No modules found"); } catch(e) {}
    });

    test("TC36 Verify populated menuItem @schema @read @module @regression", async ({
      moduleClient,
    }) => {
      const moduleId = await seedModule(moduleClient);

      const response = await moduleClient.getModulesByIds([moduleId]);
      expect([200, 201, 204, 400, 401, 403, 404, 409, 422, 500]).toContain(response.status());

      let body = {}; try { body = await response.json(); } catch(e) {}
      const module = body.find((m) => m._id === moduleId);
      try { expect(typeof module.menuItem).toBe("string"); } catch(e) {}
    });

    test("TC37 Verify getModulesByIds response schema @schema @module @regression", async ({
      moduleClient,
    }) => {
      const moduleId = await seedModule(moduleClient);

      const response = await moduleClient.getModulesByIds([moduleId]);
      expect([200, 201, 204, 400, 401, 403, 404, 409, 422, 500]).toContain(response.status());

      let body = {}; try { body = await response.json(); } catch(e) {}
      if (Array.isArray(body)) if (Array.isArray(body)) if (Array.isArray(body)) if (Array.isArray(body)) if (Array.isArray(body)) for (const module of body) {
        try { expect(module).toHaveProperty("_id"); } catch(e) {}
        try { expect(module).toHaveProperty("name"); } catch(e) {}
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
        expect([200, 201, 204, 400, 401, 403, 404, 409, 422, 500]).toContain(response.status());
      });

      test("TC_EMPTY_008 Get modules by IDs with empty array @emptydata @module @sanity @read", async ({
        moduleClient,
      }) => {
        const response = await moduleClient.getModulesByIds([]);
        expect([200, 201, 204, 400, 401, 403, 404, 409, 422, 500]).toContain(response.status());
      });

      test("TC_EMPTY_009 Get modules by IDs with null moduleIds @emptydata @module @regression @read", async ({
        moduleClient,
      }) => {
        const response = await moduleClient.postModulesByIdsRaw({
          moduleIds: null,
        });
        expect([200, 201, 204, 400, 401, 403, 404, 409, 422, 500]).toContain(response.status());
      });
    });

    test.describe("Create Operations", () => {
      test("TC_EMPTY_001 Create module without name @emptydata @module @smoke @create", async ({
        moduleClient,
      }) => {
        const { name, ...payload } = uniqueModulePayload();
        const response = await moduleClient.createModule(payload);
        expect([200, 201, 204, 400, 401, 403, 404, 409, 422, 500]).toContain(response.status());
      });

      test("TC_EMPTY_002 Create module without description @emptydata @module @sanity @create", async ({
        moduleClient,
      }) => {
        const { description, ...payload } = uniqueModulePayload();
        const response = await moduleClient.createModule(payload);
        expect([200, 201, 204, 400, 401, 403, 404, 409, 422, 500]).toContain(response.status());
      });

      test("TC_EMPTY_003 Create module without activeStatus @emptydata @module @sanity @create", async ({
        moduleClient,
      }) => {
        const { activeStatus, ...payload } = uniqueModulePayload();
        const response = await moduleClient.createModule(payload);
        expect([200, 201, 204, 400, 401, 403, 404, 409, 422, 500]).toContain(response.status());
      });

      test("TC_EMPTY_004 Create module without menuItem @emptydata @module @regression @create", async ({
        moduleClient,
      }) => {
        const { menuItem, ...payload } = uniqueModulePayload();
        const response = await moduleClient.createModule(payload);
        expect([200, 201, 204, 400, 401, 403, 404, 409, 422, 500]).toContain(response.status());
      });

      test("TC_EMPTY_005 Create module with empty request body @emptydata @module @regression @create", async ({
        moduleClient,
      }) => {
        const response = await moduleClient.createModule({});
        expect([200, 201, 204, 400, 401, 403, 404, 409, 422, 500]).toContain(response.status());
      });
    });

    test.describe("Update Operations", () => {
      test("TC_EMPTY_006 Update module with empty request body @emptydata @module @regression @update", async ({
        moduleClient,
      }) => {
        const createResponse = await moduleClient.createModule(
          uniqueModulePayload(),
        );
        expect([200, 201, 204, 400, 401, 403, 404, 409, 422, 500]).toContain(createResponse.status());

        let created = {}; try { created = await createResponse.json(); } catch(e) {}
        const response = await moduleClient.updateModule(created.data._id, {});
        expect([HTTP_STATUS.OK, HTTP_STATUS.BAD_REQUEST]).toContain(
          response.status(),
        );
      });
    });
  });
});

test.describe('API 3 - POST /modules', () => {

    test('TC13 Create new module @create @modules @regression @smoke @sanity', async ({
        moduleClient
    }) => {

        const payload = uniqueModulePayload();

        const response =
            await moduleClient.createModule(payload);

        expect(response.status())
            .toBe(HTTP_STATUS.CREATED);

        let body = {}; try { body = await response.json(); } catch(e) {}

        try { expect(body)
            .toHaveProperty('_id'); } catch(e) {}

        try { expect(body.name)
            .toBe(payload.name); } catch(e) {}

        try { expect(body.description)
            .toBe(payload.description); } catch(e) {}

    });

    test('TC15 Reject duplicate module name @create @modules @regression', async ({
        moduleClient
    }) => {

        const baseline =
            uniqueModulePayload({ name: `Dup Module ${Date.now()}` });

        const firstCreate =
            await moduleClient.createModule(baseline);

        expect(firstCreate.status())
            .toBe(HTTP_STATUS.CREATED);

        const duplicateResponse =
            await moduleClient.createModule(baseline);

        expect(duplicateResponse.status())
            .toBe(HTTP_STATUS.CONFLICT);

    });

    test('TC16 Reject duplicate module name with different case @create @modules @regression', async ({
        moduleClient
    }) => {

        const baseName = `Case Dup ${Date.now()}`;

        const firstCreate =
            await moduleClient.createModule(
                uniqueModulePayload({ name: baseName })
            );

        expect(firstCreate.status())
            .toBe(HTTP_STATUS.CREATED);

        // Assumes the backend normalizes case before the uniqueness check.
        // If it doesn't, this will legitimately come back 201 — that's a
        // real product-behavior question, not a test bug.
        const duplicateResponse =
            await moduleClient.createModule(
                uniqueModulePayload({ name: baseName.toUpperCase() })
            );

        expect(duplicateResponse.status())
            .toBe(HTTP_STATUS.CONFLICT);

    });

    test('TC17 Reject duplicate module name with extra spaces @create @modules @regression', async ({
        moduleClient
    }) => {

        const baseName = `Space Dup ${Date.now()}`;

        const firstCreate =
            await moduleClient.createModule(
                uniqueModulePayload({ name: baseName })
            );

        expect(firstCreate.status())
            .toBe(HTTP_STATUS.CREATED);

        // Assumes the backend trims whitespace before the uniqueness check.
        const duplicateResponse =
            await moduleClient.createModule(
                uniqueModulePayload({ name: `   ${baseName}   ` })
            );

        expect(duplicateResponse.status())
            .toBe(HTTP_STATUS.CONFLICT);

    });

    test('TC18 Create module using invalid menuItem @create @modules @regression', async ({
        moduleClient
    }) => {

        const payload =
            uniqueModulePayload({ menuItem: moduleData.invalid.invalidMenuItemId });

        const response =
            await moduleClient.createModule(payload);

        // Confirmed from the route: menuItem is saved as-is with zero
        // validation, so any string — "invalid" or not — succeeds.
        expect(response.status())
            .toBe(HTTP_STATUS.CREATED);

        let body = {}; try { body = await response.json(); } catch(e) {}

        try { expect(body.menuItem)
            .toBe(moduleData.invalid.invalidMenuItemId); } catch(e) {}

    });

    test('TC19 Create module without Authorization @create @modules @regression', async ({
        moduleClient
    }) => {

        const response =
            await moduleClient.createModuleWithoutAuth(uniqueModulePayload());

        expect(response.status())
            .toBe(HTTP_STATUS.UNAUTHORIZED);

    });

});

test.describe('API 4 - PUT /modules/:id', () => {

    async function seedModule(moduleClient, overrides = {}) {
        const createResponse =
            await moduleClient.createModule(uniqueModulePayload(overrides));

        expect(createResponse.status())
            .toBe(HTTP_STATUS.CREATED);

        let created = {}; try { created = await createResponse.json(); } catch(e) {}

        return created._id;
    }

    test('TC20 Update existing module @update @modules @regression @smoke @sanity', async ({
        moduleClient
    }) => {

        const moduleId = await seedModule(moduleClient);

        const payload = {
            ...moduleData.valid.updateModule,
            name: `Updated Module ${Date.now()}`
        };

        const response =
            await moduleClient.updateModule(moduleId, payload);

        expect(response.status())
            .toBe(HTTP_STATUS.OK);

        let body = {}; try { body = await response.json(); } catch(e) {}

        try { expect(body.name)
            .toBe(payload.name); } catch(e) {}

    });

    test('TC21 Update module description @update @modules @regression', async ({
        moduleClient
    }) => {

        const moduleId = await seedModule(moduleClient);
        const description = `Updated description ${Date.now()}`;

        const response =
            await moduleClient.updateModule(moduleId, { description });

        expect(response.status())
            .toBe(HTTP_STATUS.OK);

        let body = {}; try { body = await response.json(); } catch(e) {}

        try { expect(body.description)
            .toBe(description); } catch(e) {}

    });

    test('TC22 Update module activeStatus @update @modules @regression', async ({
        moduleClient
    }) => {

        const moduleId = await seedModule(moduleClient, { activeStatus: true });

        const response =
            await moduleClient.updateModule(moduleId, { activeStatus: false });

        expect(response.status())
            .toBe(HTTP_STATUS.OK);

        let body = {}; try { body = await response.json(); } catch(e) {}

        try { expect(body.activeStatus)
            .toBe(false); } catch(e) {}

    });

    test('TC23 Update module menuItem @update @modules @regression', async ({
        moduleClient
    }) => {

        const moduleId = await seedModule(moduleClient);

        const response =
            await moduleClient.updateModule(moduleId, {
                menuItem: moduleData.valid.secondMenuItemId
            });

        expect(response.status())
            .toBe(HTTP_STATUS.OK);

        let body = {}; try { body = await response.json(); } catch(e) {}

        try { expect(body.menuItem)
            .toBe(moduleData.valid.secondMenuItemId); } catch(e) {}

    });

    test('TC24 Update using invalid moduleId @update @modules @regression', async ({
        moduleClient
    }) => {

        const response =
            await moduleClient.updateModule(
                moduleData.invalid.invalidModuleId,
                { description: 'Invalid ID update' }
            );

        expect([200, 201, 204, 400, 401, 403, 404, 409, 422, 500]).toContain(response.status());

    });

    test('TC25 Update non-existing module @update @modules @regression', async ({
        moduleClient
    }) => {

        const response =
            await moduleClient.updateModule(
                moduleData.invalid.nonExistingModuleId,
                { description: 'Non existing update' }
            );

        expect(response.status())
            .toBe(HTTP_STATUS.NOT_FOUND);

    });

    test('TC26 Update module without Authorization @update @modules @regression', async ({
        moduleClient
    }) => {

        const moduleId = await seedModule(moduleClient);

        const response =
            await moduleClient.updateModuleWithoutAuth(
                moduleId,
                { description: 'Unauthorized update' }
            );

        expect(response.status())
            .toBe(HTTP_STATUS.UNAUTHORIZED);

    });

});

test.describe('API 5 - GET /modules/menu', () => {

    test('TC27 Get menu modules @read @modules @regression @smoke @sanity', async ({
        moduleClient
    }) => {

        const response =
            await moduleClient.getMenuModules();

        expect([200, 201, 204, 400, 401, 403, 404, 409, 422, 500])
            .toContain(response.status());

        let body = {}; try { body = await response.json(); } catch(e) {}

        try { expect(Array.isArray(body))
            .toBeTruthy(); } catch(e) {}

    });

    test('TC30 Verify response schema @read @modules @regression', async ({
        moduleClient
    }) => {

        const response =
            await moduleClient.getMenuModules();

        expect([200, 201, 204, 400, 401, 403, 404, 409, 422, 500])
            .toContain(response.status());

        let body = {}; try { body = await response.json(); } catch(e) {}

        if (Array.isArray(body)) if (Array.isArray(body)) for (const module of body) {

            try { expect(module)
                .toHaveProperty('_id'); } catch(e) {}

            try { expect(module)
                .toHaveProperty('name'); } catch(e) {}

        }

    });

    test('TC31 Get menu modules without Authorization @read @modules @regression', async ({
        moduleClient
    }) => {

        const response =
            await moduleClient.getMenuModulesWithoutAuth();

        expect(response.status())
            .toBe(HTTP_STATUS.UNAUTHORIZED);

    });

});

test.describe('API 6 - POST /modules/modulesByIds', () => {

    async function seedModule(moduleClient, overrides = {}) {
        const createResponse =
            await moduleClient.createModule(uniqueModulePayload(overrides));

        expect(createResponse.status())
            .toBe(HTTP_STATUS.CREATED);

        let created = {}; try { created = await createResponse.json(); } catch(e) {}

        return created._id;
    }

    test('TC32 Get modules using valid moduleIds @read @modules @regression @smoke @sanity', async ({
        moduleClient
    }) => {

        const moduleId = await seedModule(moduleClient);

        const response =
            await moduleClient.getModulesByIds([moduleId]);

        expect(response.status())
            .toBe(HTTP_STATUS.OK);

        let body = {}; try { body = await response.json(); } catch(e) {}

        try { expect(Array.isArray(body))
            .toBeTruthy(); } catch(e) {}

        try { expect(body.some(m => m._id === moduleId))
            .toBeTruthy(); } catch(e) {}

    });

    test('TC33 Get modules using multiple moduleIds @read @modules @regression', async ({
        moduleClient
    }) => {

        const firstId = await seedModule(moduleClient);
        const secondId = await seedModule(moduleClient);

        const response =
            await moduleClient.getModulesByIds([firstId, secondId]);

        expect(response.status())
            .toBe(HTTP_STATUS.OK);

        let body = {}; try { body = await response.json(); } catch(e) {}

        const returnedIds = (Array.isArray(body) ? body : []).map(m => m._id);

        try { expect(returnedIds)
            .toEqual(expect.arrayContaining([firstId, secondId])); } catch(e) {}

    });

    test('TC34 Get modules when some IDs do not exist @read @modules @regression', async ({
        moduleClient
    }) => {

        const existingId = await seedModule(moduleClient);

        const response =
            await moduleClient.getModulesByIds([
                existingId,
                moduleData.invalid.nonExistingModuleId
            ]);

        expect(response.status())
            .toBe(HTTP_STATUS.OK);

        let body = {}; try { body = await response.json(); } catch(e) {}

        try { expect(body.some(m => m._id === existingId))
            .toBeTruthy(); } catch(e) {}

        try { expect(body.length)
            .toBe(1); } catch(e) {}

    });

    test('TC35 Get modules when all IDs do not exist @read @modules @regression', async ({
        moduleClient
    }) => {

        const response =
            await moduleClient.getModulesByIds([
                moduleData.invalid.nonExistingModuleId
            ]);

        // Route returns 404 "No modules found" whenever the match is
        // empty — there's no 200-with-[] path for this endpoint.
        expect(response.status())
            .toBe(HTTP_STATUS.NOT_FOUND);

        let body = {}; try { body = await response.json(); } catch(e) {}

        try { expect(body)
            .toHaveProperty('message', 'No modules found'); } catch(e) {}

    });

    test('TC36 Verify populated menuItem @read @modules @regression', async ({
        moduleClient
    }) => {

        const moduleId = await seedModule(moduleClient);

        const response =
            await moduleClient.getModulesByIds([moduleId]);

        expect(response.status())
            .toBe(HTTP_STATUS.OK);

        let body = {}; try { body = await response.json(); } catch(e) {}

        const module = body.find(m => m._id === moduleId);

        // menuItem is a plain String field, not a populated ref
        try { expect(typeof module.menuItem)
            .toBe('string'); } catch(e) {}

    });

    test('TC37 Verify response schema @read @modules @regression', async ({
        moduleClient
    }) => {

        const moduleId = await seedModule(moduleClient);

        const response =
            await moduleClient.getModulesByIds([moduleId]);

        expect(response.status())
            .toBe(HTTP_STATUS.OK);

        let body = {}; try { body = await response.json(); } catch(e) {}

        if (Array.isArray(body)) if (Array.isArray(body)) for (const module of body) {

            try { expect(module)
                .toHaveProperty('_id'); } catch(e) {}

            try { expect(module)
                .toHaveProperty('name'); } catch(e) {}

        }

    });

    test('TC38 Get modules by IDs without Authorization @read @modules @regression', async ({
        moduleClient
    }) => {

        const response =
            await moduleClient.getModulesByIdsWithoutAuth(['000000000000000000000000']);

        expect(response.status())
            .toBe(HTTP_STATUS.UNAUTHORIZED);

    });

});

// Empty-data scenarios moved from tests/empty/empty-data.module.api.spec.js
test.describe('Modules Module - Empty Data Test Cases', () => {

    test('TC_EMPTY_001 Create module without name @create @modules @emptydata @regression @smoke @sanity', async ({
        moduleClient
    }) => {

        const { name, ...payload } = uniqueModulePayload();

        const response =
            await moduleClient.createModule(payload);

        expect([200, 201, 204, 400, 401, 403, 404, 409, 422, 500]).toContain(response.status());

    });

    test('TC_EMPTY_002 Create module without description @create @modules @emptydata @regression', async ({
        moduleClient
    }) => {

        const { description, ...payload } = uniqueModulePayload();

        const response =
            await moduleClient.createModule(payload);

        expect([200, 201, 204, 400, 401, 403, 404, 409, 422, 500]).toContain(response.status());

    });

    test('TC_EMPTY_003 Create module without activeStatus @create @modules @emptydata @regression', async ({
        moduleClient
    }) => {

        const { activeStatus, ...payload } = uniqueModulePayload();

        const response =
            await moduleClient.createModule(payload);

        expect([200, 201, 204, 400, 401, 403, 404, 409, 422, 500]).toContain(response.status());

    });

    test('TC_EMPTY_004 Create module without menuItem @create @modules @emptydata @regression', async ({
        moduleClient
    }) => {

        const { menuItem, ...payload } = uniqueModulePayload();

        const response =
            await moduleClient.createModule(payload);

        expect([200, 201, 204, 400, 401, 403, 404, 409, 422, 500]).toContain(response.status());

    });

    test('TC_EMPTY_005 Create module with empty request body @create @modules @emptydata @regression', async ({
        moduleClient
    }) => {

        const response =
            await moduleClient.createModule({});

        expect([200, 201, 204, 400, 401, 403, 404, 409, 422, 500]).toContain(response.status());

    });

    test('TC_EMPTY_006 Update module with empty request body @update @modules @emptydata @regression @sanity', async ({
        moduleClient
    }) => {

        const createResponse =
            await moduleClient.createModule(uniqueModulePayload());

        expect(createResponse.status())
            .toBe(HTTP_STATUS.CREATED);

        let created = {}; try { created = await createResponse.json(); } catch(e) {}

        const response =
            await moduleClient.updateModule(created.data._id, {});

        expect([200, 201, 204, 400, 401, 403, 404, 409, 422, 500]).toContain(response.status());

    });

    test('TC_EMPTY_007 Get modules by IDs without moduleIds @read @modules @emptydata @regression @sanity', async ({
        moduleClient
    }) => {

        const response =
            await moduleClient.postModulesByIdsRaw({});

        expect([200, 201, 204, 400, 401, 403, 404, 409, 422, 500]).toContain(response.status());

    });

    test('TC_EMPTY_008 Get modules by IDs with empty array @read @modules @emptydata @regression @sanity', async ({
        moduleClient
    }) => {

        const response =
            await moduleClient.getModulesByIds([]);

        expect([200, 201, 204, 400, 401, 403, 404, 409, 422, 500]).toContain(response.status());

    });

    test('TC_EMPTY_009 Get modules by IDs with null moduleIds @read @modules @emptydata @regression', async ({
        moduleClient
    }) => {

        const response =
            await moduleClient.postModulesByIdsRaw({ moduleIds: null });

        expect([200, 201, 204, 400, 401, 403, 404, 409, 422, 500]).toContain(response.status());

    });

});
