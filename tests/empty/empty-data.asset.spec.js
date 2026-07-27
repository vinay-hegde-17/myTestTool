const { test, expect } = require('../../fixtures/asset.fixture');
const { HTTP_STATUS } = require('../../api/constants/asset.constants');

test.describe('Empty Asset Data Scenarios', () => {

    test('TC_EMPTY_001 Get assets from empty database @emptydata', async ({
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

    test('TC_EMPTY_002 Get asset types from empty database @emptydata', async ({
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

    test('TC_EMPTY_003 Get asset models from empty database @emptydata', async ({
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

    test('TC_EMPTY_004 Create asset without assetId @emptydata', async ({
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

    test('TC_EMPTY_005 Create asset without type @emptydata', async ({
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

    test('TC_EMPTY_006 Create asset without model @emptydata', async ({
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

    test('TC_EMPTY_007 Create asset without description @emptydata', async ({
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

    test('TC_EMPTY_008 Create asset without dateOfPurchase @emptydata', async ({
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

    test('TC_EMPTY_009 Create asset with empty request body @emptydata', async ({
        assetClient
    }) => {

        const response =
            await assetClient.createAsset({});

        expect(response.status())
            .toBe(HTTP_STATUS.BAD_REQUEST);

    });

    test('TC_EMPTY_010 Update asset with empty request body @emptydata', async ({
        assetClient
    }) => {

        const response =
            await assetClient.updateAsset('', {});

        expect(response.status())
            .toBe(HTTP_STATUS.BAD_REQUEST);

    });

    test('TC_EMPTY_011 Create asset type without type @emptydata', async ({
        assetClient
    }) => {

        const response =
            await assetClient.createAssetType({});

        expect(response.status())
            .toBe(HTTP_STATUS.BAD_REQUEST);

    });

    test('TC_EMPTY_012 Create asset type with empty request body @emptydata', async ({
        assetClient
    }) => {

        const response =
            await assetClient.createAssetType({});

        expect(response.status())
            .toBe(HTTP_STATUS.BAD_REQUEST);

    });

    test('TC_EMPTY_013 Create asset model without model @emptydata', async ({
        assetClient
    }) => {

        const response =
            await assetClient.createAssetModel({});

        expect(response.status())
            .toBe(HTTP_STATUS.BAD_REQUEST);

    });

    test('TC_EMPTY_014 Create asset model with empty request body @emptydata', async ({
        assetClient
    }) => {

        const response =
            await assetClient.createAssetModel({});

        expect(response.status())
            .toBe(HTTP_STATUS.BAD_REQUEST);

    });

});