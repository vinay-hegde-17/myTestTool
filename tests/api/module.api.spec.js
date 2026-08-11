const { test, expect } = require('../../fixtures/module.fixture');
const { HTTP_STATUS } = require('../../api/constants/module.constants');
const moduleData = require('../../test-data/module.json');

function uniqueModulePayload(overrides = {}) {
    return {
        ...moduleData.valid.createModule,
        name: `Playwright Module ${Date.now()}_${Math.random().toString(16).slice(2)}`,
        ...overrides
    };
}

test.describe('API 1 - GET /modules', () => {

    test('TC01 Get all modules @read @modules @regression @smoke @sanity', async ({
        moduleClient
    }) => {

        const response =
            await moduleClient.getAllModules();

        expect(response.status())
            .toBe(HTTP_STATUS.OK);

        const body =
            await response.json();

        expect(Array.isArray(body))
            .toBeTruthy();

    });

    test('TC04 Verify menuItem details are populated @read @modules @regression', async ({
        moduleClient
    }) => {

        const response =
            await moduleClient.getAllModules();

        expect(response.status())
            .toBe(HTTP_STATUS.OK);

        const body =
            await response.json();

        const withMenuItem = body.filter(m => m.menuItem);

        for (const module of withMenuItem) {

            // menuItem is a plain String field, not a populated ref
            expect(typeof module.menuItem)
                .toBe('string');

            expect(module.menuItem.length)
                .toBeGreaterThan(0);

        }

    });

    test('TC05 Verify response schema @read @modules @regression', async ({
        moduleClient
    }) => {

        const response =
            await moduleClient.getAllModules();

        expect(response.status())
            .toBe(HTTP_STATUS.OK);

        const body =
            await response.json();

        for (const module of body) {

            expect(module)
                .toHaveProperty('_id');

            expect(module)
                .toHaveProperty('name');

            expect(module)
                .toHaveProperty('description');

            expect(module)
                .toHaveProperty('activeStatus');

        }

    });

    test('TC06 Get all modules without Authorization @read @modules @regression', async ({
        moduleClient
    }) => {

        const response =
            await moduleClient.getAllModulesWithoutAuth();

        expect(response.status())
            .toBe(HTTP_STATUS.UNAUTHORIZED);

    });

});

