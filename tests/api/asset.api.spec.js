const { test, expect } = require('../../fixtures/asset.fixture');
const { HTTP_STATUS } = require('../../api/constants/asset.constants');
const assetData = require('../../test-data/asset.json');

test.describe('Asset Read APIs', () => {

    test('TC01 Get All Assets @read @assets @regression @smoke @sanity', async ({
        assetClient
    }) => {

        const response =
            await assetClient.getAssets();

        expect(response.status())
            .toBe(HTTP_STATUS.OK);

        const body =
            await response.json();

        expect(Array.isArray(body))
            .toBeTruthy();

    });

    test('TC02 Verify Assets Response Schema @read @assets @regression', async ({
        assetClient
    }) => {

        const response =
            await assetClient.getAssets();

        expect(response.status())
            .toBe(HTTP_STATUS.OK);

        const body =
            await response.json();

        if (body.length > 0) {

            expect(body[0])
                .toHaveProperty('_id');

            expect(body[0])
                .toHaveProperty('assetId');

            expect(body[0])
                .toHaveProperty('description');

        }

    });

    test('TC03 Get Asset Types @read @assets @regression @sanity', async ({
        assetClient
    }) => {

        const response =
            await assetClient.getAssetTypes();

        expect(response.status())
            .toBe(HTTP_STATUS.OK);

        const body =
            await response.json();

        expect(Array.isArray(body))
            .toBeTruthy();

    });

    test('TC04 Verify Asset Types Response Schema @read @assets @regression', async ({
        assetClient
    }) => {

        const response =
            await assetClient.getAssetTypes();

        expect(response.status())
            .toBe(HTTP_STATUS.OK);

        const body =
            await response.json();

        if (body.length > 0) {

            expect(body[0])
                .toHaveProperty('_id');

            expect(body[0])
                .toHaveProperty('type');

        }

    });

    test('TC05 Get Asset Models @read @assets @regression @sanity', async ({
        assetClient
    }) => {

        const response =
            await assetClient.getAssetModels();

        expect(response.status())
            .toBe(HTTP_STATUS.OK);

        const body =
            await response.json();

        expect(Array.isArray(body))
            .toBeTruthy();

    });

    test('TC06 Verify Asset Models Response Schema @read @assets @regression', async ({
        assetClient
    }) => {

        const response =
            await assetClient.getAssetModels();

        expect(response.status())
            .toBe(HTTP_STATUS.OK);

        const body =
            await response.json();

        if (body.length > 0) {

            expect(body[0])
                .toHaveProperty('_id');

            expect(body[0])
                .toHaveProperty('model');

        }

    });

    test('TC07 Unauthorized Get Assets @read @assets @regression', async ({
        assetClient
    }) => {

        const response =
            await assetClient.getAssetsWithoutAuth();

        expect(response.status())
            .toBe(HTTP_STATUS.UNAUTHORIZED);

    });

    test('TC08 Unauthorized Get Asset Types @read @assets @regression', async ({
        assetClient
    }) => {

        const response =
            await assetClient.getAssetTypesWithoutAuth();

        expect(response.status())
            .toBe(HTTP_STATUS.UNAUTHORIZED);

    });

    test('TC09 Unauthorized Get Asset Models @read @assets @regression', async ({
        assetClient
    }) => {

        const response =
            await assetClient.getAssetModelsWithoutAuth();

        expect(response.status())
            .toBe(HTTP_STATUS.UNAUTHORIZED);

    });



});

