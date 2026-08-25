const { USER_ROLE_ENDPOINTS } = require("../constants/userRole.constants");

class UserRoleClient {
  constructor(request, token) {
    this.request = request;
    this.token = token;
  }

  async getUserRoles(fetchType) {
    const url = fetchType
      ? `${USER_ROLE_ENDPOINTS.GET_USER_ROLES}?fetchType=${fetchType}`
      : USER_ROLE_ENDPOINTS.GET_USER_ROLES;

    return await this.request.get(url, {
      headers: {
        Authorization: `Bearer ${this.token}`,
      },
    });
  }

  async getUserRolesWithoutAuth(fetchType) {
    const url = fetchType
      ? `${USER_ROLE_ENDPOINTS.GET_USER_ROLES}?fetchType=${fetchType}`
      : USER_ROLE_ENDPOINTS.GET_USER_ROLES;

    return await this.request.get(url);
  }

  async getUserRole(userRole) {
    return await this.request.get(
      `${USER_ROLE_ENDPOINTS.GET_USER_ROLE}/${userRole}`,
      {
        headers: {
          Authorization: `Bearer ${this.token}`,
        },
      },
    );
  }

  async getUserRoleWithoutAuth(userRole) {
    return await this.request.get(
      `${USER_ROLE_ENDPOINTS.GET_USER_ROLE}/${userRole}`,
    );
  }

  async getRoleById(roleId) {
    return await this.request.get(
      `${USER_ROLE_ENDPOINTS.GET_ROLE_BY_ID}/${roleId}`,
      {
        headers: {
          Authorization: `Bearer ${this.token}`,
        },
      },
    );
  }

  async getRoleByIdWithoutAuth(roleId) {
    return await this.request.get(
      `${USER_ROLE_ENDPOINTS.GET_ROLE_BY_ID}/${roleId}`,
    );
  }

  async createUserRole(payload) {
    return await this.request.post(USER_ROLE_ENDPOINTS.CREATE_USER_ROLE, {
      headers: {
        Authorization: `Bearer ${this.token}`,
      },
      data: payload,
    });
  }

  async createUserRoleWithoutAuth(payload) {
    return await this.request.post(USER_ROLE_ENDPOINTS.CREATE_USER_ROLE, {
      data: payload,
    });
  }

  async updateUserRole(roleId, payload) {
    return await this.request.put(
      `${USER_ROLE_ENDPOINTS.UPDATE_USER_ROLE}/${roleId}`,
      {
        headers: {
          Authorization: `Bearer ${this.token}`,
        },
        data: payload,
      },
    );
  }

  async updateUserRoleWithoutAuth(roleId, payload) {
    return await this.request.put(
      `${USER_ROLE_ENDPOINTS.UPDATE_USER_ROLE}/${roleId}`,
      {
        data: payload,
      },
    );
  }

  async getRoleId(roleName) {
    return await this.request.get(
      `${USER_ROLE_ENDPOINTS.GET_ROLE_ID}?roleName=${roleName}`,
      {
        headers: {
          Authorization: `Bearer ${this.token}`,
        },
      },
    );
  }

  async getRoleIdWithoutAuth(roleName) {
    return await this.request.get(
      `${USER_ROLE_ENDPOINTS.GET_ROLE_ID}?roleName=${roleName}`,
    );
  }

  async getRoleName(roleId) {
    return await this.request.get(
      `${USER_ROLE_ENDPOINTS.GET_ROLE_NAME}/${roleId}`,
      {
        headers: {
          Authorization: `Bearer ${this.token}`,
        },
      },
    );
  }

  async getRoleNameWithoutAuth(roleId) {
    return await this.request.get(
      `${USER_ROLE_ENDPOINTS.GET_ROLE_NAME}/${roleId}`,
    );
  }

  async checkExistsOrCreateRole(payload) {
    return await this.request.post(
      USER_ROLE_ENDPOINTS.CHECK_EXISTS_OR_CREATE_ROLE,
      {
        headers: {
          Authorization: `Bearer ${this.token}`,
        },
        data: payload,
      },
    );
  }

  async checkExistsOrCreateRoleWithoutAuth(payload) {
    return await this.request.post(
      USER_ROLE_ENDPOINTS.CHECK_EXISTS_OR_CREATE_ROLE,
      {
        data: payload,
      },
    );
  }
}

module.exports = UserRoleClient;