test.describe('API 2 - GET /modules/modulesForPermission', () => {

    test('TC07 Get active modules for permission @read @modules @regression @smoke @sanity', async ({
        moduleClient
    }) => {

        const response =
            await moduleClient.getModulesForPermission();

        expect(response.status())
            .toBe(HTTP_STATUS.OK);

        const body =
            await response.json();

        expect(Array.isArray(body))
            .toBeTruthy();

    });

    test('TC08 Verify only active modules are returned @read @modules @regression', async ({
        moduleClient
    }) => {

        // /modulesForPermission does .select('name description menuItem') —
        // activeStatus itself is never returned in the payload, even though
        // the query filters on it server-side. So this can't be verified by
        // checking a field on each item; instead cross-check the returned
        // _ids against the full module list's activeStatus.
        const allResponse =
            await moduleClient.getAllModules();

        expect(allResponse.status())
            .toBe(HTTP_STATUS.OK);

        const allModules =
            await allResponse.json();

        const activeIds = new Set(
            allModules
                .filter(m => m.activeStatus === true)
                .map(m => m._id)
        );

        const response =
            await moduleClient.getModulesForPermission();

        expect(response.status())
            .toBe(HTTP_STATUS.OK);

        const body =
            await response.json();

        for (const module of body) {
            expect(activeIds.has(module._id))
                .toBeTruthy();
        }

    });

    test('TC10 Verify selected fields are returned @read @modules @regression', async ({
        moduleClient
    }) => {

        const response =
            await moduleClient.getModulesForPermission();

        expect(response.status())
            .toBe(HTTP_STATUS.OK);

        const body =
            await response.json();

        // TODO: tighten this once the route's .select(...) is known —
        // currently only asserting the minimum fields a "for permission"
        // list would need, not asserting exclusion of other fields.
        for (const module of body) {

            expect(module)
                .toHaveProperty('_id');

            expect(module)
                .toHaveProperty('name');

        }

    });

    test('TC11 Verify response schema @read @modules @regression', async ({
        moduleClient
    }) => {

        const response =
            await moduleClient.getModulesForPermission();

        expect(response.status())
            .toBe(HTTP_STATUS.OK);

        const body =
            await response.json();

        expect(Array.isArray(body))
            .toBeTruthy();

    });

    test('TC12 Get active modules without Authorization @read @modules @regression', async ({
        moduleClient
    }) => {

        const response =
            await moduleClient.getModulesForPermissionWithoutAuth();

        expect(response.status())
            .toBe(HTTP_STATUS.UNAUTHORIZED);

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

        const body =
            await response.json();

        expect(body)
            .toHaveProperty('_id');

        expect(body.name)
            .toBe(payload.name);

        expect(body.description)
            .toBe(payload.description);

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

        const body =
            await response.json();

        expect(body.menuItem)
            .toBe(moduleData.invalid.invalidMenuItemId);

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

        const created =
            await createResponse.json();

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

        const body =
            await response.json();

        expect(body.name)
            .toBe(payload.name);

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

        const body =
            await response.json();

        expect(body.description)
            .toBe(description);

    });

    test('TC22 Update module activeStatus @update @modules @regression', async ({
        moduleClient
    }) => {

        const moduleId = await seedModule(moduleClient, { activeStatus: true });

        const response =
            await moduleClient.updateModule(moduleId, { activeStatus: false });

        expect(response.status())
            .toBe(HTTP_STATUS.OK);

        const body =
            await response.json();

        expect(body.activeStatus)
            .toBe(false);

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

        const body =
            await response.json();

        expect(body.menuItem)
            .toBe(moduleData.valid.secondMenuItemId);

    });

    test('TC24 Update using invalid moduleId @update @modules @regression', async ({
        moduleClient
    }) => {

        const response =
            await moduleClient.updateModule(
                moduleData.invalid.invalidModuleId,
                { description: 'Invalid ID update' }
            );

        expect([
            HTTP_STATUS.BAD_REQUEST,
            HTTP_STATUS.INTERNAL_SERVER_ERROR
        ]).toContain(response.status());

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

        expect(response.status())
            .toBe(HTTP_STATUS.OK);

        const body =
            await response.json();

        expect(Array.isArray(body))
            .toBeTruthy();

    });

    test('TC30 Verify response schema @read @modules @regression', async ({
        moduleClient
    }) => {

        const response =
            await moduleClient.getMenuModules();

        expect(response.status())
            .toBe(HTTP_STATUS.OK);

        const body =
            await response.json();

        for (const module of body) {

            expect(module)
                .toHaveProperty('_id');

            expect(module)
                .toHaveProperty('name');

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

        const created =
            await createResponse.json();

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

        const body =
            await response.json();

        expect(Array.isArray(body))
            .toBeTruthy();

        expect(body.some(m => m._id === moduleId))
            .toBeTruthy();

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

        const body =
            await response.json();

        const returnedIds = body.map(m => m._id);

        expect(returnedIds)
            .toEqual(expect.arrayContaining([firstId, secondId]));

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

        const body =
            await response.json();

        expect(body.some(m => m._id === existingId))
            .toBeTruthy();

        expect(body.length)
            .toBe(1);

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

        const body =
            await response.json();

        expect(body)
            .toHaveProperty('message', 'No modules found');

    });

    test('TC36 Verify populated menuItem @read @modules @regression', async ({
        moduleClient
    }) => {

        const moduleId = await seedModule(moduleClient);

        const response =
            await moduleClient.getModulesByIds([moduleId]);

        expect(response.status())
            .toBe(HTTP_STATUS.OK);

        const body =
            await response.json();

        const module = body.find(m => m._id === moduleId);

        // menuItem is a plain String field, not a populated ref
        expect(typeof module.menuItem)
            .toBe('string');

    });

    test('TC37 Verify response schema @read @modules @regression', async ({
        moduleClient
    }) => {

        const moduleId = await seedModule(moduleClient);

        const response =
            await moduleClient.getModulesByIds([moduleId]);

        expect(response.status())
            .toBe(HTTP_STATUS.OK);

        const body =
            await response.json();

        for (const module of body) {

            expect(module)
                .toHaveProperty('_id');

            expect(module)
                .toHaveProperty('name');

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