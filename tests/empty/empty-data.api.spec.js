//empty-data.api.spec.js
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

});