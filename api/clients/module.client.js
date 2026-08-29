const { MODULES_ENDPOINTS } = require("../constants/module.constants");

class ModuleClient {
  constructor(request, token = null) {
    this.request = request;
    this.token = token;
  }

  authHeaders() {
    return this.token ? { Authorization: `Bearer ${this.token}` } : {};
  }

  getAllModules() {
    return this.request.get(MODULES_ENDPOINTS.GET_ALL, {
      headers: this.authHeaders(),
    });
  }

  getAllModulesWithoutAuth() {
    return this.request.get(MODULES_ENDPOINTS.GET_ALL);
  }

  getModulesWithoutAuth() {
    return this.getAllModulesWithoutAuth();
  }

  getModulesForPermission() {
    return this.request.get(MODULES_ENDPOINTS.GET_FOR_PERMISSION, {
      headers: this.authHeaders(),
    });
  }

  getModulesForPermissionWithoutAuth() {
    return this.request.get(MODULES_ENDPOINTS.GET_FOR_PERMISSION);
  }

  createModule(payload) {
    return this.request.post(MODULES_ENDPOINTS.CREATE_MODULE, {
      headers: {
        ...this.authHeaders(),
        "Content-Type": "application/json",
      },
      data: payload,
    });
  }

  createModuleWithoutAuth(payload) {
    return this.request.post(MODULES_ENDPOINTS.CREATE_MODULE, {
      data: payload,
    });
  }

  updateModule(id, payload) {
    return this.request.put(`${MODULES_ENDPOINTS.UPDATE_MODULE}/${id}`, {
      headers: {
        ...this.authHeaders(),
        "Content-Type": "application/json",
      },
      data: payload,
    });
  }

  updateModuleWithoutAuth(id, payload) {
    return this.request.put(`${MODULES_ENDPOINTS.UPDATE_MODULE}/${id}`, {
      data: payload,
    });
  }

  getMenuModules() {
    return this.request.get(MODULES_ENDPOINTS.GET_MENU, {
      headers: this.authHeaders(),
    });
  }

  getMenuModulesWithoutAuth() {
    return this.request.get(MODULES_ENDPOINTS.GET_MENU);
  }

  getModulesByIds(moduleIds) {
    return this.request.post(MODULES_ENDPOINTS.GET_BY_IDS, {
      headers: {
        ...this.authHeaders(),
        "Content-Type": "application/json",
      },
      data: { moduleIds },
    });
  }

  getModulesByIdsWithoutAuth(moduleIds) {
    return this.request.post(MODULES_ENDPOINTS.GET_BY_IDS, {
      data: { moduleIds },
    });
  }

  postModulesByIdsRaw(body) {
    return this.request.post(MODULES_ENDPOINTS.GET_BY_IDS, {
      headers: {
        ...this.authHeaders(),
        "Content-Type": "application/json",
      },
      data: body,
    });
  }
}

module.exports = ModuleClient;
