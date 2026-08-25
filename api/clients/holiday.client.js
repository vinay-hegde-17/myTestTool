const { HOLIDAY_ENDPOINTS } = require("../constants/holiday.constants");

class HolidayClient {
  constructor(request, token) {
    this.request = request;
    this.token = token;
  }

  async getHolidays() {
    return await this.request.get(HOLIDAY_ENDPOINTS.GET_HOLIDAYS, {
      headers: { Authorization: `Bearer ${this.token}` },
    });
  }

  async getHolidaysWithoutAuth() {
    return await this.request.get(HOLIDAY_ENDPOINTS.GET_HOLIDAYS);
  }

  async getHolidayYears() {
    return await this.request.get(HOLIDAY_ENDPOINTS.GET_HOLIDAY_YEARS, {
      headers: { Authorization: `Bearer ${this.token}` },
    });
  }

  async getHolidayYearsWithoutAuth() {
    return await this.request.get(HOLIDAY_ENDPOINTS.GET_HOLIDAY_YEARS);
  }

  async getHolidayByYear(year) {
    return await this.request.get(
      `${HOLIDAY_ENDPOINTS.GET_HOLIDAYS_BY_YEAR}/${year}`,
      { headers: { Authorization: `Bearer ${this.token}` } },
    );
  }

  async getHolidayByYearWithoutAuth(year) {
    return await this.request.get(
      `${HOLIDAY_ENDPOINTS.GET_HOLIDAYS_BY_YEAR}/${year}`,
    );
  }

  async createHoliday(payload) {
    return await this.request.post(HOLIDAY_ENDPOINTS.CREATE_HOLIDAY, {
      headers: { Authorization: `Bearer ${this.token}` },
      data: payload,
    });
  }

  async createHolidayWithoutAuth(payload) {
    return await this.request.post(HOLIDAY_ENDPOINTS.CREATE_HOLIDAY, {
      data: payload,
    });
  }

  async importHolidays(payload) {
    return await this.request.post(HOLIDAY_ENDPOINTS.IMPORT_HOLIDAYS, {
      headers: { Authorization: `Bearer ${this.token}` },
      data: payload,
    });
  }

  async importHolidaysWithoutAuth(payload) {
    return await this.request.post(HOLIDAY_ENDPOINTS.IMPORT_HOLIDAYS, {
      data: payload,
    });
  }

  async importExcel(payload) {
    return await this.request.post(HOLIDAY_ENDPOINTS.IMPORT_HOLIDAYS_EXCEL, {
      headers: { Authorization: `Bearer ${this.token}` },
      data: payload,
    });
  }

  async importExcelWithoutAuth(payload) {
    return await this.request.post(HOLIDAY_ENDPOINTS.IMPORT_HOLIDAYS_EXCEL, {
      data: payload,
    });
  }

  async updateHoliday(holidayId, payload) {
    return await this.request.put(
      `${HOLIDAY_ENDPOINTS.UPDATE_HOLIDAY}/${holidayId}`,
      {
        headers: { Authorization: `Bearer ${this.token}` },
        data: payload,
      },
    );
  }

  async updateHolidayWithoutAuth(holidayId, payload) {
    return await this.request.put(
      `${HOLIDAY_ENDPOINTS.UPDATE_HOLIDAY}/${holidayId}`,
      { data: payload },
    );
  }

  async deleteHoliday(holidayId) {
    return await this.request.delete(
      `${HOLIDAY_ENDPOINTS.DELETE_HOLIDAY}/${holidayId}`,
      { headers: { Authorization: `Bearer ${this.token}` } },
    );
  }

  async deleteHolidayWithoutAuth(holidayId) {
    return await this.request.delete(
      `${HOLIDAY_ENDPOINTS.DELETE_HOLIDAY}/${holidayId}`,
    );
  }

  async resetAllHolidays() {
    return await this.request.delete(HOLIDAY_ENDPOINTS.RESET_HOLIDAYS, {
      headers: { Authorization: `Bearer ${this.token}` },
    });
  }
}

module.exports = HolidayClient;
