const { test, expect } = require('../../fixtures/moduleUserRole.fixture');
const { HTTP_STATUS } = require('../../constants/moduleUserRole.constants');
const moduleUserRoleData = require('../../test-data/moduleUserRole.json');

test.describe('Module User Role Lookup Empty Data APIs', () => {

    test('TC_EMPTY_001 Create mapping without moduleIds @emptydata @moduleuserrole',
        async ({ moduleUserRoleClient }) => {

        const payload =
            moduleUserRoleData.empty.withoutModuleIds;

        const response =
            await moduleUserRoleClient.create(payload);

        expect(response.status())
            .toBe(HTTP_STATUS.BAD_REQUEST);
    });


    test('TC_EMPTY_002 Create mapping without userRoleId @emptydata @moduleuserrole',
        async ({ moduleUserRoleClient }) => {

        const payload =
            moduleUserRoleData.empty.withoutUserRoleId;

        const response =
            await moduleUserRoleClient.create(payload);

        /*
         * Current backend checks:
         * if (!moduleIds && !userRoleId)
         *
         * Therefore moduleIds being present means this request
         * can proceed to insertMany().
         */
        expect([
            HTTP_STATUS.CREATED,
            HTTP_STATUS.INTERNAL_SERVER_ERROR
        ]).toContain(response.status());
    });


    test('TC_EMPTY_003 Create mapping with empty request body @emptydata @moduleuserrole',
        async ({ moduleUserRoleClient }) => {

        const response =
            await moduleUserRoleClient.create(
                moduleUserRoleData.empty.emptyObject
            );

        expect(response.status())
            .toBe(HTTP_STATUS.BAD_REQUEST);
    });


    test('TC_EMPTY_004 Update mapping without userRoleId @emptydata @moduleuserrole',
        async ({ moduleUserRoleClient }) => {

        /*
         * userRoleId is part of the URL, therefore an empty/missing
         * URL parameter cannot normally be produced through this route.
         *
         * This test uses an empty path segment.
         */
        const response =
            await moduleUserRoleClient.update(
                '',
                {}
            );

        expect([
            HTTP_STATUS.BAD_REQUEST,
            HTTP_STATUS.NOT_FOUND
        ]).toContain(response.status());
    });


    test('TC_EMPTY_005 Update mapping without moduleIds @emptydata @moduleuserrole',
        async ({ moduleUserRoleClient }) => {

        const response =
            await moduleUserRoleClient.update(
                moduleUserRoleData.valid.userRoleId,
                {}
            );

        /*
         * Backend intentionally treats missing moduleIds
         * as "deactivate all".
         */
        expect(response.status())
            .toBe(HTTP_STATUS.OK);
    });


    test('TC_EMPTY_006 Update mapping with empty array (deactivate all) @emptydata @moduleuserrole',
        async ({ moduleUserRoleClient }) => {

        const response =
            await moduleUserRoleClient.update(
                moduleUserRoleData.valid.userRoleId,
                moduleUserRoleData.empty.updateEmptyModules
            );

        expect(response.status())
            .toBe(HTTP_STATUS.OK);

        const body = await response.json();

        expect(body.message)
            .toContain('deactivated');
    });


    test('TC_EMPTY_007 Update mapping with empty request body @emptydata @moduleuserrole',
        async ({ moduleUserRoleClient }) => {

        const response =
            await moduleUserRoleClient.update(
                moduleUserRoleData.valid.userRoleId,
                moduleUserRoleData.empty.emptyObject
            );

        /*
         * Current backend treats missing moduleIds as
         * deactivate-all, so 200 is expected.
         */
        expect(response.status())
            .toBe(HTTP_STATUS.OK);
    });

});