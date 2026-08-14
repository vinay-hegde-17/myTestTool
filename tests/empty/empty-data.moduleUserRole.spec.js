const { test, expect } = require('../../fixtures/moduleUserRole.fixture');
const { HTTP_STATUS } = require('../../api/constants/moduleUserRole.constants');
const { loadResolvedJson } = require('../../utils/testData.util');
const moduleUserRoleData = loadResolvedJson('../../test-data/moduleUserRole.json');

test.describe('Module User Role - Empty Data Validation', () => {
    test.describe('Create Operations', () => {
        test('TC_EMPTY_001 Create mapping without moduleIds @emptydata @smoke @create', async ({ moduleUserRoleClient }) => {
            const payload = moduleUserRoleData.empty.withoutModuleIds;
            const response = await moduleUserRoleClient.create(payload);
            expect(response.status()).toBe(HTTP_STATUS.BAD_REQUEST);
        });

        test('TC_EMPTY_002 Create mapping without userRoleId @emptydata @sanity @create', async ({ moduleUserRoleClient }) => {
            const payload = moduleUserRoleData.empty.withoutUserRoleId;
            const response = await moduleUserRoleClient.create(payload);
            expect([HTTP_STATUS.CREATED, HTTP_STATUS.INTERNAL_SERVER_ERROR]).toContain(response.status());
        });

        test('TC_EMPTY_003 Create mapping with empty request body @emptydata @regression @create', async ({ moduleUserRoleClient }) => {
            const response = await moduleUserRoleClient.create(moduleUserRoleData.empty.emptyObject);
            expect(response.status()).toBe(HTTP_STATUS.BAD_REQUEST);
        });
    });

    test.describe('Update Operations', () => {
        test('TC_EMPTY_004 Update mapping without userRoleId @emptydata @regression @update', async ({ moduleUserRoleClient }) => {
            const response = await moduleUserRoleClient.update('', {});
            expect([HTTP_STATUS.BAD_REQUEST, HTTP_STATUS.NOT_FOUND]).toContain(response.status());
        });

        test('TC_EMPTY_005 Update mapping without moduleIds @emptydata @sanity @update', async ({ moduleUserRoleClient }) => {
            const response = await moduleUserRoleClient.update(moduleUserRoleData.valid.userRoleId, {});
            expect(response.status()).toBe(HTTP_STATUS.OK);
        });

        test('TC_EMPTY_006 Update mapping with empty array (deactivate all) @emptydata @regression @update', async ({ moduleUserRoleClient }) => {
            const response = await moduleUserRoleClient.update(
                moduleUserRoleData.valid.userRoleId,
                moduleUserRoleData.empty.updateEmptyModules
            );
            expect(response.status()).toBe(HTTP_STATUS.OK);

            const body = await response.json();
            expect(body.message).toContain('deactivated');
        });

        test('TC_EMPTY_007 Update mapping with empty request body @emptydata @regression @update', async ({ moduleUserRoleClient }) => {
            const response = await moduleUserRoleClient.update(
                moduleUserRoleData.valid.userRoleId,
                moduleUserRoleData.empty.emptyObject
            );
            expect(response.status()).toBe(HTTP_STATUS.OK);
        });
    });
});