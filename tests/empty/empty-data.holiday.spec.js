const { test, expect } = require("../../fixtures/holiday.fixture");
const holidayData = require("../../test-data/holiday.json");
const { HTTP_STATUS } = require("../../api/constants/holiday.constants");

test.describe("Holiday Module - Empty Data Validation", () => {

    test.describe.configure({ mode: "serial" });

    test("TC_EMPTY_001 Create holiday without holidayName @emptydata", async ({ holidayClient }) => {
        const payload = { ...holidayData.validHoliday };
        delete payload.holidayName;

        const response = await holidayClient.createHoliday(payload);
        expect(response.status()).toBe(HTTP_STATUS.BAD_REQUEST);
    });

    test("TC_EMPTY_002 Create holiday without date @emptydata", async ({ holidayClient }) => {
        const payload = { ...holidayData.validHoliday };
        delete payload.date;

        const response = await holidayClient.createHoliday(payload);
        expect(response.status()).toBe(HTTP_STATUS.BAD_REQUEST);
    });

    test("TC_EMPTY_003 Create holiday without holidayType @emptydata", async ({ holidayClient }) => {
        const payload = { ...holidayData.validHoliday };
        delete payload.holidayType;

        const response = await holidayClient.createHoliday(payload);
        expect(response.status()).toBe(HTTP_STATUS.BAD_REQUEST);
    });

    test("TC_EMPTY_004 Create holiday with empty request body @emptydata", async ({ holidayClient }) => {
        const response = await holidayClient.createHoliday({});
        expect(response.status()).toBe(HTTP_STATUS.BAD_REQUEST);
    });

    test("TC_EMPTY_005 Update holiday with empty request body @emptydata", async ({ holidayClient }) => {
        const response = await holidayClient.updateHoliday(holidayData.holidayId, {});
        expect(response.status()).toBe(HTTP_STATUS.BAD_REQUEST);
    });

    test("TC_EMPTY_006 Update holiday without holidayName @emptydata", async ({ holidayClient }) => {
        const payload = { ...holidayData.updateHoliday };
        delete payload.holidayName;

        const response = await holidayClient.updateHoliday(holidayData.holidayId, payload);
        expect(response.status()).toBe(HTTP_STATUS.BAD_REQUEST);
    });

    test("TC_EMPTY_007 Update holiday without date @emptydata", async ({ holidayClient }) => {
        const payload = { ...holidayData.updateHoliday };
        delete payload.date;

        const response = await holidayClient.updateHoliday(holidayData.holidayId, payload);
        expect(response.status()).toBe(HTTP_STATUS.BAD_REQUEST);
    });

    test("TC_EMPTY_008 Update holiday without holidayType @emptydata", async ({ holidayClient }) => {
        const payload = { ...holidayData.updateHoliday };
        delete payload.holidayType;

        const response = await holidayClient.updateHoliday(holidayData.holidayId, payload);
        expect(response.status()).toBe(HTTP_STATUS.BAD_REQUEST);
    });

    test("TC_EMPTY_009 Import holidays without fromYear @emptydata", async ({ holidayClient }) => {
        const payload = { ...holidayData.importHoliday };
        delete payload.fromYear;

        const response = await holidayClient.importHolidays(payload);
        expect(response.status()).toBe(HTTP_STATUS.BAD_REQUEST);
    });

    test("TC_EMPTY_010 Import holidays without toYear @emptydata", async ({ holidayClient }) => {
        const payload = { ...holidayData.importHoliday };
        delete payload.toYear;

        const response = await holidayClient.importHolidays(payload);
        expect(response.status()).toBe(HTTP_STATUS.BAD_REQUEST);
    });

    test("TC_EMPTY_011 Import holidays with empty request body @emptydata", async ({ holidayClient }) => {
        const response = await holidayClient.importHolidays({});
        expect(response.status()).toBe(HTTP_STATUS.BAD_REQUEST);
    });

    test("TC_EMPTY_012 Get holidays with empty year @emptydata", async ({ holidayClient }) => {
        const response = await holidayClient.getHolidayByYear("");
        expect(response.status()).toBe(HTTP_STATUS.BAD_REQUEST);
    });

    test("TC_EMPTY_013 Import Excel with empty holidays array @emptydata", async ({ holidayClient }) => {
        const payload = { ...holidayData.excelImport, holidays: [] };

        const response = await holidayClient.importExcel(payload);
        expect(response.status()).toBe(HTTP_STATUS.BAD_REQUEST);
    });

    test("TC_EMPTY_014 Import Excel without holidays @emptydata", async ({ holidayClient }) => {
        const payload = { ...holidayData.excelImport };
        delete payload.holidays;

        const response = await holidayClient.importExcel(payload);
        expect(response.status()).toBe(HTTP_STATUS.BAD_REQUEST);
    });

    test("TC_EMPTY_015 Import Excel without toYear @emptydata", async ({ holidayClient }) => {
        const payload = { ...holidayData.excelImport };
        delete payload.toYear;

        const response = await holidayClient.importExcel(payload);
        expect(response.status()).toBe(HTTP_STATUS.BAD_REQUEST);
    });

    test("TC_EMPTY_016 Import Excel with empty request body @emptydata", async ({ holidayClient }) => {
        const response = await holidayClient.importExcel({});
        expect(response.status()).toBe(HTTP_STATUS.BAD_REQUEST);
    });

});