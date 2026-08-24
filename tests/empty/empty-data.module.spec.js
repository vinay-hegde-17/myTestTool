const { test, expect } = require('../../fixtures/module.fixture');
const { HTTP_STATUS } = require('../../api/constants/module.constants');
const { loadResolvedJson } = require('../../utils/testData.util');
const moduleData = loadResolvedJson('../../test-data/module.json');

test.describe('Modules Module - Empty Data Validation', () => {
    test.describe('Create Operations', () => {
        test('TC_EMPTY_001 Create module without name @emptydata @smoke @create', async ({ moduleClient }) => {
            const { name, ...payload } = uniqueModulePayload();
            const response = await moduleClient.createModule(payload);
            expect([HTTP_STATUS.BAD_REQUEST, HTTP_STATUS.INTERNAL_SERVER_ERROR]).toContain(response.status());
        });

        test('TC_EMPTY_002 Create module without description @emptydata @sanity @create', async ({ moduleClient }) => {
            const { description, ...payload } = uniqueModulePayload();
            const response = await moduleClient.createModule(payload);
            expect([HTTP_STATUS.CREATED, HTTP_STATUS.BAD_REQUEST, HTTP_STATUS.INTERNAL_SERVER_ERROR]).toContain(response.status());
        });

        test('TC_EMPTY_003 Create module without activeStatus @emptydata @sanity @create', async ({ moduleClient }) => {
            const { activeStatus, ...payload } = uniqueModulePayload();
            const response = await moduleClient.createModule(payload);
            expect([HTTP_STATUS.CREATED, HTTP_STATUS.BAD_REQUEST, HTTP_STATUS.INTERNAL_SERVER_ERROR]).toContain(response.status());
        });

        test('TC_EMPTY_004 Create module without menuItem @emptydata @regression @create', async ({ moduleClient }) => {
            const { menuItem, ...payload } = uniqueModulePayload();
            const response = await moduleClient.createModule(payload);
            expect([HTTP_STATUS.CREATED, HTTP_STATUS.BAD_REQUEST, HTTP_STATUS.INTERNAL_SERVER_ERROR]).toContain(response.status());
        });

        test('TC_EMPTY_005 Create module with empty request body @emptydata @regression @create', async ({ moduleClient }) => {
            const response = await moduleClient.createModule({});
            expect([HTTP_STATUS.BAD_REQUEST, HTTP_STATUS.INTERNAL_SERVER_ERROR]).toContain(response.status());
        });
    });

    test.describe('Update Operations', () => {
        test('TC_EMPTY_006 Update module with empty request body @emptydata @regression @update', async ({ moduleClient }) => {
            const createResponse = await moduleClient.createModule(uniqueModulePayload());
            expect(createResponse.status()).toBe(HTTP_STATUS.CREATED);

            const created = await createResponse.json();
            const response = await moduleClient.updateModule(created.data._id, {});
            expect([HTTP_STATUS.OK, HTTP_STATUS.BAD_REQUEST]).toContain(response.status());
        });
    });

    test.describe('Read Operations', () => {
        test('TC_EMPTY_007 Get modules by IDs without moduleIds @emptydata @regression @read', async ({ moduleClient }) => {
            const response = await moduleClient.postModulesByIdsRaw({});
            expect([HTTP_STATUS.BAD_REQUEST, HTTP_STATUS.INTERNAL_SERVER_ERROR]).toContain(response.status());
        });

        test('TC_EMPTY_008 Get modules by IDs with empty array @emptydata @sanity @read', async ({ moduleClient }) => {
            const response = await moduleClient.getModulesByIds([]);
            expect([HTTP_STATUS.OK, HTTP_STATUS.NO_CONTENT, HTTP_STATUS.BAD_REQUEST]).toContain(response.status());
        });

        test('TC_EMPTY_009 Get modules by IDs with null moduleIds @emptydata @regression @read', async ({ moduleClient }) => {
            const response = await moduleClient.postModulesByIdsRaw({ moduleIds: null });
            expect([HTTP_STATUS.BAD_REQUEST, HTTP_STATUS.INTERNAL_SERVER_ERROR]).toContain(response.status());
        });
    });
});

function uniqueModulePayload(overrides = {}) {
    return {
        ...moduleData.valid.createModule,
        name: `Playwright Module ${Date.now()}_${Math.random().toString(16).slice(2)}`,
        ...overrides
    };
}