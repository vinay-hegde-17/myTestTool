const { HTTP_STATUS } = require('./httpStatus');

const HOLIDAY_ENDPOINTS = {
  GET_HOLIDAYS: "/holidays",

  CREATE_HOLIDAY: "/holidays",

  UPDATE_HOLIDAY: "/holidays",

  DELETE_HOLIDAY: "/holidays",

  IMPORT_HOLIDAYS: "/holidays/import",

  GET_HOLIDAY_YEARS: "/holidays/years",

  GET_HOLIDAYS_BY_YEAR: "/holidays",

  IMPORT_HOLIDAYS_EXCEL: "/holidays/importFromExcel",

  RESET_HOLIDAYS: "/holidays/test/reset",
};

module.exports = { HOLIDAY_ENDPOINTS, HTTP_STATUS };
