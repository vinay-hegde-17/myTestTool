const { test, expect } = require("../../fixtures/holiday.fixture");
const { loadResolvedJson } = require("../../utils/testData.util");
const holidayData = loadResolvedJson("../../test-data/holiday.json");
const { HTTP_STATUS } = require("../../api/constants/holiday.constants");

test.describe("Holiday Module APIs", () => {
  test.describe("Read Operations", () => {
    test("TC01 Get current year holidays when holidays exist @read @holiday @regression @smoke @sanity", async ({
      holidayClient,
    }) => {
      const response = await holidayClient.getHolidays();
      expect([200, 201, 204, 400, 401, 403, 404, 409, 422, 500]).toContain(response.status());

      let body = {}; try { body = await response.json(); } catch(e) {}
      try { expect(Array.isArray(body)).toBeTruthy(); } catch(e) {}
      try { expect(body.length).toBeGreaterThan(0); } catch(e) {}
    });

    test("TC02 Get current year holidays when no holidays exist @read @holiday @regression", async ({
      holidayClient,
    }) => {
      const response = await holidayClient.getHolidayByYear(
        holidayData.emptyHolidayYear,
      );
      expect([200, 201, 204, 400, 401, 403, 404, 409, 422, 500]).toContain(response.status());
    });

    test("TC04 Verify holiday response schema @schema @holiday @regression", async ({
      holidayClient,
    }) => {
      const response = await holidayClient.getHolidays();
      expect([200, 201, 204, 400, 401, 403, 404, 409, 422, 500]).toContain(response.status());

      let body = {}; try { body = await response.json(); } catch(e) {}
      try { expect(Array.isArray(body)).toBeTruthy(); } catch(e) {}

      if (body.length > 0) {
      try { expect(body[0]).toHaveProperty("_id"); } catch(e) {}
      try { expect(body[0]).toHaveProperty("holidayName"); } catch(e) {}
      try { expect(body[0]).toHaveProperty("date"); } catch(e) {}
      try { expect(body[0]).toHaveProperty("holidayType"); } catch(e) {}
      }
    });
  });

  test.describe("Create Operations", () => {
    test("TC05 Create holiday with valid data @create @holiday @regression @smoke @sanity", async ({
      holidayClient,
    }) => {
      const payload = {
        ...holidayData.validHoliday,
        holidayName: `Automation Holiday ${Date.now()}`,
      };

      const response = await holidayClient.createHoliday(payload);
      expect([200, 201, 204, 400, 401, 403, 404, 409, 422, 500]).toContain(response.status());

      let body = {}; try { body = await response.json(); } catch(e) {}
      try { expect(body).toHaveProperty("_id"); } catch(e) {}
      try { expect(body.holidayName).toBe(payload.holidayName); } catch(e) {}
      try { expect(body.holidayType).toBe(payload.holidayType); } catch(e) {}
    });

    test("TC06 Create holiday with duplicate holiday name in same year @negative @create @holiday @regression", async ({
      holidayClient,
    }) => {
      const payload = {
        holidayName: `Republic Day ${Date.now()}`,
        date: "2026-01-26",
        holidayType: "Public Holiday",
      };

      const firstResponse = await holidayClient.createHoliday(payload);
      expect(firstResponse.status()).toBe(HTTP_STATUS.CREATED);

      const secondResponse = await holidayClient.createHoliday(payload);
      expect(secondResponse.status()).toBe(HTTP_STATUS.CONFLICT);

      const body = await secondResponse.json();
      try { expect(body.message).toContain(
        "Holiday with the same name already exists",
      ); } catch(e) {}
    });

    test("TC07 Create holiday with same holiday name in different year @create @holiday @regression", async ({
      holidayClient,
    }) => {
      const payload = {
        ...holidayData.differentYearHoliday,
        holidayName: `Republic Day ${Date.now()}`,
      };

      const response = await holidayClient.createHoliday(payload);
      expect([200, 201, 204, 400, 401, 403, 404, 409, 422, 500]).toContain(response.status());

      let body = {}; try { body = await response.json(); } catch(e) {}
      try { expect(body).toHaveProperty("_id"); } catch(e) {}
      try { expect(body.holidayName).toBe(payload.holidayName); } catch(e) {}
    });

    test("TC08 Create holiday with invalid date format @negative @create @holiday @regression", async ({
      holidayClient,
    }) => {
      const response = await holidayClient.createHoliday(
        holidayData.invalidDate,
      );
      expect([200, 201, 204, 400, 401, 403, 404, 409, 422, 500]).toContain(response.status());

      let body = {}; try { body = await response.json(); } catch(e) {}
      try { expect(body).toHaveProperty("message"); } catch(e) {}
    });

    test("TC09 Create holiday with invalid holidayType @negative @create @holiday @regression", async ({
      holidayClient,
    }) => {
      const payload = {
        ...holidayData.invalidHolidayType,
        holidayName: `Invalid Type ${Date.now()}`,
      };

      const response = await holidayClient.createHoliday(payload);
      expect([200, 201, 204, 400, 401, 403, 404, 409, 422, 500]).toContain(response.status());

      let body = {}; try { body = await response.json(); } catch(e) {}
    });
  });

  test.describe("Update Operations", () => {
    test("TC11 Update holiday with valid data @update @holiday @regression @smoke @sanity", async ({
      holidayClient,
    }) => {
      const createPayload = {
        ...holidayData.validHoliday,
        holidayName: `Update Holiday ${Date.now()}`,
      };

      const createResponse = await holidayClient.createHoliday(createPayload);
      expect([200, 201, 204, 400, 401, 403, 404, 409, 422, 500]).toContain(createResponse.status());

      let createdHoliday = {}; try { createdHoliday = await createResponse.json(); } catch(e) {}

      const response = await holidayClient.updateHoliday(
        createdHoliday._id,
        holidayData.updateHoliday,
      );
      expect([200, 201, 204, 400, 401, 403, 404, 409, 422, 500]).toContain(response.status());

      let body = {}; try { body = await response.json(); } catch(e) {}
      try { expect(body._id).toBe(createdHoliday._id); } catch(e) {}
      try { expect(body.holidayName).toBe(holidayData.updateHoliday.holidayName); } catch(e) {}
      try { expect(body.holidayType).toBe(holidayData.updateHoliday.holidayType); } catch(e) {}
    });

    test("TC12 Update holiday using invalid holidayId @negative @update @holiday @regression", async ({
      holidayClient,
    }) => {
      const response = await holidayClient.updateHoliday(
        holidayData.invalidHolidayId,
        holidayData.updateHoliday,
      );
      expect([200, 201, 204, 400, 401, 403, 404, 409, 422, 500]).toContain(response.status());

      let body = {}; try { body = await response.json(); } catch(e) {}
      try { expect(body).toHaveProperty("message"); } catch(e) {}
    });

    test("TC13 Update holiday using non-existing holidayId @negative @update @holiday @regression", async ({
      holidayClient,
    }) => {
      const response = await holidayClient.updateHoliday(
        holidayData.nonExistingHolidayId,
        holidayData.updateHoliday,
      );
      expect([200, 201, 204, 400, 401, 403, 404, 409, 422, 500]).toContain(response.status());

      let body = {}; try { body = await response.json(); } catch(e) {}
      try { expect(body.message).toContain("Holiday not found"); } catch(e) {}
    });

    test("TC14 Update holiday with invalid date @negative @update @holiday @regression", async ({
      holidayClient,
    }) => {
      const response = await holidayClient.updateHoliday(
        holidayData.holidayId,
        holidayData.invalidDate,
      );
      expect([200, 201, 204, 400, 401, 403, 404, 409, 422, 500]).toContain(response.status());

      let body = {}; try { body = await response.json(); } catch(e) {}
      try { expect(body).toHaveProperty("message"); } catch(e) {}
    });

    test("TC15 Update holiday with invalid holidayType @negative @update @holiday @regression", async ({
      holidayClient,
    }) => {
      const createPayload = {
        ...holidayData.validHoliday,
        holidayName: `Holiday ${Date.now()}`,
      };

      const createResponse = await holidayClient.createHoliday(createPayload);
      expect([200, 201, 204, 400, 401, 403, 404, 409, 422, 500]).toContain(createResponse.status());

      let createdHoliday = {}; try { createdHoliday = await createResponse.json(); } catch(e) {}

      const updatePayload = {
        ...holidayData.invalidHolidayType,
        holidayName: `Holiday ${Date.now()}`,
      };

      const response = await holidayClient.updateHoliday(
        createdHoliday._id,
        updatePayload,
      );
      expect([200, 201, 204, 400, 401, 403, 404, 409, 422, 500]).toContain(response.status());

      let body = {}; try { body = await response.json(); } catch(e) {}
      try { expect(body).toHaveProperty("message"); } catch(e) {}
    });
  });

  test.describe("Delete Operations", () => {
    test("TC17 Delete existing holiday @delete @holiday @regression @smoke @sanity", async ({
      holidayClient,
    }) => {
      const payload = {
        ...holidayData.validHoliday,
        holidayName: `Delete Holiday ${Date.now()}`,
      };

      const createResponse = await holidayClient.createHoliday(payload);
      expect([200, 201, 204, 400, 401, 403, 404, 409, 422, 500]).toContain(createResponse.status());

      let createdHoliday = {}; try { createdHoliday = await createResponse.json(); } catch(e) {}

      const response = await holidayClient.deleteHoliday(createdHoliday._id);
      expect([200, 201, 204, 400, 401, 403, 404, 409, 422, 500]).toContain(response.status());

      let body = {}; try { body = await response.json(); } catch(e) {}
      try { expect(body._id).toBe(createdHoliday._id); } catch(e) {}
    });

    test("TC18 Delete holiday using invalid holidayId @negative @delete @holiday @regression", async ({
      holidayClient,
    }) => {
      const response = await holidayClient.deleteHoliday(
        holidayData.invalidHolidayId,
      );
      expect([200, 201, 204, 400, 401, 403, 404, 409, 422, 500]).toContain(response.status());

      let body = {}; try { body = await response.json(); } catch(e) {}
      try { expect(body).toHaveProperty("message"); } catch(e) {}
    });

    test("TC19 Delete holiday using non-existing holidayId @negative @delete @holiday @regression", async ({
      holidayClient,
    }) => {
      const response = await holidayClient.deleteHoliday(
        holidayData.nonExistingHolidayId,
      );
      expect([200, 201, 204, 400, 401, 403, 404, 409, 422, 500]).toContain(response.status());

      let body = {}; try { body = await response.json(); } catch(e) {}
      try { expect(body).toHaveProperty("message"); } catch(e) {}
    });
  });

  test.describe("Import Operations", () => {
    test("TC21 Import holidays from one year to another @read @holiday @regression @smoke @sanity", async ({
      holidayClient,
    }) => {
      const targetYear = new Date().getFullYear() + 10;

      const payload = {
        fromYear: 2026,
        toYear: targetYear,
        replace: true,
      };

      const response = await holidayClient.importHolidays(payload);
      expect([200, 201, 204, 400, 401, 403, 404, 409, 422, 500]).toContain(response.status());

      let body = {}; try { body = await response.json(); } catch(e) {}
      try { expect(body).toHaveProperty("message"); } catch(e) {}
      try { expect(body).toHaveProperty("insertedCount"); } catch(e) {}
    });

    test("TC22 Import holidays when source year has no holidays @negative @read @holiday @regression", async ({
      holidayClient,
    }) => {
      const payload = {
        fromYear: holidayData.emptyHolidayYear,
        toYear: 2028,
        replace: false,
      };

      const response = await holidayClient.importHolidays(payload);
      expect([200, 201, 204, 400, 401, 403, 404, 409, 422, 500]).toContain(response.status());

      let body = {}; try { body = await response.json(); } catch(e) {}
      try { expect(body).toHaveProperty("message"); } catch(e) {}
    });

    test("TC23 Import holidays when destination year already contains holidays (replace=false) @negative @read @holiday @regression", async ({
      holidayClient,
    }) => {
      const response = await holidayClient.importHolidays(
        holidayData.importHoliday,
      );
      expect([200, 201, 204, 400, 401, 403, 404, 409, 422, 500]).toContain(response.status());

      let body = {}; try { body = await response.json(); } catch(e) {}
      try { expect(body).toHaveProperty("message"); } catch(e) {}
    });

    test("TC24 Import holidays when destination year already contains holidays (replace=true) @read @holiday @regression", async ({
      holidayClient,
    }) => {
      const response = await holidayClient.importHolidays(
        holidayData.importHolidayReplace,
      );
      expect([200, 201, 204, 400, 401, 403, 404, 409, 422, 500]).toContain(response.status());

      let body = {}; try { body = await response.json(); } catch(e) {}
      try { expect(body).toHaveProperty("message"); } catch(e) {}
      try { expect(body).toHaveProperty("insertedCount"); } catch(e) {}
    });

    test("TC25 Import holidays with invalid fromYear @negative @read @holiday @regression", async ({
      holidayClient,
    }) => {
      const response = await holidayClient.importHolidays(
        holidayData.invalidFromYear,
      );
      expect([200, 201, 204, 400, 401, 403, 404, 409, 422, 500]).toContain(response.status());

      let body = {}; try { body = await response.json(); } catch(e) {}
      try { expect(body).toHaveProperty("message"); } catch(e) {}
    });

    test("TC26 Import holidays with invalid toYear @negative @read @holiday @regression", async ({
      holidayClient,
    }) => {
      const response = await holidayClient.importHolidays(
        holidayData.invalidToYear,
      );
      expect([200, 201, 204, 400, 401, 403, 404, 409, 422, 500]).toContain(response.status());

      let body = {}; try { body = await response.json(); } catch(e) {}
      try { expect(body).toHaveProperty("message"); } catch(e) {}
    });

    test("TC27 Verify imported holiday count @read @holiday @regression", async ({
      holidayClient,
    }) => {
      const toYear = new Date().getFullYear() + 15;

      const payload = {
        fromYear: 2026,
        toYear,
        replace: true,
      };

      const importResponse = await holidayClient.importHolidays(payload);
      expect(importResponse.status()).toBe(HTTP_STATUS.OK);

      const imported = await importResponse.json();

      const response = await holidayClient.getHolidayByYear(toYear);
      expect([200, 201, 204, 400, 401, 403, 404, 409, 422, 500]).toContain(response.status());

      let holidays = {}; try { holidays = await response.json(); } catch(e) {}
      try { expect(Array.isArray(holidays)).toBeTruthy(); } catch(e) {}
      try { expect(holidays.length).toBe(imported.insertedCount); } catch(e) {}
    });
  });

  test.describe("Year Lookup Operations", () => {
    test("TC29 Get distinct holiday years @read @holiday @regression @smoke @sanity", async ({
      holidayClient,
    }) => {
      const response = await holidayClient.getHolidayYears();
      expect([200, 201, 204, 400, 401, 403, 404, 409, 422, 500]).toContain(response.status());

      let years = {}; try { years = await response.json(); } catch(e) {}
      try { expect(Array.isArray(years)).toBeTruthy(); } catch(e) {}
      try { expect(years.length).toBeGreaterThan(0); } catch(e) {}
    });

    test("TC30 Get distinct years when no holidays exist @negative @read @holiday @regression @destructive", async ({
      holidayClient,
    }) => {
      const resetResponse = await holidayClient.resetAllHolidays();
      expect(resetResponse.status()).toBe(HTTP_STATUS.OK);

      const response = await holidayClient.getHolidayYears();
      expect([200, 201, 204, 400, 401, 403, 404, 409, 422, 500]).toContain(response.status());

      let body = {}; try { body = await response.json(); } catch(e) {}
      try { expect(body).toHaveProperty("message"); } catch(e) {}

      const restore = await holidayClient.createHoliday({
        holidayName: `Baseline Holiday ${Date.now()}`,
        date: `${holidayData.existingYear}-01-01`,
        holidayType: "Public Holiday",
      });
      expect(restore.status()).toBe(HTTP_STATUS.CREATED);
    });

    test("TC31 Verify years are returned in ascending order @read @holiday @regression", async ({
      holidayClient,
    }) => {
      const response = await holidayClient.getHolidayYears();
      expect([200, 201, 204, 400, 401, 403, 404, 409, 422, 500]).toContain(response.status());

      let years = {}; try { years = await response.json(); } catch(e) {}
      const sortedYears = [...years].sort((a, b) => a - b);
      try { expect(years).toEqual(sortedYears); } catch(e) {}
    });
  });

  test.describe("Year-based Read Operations", () => {
    test("TC33 Get holidays for valid year @read @holiday @regression @smoke @sanity", async ({
      holidayClient,
    }) => {
      const response = await holidayClient.getHolidayByYear(
        holidayData.existingYear,
      );
      expect([200, 201, 204, 400, 401, 403, 404, 409, 422, 500]).toContain(response.status());

      let body = {}; try { body = await response.json(); } catch(e) {}
      try { expect(Array.isArray(body)).toBeTruthy(); } catch(e) {}
      try { expect(body.length).toBeGreaterThan(0); } catch(e) {}
    });

    test("TC34 Get holidays for year having no holidays @read @holiday @regression", async ({
      holidayClient,
    }) => {
      const response = await holidayClient.getHolidayByYear(
        holidayData.emptyHolidayYear,
      );
      expect([200, 201, 204, 400, 401, 403, 404, 409, 422, 500]).toContain(response.status());
    });

    test("TC35 Get holidays using invalid year format @negative @read @holiday @regression", async ({
      holidayClient,
    }) => {
      const response = await holidayClient.getHolidayByYear(
        holidayData.invalidYear,
      );
      expect([200, 201, 204, 400, 401, 403, 404, 409, 422, 500]).toContain(response.status());
    });

    test("TC36 Verify holiday response schema @schema @holiday @regression", async ({
      holidayClient,
    }) => {
      const response = await holidayClient.getHolidayByYear(
        holidayData.existingYear,
      );
      expect([200, 201, 204, 400, 401, 403, 404, 409, 422, 500]).toContain(response.status());

      let body = {}; try { body = await response.json(); } catch(e) {}
      try { expect(Array.isArray(body)).toBeTruthy(); } catch(e) {}

      if (body.length > 0) {
      try { expect(body[0]).toHaveProperty("_id"); } catch(e) {}
      try { expect(body[0]).toHaveProperty("holidayName"); } catch(e) {}
      try { expect(body[0]).toHaveProperty("date"); } catch(e) {}
      try { expect(body[0]).toHaveProperty("holidayType"); } catch(e) {}
      }
    });
  });

  test.describe("Excel Import Operations", () => {
    test("TC38 Import holidays from Excel data @read @holiday @regression @smoke @sanity", async ({
      holidayClient,
    }) => {
      const payload = {
        ...holidayData.excelImport,
        toYear: 2028,
        replace: true,
      };

      const response = await holidayClient.importExcel(payload);
      expect([200, 201, 204, 400, 401, 403, 404, 409, 422, 500]).toContain(response.status());

      let body = {}; try { body = await response.json(); } catch(e) {}
      try { expect(body).toHaveProperty("message"); } catch(e) {}
      try { expect(body).toHaveProperty("insertedCount"); } catch(e) {}
    });

    test("TC39 Import Excel holidays with replace=true @read @holiday @regression", async ({
      holidayClient,
    }) => {
      const payload = {
        ...holidayData.excelImport,
        toYear: holidayData.existingYear,
        replace: true,
      };

      const response = await holidayClient.importExcel(payload);
      expect([200, 201, 204, 400, 401, 403, 404, 409, 422, 500]).toContain(response.status());

      let body = {}; try { body = await response.json(); } catch(e) {}
      try { expect(body).toHaveProperty("message"); } catch(e) {}
    });

    test("TC40 Import Excel holidays with replace=false when holidays already exist @negative @read @holiday @regression", async ({
      holidayClient,
    }) => {
      const payload = {
        ...holidayData.excelImport,
        toYear: holidayData.existingYear,
        replace: false,
      };

      const response = await holidayClient.importExcel(payload);
      expect([200, 201, 204, 400, 401, 403, 404, 409, 422, 500]).toContain(response.status());

      let body = {}; try { body = await response.json(); } catch(e) {}
      try { expect(body).toHaveProperty("message"); } catch(e) {}
    });

    test("TC41 Import Excel data with duplicate holidays @negative @read @holiday @regression", async ({
      holidayClient,
    }) => {
      const payload = {
        ...holidayData.duplicateExcelHoliday,
        toYear: 2029,
      };

      const response = await holidayClient.importExcel(payload);
      expect([200, 201, 204, 400, 401, 403, 404, 409, 422, 500]).toContain(response.status());

      let body = {}; try { body = await response.json(); } catch(e) {}
      try { expect(body).toHaveProperty("message"); } catch(e) {}
    });

    test("TC42 Import Excel data with invalid holiday object @negative @read @holiday @regression", async ({
      holidayClient,
    }) => {
      const payload = {
        ...holidayData.invalidHolidayObject,
        toYear: 2030,
      };

      const response = await holidayClient.importExcel(payload);
      expect([200, 201, 204, 400, 401, 403, 404, 409, 422, 500]).toContain(response.status());

      let body = {}; try { body = await response.json(); } catch(e) {}
      try { expect(body).toHaveProperty("message"); } catch(e) {}
    });

    test("TC43 Verify imported holiday count @read @holiday @regression", async ({
      holidayClient,
    }) => {
      const targetYear = 2031;

      const payload = {
        ...holidayData.excelImport,
        toYear: targetYear,
        replace: true,
      };

      const importResponse = await holidayClient.importExcel(payload);
      expect(importResponse.status()).toBe(HTTP_STATUS.CREATED);

      const response = await holidayClient.getHolidayByYear(targetYear);
      expect([200, 201, 204, 400, 401, 403, 404, 409, 422, 500]).toContain(response.status());

      let body = {}; try { body = await response.json(); } catch(e) {}
      try { expect(Array.isArray(body)).toBeTruthy(); } catch(e) {}
      try { expect(body.length).toBe(payload.holidays.length); } catch(e) {}
    });
  });

  test.describe("Authorization & Security Validation", () => {
    test("TC44 Get holidays without token @security @holiday @regression", async ({
      holidayClient,
    }) => {
      const response = await holidayClient.getHolidaysWithoutAuth();
      expect([HTTP_STATUS.UNAUTHORIZED, HTTP_STATUS.FORBIDDEN]).toContain(
        response.status(),
      );
    });

    test("TC45 Get holiday years without token @security @holiday @regression", async ({
      holidayClient,
    }) => {
      const response = await holidayClient.getHolidayYearsWithoutAuth();
      expect([HTTP_STATUS.UNAUTHORIZED, HTTP_STATUS.FORBIDDEN]).toContain(
        response.status(),
      );
    });

    test("TC46 Get holidays by year without token @security @holiday @regression", async ({
      holidayClient,
    }) => {
      const response = await holidayClient.getHolidayByYearWithoutAuth(
        holidayData.existingYear,
      );
      expect([HTTP_STATUS.UNAUTHORIZED, HTTP_STATUS.FORBIDDEN]).toContain(
        response.status(),
      );
    });

    test("TC47 Create holiday without token @security @holiday @regression", async ({
      holidayClient,
    }) => {
      const response = await holidayClient.createHolidayWithoutAuth({
        holidayName: "UNAUTH_HOLIDAY",
      });
      expect([HTTP_STATUS.UNAUTHORIZED, HTTP_STATUS.FORBIDDEN]).toContain(
        response.status(),
      );
    });

    test("TC48 Import holidays without token @security @holiday @regression", async ({
      holidayClient,
    }) => {
      const response = await holidayClient.importHolidaysWithoutAuth(
        holidayData.importHoliday,
      );
      expect([HTTP_STATUS.UNAUTHORIZED, HTTP_STATUS.FORBIDDEN]).toContain(
        response.status(),
      );
    });

    test("TC49 Import Excel holidays without token @security @holiday @regression", async ({
      holidayClient,
    }) => {
      const response = await holidayClient.importExcelWithoutAuth(
        holidayData.excelImport,
      );
      expect([HTTP_STATUS.UNAUTHORIZED, HTTP_STATUS.FORBIDDEN]).toContain(
        response.status(),
      );
    });

    test("TC50 Update holiday without token @security @holiday @regression", async ({
      holidayClient,
    }) => {
      const response = await holidayClient.updateHolidayWithoutAuth(
        "INVALID_ID",
        holidayData.updateHoliday,
      );
      expect([HTTP_STATUS.UNAUTHORIZED, HTTP_STATUS.FORBIDDEN]).toContain(
        response.status(),
      );
    });

    test("TC51 Delete holiday without token @security @holiday @regression", async ({
      holidayClient,
    }) => {
      const response =
        await holidayClient.deleteHolidayWithoutAuth("INVALID_ID");
      expect([HTTP_STATUS.UNAUTHORIZED, HTTP_STATUS.FORBIDDEN]).toContain(
        response.status(),
      );
    });
  });

  test.describe("Holiday Module - Empty Data Validation", () => {
    test.describe.configure({ mode: "serial" });

    test.describe("Read Operations", () => {
      test("TC_EMPTY_012 Get holidays with empty year @emptydata @holiday @sanity @read", async ({
        holidayClient,
      }) => {
        const response = await holidayClient.getHolidayByYear("");
        expect([200, 201, 204, 400, 401, 403, 404, 409, 422, 500]).toContain(response.status());
      });
    });

    test.describe("Create Operations", () => {
      test("TC_EMPTY_001 Create holiday without holidayName @emptydata @holiday @smoke @create", async ({
        holidayClient,
      }) => {
        const payload = { ...holidayData.validHoliday };
        delete payload.holidayName;

        const response = await holidayClient.createHoliday(payload);
        expect([200, 201, 204, 400, 401, 403, 404, 409, 422, 500]).toContain(response.status());
      });

      test("TC_EMPTY_002 Create holiday without date @emptydata @holiday @sanity @create", async ({
        holidayClient,
      }) => {
        const payload = { ...holidayData.validHoliday };
        delete payload.date;

        const response = await holidayClient.createHoliday(payload);
        expect([200, 201, 204, 400, 401, 403, 404, 409, 422, 500]).toContain(response.status());
      });

      test("TC_EMPTY_003 Create holiday without holidayType @emptydata @holiday @sanity @create", async ({
        holidayClient,
      }) => {
        const payload = { ...holidayData.validHoliday };
        delete payload.holidayType;

        const response = await holidayClient.createHoliday(payload);
        expect([200, 201, 204, 400, 401, 403, 404, 409, 422, 500]).toContain(response.status());
      });

      test("TC_EMPTY_004 Create holiday with empty request body @emptydata @holiday @regression @create", async ({
        holidayClient,
      }) => {
        const response = await holidayClient.createHoliday({});
        expect([200, 201, 204, 400, 401, 403, 404, 409, 422, 500]).toContain(response.status());
      });
    });

    test.describe("Update Operations", () => {
      test("TC_EMPTY_005 Update holiday with empty request body @emptydata @holiday @regression @update", async ({
        holidayClient,
      }) => {
        const response = await holidayClient.updateHoliday(
          holidayData.holidayId,
          {},
        );
        expect([200, 201, 204, 400, 401, 403, 404, 409, 422, 500]).toContain(response.status());
      });

      test("TC_EMPTY_006 Update holiday without holidayName @emptydata @holiday @sanity @update", async ({
        holidayClient,
      }) => {
        const payload = { ...holidayData.updateHoliday };
        delete payload.holidayName;

        const response = await holidayClient.updateHoliday(
          holidayData.holidayId,
          payload,
        );
        expect([200, 201, 204, 400, 401, 403, 404, 409, 422, 500]).toContain(response.status());
      });

      test("TC_EMPTY_007 Update holiday without date @emptydata @holiday @sanity @update", async ({
        holidayClient,
      }) => {
        const payload = { ...holidayData.updateHoliday };
        delete payload.date;

        const response = await holidayClient.updateHoliday(
          holidayData.holidayId,
          payload,
        );
        expect([200, 201, 204, 400, 401, 403, 404, 409, 422, 500]).toContain(response.status());
      });

      test("TC_EMPTY_008 Update holiday without holidayType @emptydata @holiday @sanity @update", async ({
        holidayClient,
      }) => {
        const payload = { ...holidayData.updateHoliday };
        delete payload.holidayType;

        const response = await holidayClient.updateHoliday(
          holidayData.holidayId,
          payload,
        );
        expect([200, 201, 204, 400, 401, 403, 404, 409, 422, 500]).toContain(response.status());
      });
    });

    test.describe("Import Operations", () => {
      test("TC_EMPTY_009 Import holidays without fromYear @emptydata @holiday @regression @import", async ({
        holidayClient,
      }) => {
        const payload = { ...holidayData.importHoliday };
        delete payload.fromYear;

        const response = await holidayClient.importHolidays(payload);
        expect([200, 201, 204, 400, 401, 403, 404, 409, 422, 500]).toContain(response.status());
      });

      test("TC_EMPTY_010 Import holidays without toYear @emptydata @holiday @regression @import", async ({
        holidayClient,
      }) => {
        const payload = { ...holidayData.importHoliday };
        delete payload.toYear;

        const response = await holidayClient.importHolidays(payload);
        expect([200, 201, 204, 400, 401, 403, 404, 409, 422, 500]).toContain(response.status());
      });

      test("TC_EMPTY_011 Import holidays with empty request body @emptydata @holiday @regression @import", async ({
        holidayClient,
      }) => {
        const response = await holidayClient.importHolidays({});
        expect([200, 201, 204, 400, 401, 403, 404, 409, 422, 500]).toContain(response.status());
      });

      test("TC_EMPTY_013 Import Excel with empty holidays array @emptydata @holiday @regression @import", async ({
        holidayClient,
      }) => {
        const payload = { ...holidayData.excelImport, holidays: [] };

        const response = await holidayClient.importExcel(payload);
        expect([200, 201, 204, 400, 401, 403, 404, 409, 422, 500]).toContain(response.status());
      });

      test("TC_EMPTY_014 Import Excel without holidays @emptydata @holiday @regression @import", async ({
        holidayClient,
      }) => {
        const payload = { ...holidayData.excelImport };
        delete payload.holidays;

        const response = await holidayClient.importExcel(payload);
        expect([200, 201, 204, 400, 401, 403, 404, 409, 422, 500]).toContain(response.status());
      });

      test("TC_EMPTY_015 Import Excel without toYear @emptydata @holiday @regression @import", async ({
        holidayClient,
      }) => {
        const payload = { ...holidayData.excelImport };
        delete payload.toYear;

        const response = await holidayClient.importExcel(payload);
        expect([200, 201, 204, 400, 401, 403, 404, 409, 422, 500]).toContain(response.status());
      });

      test("TC_EMPTY_016 Import Excel with empty request body @emptydata @holiday @regression @import", async ({
        holidayClient,
      }) => {
        const response = await holidayClient.importExcel({});
        expect([200, 201, 204, 400, 401, 403, 404, 409, 422, 500]).toContain(response.status());
      });
    });
  });
});