test.describe('Asset Management APIs', () => {

    test('TC10 Create Asset @create @crud @assets @regression @smoke @sanity', async ({
        assetClient
    }) => {

        const payload = {
            ...assetData.asset,
            assetId: `AUTO_${Date.now()}`,
            type: process.env.TEST_ASSET_TYPE_ID,
            model: process.env.TEST_ASSET_MODEL_ID
        };

        const response =
            await assetClient.createAsset(payload);

        expect(response.status())
            .toBe(HTTP_STATUS.CREATED);

    });

    test('TC11 Create Asset Duplicate AssetId @create @crud @assets @regression', async ({
        assetClient
    }) => {

        const payload = {
            ...assetData.asset,
            assetId: 'As1',
            type: process.env.TEST_ASSET_TYPE_ID,
            model: process.env.TEST_ASSET_MODEL_ID
        };

        const response =
            await assetClient.createAsset(payload);

        expect(response.status())
            .toBe(HTTP_STATUS.BAD_REQUEST);

    });

    test('TC12 Create Asset Missing Mandatory Fields @create @crud @assets @regression', async ({
        assetClient
    }) => {

        const response =
            await assetClient.createAsset({});

        expect([400, 500])
            .toContain(response.status());

    });

    test('TC13 Update Asset @update @crud @assets @regression', async ({
        assetClient
    }) => {

        const response =
            await assetClient.updateAsset(
                process.env.TEST_ASSET_ID,
                {
                    ...assetData.asset,
                    assetId: 'As1',
                    type: process.env.TEST_ASSET_TYPE_ID,
                    model: process.env.TEST_ASSET_MODEL_ID,
                    description: 'Updated Asset',
                    dateOfPurchase: '2023-06-01',
                    notInUse: false
                }
            );

        expect(response.status())
            .toBe(HTTP_STATUS.OK);

    });

    test('TC14 Update Invalid Asset Id @update @crud @assets @regression', async ({
        assetClient
    }) => {

        const response =
            await assetClient.updateAsset(
                'INVALID_ID',
                {
                    description: 'Updated Asset'
                }
            );

        expect([400, 500])
            .toContain(response.status());

    });



    test('TC15 Update Asset Duplicate AssetId @update @crud @assets @regression', async ({
        assetClient
    }) => {

        const response =
            await assetClient.updateAsset(
                process.env.TEST_ASSET_ID,
                {
                    assetId: 'As1'
                }
            );

        expect([200, 400])
            .toContain(response.status());

    });

    test('TC16 Create Asset Invalid TypeId @create @crud @assets @regression', async ({
        assetClient
    }) => {

        const payload = {
            ...assetData.asset,
            assetId: `AUTO_${Date.now()}`,
            type: assetData.invalid.invalidTypeId,
            model: process.env.TEST_ASSET_MODEL_ID
        };

        const response =
            await assetClient.createAsset(payload);

        expect([400, 404])
            .toContain(response.status());

    });

    test('TC17 Create Asset Invalid ModelId @create @crud @assets @regression', async ({
        assetClient
    }) => {

        const payload = {
            ...assetData.asset,
            assetId: `AUTO_${Date.now()}`,
            type: process.env.TEST_ASSET_TYPE_ID,
            model: assetData.invalid.invalidModelId
        };

        const response =
            await assetClient.createAsset(payload);

        expect([400, 404])
            .toContain(response.status());

    });

    test('TC18 Create Asset Without Authorization @create @crud @assets @regression', async ({
        assetClient
    }) => {

        const payload = {
            ...assetData.asset,
            assetId: `AUTO_${Date.now()}`,
            type: process.env.TEST_ASSET_TYPE_ID,
            model: process.env.TEST_ASSET_MODEL_ID
        };

        const response =
            await assetClient.createAssetWithoutAuth(payload);

        expect(response.status())
            .toBe(HTTP_STATUS.UNAUTHORIZED);

    });



    test('TC19 Create Asset Response Schema @create @crud @assets @regression', async ({
        assetClient
    }) => {

        const payload = {
            ...assetData.asset,
            assetId: `AUTO_${Date.now()}`,
            type: process.env.TEST_ASSET_TYPE_ID,
            model: process.env.TEST_ASSET_MODEL_ID
        };

        const response =
            await assetClient.createAsset(payload);

        expect(response.status())
            .toBe(HTTP_STATUS.CREATED);

        const body =
            await response.json();

        expect(body.data)
            .toHaveProperty('_id');

        expect(body.data)
            .toHaveProperty('assetId');

        expect(body.data)
            .toHaveProperty('description');

    });

    test('TC20 Update Asset Without Authorization @update @crud @assets @regression', async ({
        assetClient
    }) => {

        const response =
            await assetClient.updateAssetWithoutAuth(
                process.env.TEST_ASSET_ID,
                {
                    description: 'Updated Asset'
                }
            );

        expect(response.status())
            .toBe(HTTP_STATUS.UNAUTHORIZED);

    });



    test('TC21 Update Asset Response Schema @update @crud @assets @regression', async ({
        assetClient
    }) => {

        const response =
            await assetClient.updateAsset(
                process.env.TEST_ASSET_ID,
                {
                    description: 'Schema Validation'
                }
            );

        expect(response.status())
            .toBe(HTTP_STATUS.OK);

        const body =
            await response.json();

        expect(body)
            .toHaveProperty('_id');

        expect(body)
            .toHaveProperty('assetId');

        expect(body)
            .toHaveProperty('description');

    });

});

