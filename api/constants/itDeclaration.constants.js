const HTTP_STATUS = {
    OK: 200,
    CREATED: 201,
    NO_CONTENT: 204,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    NOT_FOUND: 404,
    CONFLICT: 409,
    INTERNAL_SERVER_ERROR: 500
};

const IT_DECLARATION_ENDPOINTS = {

    GET_PROOF_FILE: "/itdeclaration/file",

    GET_IT_DECLARATION: "/itdeclaration",

    GET_PROOFS: "/itdeclaration/proofs",

    GET_ZIP_PROOFS: "/itdeclaration/zipProofs",

    GET_EMPLOYEES: "/itdeclaration",

    GET_ITD_CONFIGURATION: "/itdeclaration/ITDConfigurationDetails",

    CREATE_IT_DECLARATION: "/itdeclaration",

    UPDATE_REGIME_DATA: "/itdeclaration/updateRegimeData",

    UPLOAD_PROOFS: "/itdeclaration/proofs",

    UPDATE_ITD_FLAGS: "/itdeclaration/ITDFlags",

    DELETE_PROOF: "/itdeclaration"

};

module.exports = {
    IT_DECLARATION_ENDPOINTS,
    HTTP_STATUS
};