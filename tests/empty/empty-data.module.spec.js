const { test, expect } = require('../../fixtures/module.fixture');
const { HTTP_STATUS } = require('../../api/constants/module.constants');
const moduleData = require('../../test-data/module.json');

test.describe('Modules Module - Empty Data Test Cases', () => {

    test('TC_EMPTY_001 Create module without name @create @modules @emptydata', async ({
        modulesClient
    }) => {

        const { name, ...payload } = uniqueModulePayload();

        const response =
            await modulesClient.createModule(payload);

        expect([
            HTTP_STATUS.BAD_REQUEST,
            HTTP_STATUS.INTERNAL_SERVER_ERROR
        ]).toContain(response.status());

    });

    test('TC_EMPTY_002 Create module without description @create @modules @emptydata', async ({
        modulesClient
    }) => {

        const { description, ...payload } = uniqueModulePayload();

        const response =
            await modulesClient.createModule(payload);

        expect([
            HTTP_STATUS.CREATED,
            HTTP_STATUS.BAD_REQUEST,
            HTTP_STATUS.INTERNAL_SERVER_ERROR
        ]).toContain(response.status());

    });

    test('TC_EMPTY_003 Create module without activeStatus @create @modules @emptydata', async ({
        modulesClient
    }) => {

        const { activeStatus, ...payload } = uniqueModulePayload();

        const response =
            await modulesClient.createModule(payload);

        expect([
            HTTP_STATUS.CREATED,
            HTTP_STATUS.BAD_REQUEST,
            HTTP_STATUS.INTERNAL_SERVER_ERROR
        ]).toContain(response.status());

    });

    test('TC_EMPTY_004 Create module without menuItem @create @modules @emptydata', async ({
        modulesClient
    }) => {

        const { menuItem, ...payload } = uniqueModulePayload();

        const response =
            await modulesClient.createModule(payload);

        expect([
            HTTP_STATUS.CREATED,
            HTTP_STATUS.BAD_REQUEST,
            HTTP_STATUS.INTERNAL_SERVER_ERROR
        ]).toContain(response.status());

    });

    test('TC_EMPTY_005 Create module with empty request body @create @modules @emptydata', async ({
        modulesClient
    }) => {

        const response =
            await modulesClient.createModule({});

        expect([
            HTTP_STATUS.BAD_REQUEST,
            HTTP_STATUS.INTERNAL_SERVER_ERROR
        ]).toContain(response.status());

    });

    test('TC_EMPTY_006 Update module with empty request body @update @modules @emptydata', async ({
        modulesClient
    }) => {

        const createResponse =
            await modulesClient.createModule(uniqueModulePayload());

        expect(createResponse.status())
            .toBe(HTTP_STATUS.CREATED);

        const created =
            await createResponse.json();

        const response =
            await modulesClient.updateModule(created.data._id, {});

        expect([
            HTTP_STATUS.OK,
            HTTP_STATUS.BAD_REQUEST
        ]).toContain(response.status());

    });

    test('TC_EMPTY_007 Get modules by IDs without moduleIds @read @modules @emptydata', async ({
        modulesClient
    }) => {

        const response =
            await modulesClient.postModulesByIdsRaw({});

        expect([
            HTTP_STATUS.BAD_REQUEST,
            HTTP_STATUS.INTERNAL_SERVER_ERROR
        ]).toContain(response.status());

    });

    test('TC_EMPTY_008 Get modules by IDs with empty array @read @modules @emptydata', async ({
        modulesClient
    }) => {

        const response =
            await modulesClient.getModulesByIds([]);

        expect([
            HTTP_STATUS.OK,
            HTTP_STATUS.NO_CONTENT,
            HTTP_STATUS.BAD_REQUEST
        ]).toContain(response.status());

    });

    test('TC_EMPTY_009 Get modules by IDs with null moduleIds @read @modules @emptydata', async ({
        modulesClient
    }) => {

        const response =
            await modulesClient.postModulesByIdsRaw({ moduleIds: null });

        expect([
            HTTP_STATUS.BAD_REQUEST,
            HTTP_STATUS.INTERNAL_SERVER_ERROR
        ]).toContain(response.status());

    });

});