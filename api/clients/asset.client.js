const { ASSET_ENDPOINTS } = require('../constants/asset.constants');

class AssetClient {

    constructor(request, token = null) {
        this.request = request;
        this.token = token;
    }

    authHeaders() {
        return this.token
            ? { Authorization: `Bearer ${this.token}` }
            : {};
    }

    getAssets() {
        return this.request.get(
            ASSET_ENDPOINTS.GET_ASSETS,
            {
                headers: this.authHeaders()
            }
        );
    }

    getAssetTypes() {
        return this.request.get(
            ASSET_ENDPOINTS.GET_ASSET_TYPES,
            {
                headers: this.authHeaders()
            }
        );
    }

    getAssetModels() {
        return this.request.get(
            ASSET_ENDPOINTS.GET_ASSET_MODELS,
            {
                headers: this.authHeaders()
            }
        );
    }

    getAssetsWithoutAuth() {
        return this.request.get(
            ASSET_ENDPOINTS.GET_ASSETS
        );
    }

    getAssetTypesWithoutAuth() {
        return this.request.get(
            ASSET_ENDPOINTS.GET_ASSET_TYPES
        );
    }

    getAssetModelsWithoutAuth() {
        return this.request.get(
            ASSET_ENDPOINTS.GET_ASSET_MODELS
        );
    }

    createAsset(payload) {
        return this.request.post(
            ASSET_ENDPOINTS.CREATE_ASSET,
            {
                headers: {
                    ...this.authHeaders(),
                    'Content-Type': 'application/json'
                },
                data: payload
            }
        );
    }

    updateAsset(assetId, payload) {
        return this.request.put(
            `${ASSET_ENDPOINTS.UPDATE_ASSET}/${assetId}`,
            {
                headers: {
                    ...this.authHeaders(),
                    'Content-Type': 'application/json'
                },
                data: payload
            }
        );
    }

    createAssetType(payload) {
        return this.request.post(
            ASSET_ENDPOINTS.CREATE_ASSET_TYPE,
            {
                headers: {
                    ...this.authHeaders(),
                    'Content-Type': 'application/json'
                },
                data: payload
            }
        );
    }

    createAssetModel(payload) {
        return this.request.post(
            ASSET_ENDPOINTS.CREATE_ASSET_MODEL,
            {
                headers: {
                    ...this.authHeaders(),
                    'Content-Type': 'application/json'
                },
                data: payload
            }
        );
    }

    createAssetTypeWithoutAuth(payload) {

        return this.request.post(
            ASSET_ENDPOINTS.CREATE_ASSET_TYPE,
            {
                data: payload
            }
        );

    }

    createAssetModelWithoutAuth(payload) {

        return this.request.post(
            ASSET_ENDPOINTS.CREATE_ASSET_MODEL,
            {
                data: payload
            }
        );

    }

    createAssetWithoutAuth(payload) {

        return this.request.post(
            ASSET_ENDPOINTS.CREATE_ASSET,
            {
                data: payload
            }
        );

    }

    updateAssetWithoutAuth(assetId, payload) {

        return this.request.put(
            `${ASSET_ENDPOINTS.UPDATE_ASSET}/${assetId}`,
            {
                data: payload
            }
        );

    }

    getAssetsWithToken(token) {

        return this.request.get(
            ASSET_ENDPOINTS.GET_ASSETS,
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

    }

    getAssetTypesWithToken(token) {

        return this.request.get(
            ASSET_ENDPOINTS.GET_ASSET_TYPES,
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

    }

    getAssetModelsWithToken(token) {

        return this.request.get(
            ASSET_ENDPOINTS.GET_ASSET_MODELS,
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

    }

    createAssetWithToken(payload, token) {

        return this.request.post(
            ASSET_ENDPOINTS.CREATE_ASSET,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                data: payload
            }
        );
    }

    updateAssetWithToken(assetId, payload, token) {

        return this.request.put(
            `${ASSET_ENDPOINTS.UPDATE_ASSET}/${assetId}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                data: payload
            }
        );

    }

    createAssetTypeWithToken(payload, token) {

        return this.request.post(
            ASSET_ENDPOINTS.CREATE_ASSET_TYPE,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                data: payload
            }
        );

    }

    createAssetModelWithToken(payload, token) {

        return this.request.post(
            ASSET_ENDPOINTS.CREATE_ASSET_MODEL,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                data: payload
            }
        );

    }
}

module.exports = AssetClient;
