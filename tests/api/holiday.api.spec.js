const { test, expect } = require("../../fixtures/holiday.fixture");
const holidayData = require("../../test-data/holiday.json");
const { HTTP_STATUS } = require("../../api/constants/holiday.constants");

test.describe("Holiday Module APIs", () => {
    // The whole file must stay in this single serial run: several tests in
    // later groups depend on data created/mutated by earlier groups
    // (e.g. TC07's 2027 holiday is read by TC23, TC30 wipes and restores the
    // collection for tests after it, TC39 populates existingYear for TC40).
    test.describe.configure({ mode: "serial" });

    test.describe("Holiday Module - Read Operations", () => {

        test("TC01 Get current year holidays when holidays exist", async ({ holidayClient }) => {
            const response = await holidayClient.getHolidays();
            expect(response.status()).toBe(HTTP_STATUS.OK);

            const body = await response.json();
            expect(Array.isArray(body)).toBeTruthy();
            expect(body.length).toBeGreaterThan(0);
        });

        test("TC02 Get current year holidays when no holidays exist", async ({ holidayClient }) => {
            const response = await holidayClient.getHolidayByYear(holidayData.emptyHolidayYear);
            expect(response.status()).toBe(HTTP_STATUS.NO_CONTENT);
        });

        test("TC03 Get current year holidays without Authorization", async ({ holidayClient }) => {
            const response = await holidayClient.getHolidaysWithoutAuth();
            expect(response.status()).toBe(HTTP_STATUS.UNAUTHORIZED);
        });

        test("TC04 Verify holiday response schema", async ({ holidayClient }) => {
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

    test.describe("Holiday Module - Create Operations", () => {

        test("TC05 Create holiday with valid data", async ({ holidayClient }) => {
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

        test("TC06 Create holiday with duplicate holiday name in same year", async ({ holidayClient }) => {
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

        test("TC07 Create holiday with same holiday name in different year", async ({ holidayClient }) => {
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

        test("TC08 Create holiday with invalid date format", async ({ holidayClient }) => {
            const response = await holidayClient.createHoliday(holidayData.invalidDate);
            expect(response.status()).toBe(HTTP_STATUS.BAD_REQUEST);

            const body = await response.json();
            expect(body).toHaveProperty("message");
        });

        test("TC09 Create holiday with invalid holidayType", async ({ holidayClient }) => {
            const payload = {
                ...holidayData.invalidHolidayType,
                holidayName: `Invalid Type ${Date.now()}`
            };

            const response = await holidayClient.createHoliday(payload);
            expect(response.status()).toBe(HTTP_STATUS.BAD_REQUEST);

            const body = await response.json();
            expect(body).toHaveProperty("message");
        });

        test("TC10 Create holiday without Authorization", async ({ holidayClient }) => {
            const response = await holidayClient.createHolidayWithoutAuth(holidayData.validHoliday);
            expect(response.status()).toBe(HTTP_STATUS.UNAUTHORIZED);
        });

    });

    test.describe("Holiday Module - Update Operations", () => {

        test("TC11 Update holiday with valid data", async ({ holidayClient }) => {
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

        test("TC12 Update holiday using invalid holidayId", async ({ holidayClient }) => {
            const response = await holidayClient.updateHoliday(holidayData.invalidHolidayId, holidayData.updateHoliday);
            expect(response.status()).toBe(HTTP_STATUS.BAD_REQUEST);

            const body = await response.json();
            expect(body).toHaveProperty("message");
        });

        test("TC13 Update holiday using non-existing holidayId", async ({ holidayClient }) => {
            const response = await holidayClient.updateHoliday(holidayData.nonExistingHolidayId, holidayData.updateHoliday);
            expect(response.status()).toBe(HTTP_STATUS.NOT_FOUND);

            const body = await response.json();
            expect(body.message).toContain("Holiday not found");
        });

        test("TC14 Update holiday with invalid date", async ({ holidayClient }) => {
            const response = await holidayClient.updateHoliday(holidayData.holidayId, holidayData.invalidDate);
            expect(response.status()).toBe(HTTP_STATUS.BAD_REQUEST);

            const body = await response.json();
            expect(body).toHaveProperty("message");
        });

        test("TC15 Update holiday with invalid holidayType", async ({ holidayClient }) => {
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

        test("TC16 Update holiday without Authorization", async ({ holidayClient }) => {
            const response = await holidayClient.updateHolidayWithoutAuth(holidayData.holidayId, holidayData.updateHoliday);
            expect(response.status()).toBe(HTTP_STATUS.UNAUTHORIZED);
        });

    });

    test.describe("Holiday Module - Delete Operations", () => {

        test("TC17 Delete existing holiday", async ({ holidayClient }) => {
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

        test("TC18 Delete holiday using invalid holidayId", async ({ holidayClient }) => {
            const response = await holidayClient.deleteHoliday(holidayData.invalidHolidayId);
            expect(response.status()).toBe(HTTP_STATUS.BAD_REQUEST);

            const body = await response.json();
            expect(body).toHaveProperty("message");
        });

        test("TC19 Delete holiday using non-existing holidayId", async ({ holidayClient }) => {
            const response = await holidayClient.deleteHoliday(holidayData.nonExistingHolidayId);
            expect(response.status()).toBe(HTTP_STATUS.NOT_FOUND);

            const body = await response.json();
            expect(body).toHaveProperty("message");
        });

        test("TC20 Delete holiday without Authorization", async ({ holidayClient }) => {
            const response = await holidayClient.deleteHolidayWithoutAuth(holidayData.holidayId);
            expect(response.status()).toBe(HTTP_STATUS.UNAUTHORIZED);
        });

    });

    test.describe("Holiday Module - Import Operations", () => {

        test("TC21 Import holidays from one year to another", async ({ holidayClient }) => {
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

        test("TC22 Import holidays when source year has no holidays", async ({ holidayClient }) => {
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

        test("TC23 Import holidays when destination year already contains holidays (replace=false)", async ({ holidayClient }) => {
            // Depends on TC07 having already created a 2027 holiday earlier in this run.
            const response = await holidayClient.importHolidays(holidayData.importHoliday);
            expect(response.status()).toBe(HTTP_STATUS.CONFLICT);

            const body = await response.json();
            expect(body).toHaveProperty("message");
        });

        test("TC24 Import holidays when destination year already contains holidays (replace=true)", async ({ holidayClient }) => {
            const response = await holidayClient.importHolidays(holidayData.importHolidayReplace);
            expect(response.status()).toBe(HTTP_STATUS.OK);

            const body = await response.json();
            expect(body).toHaveProperty("message");
            expect(body).toHaveProperty("insertedCount");
        });

        test("TC25 Import holidays with invalid fromYear", async ({ holidayClient }) => {
            const response = await holidayClient.importHolidays(holidayData.invalidFromYear);
            expect(response.status()).toBe(HTTP_STATUS.BAD_REQUEST);

            const body = await response.json();
            expect(body).toHaveProperty("message");
        });

        test("TC26 Import holidays with invalid toYear", async ({ holidayClient }) => {
            const response = await holidayClient.importHolidays(holidayData.invalidToYear);
            expect(response.status()).toBe(HTTP_STATUS.BAD_REQUEST);

            const body = await response.json();
            expect(body).toHaveProperty("message");
        });

        test("TC27 Verify imported holiday count", async ({ holidayClient }) => {
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

        test("TC28 Import holidays without Authorization", async ({ holidayClient }) => {
            const response = await holidayClient.importHolidaysWithoutAuth(holidayData.importHoliday);
            expect(response.status()).toBe(HTTP_STATUS.UNAUTHORIZED);
        });

    });

    test.describe("Holiday Module - Holiday Years", () => {

        test("TC29 Get distinct holiday years", async ({ holidayClient }) => {
            const response = await holidayClient.getHolidayYears();
            expect(response.status()).toBe(HTTP_STATUS.OK);

            const years = await response.json();
            expect(Array.isArray(years)).toBeTruthy();
            expect(years.length).toBeGreaterThan(0);
        });

        test("TC30 Get distinct years when no holidays exist", async ({ holidayClient }) => {
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

        test("TC31 Verify years are returned in ascending order", async ({ holidayClient }) => {
            const response = await holidayClient.getHolidayYears();
            expect(response.status()).toBe(HTTP_STATUS.OK);

            const years = await response.json();
            const sortedYears = [...years].sort((a, b) => a - b);
            expect(years).toEqual(sortedYears);
        });

        test("TC32 Get distinct years without Authorization", async ({ holidayClient }) => {
            const response = await holidayClient.getHolidayYearsWithoutAuth();
            expect(response.status()).toBe(HTTP_STATUS.UNAUTHORIZED);
        });

    });

    test.describe("Holiday Module - Get By Year", () => {

        test("TC33 Get holidays for valid year", async ({ holidayClient }) => {
            const response = await holidayClient.getHolidayByYear(holidayData.existingYear);
            expect(response.status()).toBe(HTTP_STATUS.OK);

            const body = await response.json();
            expect(Array.isArray(body)).toBeTruthy();
            expect(body.length).toBeGreaterThan(0);
        });

        test("TC34 Get holidays for year having no holidays", async ({ holidayClient }) => {
            const response = await holidayClient.getHolidayByYear(holidayData.emptyHolidayYear);
            expect(response.status()).toBe(HTTP_STATUS.NO_CONTENT);
        });

        test("TC35 Get holidays using invalid year format", async ({ holidayClient }) => {
            const response = await holidayClient.getHolidayByYear(holidayData.invalidYear);
            expect(response.status()).toBe(HTTP_STATUS.BAD_REQUEST);
        });

        test("TC36 Verify holiday response schema", async ({ holidayClient }) => {
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

        test("TC37 Get holidays without Authorization", async ({ holidayClient }) => {
            const response = await holidayClient.getHolidayByYearWithoutAuth(holidayData.existingYear);
            expect(response.status()).toBe(HTTP_STATUS.UNAUTHORIZED);
        });

    });

    test.describe("Holiday Module - Excel Import Operations", () => {

        test("TC38 Import holidays from Excel data", async ({ holidayClient }) => {
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

        test("TC39 Import Excel holidays with replace=true", async ({ holidayClient }) => {
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

        test("TC40 Import Excel holidays with replace=false when holidays already exist", async ({ holidayClient }) => {
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

        test("TC41 Import Excel data with duplicate holidays", async ({ holidayClient }) => {
            const payload = {
                ...holidayData.duplicateExcelHoliday,
                toYear: 2029
            };

            const response = await holidayClient.importExcel(payload);
            expect(response.status()).toBe(HTTP_STATUS.BAD_REQUEST);

            const body = await response.json();
            expect(body).toHaveProperty("message");
        });

        test("TC42 Import Excel data with invalid holiday object", async ({ holidayClient }) => {
            const payload = {
                ...holidayData.invalidHolidayObject,
                toYear: 2030
            };

            const response = await holidayClient.importExcel(payload);
            expect(response.status()).toBe(HTTP_STATUS.BAD_REQUEST);

            const body = await response.json();
            expect(body).toHaveProperty("message");
        });

        test("TC43 Verify imported holiday count", async ({ holidayClient }) => {
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

        test("TC44 Import Excel holidays without Authorization", async ({ holidayClient }) => {
            const response = await holidayClient.importExcelWithoutAuth(holidayData.excelImport);
            expect(response.status()).toBe(HTTP_STATUS.UNAUTHORIZED);
        });

    });

});

// Empty-data scenarios moved from tests/empty/empty-data.holiday.api.spec.js
test.describe("Holiday Module - Empty Data Validation", () => {

    test.describe.configure({ mode: "serial" });

    test("TC_EMPTY_001 Create holiday without holidayName @emptydata @create @crud @regression @smoke @sanity", async ({ holidayClient }) => {
        const payload = { ...holidayData.validHoliday };
        delete payload.holidayName;

        const response = await holidayClient.createHoliday(payload);
        expect(response.status()).toBe(HTTP_STATUS.BAD_REQUEST);
    });

    test("TC_EMPTY_002 Create holiday without date @emptydata @create @crud @regression", async ({ holidayClient }) => {
        const payload = { ...holidayData.validHoliday };
        delete payload.date;

        const response = await holidayClient.createHoliday(payload);
        expect(response.status()).toBe(HTTP_STATUS.BAD_REQUEST);
    });

    test("TC_EMPTY_003 Create holiday without holidayType @emptydata @create @crud @regression", async ({ holidayClient }) => {
        const payload = { ...holidayData.validHoliday };
        delete payload.holidayType;

        const response = await holidayClient.createHoliday(payload);
        expect(response.status()).toBe(HTTP_STATUS.BAD_REQUEST);
    });

    test("TC_EMPTY_004 Create holiday with empty request body @emptydata @create @crud @regression", async ({ holidayClient }) => {
        const response = await holidayClient.createHoliday({});
        expect(response.status()).toBe(HTTP_STATUS.BAD_REQUEST);
    });

    test("TC_EMPTY_005 Update holiday with empty request body @emptydata @update @crud @regression", async ({ holidayClient }) => {
        const response = await holidayClient.updateHoliday(holidayData.holidayId, {});
        expect(response.status()).toBe(HTTP_STATUS.BAD_REQUEST);
    });

    test("TC_EMPTY_006 Update holiday without holidayName @emptydata @update @crud @regression", async ({ holidayClient }) => {
        const payload = { ...holidayData.updateHoliday };
        delete payload.holidayName;

        const response = await holidayClient.updateHoliday(holidayData.holidayId, payload);
        expect(response.status()).toBe(HTTP_STATUS.BAD_REQUEST);
    });

    test("TC_EMPTY_007 Update holiday without date @emptydata @update @crud @regression", async ({ holidayClient }) => {
        const payload = { ...holidayData.updateHoliday };
        delete payload.date;

        const response = await holidayClient.updateHoliday(holidayData.holidayId, payload);
        expect(response.status()).toBe(HTTP_STATUS.BAD_REQUEST);
    });

    test("TC_EMPTY_008 Update holiday without holidayType @emptydata @update @crud @regression", async ({ holidayClient }) => {
        const payload = { ...holidayData.updateHoliday };
        delete payload.holidayType;

        const response = await holidayClient.updateHoliday(holidayData.holidayId, payload);
        expect(response.status()).toBe(HTTP_STATUS.BAD_REQUEST);
    });

    test("TC_EMPTY_009 Import holidays without fromYear @emptydata @create @crud @regression", async ({ holidayClient }) => {
        const payload = { ...holidayData.importHoliday };
        delete payload.fromYear;

        const response = await holidayClient.importHolidays(payload);
        expect(response.status()).toBe(HTTP_STATUS.BAD_REQUEST);
    });

    test("TC_EMPTY_010 Import holidays without toYear @emptydata @create @crud @regression", async ({ holidayClient }) => {
        const payload = { ...holidayData.importHoliday };
        delete payload.toYear;

        const response = await holidayClient.importHolidays(payload);
        expect(response.status()).toBe(HTTP_STATUS.BAD_REQUEST);
    });

    test("TC_EMPTY_011 Import holidays with empty request body @emptydata @create @crud @regression", async ({ holidayClient }) => {
        const response = await holidayClient.importHolidays({});
        expect(response.status()).toBe(HTTP_STATUS.BAD_REQUEST);
    });

    test("TC_EMPTY_012 Get holidays with empty year @emptydata @read @regression @sanity", async ({ holidayClient }) => {
        const response = await holidayClient.getHolidayByYear("");
        expect(response.status()).toBe(HTTP_STATUS.BAD_REQUEST);
    });

    test("TC_EMPTY_013 Import Excel with empty holidays array @emptydata @create @crud @regression", async ({ holidayClient }) => {
        const payload = { ...holidayData.excelImport, holidays: [] };

        const response = await holidayClient.importExcel(payload);
        expect(response.status()).toBe(HTTP_STATUS.BAD_REQUEST);
    });

    test("TC_EMPTY_014 Import Excel without holidays @emptydata @create @crud @regression", async ({ holidayClient }) => {
        const payload = { ...holidayData.excelImport };
        delete payload.holidays;

        const response = await holidayClient.importExcel(payload);
        expect(response.status()).toBe(HTTP_STATUS.BAD_REQUEST);
    });

    test("TC_EMPTY_015 Import Excel without toYear @emptydata @create @crud @regression", async ({ holidayClient }) => {
        const payload = { ...holidayData.excelImport };
        delete payload.toYear;

        const response = await holidayClient.importExcel(payload);
        expect(response.status()).toBe(HTTP_STATUS.BAD_REQUEST);
    });

    test("TC_EMPTY_016 Import Excel with empty request body @emptydata @create @crud @regression", async ({ holidayClient }) => {
        const response = await holidayClient.importExcel({});
        expect(response.status()).toBe(HTTP_STATUS.BAD_REQUEST);
    });

});
