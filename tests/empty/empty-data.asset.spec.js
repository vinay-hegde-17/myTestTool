const { test, expect } = require('../../fixtures/asset.fixture');
const { HTTP_STATUS } = require('../../api/constants/asset.constants');
const { loadResolvedJson } = require('../../utils/testData.util');
const assetData = loadResolvedJson('../../test-data/asset.json');

const resolvedAssetTypeId = assetData.testData.assetTypeId || '';
const resolvedAssetModelId = assetData.testData.assetModelId || '';

test.describe('Asset Module - Empty Data Validation', () => {
    test.describe('Read Operations', () => {
        test('TC_EMPTY_001 Get assets from empty database @emptydata @smoke @read', async ({ assetClient }) => {
            const response = await assetClient.getAssets();
            expect(response.status()).toBe(HTTP_STATUS.OK);

            const body = await response.json();
            expect(body).toEqual([]);
        });

        test('TC_EMPTY_002 Get asset types from empty database @emptydata @sanity @read', async ({ assetClient }) => {
            const response = await assetClient.getAssetTypes();
            expect(response.status()).toBe(HTTP_STATUS.OK);

            const body = await response.json();
            expect(body).toEqual([]);
        });

        test('TC_EMPTY_003 Get asset models from empty database @emptydata @sanity @read', async ({ assetClient }) => {
            const response = await assetClient.getAssetModels();
            expect(response.status()).toBe(HTTP_STATUS.OK);

            const body = await response.json();
            expect(body).toEqual([]);
        });
    });

    test.describe('Create Operations', () => {
        test('TC_EMPTY_004 Create asset without assetId @emptydata @sanity @create', async ({ assetClient }) => {
            const payload = {
                type: resolvedAssetTypeId,
                model: resolvedAssetModelId,
                description: 'Playwright Test Asset',
                dateOfPurchase: '2023-06-01',
                notInUse: false
            };

            const response = await assetClient.createAsset(payload);
            expect(response.status()).toBe(HTTP_STATUS.BAD_REQUEST);
        });

        test('TC_EMPTY_005 Create asset without type @emptydata @regression @create', async ({ assetClient }) => {
            const payload = {
                assetId: `AUTO_${Date.now()}`,
                model: resolvedAssetModelId,
                description: 'Playwright Test Asset',
                dateOfPurchase: '2023-06-01',
                notInUse: false
            };

            const response = await assetClient.createAsset(payload);
            expect(response.status()).toBe(HTTP_STATUS.BAD_REQUEST);
        });

        test('TC_EMPTY_006 Create asset without model @emptydata @regression @create', async ({ assetClient }) => {
            const payload = {
                assetId: `AUTO_${Date.now()}`,
                type: resolvedAssetTypeId,
                description: 'Playwright Test Asset',
                dateOfPurchase: '2023-06-01',
                notInUse: false
            };

            const response = await assetClient.createAsset(payload);
            expect(response.status()).toBe(HTTP_STATUS.BAD_REQUEST);
        });

        test('TC_EMPTY_007 Create asset without description @emptydata @regression @create', async ({ assetClient }) => {
            const payload = {
                assetId: `AUTO_${Date.now()}`,
                type: resolvedAssetTypeId,
                model: resolvedAssetModelId,
                dateOfPurchase: '2023-06-01',
                notInUse: false
            };

            const response = await assetClient.createAsset(payload);
            expect(response.status()).toBe(HTTP_STATUS.CREATED);
        });

        test('TC_EMPTY_008 Create asset without dateOfPurchase @emptydata @regression @create', async ({ assetClient }) => {
            const payload = {
                assetId: `AUTO_${Date.now()}`,
                type: resolvedAssetTypeId,
                model: resolvedAssetModelId,
                description: 'Playwright Test Asset',
                notInUse: false
            };

            const response = await assetClient.createAsset(payload);
            expect(response.status()).toBe(HTTP_STATUS.BAD_REQUEST);
        });

        test('TC_EMPTY_009 Create asset with empty request body @emptydata @regression @create', async ({ assetClient }) => {
            const response = await assetClient.createAsset({});
            expect(response.status()).toBe(HTTP_STATUS.BAD_REQUEST);
        });

        test('TC_EMPTY_010 Update asset with empty request body @emptydata @regression @update', async ({ assetClient }) => {
            const response = await assetClient.updateAsset('', {});
            expect(response.status()).toBe(HTTP_STATUS.BAD_REQUEST);
        });

        test('TC_EMPTY_011 Create asset type without type @emptydata @sanity @create', async ({ assetClient }) => {
            const response = await assetClient.createAssetType({});
            expect(response.status()).toBe(HTTP_STATUS.BAD_REQUEST);
        });

        test('TC_EMPTY_012 Create asset type with empty request body @emptydata @regression @create', async ({ assetClient }) => {
            const response = await assetClient.createAssetType({});
            expect(response.status()).toBe(HTTP_STATUS.BAD_REQUEST);
        });

        test('TC_EMPTY_013 Create asset model without model @emptydata @sanity @create', async ({ assetClient }) => {
            const response = await assetClient.createAssetModel({});
            expect(response.status()).toBe(HTTP_STATUS.BAD_REQUEST);
        });

        test('TC_EMPTY_014 Create asset model with empty request body @emptydata @regression @create', async ({ assetClient }) => {
            const response = await assetClient.createAssetModel({});
            expect(response.status()).toBe(HTTP_STATUS.BAD_REQUEST);
        });
    });
});