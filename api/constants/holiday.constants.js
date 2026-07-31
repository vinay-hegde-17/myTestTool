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

const HOLIDAY_ENDPOINTS = {

    GET_HOLIDAYS: "/holidays",

    CREATE_HOLIDAY: "/holidays",

    UPDATE_HOLIDAY: "/holidays",

    DELETE_HOLIDAY: "/holidays",

    IMPORT_HOLIDAYS: "/holidays/import",

    GET_HOLIDAY_YEARS: "/holidays/years",

    GET_HOLIDAYS_BY_YEAR: "/holidays",

    IMPORT_HOLIDAYS_EXCEL: "/holidays/importFromExcel",

    RESET_HOLIDAYS: "/holidays/test/reset"

};

module.exports = { HOLIDAY_ENDPOINTS, HTTP_STATUS };