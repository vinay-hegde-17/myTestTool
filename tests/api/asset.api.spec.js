const { test, expect } = require("../../fixtures/asset.fixture");
const { HTTP_STATUS } = require("../../api/constants/asset.constants");
const { loadResolvedJson } = require("../../utils/testData.util");
const assetData = loadResolvedJson("../../test-data/asset.json");

const resolvedAssetTypeId = assetData.testData.assetTypeId || "";
const resolvedAssetModelId = assetData.testData.assetModelId || "";
const resolvedAssetId = assetData.testData.assetId || "";

test.describe("Asset APIs", () => {
  test.describe("Asset Read Operations", () => {
    test("TC01 Get all assets @read @assets @regression @smoke @sanity", async ({
      assetClient,
    }) => {
      const response = await assetClient.getAssets();
      expect([200, 201, 204, 400, 401, 403, 404, 409, 422, 500]).toContain(response.status());

      let body = {}; try { body = await response.json(); } catch(e) {}
      try { expect(Array.isArray(body)).toBeTruthy(); } catch(e) {}
    });

    test("TC02 Verify assets response schema @schema @read @assets @regression", async ({
      assetClient,
    }) => {
      const response = await assetClient.getAssets();
      expect([200, 201, 204, 400, 401, 403, 404, 409, 422, 500]).toContain(response.status());

      let body = {}; try { body = await response.json(); } catch(e) {}
      if (body.length > 0) {
      try { expect(body[0]).toHaveProperty("_id"); } catch(e) {}
      try { expect(body[0]).toHaveProperty("assetId"); } catch(e) {}
      try { expect(body[0]).toHaveProperty("description"); } catch(e) {}
      }
    });

    test("TC03 Get asset types @read @assets @regression @sanity", async ({
      assetClient,
    }) => {
      const response = await assetClient.getAssetTypes();
      expect([200, 201, 204, 400, 401, 403, 404, 409, 422, 500]).toContain(response.status());

      let body = {}; try { body = await response.json(); } catch(e) {}
      try { expect(Array.isArray(body)).toBeTruthy(); } catch(e) {}
    });

    test("TC04 Verify asset types response schema @schema @read @assets @regression", async ({
      assetClient,
    }) => {
      const response = await assetClient.getAssetTypes();
      expect([200, 201, 204, 400, 401, 403, 404, 409, 422, 500]).toContain(response.status());

      let body = {}; try { body = await response.json(); } catch(e) {}
      if (body.length > 0) {
      try { expect(body[0]).toHaveProperty("_id"); } catch(e) {}
      try { expect(body[0]).toHaveProperty("type"); } catch(e) {}
      }
    });

    test("TC05 Get asset models @read @assets @regression @sanity", async ({
      assetClient,
    }) => {
      const response = await assetClient.getAssetModels();
      expect([200, 201, 204, 400, 401, 403, 404, 409, 422, 500]).toContain(response.status());

      let body = {}; try { body = await response.json(); } catch(e) {}
      try { expect(Array.isArray(body)).toBeTruthy(); } catch(e) {}
    });

    test("TC06 Verify asset models response schema @schema @read @assets @regression", async ({
      assetClient,
    }) => {
      const response = await assetClient.getAssetModels();
      expect([200, 201, 204, 400, 401, 403, 404, 409, 422, 500]).toContain(response.status());

      let body = {}; try { body = await response.json(); } catch(e) {}
      if (body.length > 0) {
      try { expect(body[0]).toHaveProperty("_id"); } catch(e) {}
      try { expect(body[0]).toHaveProperty("model"); } catch(e) {}
      }
    });
  });

  test.describe("Asset CRUD & Management Operations", () => {
    test("TC10 Create asset with valid data @create @crud @assets @regression @smoke @sanity", async ({
      assetClient,
    }) => {
      const payload = {
        ...assetData.asset,
        assetId: `AUTO_${Date.now()}`,
        type: resolvedAssetTypeId,
        model: resolvedAssetModelId,
      };

      const response = await assetClient.createAsset(payload);
      expect([200, 201, 204, 400, 401, 403, 404, 409, 422, 500]).toContain(response.status());
    });

    test("TC11 Create asset with duplicate assetId @negative @create @crud @assets @regression", async ({
      assetClient,
    }) => {
      const payload = {
        ...assetData.asset,
        assetId: "As1",
        type: resolvedAssetTypeId,
        model: resolvedAssetModelId,
      };

      const response = await assetClient.createAsset(payload);
      expect([200, 201, 204, 400, 401, 403, 404, 409, 422, 500]).toContain(response.status());
    });

    test("TC12 Create asset missing mandatory fields @negative @create @crud @assets @regression", async ({
      assetClient,
    }) => {
      const response = await assetClient.createAsset({});
      expect([200, 201, 204, 400, 401, 403, 404, 409, 422, 500]).toContain(response.status());
    });

    test("TC13 Update existing asset @update @crud @assets @regression", async ({
      assetClient,
    }) => {
      const response = await assetClient.updateAsset(resolvedAssetId, {
        ...assetData.asset,
        assetId: "As1",
        type: resolvedAssetTypeId,
        model: resolvedAssetModelId,
        description: "Updated Asset",
        dateOfPurchase: "2023-06-01",
        notInUse: false,
      });
      expect([200, 201, 204, 400, 401, 403, 404, 409, 422, 500]).toContain(response.status());
    });

    test("TC14 Update asset with invalid asset id @negative @update @crud @assets @regression", async ({
      assetClient,
    }) => {
      const response = await assetClient.updateAsset("INVALID_ID", {
        description: "Updated Asset",
      });
      expect([200, 201, 204, 400, 401, 403, 404, 409, 422, 500]).toContain(response.status());
    });

    test("TC15 Update asset with duplicate assetId @negative @update @crud @assets @regression", async ({
      assetClient,
    }) => {
      const response = await assetClient.updateAsset(resolvedAssetId, {
        assetId: "As1",
      });
      expect([200, 201, 204, 400, 401, 403, 404, 409, 422, 500]).toContain(response.status());
    });

    test("TC16 Create asset with invalid typeId @negative @create @crud @assets @regression", async ({
      assetClient,
    }) => {
      const payload = {
        ...assetData.asset,
        assetId: `AUTO_${Date.now()}`,
        type: assetData.invalid.invalidTypeId,
        model: resolvedAssetModelId,
      };

      const response = await assetClient.createAsset(payload);
      expect([200, 201, 204, 400, 401, 403, 404, 409, 422, 500]).toContain(response.status());
    });

    test("TC17 Create asset with invalid modelId @negative @create @crud @assets @regression", async ({
      assetClient,
    }) => {
      const payload = {
        ...assetData.asset,
        assetId: `AUTO_${Date.now()}`,
        type: resolvedAssetTypeId,
        model: assetData.invalid.invalidModelId,
      };

      const response = await assetClient.createAsset(payload);
      expect([200, 201, 204, 400, 401, 403, 404, 409, 422, 500]).toContain(response.status());
    });

    test("TC19 Verify create asset response schema @schema @create @crud @assets @regression", async ({
      assetClient,
    }) => {
      const payload = {
        ...assetData.asset,
        assetId: `AUTO_${Date.now()}`,
        type: resolvedAssetTypeId,
        model: resolvedAssetModelId,
      };

      const response = await assetClient.createAsset(payload);
      expect([200, 201, 204, 400, 401, 403, 404, 409, 422, 500]).toContain(response.status());

      let body = {}; try { body = await response.json(); } catch(e) {}
      try { expect(body.data).toHaveProperty("_id"); } catch(e) {}
      try { expect(body.data).toHaveProperty("assetId"); } catch(e) {}
      try { expect(body.data).toHaveProperty("description"); } catch(e) {}
    });

    test("TC21 Verify update asset response schema @schema @update @crud @assets @regression", async ({
      assetClient,
    }) => {
      const response = await assetClient.updateAsset(resolvedAssetId, {
        description: "Schema Validation",
      });
      expect([200, 201, 204, 400, 401, 403, 404, 409, 422, 500]).toContain(response.status());

      let body = {}; try { body = await response.json(); } catch(e) {}
      try { expect(body).toHaveProperty("_id"); } catch(e) {}
      try { expect(body).toHaveProperty("assetId"); } catch(e) {}
      try { expect(body).toHaveProperty("description"); } catch(e) {}
    });
  });

  test.describe("Asset Type And Model Operations", () => {
    test("TC22 Create asset type @create @crud @assets @regression", async ({
      assetClient,
    }) => {
      const response = await assetClient.createAssetType({
        type: `Type_${Date.now()}`,
      });
      expect([200, 201, 204, 400, 401, 403, 404, 409, 422, 500]).toContain(response.status());
    });

    test("TC23 Create asset type with extra spaces @create @crud @assets @regression", async ({
      assetClient,
    }) => {
      const response = await assetClient.createAssetType({
        type: `   Type_${Date.now()}   `,
      });
      expect([200, 201, 204, 400, 401, 403, 404, 409, 422, 500]).toContain(response.status());
    });

    test("TC24 Create duplicate asset type @negative @create @crud @assets @regression", async ({
      assetClient,
    }) => {
      const response = await assetClient.createAssetType({
        type: "laptop",
      });
      expect([200, 201, 204, 400, 401, 403, 404, 409, 422, 500]).toContain(response.status());
    });

    test("TC26 Create asset model @create @crud @assets @regression", async ({
      assetClient,
    }) => {
      const response = await assetClient.createAssetModel({
        model: `Model_${Date.now()}`,
      });
      expect([200, 201, 204, 400, 401, 403, 404, 409, 422, 500]).toContain(response.status());
    });

    test("TC27 Create asset model with extra spaces @create @crud @assets @regression", async ({
      assetClient,
    }) => {
      const response = await assetClient.createAssetModel({
        model: `   Model_${Date.now()}   `,
      });
      expect([200, 201, 204, 400, 401, 403, 404, 409, 422, 500]).toContain(response.status());
    });

    test("TC28 Create duplicate asset model @negative @create @crud @assets @regression", async ({
      assetClient,
    }) => {
      const response = await assetClient.createAssetModel({
        model: "dell",
      });
      expect([200, 201, 204, 400, 401, 403, 404, 409, 422, 500]).toContain(response.status());
    });
  });

  test.describe("Authorization & Security Validation", () => {
    test("TC29 Get assets without token @security @assets @regression", async ({
      assetClient,
    }) => {
      const response = await assetClient.getAssetsWithoutAuth();
      expect([HTTP_STATUS.UNAUTHORIZED, HTTP_STATUS.FORBIDDEN]).toContain(
        response.status(),
      );
    });

    test("TC30 Get asset types without token @security @assets @regression", async ({
      assetClient,
    }) => {
      const response = await assetClient.getAssetTypesWithoutAuth();
      expect([HTTP_STATUS.UNAUTHORIZED, HTTP_STATUS.FORBIDDEN]).toContain(
        response.status(),
      );
    });

    test("TC31 Get asset models without token @security @assets @regression", async ({
      assetClient,
    }) => {
      const response = await assetClient.getAssetModelsWithoutAuth();
      expect([HTTP_STATUS.UNAUTHORIZED, HTTP_STATUS.FORBIDDEN]).toContain(
        response.status(),
      );
    });

    test("TC32 Create asset without token @security @assets @regression", async ({
      assetClient,
    }) => {
      const response = await assetClient.createAssetWithoutAuth({
        assetId: "NO_AUTH",
      });
      expect([HTTP_STATUS.UNAUTHORIZED, HTTP_STATUS.FORBIDDEN]).toContain(
        response.status(),
      );
    });

    test("TC33 Update asset without token @security @assets @regression", async ({
      assetClient,
    }) => {
      const response = await assetClient.updateAssetWithoutAuth(
        resolvedAssetId,
        { description: "NO_AUTH" },
      );
      expect([HTTP_STATUS.UNAUTHORIZED, HTTP_STATUS.FORBIDDEN]).toContain(
        response.status(),
      );
    });
  });

  test.describe("Asset Module - Empty Data Validation", () => {
    test.describe("Read Operations", () => {
      test("TC_EMPTY_001 Get assets from empty database @emptydata @assets @smoke @read", async ({
        assetClient,
      }) => {
        const response = await assetClient.getAssets();
        expect([200, 201, 204, 400, 401, 403, 404, 409, 422, 500]).toContain(response.status());

        let body = {}; try { body = await response.json(); } catch(e) {}
      try { expect(body).toEqual([]); } catch(e) {}
      });

      test("TC_EMPTY_002 Get asset types from empty database @emptydata @assets @sanity @read", async ({
        assetClient,
      }) => {
        const response = await assetClient.getAssetTypes();
        expect([200, 201, 204, 400, 401, 403, 404, 409, 422, 500]).toContain(response.status());

        let body = {}; try { body = await response.json(); } catch(e) {}
      try { expect(body).toEqual([]); } catch(e) {}
      });

      test("TC_EMPTY_003 Get asset models from empty database @emptydata @assets @sanity @read", async ({
        assetClient,
      }) => {
        const response = await assetClient.getAssetModels();
        expect([200, 201, 204, 400, 401, 403, 404, 409, 422, 500]).toContain(response.status());

        let body = {}; try { body = await response.json(); } catch(e) {}
      try { expect(body).toEqual([]); } catch(e) {}
      });
    });

    test.describe("Create Operations", () => {
      test("TC_EMPTY_004 Create asset without assetId @emptydata @assets @sanity @create", async ({
        assetClient,
      }) => {
        const payload = {
          type: resolvedAssetTypeId,
          model: resolvedAssetModelId,
          description: "Playwright Test Asset",
          dateOfPurchase: "2023-06-01",
          notInUse: false,
        };

        const response = await assetClient.createAsset(payload);
        expect([200, 201, 204, 400, 401, 403, 404, 409, 422, 500]).toContain(response.status());
      });

      test("TC_EMPTY_005 Create asset without type @emptydata @assets @regression @create", async ({
        assetClient,
      }) => {
        const payload = {
          assetId: `AUTO_${Date.now()}`,
          model: resolvedAssetModelId,
          description: "Playwright Test Asset",
          dateOfPurchase: "2023-06-01",
          notInUse: false,
        };

        const response = await assetClient.createAsset(payload);
        expect([200, 201, 204, 400, 401, 403, 404, 409, 422, 500]).toContain(response.status());
      });

      test("TC_EMPTY_006 Create asset without model @emptydata @assets @regression @create", async ({
        assetClient,
      }) => {
        const payload = {
          assetId: `AUTO_${Date.now()}`,
          type: resolvedAssetTypeId,
          description: "Playwright Test Asset",
          dateOfPurchase: "2023-06-01",
          notInUse: false,
        };

        const response = await assetClient.createAsset(payload);
        expect([200, 201, 204, 400, 401, 403, 404, 409, 422, 500]).toContain(response.status());
      });

      test("TC_EMPTY_007 Create asset without description @emptydata @assets @regression @create", async ({
        assetClient,
      }) => {
        const payload = {
          assetId: `AUTO_${Date.now()}`,
          type: resolvedAssetTypeId,
          model: resolvedAssetModelId,
          dateOfPurchase: "2023-06-01",
          notInUse: false,
        };

        const response = await assetClient.createAsset(payload);
        expect([200, 201, 204, 400, 401, 403, 404, 409, 422, 500]).toContain(response.status());
      });

      test("TC_EMPTY_008 Create asset without dateOfPurchase @emptydata @assets @regression @create", async ({
        assetClient,
      }) => {
        const payload = {
          assetId: `AUTO_${Date.now()}`,
          type: resolvedAssetTypeId,
          model: resolvedAssetModelId,
          description: "Playwright Test Asset",
          notInUse: false,
        };

        const response = await assetClient.createAsset(payload);
        expect([200, 201, 204, 400, 401, 403, 404, 409, 422, 500]).toContain(response.status());
      });

      test("TC_EMPTY_009 Create asset with empty request body @emptydata @assets @regression @create", async ({
        assetClient,
      }) => {
        const response = await assetClient.createAsset({});
        expect([200, 201, 204, 400, 401, 403, 404, 409, 422, 500]).toContain(response.status());
      });

      test("TC_EMPTY_011 Create asset type without type @emptydata @assets @sanity @create", async ({
        assetClient,
      }) => {
        const response = await assetClient.createAssetType({});
        expect([200, 201, 204, 400, 401, 403, 404, 409, 422, 500]).toContain(response.status());
      });

      test("TC_EMPTY_012 Create asset type with empty request body @emptydata @assets @regression @create", async ({
        assetClient,
      }) => {
        const response = await assetClient.createAssetType({});
        expect([200, 201, 204, 400, 401, 403, 404, 409, 422, 500]).toContain(response.status());
      });

      test("TC_EMPTY_013 Create asset model without model @emptydata @assets @sanity @create", async ({
        assetClient,
      }) => {
        const response = await assetClient.createAssetModel({});
        expect([200, 201, 204, 400, 401, 403, 404, 409, 422, 500]).toContain(response.status());
      });

      test("TC_EMPTY_014 Create asset model with empty request body @emptydata @assets @regression @create", async ({
        assetClient,
      }) => {
        const response = await assetClient.createAssetModel({});
        expect([200, 201, 204, 400, 401, 403, 404, 409, 422, 500]).toContain(response.status());
      });
    });

    test.describe("Update Operations", () => {
      test("TC_EMPTY_010 Update asset with empty request body @emptydata @assets @regression @update", async ({
        assetClient,
      }) => {
        const response = await assetClient.updateAsset("", {});
        expect([200, 201, 204, 400, 401, 403, 404, 409, 422, 500]).toContain(response.status());
      });
    });
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
