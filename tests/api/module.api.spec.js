const { test, expect } = require('../../fixtures/module.fixture');
const { HTTP_STATUS } = require('../../api/constants/module.constants');
const { loadResolvedJson } = require('../../utils/testData.util');
const moduleData = loadResolvedJson('../../test-data/module.json');

function uniqueModulePayload(overrides = {}) {
    return {
        ...moduleData.valid.createModule,
        name: `Playwright Module ${Date.now()}_${Math.random().toString(16).slice(2)}`,
        ...overrides
    };
}

test.describe('Module APIs', () => {

    test.describe('Read Operations', () => {
        test('TC01 Get all modules @read @regression', async ({ moduleClient }) => {
            const response = await moduleClient.getAllModules();

            expect(response.status()).toBe(HTTP_STATUS.OK);

            const body = await response.json();
            expect(Array.isArray(body)).toBeTruthy();
        });

        test('TC04 Verify menuItem details are populated @read @regression', async ({ moduleClient }) => {
            const response = await moduleClient.getAllModules();

            expect(response.status()).toBe(HTTP_STATUS.OK);

            const body = await response.json();
            const withMenuItem = body.filter(m => m.menuItem);

            for (const module of withMenuItem) {
                expect(typeof module.menuItem).toBe('string');
                expect(module.menuItem.length).toBeGreaterThan(0);
            }
        });

        test('TC05 Verify response schema @read @regression', async ({ moduleClient }) => {
            const response = await moduleClient.getAllModules();

            expect(response.status()).toBe(HTTP_STATUS.OK);

            const body = await response.json();

            for (const module of body) {
                expect(module).toHaveProperty('_id');
                expect(module).toHaveProperty('name');
                expect(module).toHaveProperty('description');
                expect(module).toHaveProperty('activeStatus');
            }
        });

        test('TC07 Get active modules for permission @read @regression', async ({ moduleClient }) => {
            const response = await moduleClient.getModulesForPermission();

            expect(response.status()).toBe(HTTP_STATUS.OK);

            const body = await response.json();
            expect(Array.isArray(body)).toBeTruthy();
        });

        test('TC08 Verify only active modules are returned @read @regression', async ({ moduleClient }) => {
            const allResponse = await moduleClient.getAllModules();
            expect(allResponse.status()).toBe(HTTP_STATUS.OK);

            const allModules = await allResponse.json();
            const activeIds = new Set(
                allModules
                    .filter(m => m.activeStatus === true)
                    .map(m => m._id)
            );

            const response = await moduleClient.getModulesForPermission();
            expect(response.status()).toBe(HTTP_STATUS.OK);

            const body = await response.json();
            for (const module of body) {
                expect(activeIds.has(module._id)).toBeTruthy();
            }
        });

        test('TC10 Verify selected fields are returned @read @regression', async ({ moduleClient }) => {
            const response = await moduleClient.getModulesForPermission();

            expect(response.status()).toBe(HTTP_STATUS.OK);

            const body = await response.json();
            for (const module of body) {
                expect(module).toHaveProperty('_id');
                expect(module).toHaveProperty('name');
            }
        });

        test('TC11 Verify response schema @read @regression', async ({ moduleClient }) => {
            const response = await moduleClient.getModulesForPermission();

            expect(response.status()).toBe(HTTP_STATUS.OK);

            const body = await response.json();
            expect(Array.isArray(body)).toBeTruthy();
        });

    });

    test.describe('Create Operations', () => {
        test('TC13 Create new module @create @regression', async ({ moduleClient }) => {
            const payload = uniqueModulePayload();
            const response = await moduleClient.createModule(payload);

            expect(response.status()).toBe(HTTP_STATUS.CREATED);

            const body = await response.json();
            expect(body).toHaveProperty('_id');
            expect(body.name).toBe(payload.name);
            expect(body.description).toBe(payload.description);
        });

        test('TC15 Reject duplicate module name @read @regression', async ({ moduleClient }) => {
            const baseline = uniqueModulePayload({ name: `Dup Module ${Date.now()}` });

            const firstCreate = await moduleClient.createModule(baseline);
            expect(firstCreate.status()).toBe(HTTP_STATUS.CREATED);

            const duplicateResponse = await moduleClient.createModule(baseline);
            expect(duplicateResponse.status()).toBe(HTTP_STATUS.CONFLICT);
        });

        test('TC16 Reject duplicate module name with different case @read @regression', async ({ moduleClient }) => {
            const baseName = `Case Dup ${Date.now()}`;

            const firstCreate = await moduleClient.createModule(uniqueModulePayload({ name: baseName }));
            expect(firstCreate.status()).toBe(HTTP_STATUS.CREATED);

            const duplicateResponse = await moduleClient.createModule(uniqueModulePayload({ name: baseName.toUpperCase() }));
            expect(duplicateResponse.status()).toBe(HTTP_STATUS.CONFLICT);
        });

        test('TC17 Reject duplicate module name with extra spaces @read @regression', async ({ moduleClient }) => {
            const baseName = `Space Dup ${Date.now()}`;

            const firstCreate = await moduleClient.createModule(uniqueModulePayload({ name: baseName }));
            expect(firstCreate.status()).toBe(HTTP_STATUS.CREATED);

            const duplicateResponse = await moduleClient.createModule(uniqueModulePayload({ name: `   ${baseName}   ` }));
            expect(duplicateResponse.status()).toBe(HTTP_STATUS.CONFLICT);
        });

        test('TC18 Create module using invalid menuItem @create @regression', async ({ moduleClient }) => {
            const payload = uniqueModulePayload({ menuItem: moduleData.invalid.invalidMenuItemId });
            const response = await moduleClient.createModule(payload);

            expect(response.status()).toBe(HTTP_STATUS.CREATED);

            const body = await response.json();
            expect(body.menuItem).toBe(moduleData.invalid.invalidMenuItemId);
        });

    });

    test.describe('Update Operations', () => {
        async function seedModule(moduleClient, overrides = {}) {
            const createResponse = await moduleClient.createModule(uniqueModulePayload(overrides));
            expect(createResponse.status()).toBe(HTTP_STATUS.CREATED);

            const created = await createResponse.json();
            return created._id;
        }

        test('TC20 Update existing module @update @regression', async ({ moduleClient }) => {
            const moduleId = await seedModule(moduleClient);
            const payload = {
                ...moduleData.valid.updateModule,
                name: `Updated Module ${Date.now()}`
            };

            const response = await moduleClient.updateModule(moduleId, payload);
            expect(response.status()).toBe(HTTP_STATUS.OK);

            const body = await response.json();
            expect(body.name).toBe(payload.name);
        });

        test('TC21 Update module description @update @regression', async ({ moduleClient }) => {
            const moduleId = await seedModule(moduleClient);
            const description = `Updated description ${Date.now()}`;

            const response = await moduleClient.updateModule(moduleId, { description });
            expect(response.status()).toBe(HTTP_STATUS.OK);

            const body = await response.json();
            expect(body.description).toBe(description);
        });

        test('TC22 Update module activeStatus @update @regression', async ({ moduleClient }) => {
            const moduleId = await seedModule(moduleClient, { activeStatus: true });

            const response = await moduleClient.updateModule(moduleId, { activeStatus: false });
            expect(response.status()).toBe(HTTP_STATUS.OK);

            const body = await response.json();
            expect(body.activeStatus).toBe(false);
        });

        test('TC23 Update module menuItem @update @regression', async ({ moduleClient }) => {
            const moduleId = await seedModule(moduleClient);

            const response = await moduleClient.updateModule(moduleId, {
                menuItem: moduleData.valid.secondMenuItemId
            });
            expect(response.status()).toBe(HTTP_STATUS.OK);

            const body = await response.json();
            expect(body.menuItem).toBe(moduleData.valid.secondMenuItemId);
        });

        test('TC24 Update using invalid moduleId @update @regression', async ({ moduleClient }) => {
            const response = await moduleClient.updateModule(
                moduleData.invalid.invalidModuleId,
                { description: 'Invalid ID update' }
            );

            expect([
                HTTP_STATUS.BAD_REQUEST,
                HTTP_STATUS.INTERNAL_SERVER_ERROR
            ]).toContain(response.status());
        });

        test('TC25 Update non-existing module @update @regression', async ({ moduleClient }) => {
            const response = await moduleClient.updateModule(
                moduleData.invalid.nonExistingModuleId,
                { description: 'Non existing update' }
            );

            expect(response.status()).toBe(HTTP_STATUS.NOT_FOUND);
        });

    });

    test.describe('Menu and Lookup Operations', () => {
        async function seedModule(moduleClient, overrides = {}) {
            const createResponse = await moduleClient.createModule(uniqueModulePayload(overrides));
            expect(createResponse.status()).toBe(HTTP_STATUS.CREATED);

            const created = await createResponse.json();
            return created._id;
        }

        test('TC27 Get menu modules @read @regression', async ({ moduleClient }) => {
            const response = await moduleClient.getMenuModules();

            expect(response.status()).toBe(HTTP_STATUS.OK);

            const body = await response.json();
            expect(Array.isArray(body)).toBeTruthy();
        });

        test('TC30 Verify response schema @read @regression', async ({ moduleClient }) => {
            const response = await moduleClient.getMenuModules();

            expect(response.status()).toBe(HTTP_STATUS.OK);

            const body = await response.json();
            for (const module of body) {
                expect(module).toHaveProperty('_id');
                expect(module).toHaveProperty('name');
            }
        });

        test('TC32 Get modules using valid moduleIds @read @regression', async ({ moduleClient }) => {
            const moduleId = await seedModule(moduleClient);

            const response = await moduleClient.getModulesByIds([moduleId]);
            expect(response.status()).toBe(HTTP_STATUS.OK);

            const body = await response.json();
            expect(Array.isArray(body)).toBeTruthy();
            expect(body.some(m => m._id === moduleId)).toBeTruthy();
        });

        test('TC33 Get modules using multiple moduleIds @read @regression', async ({ moduleClient }) => {
            const firstId = await seedModule(moduleClient);
            const secondId = await seedModule(moduleClient);

            const response = await moduleClient.getModulesByIds([firstId, secondId]);
            expect(response.status()).toBe(HTTP_STATUS.OK);

            const body = await response.json();
            const returnedIds = body.map(m => m._id);
            expect(returnedIds).toEqual(expect.arrayContaining([firstId, secondId]));
        });

        test('TC34 Get modules when some IDs do not exist @read @regression', async ({ moduleClient }) => {
            const existingId = await seedModule(moduleClient);

            const response = await moduleClient.getModulesByIds([
                existingId,
                moduleData.invalid.nonExistingModuleId
            ]);

            expect(response.status()).toBe(HTTP_STATUS.OK);

            const body = await response.json();
            expect(body.some(m => m._id === existingId)).toBeTruthy();
            expect(body.length).toBe(1);
        });

        test('TC35 Get modules when all IDs do not exist @read @regression', async ({ moduleClient }) => {
            const response = await moduleClient.getModulesByIds([
                moduleData.invalid.nonExistingModuleId
            ]);

            expect(response.status()).toBe(HTTP_STATUS.NOT_FOUND);

            const body = await response.json();
            expect(body).toHaveProperty('message', 'No modules found');
        });

        test('TC36 Verify populated menuItem @read @regression', async ({ moduleClient }) => {
            const moduleId = await seedModule(moduleClient);

            const response = await moduleClient.getModulesByIds([moduleId]);
            expect(response.status()).toBe(HTTP_STATUS.OK);

            const body = await response.json();
            const module = body.find(m => m._id === moduleId);
            expect(typeof module.menuItem).toBe('string');
        });

        test('TC37 Verify response schema @read @regression', async ({ moduleClient }) => {
            const moduleId = await seedModule(moduleClient);

            const response = await moduleClient.getModulesByIds([moduleId]);
            expect(response.status()).toBe(HTTP_STATUS.OK);

            const body = await response.json();
            for (const module of body) {
                expect(module).toHaveProperty('_id');
                expect(module).toHaveProperty('name');
            }
        });

    });
});