const { test, expect } = require('../../fixtures/asset.fixture');
const { HTTP_STATUS } = require('../../api/constants/asset.constants');
const assetData = require('../../test-data/asset.json');

test.describe('Asset Read APIs', () => {

    test('TC_ASSET_001 Get All Assets', async ({
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

    test('TC_ASSET_002 Verify Assets Response Schema', async ({
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

    test('TC_ASSET_003 Get Asset Types', async ({
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

    test('TC_ASSET_004 Verify Asset Types Response Schema', async ({
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

    test('TC_ASSET_005 Get Asset Models', async ({
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

    test('TC_ASSET_006 Verify Asset Models Response Schema', async ({
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

    test('TC_ASSET_007 Unauthorized Get Assets', async ({
        assetClient
    }) => {

        const response =
            await assetClient.getAssetsWithoutAuth();

        expect(response.status())
            .toBe(HTTP_STATUS.UNAUTHORIZED);

    });

    test('TC_ASSET_008 Unauthorized Get Asset Types', async ({
        assetClient
    }) => {

        const response =
            await assetClient.getAssetTypesWithoutAuth();

        expect(response.status())
            .toBe(HTTP_STATUS.UNAUTHORIZED);

    });

    test('TC_ASSET_009 Unauthorized Get Asset Models', async ({
        assetClient
    }) => {

        const response =
            await assetClient.getAssetModelsWithoutAuth();

        expect(response.status())
            .toBe(HTTP_STATUS.UNAUTHORIZED);

    });

    test('TC_ASSET_010 Invalid Token Get Assets', async ({
        assetClient
    }) => {

        const response =
            await assetClient.getAssetsWithToken(
                assetData.invalid.invalidToken
            );

        expect(response.status())
            .toBe(HTTP_STATUS.UNAUTHORIZED);

    });

    test('TC_ASSET_011 Invalid Token Get Asset Types', async ({
        assetClient
    }) => {

        const response =
            await assetClient.getAssetTypesWithToken(
                assetData.invalid.invalidToken
            );

        expect(response.status())
            .toBe(HTTP_STATUS.UNAUTHORIZED);

    });

    test('TC_ASSET_012 Invalid Token Get Asset Models', async ({
        assetClient
    }) => {

        const response =
            await assetClient.getAssetModelsWithToken(
                assetData.invalid.invalidToken
            );

        expect(response.status())
            .toBe(HTTP_STATUS.UNAUTHORIZED);

    });

});

test.describe('Asset Management APIs', () => {

    test('TC_ASSET_013 Create Asset', async ({
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

    test('TC_ASSET_014 Create Asset Duplicate AssetId', async ({
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

    test('TC_ASSET_015 Create Asset Missing Mandatory Fields', async ({
        assetClient
    }) => {

        const response =
            await assetClient.createAsset({});

        expect([400, 500])
            .toContain(response.status());

    });

    test('TC_ASSET_016 Update Asset', async ({
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

    test('TC_ASSET_017 Update Invalid Asset Id', async ({
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

    test('TC_ASSET_018 Update Non Existing Asset', async ({
        assetClient
    }) => {

        const response =
            await assetClient.updateAsset(
                '66a111111111111111111111',
                {
                    description: 'Updated Asset'
                }
            );

        expect(response.status())
            .toBe(HTTP_STATUS.NOT_FOUND);

    });

    test('TC_ASSET_019 Update Asset Duplicate AssetId', async ({
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

    test('TC_ASSET_020 Create Asset Invalid TypeId', async ({
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

    test('TC_ASSET_021 Create Asset Invalid ModelId', async ({
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

    test('TC_ASSET_022 Create Asset Without Authorization', async ({
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

    test('TC_ASSET_023 Create Asset Invalid Token', async ({
        request
    }) => {

        const AssetClient =
            require('../../api/clients/asset.client');

        const client =
            new AssetClient(
                request,
                assetData.invalid.invalidToken
            );

        const payload = {
            ...assetData.asset,
            assetId: `AUTO_${Date.now()}`,
            type: process.env.TEST_ASSET_TYPE_ID,
            model: process.env.TEST_ASSET_MODEL_ID
        };

        const response =
            await client.createAsset(payload);

        expect(response.status())
            .toBe(HTTP_STATUS.UNAUTHORIZED);

    });

    test('TC_ASSET_024 Create Asset Response Schema', async ({
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

    test('TC_ASSET_025 Update Asset Without Authorization', async ({
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

    test('TC_ASSET_026 Update Asset Invalid Token', async ({
        request
    }) => {

        const AssetClient =
            require('../../api/clients/asset.client');

        const client =
            new AssetClient(
                request,
                assetData.invalid.invalidToken
            );

        const response =
            await client.updateAsset(
                process.env.TEST_ASSET_ID,
                {
                    description: 'Updated Asset'
                }
            );

        expect(response.status())
            .toBe(HTTP_STATUS.UNAUTHORIZED);

    });

    test('TC_ASSET_027 Update Asset Response Schema', async ({
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

    test('TC_ASSET_028 Create Asset Type', async ({
        assetClient
    }) => {

        const response =
            await assetClient.createAssetType({
                type: `Type_${Date.now()}`
            });

        expect(response.status())
            .toBe(HTTP_STATUS.CREATED);

    });

    test('TC_ASSET_029 Create Asset Type With Spaces', async ({
        assetClient
    }) => {

        const response =
            await assetClient.createAssetType({
                type: `   Type_${Date.now()}   `
            });

        expect(response.status())
            .toBe(HTTP_STATUS.CREATED);

    });

    test('TC_ASSET_030 Create Duplicate Asset Type', async ({
        assetClient
    }) => {

        const response =
            await assetClient.createAssetType({
                type: 'laptop'
            });

        expect(response.status())
            .toBe(HTTP_STATUS.CONFLICT);

    });

    test('TC_ASSET_031 Create Asset Type Missing Field', async ({
        assetClient
    }) => {

        const response =
            await assetClient.createAssetType({});

        expect([400, 500])
            .toContain(response.status());

    });

    test('TC_ASSET_032 Create Asset Type Without Auth', async ({
        assetClient
    }) => {

        const response =
            await assetClient.createAssetTypeWithoutAuth({
                type: 'TestType'
            });

        expect(response.status())
            .toBe(HTTP_STATUS.UNAUTHORIZED);

    });

    test('TC_ASSET_033 Create Asset Model', async ({
        assetClient
    }) => {

        const response =
            await assetClient.createAssetModel({
                model: `Model_${Date.now()}`
            });

        expect(response.status())
            .toBe(HTTP_STATUS.CREATED);

    });

    test('TC_ASSET_034 Create Asset Model With Spaces', async ({
        assetClient
    }) => {

        const response =
            await assetClient.createAssetModel({
                model: `   Model_${Date.now()}   `
            });

        expect(response.status())
            .toBe(HTTP_STATUS.CREATED);

    });

    test('TC_ASSET_035 Create Duplicate Asset Model', async ({
        assetClient
    }) => {

        const response =
            await assetClient.createAssetModel({
                model: 'dell'
            });

        expect(response.status())
            .toBe(HTTP_STATUS.CONFLICT);

    });

    test('TC_ASSET_036 Create Asset Model Missing Field', async ({
        assetClient
    }) => {

        const response =
            await assetClient.createAssetModel({});

        expect([400, 500])
            .toContain(response.status());

    });

    test('TC_ASSET_037 Create Asset Model Without Auth', async ({
        assetClient
    }) => {

        const response =
            await assetClient.createAssetModelWithoutAuth({
                model: 'TestModel'
            });

        expect(response.status())
            .toBe(HTTP_STATUS.UNAUTHORIZED);

    });

    test('TC_ASSET_038 Create Asset Type Invalid Token', async ({
        assetClient
    }) => {

        const response =
            await assetClient.createAssetTypeWithToken(
                {
                    type: `Type_${Date.now()}`
                },
                assetData.invalid.invalidToken
            );

        expect(response.status())
            .toBe(HTTP_STATUS.UNAUTHORIZED);

    });

    test('TC_ASSET_039 Create Asset Type Response Schema', async ({
        assetClient
    }) => {

        const response =
            await assetClient.createAssetType({
                type: `Type_${Date.now()}`
            });

        expect(response.status())
            .toBe(HTTP_STATUS.CREATED);

        const body = await response.json();

        expect(body)
            .toHaveProperty('message');

        expect(body)
            .toHaveProperty('savedAssetType');

        expect(body.savedAssetType)
            .toHaveProperty('_id');

        expect(body.savedAssetType)
            .toHaveProperty('type');

    });

    test('TC_ASSET_040 Create Asset Model Invalid Token', async ({
        assetClient
    }) => {

        const response =
            await assetClient.createAssetModelWithToken(
                {
                    model: `Model_${Date.now()}`
                },
                assetData.invalid.invalidToken
            );

        expect(response.status())
            .toBe(HTTP_STATUS.UNAUTHORIZED);

    });

    test('TC_ASSET_041 Create Asset Model Response Schema', async ({
        assetClient
    }) => {

        const response =
            await assetClient.createAssetModel({
                model: `Model_${Date.now()}`
            });

        expect(response.status())
            .toBe(HTTP_STATUS.CREATED);

        const body = await response.json();

        expect(body)
            .toHaveProperty('message');

        expect(body)
            .toHaveProperty('savedAssetModel');

        expect(body.savedAssetModel)
            .toHaveProperty('_id');

        expect(body.savedAssetModel)
            .toHaveProperty('model');

    });

});
