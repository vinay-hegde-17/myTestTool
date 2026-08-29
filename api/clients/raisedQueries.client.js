const {
  RAISED_QUERIES_ENDPOINTS,
} = require("../constants/raisedQueries.constants");

class RaisedQueriesClient {
  constructor(request, token = null) {
    this.request = request;
    this.token = token;
  }

  authHeaders() {
    return this.token ? { Authorization: `Bearer ${this.token}` } : {};
  }

  getRaisedQueries(filter = false) {
    return this.request.get(RAISED_QUERIES_ENDPOINTS.GET_ALL, {
      params: {
        filter,
      },
      headers: this.authHeaders(),
    });
  }

  getQueryTypes() {
    return this.request.get(RAISED_QUERIES_ENDPOINTS.GET_TYPES, {
      headers: this.authHeaders(),
    });
  }

  getEmployeeQueries(employeeId) {
    return this.request.get(
      `${RAISED_QUERIES_ENDPOINTS.GET_BY_EMPLOYEE}/${employeeId}`,
      {
        headers: this.authHeaders(),
      },
    );
  }

  createRaisedQuery(payload) {
    return this.request.post(RAISED_QUERIES_ENDPOINTS.CREATE_QUERY, {
      headers: {
        ...this.authHeaders(),
        "Content-Type": "application/json",
      },
      data: payload,
    });
  }

  updateRaisedQueryReply(payload) {
    return this.request.put(RAISED_QUERIES_ENDPOINTS.UPDATE_QUERY, {
      headers: {
        ...this.authHeaders(),
        "Content-Type": "application/json",
      },
      data: payload,
    });
  }

  updateRaisedQuery(payload) {
    return this.request.put(RAISED_QUERIES_ENDPOINTS.UPDATE_RAISE_QUERY, {
      headers: {
        ...this.authHeaders(),
        "Content-Type": "application/json",
      },
      data: payload,
    });
  }

  getFAQQueries() {
    return this.request.get(RAISED_QUERIES_ENDPOINTS.GET_FAQ, {
      headers: this.authHeaders(),
    });
  }

  getRaisedQueriesWithoutAuth(filter = false) {
    return this.request.get(RAISED_QUERIES_ENDPOINTS.GET_ALL, {
      params: {
        filter,
      },
    });
  }

  getUnansweredQueriesWithoutAuth() {
    return this.getRaisedQueriesWithoutAuth(false);
  }

  getQueryTypesWithoutAuth() {
    return this.request.get(RAISED_QUERIES_ENDPOINTS.GET_TYPES);
  }

  getEmployeeQueriesWithoutAuth(employeeId) {
    return this.request.get(
      `${RAISED_QUERIES_ENDPOINTS.GET_BY_EMPLOYEE}/${employeeId}`,
    );
  }

  createRaisedQueryWithoutAuth(payload) {
    return this.request.post(RAISED_QUERIES_ENDPOINTS.CREATE_QUERY, {
      data: payload,
    });
  }

  updateRaisedQueryReplyWithoutAuth(payload) {
    return this.request.put(RAISED_QUERIES_ENDPOINTS.UPDATE_QUERY, {
      data: payload,
    });
  }

  updateRaisedQueryWithoutAuth(payload) {
    return this.request.put(RAISED_QUERIES_ENDPOINTS.UPDATE_RAISE_QUERY, {
      data: payload,
    });
  }

  getFAQQueriesWithoutAuth() {
    return this.request.get(RAISED_QUERIES_ENDPOINTS.GET_FAQ);
  }
}

module.exports = RaisedQueriesClient;
