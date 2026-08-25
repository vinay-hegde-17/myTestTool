const {
  IT_DECLARATION_ENDPOINTS,
} = require("../constants/itDeclaration.constants");

class ItDeclarationClient {
  constructor(request, token = null) {
    this.request = request;
    this.token = token;
  }

  authHeaders() {
    return this.token ? { Authorization: `Bearer ${this.token}` } : {};
  }

  getProofFile(fileId) {
    return this.request.get(
      `${IT_DECLARATION_ENDPOINTS.GET_PROOF_FILE}/${fileId}`,
      {
        headers: this.authHeaders(),
      },
    );
  }

  getITDeclaration(employeeId, financialYear) {
    return this.request.get(
      `${IT_DECLARATION_ENDPOINTS.GET_IT_DECLARATION}/${employeeId}/${financialYear}`,
      {
        headers: this.authHeaders(),
      },
    );
  }

  getProofs(employeeId, financialYear) {
    return this.request.get(
      `${IT_DECLARATION_ENDPOINTS.GET_PROOFS}/${employeeId}/${financialYear}`,
      {
        headers: this.authHeaders(),
      },
    );
  }

  getZipProofs(employeeId, financialYear) {
    return this.request.get(
      `${IT_DECLARATION_ENDPOINTS.GET_ZIP_PROOFS}/${employeeId}/${financialYear}`,
      {
        headers: this.authHeaders(),
      },
    );
  }

  getEmployees(regime, financialYear) {
    return this.request.get(
      `${IT_DECLARATION_ENDPOINTS.GET_EMPLOYEES}?regime=${regime}&financialYear=${financialYear}`,
      {
        headers: this.authHeaders(),
      },
    );
  }

  getITDConfiguration() {
    return this.request.get(IT_DECLARATION_ENDPOINTS.GET_ITD_CONFIGURATION, {
      headers: this.authHeaders(),
    });
  }

  createITDeclaration(payload) {
    return this.request.post(IT_DECLARATION_ENDPOINTS.CREATE_IT_DECLARATION, {
      headers: this.authHeaders(),
      data: payload,
    });
  }

  updateITDeclaration(payload) {
    return this.request.put(IT_DECLARATION_ENDPOINTS.UPDATE_REGIME_DATA, {
      headers: this.authHeaders(),
      data: payload,
    });
  }

  // in the client class, support optional file buffer
  uploadProofs(fields, file = null) {
    const multipart = { ...fields };
    if (file) {
      multipart.proofFiles = {
        name: file.name,
        mimeType: file.mimeType,
        buffer: file.buffer,
      };
    }
    return this.request.put(IT_DECLARATION_ENDPOINTS.UPLOAD_PROOFS, {
      headers: this.authHeaders(),
      multipart,
    });
  }

  updateITDFlags(payload) {
    return this.request.put(IT_DECLARATION_ENDPOINTS.UPDATE_ITD_FLAGS, {
      headers: this.authHeaders(),
      data: payload,
    });
  }

  deleteProof(fileId) {
    return this.request.delete(
      `${IT_DECLARATION_ENDPOINTS.DELETE_PROOF}/${fileId}`,
      {
        headers: this.authHeaders(),
      },
    );
  }
}

module.exports = ItDeclarationClient;
