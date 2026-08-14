const { test, expect } = require("../../fixtures/holiday.fixture");
const { loadResolvedJson } = require("../../utils/testData.util");
const holidayData = loadResolvedJson("../../test-data/holiday.json");
const { HTTP_STATUS } = require("../../api/constants/holiday.constants");

test.describe("Holiday Module APIs", () => {
    test.describe.configure({ mode: "serial" });

    test.describe("Read Operations", () => {

        test("TC01 Get current year holidays when holidays exist @read @regression", async ({ holidayClient }) => {
            const response = await holidayClient.getHolidays();
            expect(response.status()).toBe(HTTP_STATUS.OK);

            const body = await response.json();
            expect(Array.isArray(body)).toBeTruthy();
            expect(body.length).toBeGreaterThan(0);
        });

        test("TC02 Get current year holidays when no holidays exist @read @regression", async ({ holidayClient }) => {
            const response = await holidayClient.getHolidayByYear(holidayData.emptyHolidayYear);
            expect(response.status()).toBe(HTTP_STATUS.NO_CONTENT);
        });

        test("TC04 Verify holiday response schema @read @regression", async ({ holidayClient }) => {
            const response = await holidayClient.getHolidays();
            expect(response.status()).toBe(HTTP_STATUS.OK);

            const body = await response.json();
            expect(Array.isArray(body)).toBeTruthy();

            if (body.length > 0) {
                expect(body[0]).toHaveProperty("_id");
                expect(body[0]).toHaveProperty("holidayName");
                expect(body[0]).toHaveProperty("date");
                expect(body[0]).toHaveProperty("holidayType");
            }
        });

    });

    test.describe("Create Operations", () => {

        test("TC05 Create holiday with valid data @create @regression", async ({ holidayClient }) => {
            const payload = {
                ...holidayData.validHoliday,
                holidayName: `Automation Holiday ${Date.now()}`
            };

            const response = await holidayClient.createHoliday(payload);
            expect(response.status()).toBe(HTTP_STATUS.CREATED);

            const body = await response.json();
            expect(body).toHaveProperty("_id");
            expect(body.holidayName).toBe(payload.holidayName);
            expect(body.holidayType).toBe(payload.holidayType);
        });

        test("TC06 Create holiday with duplicate holiday name in same year @create @regression", async ({ holidayClient }) => {
            const payload = {
                holidayName: `Republic Day ${Date.now()}`,
                date: "2026-01-26",
                holidayType: "Public Holiday"
            };

            const firstResponse = await holidayClient.createHoliday(payload);
            expect(firstResponse.status()).toBe(HTTP_STATUS.CREATED);

            const secondResponse = await holidayClient.createHoliday(payload);
            expect(secondResponse.status()).toBe(HTTP_STATUS.CONFLICT);

            const body = await secondResponse.json();
            expect(body.message).toContain("Holiday with the same name already exists");
        });

        test("TC07 Create holiday with same holiday name in different year @create @regression", async ({ holidayClient }) => {
            const payload = {
                ...holidayData.differentYearHoliday,
                holidayName: `Republic Day ${Date.now()}`
            };

            const response = await holidayClient.createHoliday(payload);
            expect(response.status()).toBe(HTTP_STATUS.CREATED);

            const body = await response.json();
            expect(body).toHaveProperty("_id");
            expect(body.holidayName).toBe(payload.holidayName);
        });

        test("TC08 Create holiday with invalid date format @create @regression", async ({ holidayClient }) => {
            const response = await holidayClient.createHoliday(holidayData.invalidDate);
            expect(response.status()).toBe(HTTP_STATUS.BAD_REQUEST);

            const body = await response.json();
            expect(body).toHaveProperty("message");
        });

        test("TC09 Create holiday with invalid holidayType @create @regression", async ({ holidayClient }) => {
            const payload = {
                ...holidayData.invalidHolidayType,
                holidayName: `Invalid Type ${Date.now()}`
            };

            const response = await holidayClient.createHoliday(payload);
            expect(response.status()).toBe(HTTP_STATUS.BAD_REQUEST);

            const body = await response.json();
            expect(body).toHaveProperty("message");
        });

    });

    test.describe("Update Operations", () => {

        test("TC11 Update holiday with valid data @update @regression", async ({ holidayClient }) => {
            const createPayload = {
                ...holidayData.validHoliday,
                holidayName: `Update Holiday ${Date.now()}`
            };

            const createResponse = await holidayClient.createHoliday(createPayload);
            expect(createResponse.status()).toBe(HTTP_STATUS.CREATED);

            const createdHoliday = await createResponse.json();

            const response = await holidayClient.updateHoliday(createdHoliday._id, holidayData.updateHoliday);
            expect(response.status()).toBe(HTTP_STATUS.OK);

            const body = await response.json();
            expect(body._id).toBe(createdHoliday._id);
            expect(body.holidayName).toBe(holidayData.updateHoliday.holidayName);
            expect(body.holidayType).toBe(holidayData.updateHoliday.holidayType);
        });

        test("TC12 Update holiday using invalid holidayId @update @regression", async ({ holidayClient }) => {
            const response = await holidayClient.updateHoliday(holidayData.invalidHolidayId, holidayData.updateHoliday);
            expect(response.status()).toBe(HTTP_STATUS.BAD_REQUEST);

            const body = await response.json();
            expect(body).toHaveProperty("message");
        });

        test("TC13 Update holiday using non-existing holidayId @update @regression", async ({ holidayClient }) => {
            const response = await holidayClient.updateHoliday(holidayData.nonExistingHolidayId, holidayData.updateHoliday);
            expect(response.status()).toBe(HTTP_STATUS.NOT_FOUND);

            const body = await response.json();
            expect(body.message).toContain("Holiday not found");
        });

        test("TC14 Update holiday with invalid date @update @regression", async ({ holidayClient }) => {
            const response = await holidayClient.updateHoliday(holidayData.holidayId, holidayData.invalidDate);
            expect(response.status()).toBe(HTTP_STATUS.BAD_REQUEST);

            const body = await response.json();
            expect(body).toHaveProperty("message");
        });

        test("TC15 Update holiday with invalid holidayType @update @regression", async ({ holidayClient }) => {
            const createPayload = {
                ...holidayData.validHoliday,
                holidayName: `Holiday ${Date.now()}`
            };

            const createResponse = await holidayClient.createHoliday(createPayload);
            expect(createResponse.status()).toBe(HTTP_STATUS.CREATED);

            const createdHoliday = await createResponse.json();

            const updatePayload = {
                ...holidayData.invalidHolidayType,
                holidayName: `Holiday ${Date.now()}`
            };

            const response = await holidayClient.updateHoliday(createdHoliday._id, updatePayload);
            expect(response.status()).toBe(HTTP_STATUS.BAD_REQUEST);

            const body = await response.json();
            expect(body).toHaveProperty("message");
        });

    });

    test.describe("Delete Operations", () => {

        test("TC17 Delete existing holiday @delete @regression", async ({ holidayClient }) => {
            const payload = {
                ...holidayData.validHoliday,
                holidayName: `Delete Holiday ${Date.now()}`
            };

            const createResponse = await holidayClient.createHoliday(payload);
            expect(createResponse.status()).toBe(HTTP_STATUS.CREATED);

            const createdHoliday = await createResponse.json();

            const response = await holidayClient.deleteHoliday(createdHoliday._id);
            expect(response.status()).toBe(HTTP_STATUS.OK);

            const body = await response.json();
            expect(body._id).toBe(createdHoliday._id);
        });

        test("TC18 Delete holiday using invalid holidayId @delete @regression", async ({ holidayClient }) => {
            const response = await holidayClient.deleteHoliday(holidayData.invalidHolidayId);
            expect(response.status()).toBe(HTTP_STATUS.BAD_REQUEST);

            const body = await response.json();
            expect(body).toHaveProperty("message");
        });

        test("TC19 Delete holiday using non-existing holidayId @delete @regression", async ({ holidayClient }) => {
            const response = await holidayClient.deleteHoliday(holidayData.nonExistingHolidayId);
            expect(response.status()).toBe(HTTP_STATUS.NOT_FOUND);

            const body = await response.json();
            expect(body).toHaveProperty("message");
        });

    });

    test.describe("Import Operations", () => {

        test("TC21 Import holidays from one year to another @read @regression", async ({ holidayClient }) => {
            const targetYear = new Date().getFullYear() + 10;

            const payload = {
                fromYear: 2026,
                toYear: targetYear,
                replace: true // idempotent across reruns
            };

            const response = await holidayClient.importHolidays(payload);
            expect(response.status()).toBe(HTTP_STATUS.OK);

            const body = await response.json();
            expect(body).toHaveProperty("message");
            expect(body).toHaveProperty("insertedCount");
        });

        test("TC22 Import holidays when source year has no holidays @read @regression", async ({ holidayClient }) => {
            const payload = {
                fromYear: holidayData.emptyHolidayYear,
                toYear: 2028,
                replace: false
            };

            const response = await holidayClient.importHolidays(payload);
            expect(response.status()).toBe(HTTP_STATUS.NOT_FOUND);

            const body = await response.json();
            expect(body).toHaveProperty("message");
        });

        test("TC23 Import holidays when destination year already contains holidays (replace=false) @read @holiday @regression", async ({ holidayClient }) => {
            // Depends on TC07 having already created a 2027 holiday earlier in this run.
            const response = await holidayClient.importHolidays(holidayData.importHoliday);
            expect(response.status()).toBe(HTTP_STATUS.CONFLICT);

            const body = await response.json();
            expect(body).toHaveProperty("message");
        });

        test("TC24 Import holidays when destination year already contains holidays (replace=true) @read @holiday @regression", async ({ holidayClient }) => {
            const response = await holidayClient.importHolidays(holidayData.importHolidayReplace);
            expect(response.status()).toBe(HTTP_STATUS.OK);

            const body = await response.json();
            expect(body).toHaveProperty("message");
            expect(body).toHaveProperty("insertedCount");
        });

        test("TC25 Import holidays with invalid fromYear @read @regression", async ({ holidayClient }) => {
            const response = await holidayClient.importHolidays(holidayData.invalidFromYear);
            expect(response.status()).toBe(HTTP_STATUS.BAD_REQUEST);

            const body = await response.json();
            expect(body).toHaveProperty("message");
        });

        test("TC26 Import holidays with invalid toYear @read @regression", async ({ holidayClient }) => {
            const response = await holidayClient.importHolidays(holidayData.invalidToYear);
            expect(response.status()).toBe(HTTP_STATUS.BAD_REQUEST);

            const body = await response.json();
            expect(body).toHaveProperty("message");
        });

        test("TC27 Verify imported holiday count @read @regression", async ({ holidayClient }) => {
            const toYear = new Date().getFullYear() + 15; // distinct from TC21's target year

            const payload = {
                fromYear: 2026,
                toYear,
                replace: true // self-sufficient regardless of prior run state
            };

            const importResponse = await holidayClient.importHolidays(payload);
            expect(importResponse.status()).toBe(HTTP_STATUS.OK);

            const imported = await importResponse.json();

            const response = await holidayClient.getHolidayByYear(toYear);
            expect(response.status()).toBe(HTTP_STATUS.OK);

            const holidays = await response.json();
            expect(Array.isArray(holidays)).toBeTruthy();
            expect(holidays.length).toBe(imported.insertedCount);
        });

    });

    test.describe("Year Lookup Operations", () => {

        test("TC29 Get distinct holiday years @read @regression", async ({ holidayClient }) => {
            const response = await holidayClient.getHolidayYears();
            expect(response.status()).toBe(HTTP_STATUS.OK);

            const years = await response.json();
            expect(Array.isArray(years)).toBeTruthy();
            expect(years.length).toBeGreaterThan(0);
        });

        test("TC30 Get distinct years when no holidays exist @read @regression", async ({ holidayClient }) => {
            // Destructive: wipes the whole collection. Must run alone (serial mode
            // above guarantees no other test is running concurrently against the DB).
            const resetResponse = await holidayClient.resetAllHolidays();
            expect(resetResponse.status()).toBe(HTTP_STATUS.OK);

            const response = await holidayClient.getHolidayYears();
            expect(response.status()).toBe(HTTP_STATUS.NOT_FOUND);

            const body = await response.json();
            expect(body).toHaveProperty("message");

            // Restore baseline data so later tests (TC33/36/39/40 etc.) that
            // expect the "existing year" (2026) to have holidays still pass.
            const restore = await holidayClient.createHoliday({
                holidayName: `Baseline Holiday ${Date.now()}`,
                date: `${holidayData.existingYear}-01-01`,
                holidayType: "Public Holiday"
            });
            expect(restore.status()).toBe(HTTP_STATUS.CREATED);
        });

        test("TC31 Verify years are returned in ascending order @read @regression", async ({ holidayClient }) => {
            const response = await holidayClient.getHolidayYears();
            expect(response.status()).toBe(HTTP_STATUS.OK);

            const years = await response.json();
            const sortedYears = [...years].sort((a, b) => a - b);
            expect(years).toEqual(sortedYears);
        });

    });

    test.describe("Year-based Read Operations", () => {

        test("TC33 Get holidays for valid year @read @regression", async ({ holidayClient }) => {
            const response = await holidayClient.getHolidayByYear(holidayData.existingYear);
            expect(response.status()).toBe(HTTP_STATUS.OK);

            const body = await response.json();
            expect(Array.isArray(body)).toBeTruthy();
            expect(body.length).toBeGreaterThan(0);
        });

        test("TC34 Get holidays for year having no holidays @read @regression", async ({ holidayClient }) => {
            const response = await holidayClient.getHolidayByYear(holidayData.emptyHolidayYear);
            expect(response.status()).toBe(HTTP_STATUS.NO_CONTENT);
        });

        test("TC35 Get holidays using invalid year format @read @regression", async ({ holidayClient }) => {
            const response = await holidayClient.getHolidayByYear(holidayData.invalidYear);
            expect(response.status()).toBe(HTTP_STATUS.BAD_REQUEST);
        });

        test("TC36 Verify holiday response schema @read @regression", async ({ holidayClient }) => {
            const response = await holidayClient.getHolidayByYear(holidayData.existingYear);
            expect(response.status()).toBe(HTTP_STATUS.OK);

            const body = await response.json();
            expect(Array.isArray(body)).toBeTruthy();

            if (body.length > 0) {
                expect(body[0]).toHaveProperty("_id");
                expect(body[0]).toHaveProperty("holidayName");
                expect(body[0]).toHaveProperty("date");
                expect(body[0]).toHaveProperty("holidayType");
            }
        });

    });

    test.describe("Excel Import Operations", () => {

        test("TC38 Import holidays from Excel data @read @regression", async ({ holidayClient }) => {
            const payload = {
                ...holidayData.excelImport,
                toYear: 2028,
                replace: true // idempotent across reruns
            };

            const response = await holidayClient.importExcel(payload);
            expect(response.status()).toBe(HTTP_STATUS.CREATED);

            const body = await response.json();
            expect(body).toHaveProperty("message");
            expect(body).toHaveProperty("insertedCount");
        });

        test("TC39 Import Excel holidays with replace=true @read @regression", async ({ holidayClient }) => {
            const payload = {
                ...holidayData.excelImport,
                toYear: holidayData.existingYear,
                replace: true
            };

            const response = await holidayClient.importExcel(payload);
            expect(response.status()).toBe(HTTP_STATUS.CREATED);

            const body = await response.json();
            expect(body).toHaveProperty("message");
        });

        test("TC40 Import Excel holidays with replace=false when holidays already exist @read @regression", async ({ holidayClient }) => {
            // Depends on TC39 just having populated holidayData.existingYear.
            const payload = {
                ...holidayData.excelImport,
                toYear: holidayData.existingYear,
                replace: false
            };

            const response = await holidayClient.importExcel(payload);
            expect(response.status()).toBe(HTTP_STATUS.CONFLICT);

            const body = await response.json();
            expect(body).toHaveProperty("message");
        });

        test("TC41 Import Excel data with duplicate holidays @read @regression", async ({ holidayClient }) => {
            const payload = {
                ...holidayData.duplicateExcelHoliday,
                toYear: 2029
            };

            const response = await holidayClient.importExcel(payload);
            expect(response.status()).toBe(HTTP_STATUS.BAD_REQUEST);

            const body = await response.json();
            expect(body).toHaveProperty("message");
        });

        test("TC42 Import Excel data with invalid holiday object @read @regression", async ({ holidayClient }) => {
            const payload = {
                ...holidayData.invalidHolidayObject,
                toYear: 2030
            };

            const response = await holidayClient.importExcel(payload);
            expect(response.status()).toBe(HTTP_STATUS.BAD_REQUEST);

            const body = await response.json();
            expect(body).toHaveProperty("message");
        });

        test("TC43 Verify imported holiday count @read @regression", async ({ holidayClient }) => {
            const targetYear = 2031;

            const payload = {
                ...holidayData.excelImport,
                toYear: targetYear,
                replace: true // idempotent across reruns
            };

            const importResponse = await holidayClient.importExcel(payload);
            expect(importResponse.status()).toBe(HTTP_STATUS.CREATED);

            const response = await holidayClient.getHolidayByYear(targetYear);
            expect(response.status()).toBe(HTTP_STATUS.OK);

            const body = await response.json();
            expect(Array.isArray(body)).toBeTruthy();
            expect(body.length).toBe(payload.holidays.length);
        });

    });

});