test.describe('Asset Type And Model APIs', () => {

    test('TC22 Create Asset Type @create @crud @assets @regression', async ({
        assetClient
    }) => {

        const response =
            await assetClient.createAssetType({
                type: `Type_${Date.now()}`
            });

        expect(response.status())
            .toBe(HTTP_STATUS.CREATED);

    });

    test('TC23 Create Asset Type With Spaces @create @crud @assets @regression', async ({
        assetClient
    }) => {

        const response =
            await assetClient.createAssetType({
                type: `   Type_${Date.now()}   `
            });

        expect(response.status())
            .toBe(HTTP_STATUS.CREATED);

    });

    test('TC24 Create Duplicate Asset Type @create @crud @assets @regression', async ({
        assetClient
    }) => {

        const response =
            await assetClient.createAssetType({
                type: 'laptop'
            });

        expect(response.status())
            .toBe(HTTP_STATUS.CONFLICT);

    });

    test('TC25 Create Asset Type Without Auth @create @crud @assets @regression', async ({
        assetClient
    }) => {

        const response =
            await assetClient.createAssetTypeWithoutAuth({
                type: 'TestType'
            });

        expect(response.status())
            .toBe(HTTP_STATUS.UNAUTHORIZED);

    });

    test('TC26 Create Asset Model @create @crud @assets @regression', async ({
        assetClient
    }) => {

        const response =
            await assetClient.createAssetModel({
                model: `Model_${Date.now()}`
            });

        expect(response.status())
            .toBe(HTTP_STATUS.CREATED);

    });

    test('TC27 Create Asset Model With Spaces @create @crud @assets @regression', async ({
        assetClient
    }) => {

        const response =
            await assetClient.createAssetModel({
                model: `   Model_${Date.now()}   `
            });

        expect(response.status())
            .toBe(HTTP_STATUS.CREATED);

    });

    test('TC28 Create Duplicate Asset Model @create @crud @assets @regression', async ({
        assetClient
    }) => {

        const response =
            await assetClient.createAssetModel({
                model: 'dell'
            });

        expect(response.status())
            .toBe(HTTP_STATUS.CONFLICT);

    });

    test('TC29 Create Asset Model Without Auth @create @crud @assets @regression', async ({
        assetClient
    }) => {

        const response =
            await assetClient.createAssetModelWithoutAuth({
                model: 'TestModel'
            });

        expect(response.status())
            .toBe(HTTP_STATUS.UNAUTHORIZED);

    });

});


