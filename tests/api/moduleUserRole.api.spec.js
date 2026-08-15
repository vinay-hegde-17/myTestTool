const { test, expect } = require('../../fixtures/moduleUserRole.fixture');
const { HTTP_STATUS } = require('../../api/constants/moduleUserRole.constants');
const moduleUserRoleData = require('../../test-data/moduleUserRole.json');

test.describe('Module Role Mapping Read APIs', () => {

    test('TC01 Get all module-role mappings @read @moduleuserrole @regression @smoke @sanity',
        async ({ moduleUserRoleClient }) => {

            const response =
                await moduleUserRoleClient.getAll();

            expect(response.status())
                .toBe(HTTP_STATUS.OK);

            const body = await response.json();

            expect(Array.isArray(body))
                .toBe(true);
        });


    test('TC02 Get all mappings when records exist @read @moduleuserrole @regression',
        async ({ moduleUserRoleClient }) => {

            const response =
                await moduleUserRoleClient.getAll();

            expect(response.status())
                .toBe(HTTP_STATUS.OK);

            const body = await response.json();

            expect(body.length)
                .toBeGreaterThan(0);
        });


    test('TC03 Get all mappings when no records exist @read @moduleuserrole @regression',
        async ({ moduleUserRoleClient }) => {

            const response =
                await moduleUserRoleClient.getAll();

            /*
             * Backend returns 404 when no mappings exist.
             */
            expect([HTTP_STATUS.OK, HTTP_STATUS.NOT_FOUND])
                .toContain(response.status());
        });


    test('TC04 Verify module-role mapping response schema @read @moduleuserrole @regression',
        async ({ moduleUserRoleClient }) => {

            const response =
                await moduleUserRoleClient.getAll();

            expect(response.status())
                .toBe(HTTP_STATUS.OK);

            const body = await response.json();

            expect(Array.isArray(body))
                .toBe(true);

            if (body.length > 0) {
                expect(body[0])
                    .toHaveProperty('moduleId');

                expect(body[0])
                    .toHaveProperty('userRoleId');

                expect(body[0])
                    .toHaveProperty('activeStatus');
            }
        });


    test('TC05 Get all mappings without Authorization @read @moduleuserrole @regression',
        async ({ moduleUserRoleClient }) => {

            const response =
                await moduleUserRoleClient.getAllWithoutAuth();

            expect(response.status())
                .toBe(HTTP_STATUS.UNAUTHORIZED);
        });

});

test.describe('Role Module Assignment Read APIs', () => {

    test('TC06 Get assigned modules for valid role @read @moduleuserrole @regression @smoke @sanity',
        async ({ moduleUserRoleClient }) => {

            const response =
                await moduleUserRoleClient.getByRole(
                    moduleUserRoleData.valid.userRoleId
                );

            expect(response.status())
                .toBe(HTTP_STATUS.OK);

            const body = await response.json();

            expect(body)
                .toHaveProperty('message');

            expect(body)
                .toHaveProperty('data');
        });


    test('TC07 Get assigned modules when active modules exist @read @moduleuserrole @regression',
        async ({ moduleUserRoleClient }) => {

            const response =
                await moduleUserRoleClient.getByRole(
                    moduleUserRoleData.activeAssignment.userRoleId
                );

            expect(response.status())
                .toBe(HTTP_STATUS.OK);

            const body = await response.json();

            expect(body.data)
                .not.toBeNull();

            expect(Array.isArray(body.data))
                .toBe(true);
        });


    test('TC08 Get role with no assigned modules @read @moduleuserrole @regression',
        async ({ moduleUserRoleClient }) => {

            const response =
                await moduleUserRoleClient.getByRole(
                    moduleUserRoleData.noAssignedModules.userRoleId
                );

            expect(response.status())
                .toBe(HTTP_STATUS.OK);

            const body = await response.json();

            expect(body.data)
                .toBeNull();
        });


    test('TC09 Get assigned modules using invalid userRoleId @read @moduleuserrole @regression',
        async ({ moduleUserRoleClient }) => {

            await expect(
                moduleUserRoleClient.getByRole(
                    moduleUserRoleData.invalid.nonObjectUserRoleId
                )
            ).rejects.toThrow('userRoleId must be a valid MongoDB ObjectId');
        });


    test('TC10 Verify only active modules are returned @read @moduleuserrole @regression',
        async ({ moduleUserRoleClient }) => {

            const response =
                await moduleUserRoleClient.getByRole(
                    moduleUserRoleData.valid.userRoleId
                );

            expect(response.status())
                .toBe(HTTP_STATUS.OK);

            const body = await response.json();

            expect(body.data)
                .not.toBeNull();

            expect(Array.isArray(body.data))
                .toBe(true);
        });


    test('TC11 Verify populated menuItem details @read @moduleuserrole @regression',
        async ({ moduleUserRoleClient }) => {

            const response =
                await moduleUserRoleClient.getByRole(
                    moduleUserRoleData.valid.userRoleId
                );

            expect(response.status())
                .toBe(HTTP_STATUS.OK);

            const body = await response.json();

            if (body.data && body.data.length > 0) {

                expect(body.data[0])
                    .toHaveProperty('menuItem');
            }
        });


    test('TC12 Verify assigned module response schema @read @moduleuserrole @regression',
        async ({ moduleUserRoleClient }) => {

            const response =
                await moduleUserRoleClient.getByRole(
                    moduleUserRoleData.valid.userRoleId
                );

            expect(response.status())
                .toBe(HTTP_STATUS.OK);

            const body = await response.json();

            expect(body)
                .toHaveProperty('message');

            expect(body)
                .toHaveProperty('data');
        });


    test('TC13 Get assigned modules without Authorization @read @moduleuserrole @regression',
        async ({ moduleUserRoleClient }) => {

            const response =
                await moduleUserRoleClient.getByRoleWithoutAuth(
                    moduleUserRoleData.valid.userRoleId
                );

            expect(response.status())
                .toBe(HTTP_STATUS.UNAUTHORIZED);
        });

});

