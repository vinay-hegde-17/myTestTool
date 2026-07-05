const { test, expect } = require('../../fixtures/asset.fixture');
const { HTTP_STATUS } = require('../../api/constants/asset.constants');

test.describe('Empty Asset Data Scenarios', () => {

    test('TC_EMPTY_001 Get Assets Empty @emptydata',
        async ({ assetClient }) => {

            const response =
                await assetClient.getAssets();

            expect(response.status())
                .toBe(HTTP_STATUS.OK);

            const body =
                await response.json();

            expect(body)
                .toEqual([]);

        });

    test('TC_EMPTY_002 Get Asset Types Empty @emptydata',
        async ({ assetClient }) => {

            const response =
                await assetClient.getAssetTypes();

            expect(response.status())
                .toBe(HTTP_STATUS.OK);

            const body =
                await response.json();

            expect(body)
                .toEqual([]);

        });

    test('TC_EMPTY_003 Get Asset Models Empty @emptydata',
        async ({ assetClient }) => {

            const response =
                await assetClient.getAssetModels();

            expect(response.status())
                .toBe(HTTP_STATUS.OK);

            const body =
                await response.json();

            expect(body)
                .toEqual([]);

        });

    test('TC_EMPTY_004 Create Asset Without AssetId @emptydata', async ({
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

    test('TC_EMPTY_005 Create Asset Without Type @emptydata', async ({
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

    test('TC_EMPTY_006 Create Asset Without Model @emptydata', async ({
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

    test('TC_EMPTY_007 Create Asset Without Description @emptydata', async ({
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

    test('TC_EMPTY_008 Create Asset Without Date Of Purchase @emptydata', async ({
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

});