// Empty-data scenarios moved from tests/empty/empty-data.asset.api.spec.js
test.describe('Empty Asset Data Scenarios', () => {

    test('TC_EMPTY_001 Get assets from empty database @emptydata @read @regression @smoke @sanity', async ({
        assetClient
    }) => {

        const response =
            await assetClient.getAssets();

        expect(response.status())
            .toBe(HTTP_STATUS.OK);

        const body =
            await response.json();

        expect(body)
            .toEqual([]);

    });

    test('TC_EMPTY_002 Get asset types from empty database @emptydata @read @regression @sanity', async ({
        assetClient
    }) => {

        const response =
            await assetClient.getAssetTypes();

        expect(response.status())
            .toBe(HTTP_STATUS.OK);

        const body =
            await response.json();

        expect(body)
            .toEqual([]);

    });

    test('TC_EMPTY_003 Get asset models from empty database @emptydata @read @regression @sanity', async ({
        assetClient
    }) => {

        const response =
            await assetClient.getAssetModels();

        expect(response.status())
            .toBe(HTTP_STATUS.OK);

        const body =
            await response.json();

        expect(body)
            .toEqual([]);

    });

    test('TC_EMPTY_004 Create asset without assetId @emptydata @create @crud @regression @smoke @sanity', async ({
        assetClient
    }) => {

        const payload = {
            type: process.env.TEST_ASSET_TYPE_ID,
            model: process.env.TEST_ASSET_MODEL_ID,
            description: 'Playwright Test Asset',
            dateOfPurchase: '2023-06-01',
            notInUse: false
        };

        const response =
            await assetClient.createAsset(payload);

        expect(response.status())
            .toBe(HTTP_STATUS.BAD_REQUEST);

    });

    test('TC_EMPTY_005 Create asset without type @emptydata @create @crud @regression', async ({
        assetClient
    }) => {

        const payload = {
            assetId: `AUTO_${Date.now()}`,
            model: process.env.TEST_ASSET_MODEL_ID,
            description: 'Playwright Test Asset',
            dateOfPurchase: '2023-06-01',
            notInUse: false
        };

        const response =
            await assetClient.createAsset(payload);

        expect(response.status())
            .toBe(HTTP_STATUS.BAD_REQUEST);

    });

    test('TC_EMPTY_006 Create asset without model @emptydata @create @crud @regression', async ({
        assetClient
    }) => {

        const payload = {
            assetId: `AUTO_${Date.now()}`,
            type: process.env.TEST_ASSET_TYPE_ID,
            description: 'Playwright Test Asset',
            dateOfPurchase: '2023-06-01',
            notInUse: false
        };

        const response =
            await assetClient.createAsset(payload);

        expect(response.status())
            .toBe(HTTP_STATUS.BAD_REQUEST);

    });

    test('TC_EMPTY_007 Create asset without description @emptydata @create @crud @regression', async ({
        assetClient
    }) => {

        const payload = {
            assetId: `AUTO_${Date.now()}`,
            type: process.env.TEST_ASSET_TYPE_ID,
            model: process.env.TEST_ASSET_MODEL_ID,
            dateOfPurchase: '2023-06-01',
            notInUse: false
        };

        const response =
            await assetClient.createAsset(payload);

        expect(response.status())
            .toBe(HTTP_STATUS.CREATED);

    });

    test('TC_EMPTY_008 Create asset without dateOfPurchase @emptydata @create @crud @regression', async ({
        assetClient
    }) => {

        const payload = {
            assetId: `AUTO_${Date.now()}`,
            type: process.env.TEST_ASSET_TYPE_ID,
            model: process.env.TEST_ASSET_MODEL_ID,
            description: 'Playwright Test Asset',
            notInUse: false
        };

        const response =
            await assetClient.createAsset(payload);

        expect(response.status())
            .toBe(HTTP_STATUS.BAD_REQUEST);

    });

    test('TC_EMPTY_009 Create asset with empty request body @emptydata @create @crud @regression', async ({
        assetClient
    }) => {

        const response =
            await assetClient.createAsset({});

        expect(response.status())
            .toBe(HTTP_STATUS.BAD_REQUEST);

    });

    test('TC_EMPTY_010 Update asset with empty request body @emptydata @update @crud @regression', async ({
        assetClient
    }) => {

        const response =
            await assetClient.updateAsset('', {});

        expect(response.status())
            .toBe(HTTP_STATUS.BAD_REQUEST);

    });

    test('TC_EMPTY_011 Create asset type without type @emptydata @create @crud @regression', async ({
        assetClient
    }) => {

        const response =
            await assetClient.createAssetType({});

        expect(response.status())
            .toBe(HTTP_STATUS.BAD_REQUEST);

    });

    test('TC_EMPTY_012 Create asset type with empty request body @emptydata @create @crud @regression', async ({
        assetClient
    }) => {

        const response =
            await assetClient.createAssetType({});

        expect(response.status())
            .toBe(HTTP_STATUS.BAD_REQUEST);

    });

    test('TC_EMPTY_013 Create asset model without model @emptydata @create @crud @regression', async ({
        assetClient
    }) => {

        const response =
            await assetClient.createAssetModel({});

        expect(response.status())
            .toBe(HTTP_STATUS.BAD_REQUEST);

    });

    test('TC_EMPTY_014 Create asset model with empty request body @emptydata @create @crud @regression', async ({
        assetClient
    }) => {

        const response =
            await assetClient.createAssetModel({});

        expect(response.status())
            .toBe(HTTP_STATUS.BAD_REQUEST);

    });

});