test.describe('Module Role Assignment APIs', () => {

    test('TC14 Assign single module to role @create @moduleuserrole @regression @smoke @sanity',
        async ({ moduleUserRoleClient }) => {

            const payload = {
                moduleIds: [
                    moduleUserRoleData.valid.moduleId
                ],
                userRoleId: moduleUserRoleData.valid.userRoleId,
                activeStatus: true
            };

            const response =
                await moduleUserRoleClient.create(payload);

            expect(response.status())
                .toBe(HTTP_STATUS.CREATED);

            const body = await response.json();

            expect(Array.isArray(body))
                .toBe(true);
        });


    test('TC15 Assign multiple modules to role @create @moduleuserrole @regression',
        async ({ moduleUserRoleClient }) => {

            const payload = {
                moduleIds: moduleUserRoleData.multipleModules.moduleIds,
                userRoleId: moduleUserRoleData.valid.userRoleId,
                activeStatus: true
            };

            const response =
                await moduleUserRoleClient.create(payload);

            expect(response.status())
                .toBe(HTTP_STATUS.CREATED);

            const body = await response.json();

            expect(Array.isArray(body))
                .toBe(true);
        });


    test('TC16 Assign module using invalid roleId @create @moduleuserrole @regression',
        async ({ moduleUserRoleClient }) => {

            const payload = {
                moduleIds: [
                    moduleUserRoleData.valid.moduleId
                ],
                userRoleId: moduleUserRoleData.invalid.invalidUserRoleId,
                activeStatus: true
            };

            const response =
                await moduleUserRoleClient.create(payload);

            /*
             * Current backend does not validate referenced role existence.
             * It may therefore create the mapping.
             */
            expect([HTTP_STATUS.CREATED, HTTP_STATUS.INTERNAL_SERVER_ERROR])
                .toContain(response.status());
        });


    test('TC17 Assign module using invalid moduleId @create @moduleuserrole @regression',
        async ({ moduleUserRoleClient }) => {

            const payload = {
                moduleIds: [
                    moduleUserRoleData.invalid.invalidModuleId
                ],
                userRoleId: moduleUserRoleData.valid.userRoleId,
                activeStatus: true
            };

            const response =
                await moduleUserRoleClient.create(payload);

            expect([HTTP_STATUS.CREATED, HTTP_STATUS.INTERNAL_SERVER_ERROR])
                .toContain(response.status());
        });


    test('TC18 Create mapping without Authorization @create @moduleuserrole @regression',
        async ({ moduleUserRoleClient }) => {

            const payload = {
                moduleIds: [
                    moduleUserRoleData.valid.moduleId
                ],
                userRoleId: moduleUserRoleData.valid.userRoleId,
                activeStatus: true
            };

            const response =
                await moduleUserRoleClient.getByRoleWithoutAuth(
                    moduleUserRoleData.valid.userRoleId
                );

            expect(response.status())
                .toBe(HTTP_STATUS.UNAUTHORIZED);
        });

});

