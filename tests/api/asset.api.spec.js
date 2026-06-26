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

        expect(
            Array.isArray(body)
        ).toBeTruthy();

    }
    );

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

    }
    );

    test('TC_ASSET_003 Get Asset Types', async ({
        assetClient
    }) => {

        const response =
            await assetClient.getAssetTypes();

        expect(response.status())
            .toBe(HTTP_STATUS.OK);

    }
    );

    test('TC_ASSET_004 Verify Asset Types Response Schema', async ({
        assetClient
    }) => {

        const response =
            await assetClient.getAssetTypes();

        const body =
            await response.json();

        if (body.length > 0) {

            expect(body[0])
                .toHaveProperty('_id');

            expect(body[0])
                .toHaveProperty('type');

        }

    }
    );

    test('TC_ASSET_005 Get Asset Models', async ({
        assetClient
    }) => {

        const response =
            await assetClient.getAssetModels();

        expect(response.status())
            .toBe(HTTP_STATUS.OK);

    }
    );

    test('TC_ASSET_006 Verify Asset Models Response Schema', async ({
        assetClient
    }) => {

        const response =
            await assetClient.getAssetModels();

        const body =
            await response.json();

        if (body.length > 0) {

            expect(body[0])
                .toHaveProperty('_id');

            expect(body[0])
                .toHaveProperty('model');

        }

    }
    );

    test('TC_ASSET_007 Unauthorized Get Assets', async ({
        assetClient
    }) => {

        const response =
            await assetClient
                .getAssetsWithoutAuth();

        expect(response.status())
            .toBe(401);

    }
    );

    test('TC_ASSET_008 Unauthorized Get Asset Types', async ({
        assetClient
    }) => {

        const response =
            await assetClient
                .getAssetTypesWithoutAuth();

        expect(response.status())
            .toBe(401);

    }
    );

    test('TC_ASSET_009 Unauthorized Get Asset Models', async ({
        assetClient
    }) => {

        const response =
            await assetClient
                .getAssetModelsWithoutAuth();

        expect(response.status())
            .toBe(401);

    }
    );

}
);

test.describe('Asset Management APIs', () => {

    test('TC_ASSET_010 Create Asset', async ({
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
    test('TC_ASSET_011 Create Asset Duplicate AssetId', async ({
        assetClient
    }) => {

        const payload = {
            ...assetData.asset,
            assetId: 'As1',
            type: process.env.TEST_ASSET_TYPE_ID,
            model: process.env.TEST_ASSET_MODEL_ID
        };

        const response =
            await assetClient.createAsset(
                payload
            );

        expect(response.status())
            .toBe(
                HTTP_STATUS.BAD_REQUEST
            );
    }
    );

    test('TC_ASSET_012 Create Asset Missing Mandatory Fields', async ({
        assetClient
    }) => {

        const response =
            await assetClient.createAsset(
                {}
            );

        expect([400, 500]).toContain(response.status());
    }
    );

    test('TC_ASSET_013 Update Asset', async ({
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
            .toBe(
                HTTP_STATUS.OK
            );
    }
    );

    test('TC_ASSET_014 Update Invalid Asset Id', async ({
        assetClient
    }) => {

        const response =
            await assetClient.updateAsset(
                'INVALID_ID',
                {
                    description:
                        'Updated Asset'
                }
            );

        expect([400, 500]).toContain(response.status());
    }
    );

    test('TC_ASSET_015 Update Non Existing Asset', async ({
        assetClient
    }) => {

        const response =
            await assetClient.updateAsset(
                '66a111111111111111111111',
                {
                    description:
                        'Updated Asset'
                }
            );

        expect(response.status())
            .toBe(HTTP_STATUS.NOT_FOUND);
    }
    );

    test('TC_ASSET_016 Update Asset Duplicate AssetId', async ({
        assetClient
    }) => {

        const response =
            await assetClient.updateAsset(
                process.env.TEST_ASSET_ID,
                {
                    assetId: 'As1'
                }
            );

        expect([200, 400]).toContain(response.status());

    }
    );
}
);

test.describe('Asset Type And Model APIs', () => {
    test('TC_ASSET_017 Create Asset Type', async ({
        assetClient
    }) => {

        const response =
            await assetClient.createAssetType({
                type: `Type_${Date.now()}`
            });

        expect(response.status())
            .toBe(HTTP_STATUS.CREATED);

    });

    test('TC_ASSET_018 Create Asset Type With Spaces', async ({
        assetClient
    }) => {

        const response =
            await assetClient.createAssetType({
                type: `   Type_${Date.now()}   `
            });

        expect(response.status())
            .toBe(HTTP_STATUS.CREATED);

    });

    test('TC_ASSET_019 Create Duplicate Asset Type', async ({
        assetClient
    }) => {

        const response =
            await assetClient.createAssetType({
                type: 'laptop'
            });

        expect(response.status())
            .toBe(HTTP_STATUS.CONFLICT);

    });

    test('TC_ASSET_020 Create Asset Type Missing Field', async ({
        assetClient
    }) => {

        const response =
            await assetClient.createAssetType({});

        expect([400, 500])
            .toContain(response.status());

    });
    test('TC_ASSET_021 Create Asset Type Without Auth', async ({
        assetClient
    }) => {

        const response =
            await assetClient.createAssetTypeWithoutAuth({
                type: 'TestType'
            });

        expect(response.status())
            .toBe(HTTP_STATUS.UNAUTHORIZED);

    });

    test('TC_ASSET_022 Create Asset Model', async ({
        assetClient
    }) => {

        const response =
            await assetClient.createAssetModel({
                model: `Model_${Date.now()}`
            });

        expect(response.status())
            .toBe(HTTP_STATUS.CREATED);

    });

    test('TC_ASSET_023 Create Asset Model With Spaces', async ({
        assetClient
    }) => {

        const response =
            await assetClient.createAssetModel({
                model: `   Model_${Date.now()}   `
            });

        expect(response.status())
            .toBe(HTTP_STATUS.CREATED);

    });

    test('TC_ASSET_024 Create Duplicate Asset Model', async ({
        assetClient
    }) => {

        const response =
            await assetClient.createAssetModel({
                model: 'dell'
            });

        expect(response.status())
            .toBe(HTTP_STATUS.CONFLICT);

    });

    test('TC_ASSET_025 Create Asset Model Missing Field', async ({
        assetClient
    }) => {

        const response =
            await assetClient.createAssetModel({});

        expect([400, 500])
            .toContain(response.status());

    });
    test('TC_ASSET_026 Create Asset Model Without Auth', async ({
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