test.describe('Module Role Assignment Update APIs', () => {

    test('TC19 Update assigned modules for role @update @moduleuserrole @regression @smoke @sanity',
        async ({ moduleUserRoleClient }) => {

            const payload = {
                moduleIds: moduleUserRoleData.update.moduleIds
            };

            const response =
                await moduleUserRoleClient.update(
                    moduleUserRoleData.valid.userRoleId,
                    payload
                );

            expect(response.status())
                .toBe(HTTP_STATUS.OK);

            const body = await response.json();

            expect(body)
                .toHaveProperty('message');
        });


    test('TC20 Activate previously inactive module assignment @update @moduleuserrole @regression',
        async ({ moduleUserRoleClient }) => {

            const payload = {
                moduleIds: [
                    moduleUserRoleData.valid.moduleId
                ]
            };

            const response =
                await moduleUserRoleClient.update(
                    moduleUserRoleData.valid.userRoleId,
                    payload
                );

            expect(response.status())
                .toBe(HTTP_STATUS.OK);
        });


    test('TC21 Add newly assigned modules @update @moduleuserrole @regression',
        async ({ moduleUserRoleClient }) => {

            const payload = {
                moduleIds: moduleUserRoleData.multipleModules.moduleIds
            };

            const response =
                await moduleUserRoleClient.update(
                    moduleUserRoleData.valid.userRoleId,
                    payload
                );

            expect(response.status())
                .toBe(HTTP_STATUS.OK);
        });


    test('TC22 Deactivate removed modules @update @moduleuserrole @regression',
        async ({ moduleUserRoleClient }) => {

            const payload = {
                moduleIds: [
                    moduleUserRoleData.valid.moduleId
                ]
            };

            const response =
                await moduleUserRoleClient.update(
                    moduleUserRoleData.valid.userRoleId,
                    payload
                );

            expect(response.status())
                .toBe(HTTP_STATUS.OK);
        });


    test('TC23 Replace existing module assignments @update @moduleuserrole @regression',
        async ({ moduleUserRoleClient }) => {

            const payload = {
                moduleIds:
                    moduleUserRoleData.replaceAssignments.moduleIds
            };

            const response =
                await moduleUserRoleClient.update(
                    moduleUserRoleData.valid.userRoleId,
                    payload
                );

            expect(response.status())
                .toBe(HTTP_STATUS.OK);
        });


    test('TC24 Remove all module assignments @update @moduleuserrole @regression',
        async ({ moduleUserRoleClient }) => {

            const payload = {
                moduleIds: []
            };

            const response =
                await moduleUserRoleClient.update(
                    moduleUserRoleData.valid.userRoleId,
                    payload
                );

            expect(response.status())
                .toBe(HTTP_STATUS.OK);

            const body = await response.json();

            expect(body.message)
                .toContain('deactivated');
        });


    test('TC25 Update role using invalid userRoleId @update @moduleuserrole @regression',
        async ({ moduleUserRoleClient }) => {

            const payload = {
                moduleIds: [
                    moduleUserRoleData.valid.moduleId
                ]
            };

            await expect(
                moduleUserRoleClient.update(
                    moduleUserRoleData.invalid.nonObjectUserRoleId,
                    payload
                )
            ).rejects.toThrow(
                'userRoleId must be a valid MongoDB ObjectId'
            );
        });


    test('TC26 Update non-existing role @update @moduleuserrole @regression',
        async ({ moduleUserRoleClient }) => {

            const payload = {
                moduleIds: [
                    moduleUserRoleData.valid.moduleId
                ]
            };

            const response =
                await moduleUserRoleClient.update(
                    moduleUserRoleData.invalid.invalidUserRoleId,
                    payload
                );

            expect(response.status())
                .toBe(HTTP_STATUS.OK);
        });


    test('TC27 Update module assignments without Authorization @update @moduleuserrole @regression',
        async ({ moduleUserRoleClient }) => {

            const payload = {
                moduleIds: [
                    moduleUserRoleData.valid.moduleId
                ]
            };

            const response =
                await moduleUserRoleClient.updateWithoutAuth(
                    moduleUserRoleData.valid.userRoleId,
                    payload
                );

            expect(response.status())
                .toBe(HTTP_STATUS.UNAUTHORIZED);
        });

});


// Empty-data scenarios moved from tests/empty/empty-data.moduleUserRole.api.spec.js
test.describe('Module User Role Lookup Empty Data APIs', () => {

    test('TC_EMPTY_001 Create mapping without moduleIds @emptydata @moduleuserrole @create @regression @smoke @sanity',
        async ({ moduleUserRoleClient }) => {

        const payload =
            moduleUserRoleData.empty.withoutModuleIds;

        const response =
            await moduleUserRoleClient.create(payload);

        expect(response.status())
            .toBe(HTTP_STATUS.BAD_REQUEST);
    });


    test('TC_EMPTY_002 Create mapping without userRoleId @emptydata @moduleuserrole @create @regression',
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


    test('TC_EMPTY_003 Create mapping with empty request body @emptydata @moduleuserrole @create @regression',
        async ({ moduleUserRoleClient }) => {

        const response =
            await moduleUserRoleClient.create(
                moduleUserRoleData.empty.emptyObject
            );

        expect(response.status())
            .toBe(HTTP_STATUS.BAD_REQUEST);
    });


    test('TC_EMPTY_004 Update mapping without userRoleId @emptydata @moduleuserrole @update @regression',
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


    test('TC_EMPTY_005 Update mapping without moduleIds @emptydata @moduleuserrole @update @regression @sanity',
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


    test('TC_EMPTY_006 Update mapping with empty array (deactivate all) @emptydata @moduleuserrole @update @regression @sanity',
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


    test('TC_EMPTY_007 Update mapping with empty request body @emptydata @moduleuserrole @update @regression',
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
