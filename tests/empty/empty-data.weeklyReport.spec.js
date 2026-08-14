const { test, expect } = require('../../fixtures/weeklyReport.fixture');
const { HTTP_STATUS } = require('../../api/constants/weeklyReport.constants');
const { loadResolvedJson } = require('../../utils/testData.util');
const weeklyReportData = loadResolvedJson('../../test-data/weeklyReport.json');

test.describe('Weekly Report - Empty Data Validation', () => {
    test.describe('Read Operations', () => {
        test('TC_EMPTY_001 Get weekly reports byWeek without employeeId @emptydata @smoke @read', async ({ weeklyReportClient }) => {
            const params = { ...weeklyReportData.byWeek.valid };
            delete params.employeeId;

            const response = await weeklyReportClient.getWeeklyReportsByWeek(params);
            expect(response.status()).toBe(HTTP_STATUS.OK);

            const body = await response.json();
            expect(Array.isArray(body)).toBeTruthy();
        });

        test('TC_EMPTY_002 Get weekly reports byWeek without year @emptydata @sanity @read', async ({ weeklyReportClient }) => {
            const params = { ...weeklyReportData.byWeek.valid };
            delete params.year;

            const response = await weeklyReportClient.getWeeklyReportsByWeek(params);
            expect(response.status()).toBe(HTTP_STATUS.OK);

            const body = await response.json();
            expect(Array.isArray(body)).toBeTruthy();
        });

        test('TC_EMPTY_003 Get weekly reports byWeek without weekStartDate @emptydata @sanity @read', async ({ weeklyReportClient }) => {
            const params = { ...weeklyReportData.byWeek.valid };
            delete params.weekStartDate;

            const response = await weeklyReportClient.getWeeklyReportsByWeek(params);
            expect(response.status()).toBe(HTTP_STATUS.OK);

            const body = await response.json();
            expect(Array.isArray(body)).toBeTruthy();
        });

        test('TC_EMPTY_004 Get weekly reports byWeek without weekEndDate @emptydata @regression @read', async ({ weeklyReportClient }) => {
            const params = { ...weeklyReportData.byWeek.valid };
            delete params.weekEndDate;

            const response = await weeklyReportClient.getWeeklyReportsByWeek(params);
            expect(response.status()).toBe(HTTP_STATUS.OK);

            const body = await response.json();
            expect(Array.isArray(body)).toBeTruthy();
        });

        test('TC_EMPTY_012 Get all weekly reports when no records exist @emptydata @regression @read', async ({ weeklyReportClient }) => {
            const response = await weeklyReportClient.getWeeklyReports();
            expect(response.status()).toBe(HTTP_STATUS.NOT_FOUND);

            const body = await response.json();
            expect(body.message).toBe(weeklyReportData.messages.noWeeklyReports);
        });
    });

    test.describe('Create Operations', () => {
        test('TC_EMPTY_005 Create weekly report with empty array @emptydata @regression @create', async ({ weeklyReportClient }) => {
            const response = await weeklyReportClient.createWeeklyReports(weeklyReportData.empty.emptyArray);
            expect(response.status()).toBe(HTTP_STATUS.BAD_REQUEST);

            const body = await response.json();
            expect(body.message).toBe(weeklyReportData.messages.badRequest);
        });

        test('TC_EMPTY_006 Create weekly report with empty request body @emptydata @regression @create', async ({ weeklyReportClient }) => {
            const response = await weeklyReportClient.createWeeklyReports(weeklyReportData.empty.emptyObject);
            expect(response.status()).toBe(HTTP_STATUS.BAD_REQUEST);

            const body = await response.json();
            expect(body.message).toBe(weeklyReportData.messages.badRequest);
        });

        test('TC_EMPTY_007 Create report without employeeId @emptydata @sanity @create', async ({ weeklyReportClient }) => {
            const response = await weeklyReportClient.createWeeklyReports([weeklyReportData.empty.withoutEmployeeId]);
            expect(response.status()).toBe(HTTP_STATUS.OK);

            const body = await response.json();
            expect(body.message).toBe(weeklyReportData.messages.noNewReports);
        });

        test('TC_EMPTY_008 Create report without date @emptydata @sanity @create', async ({ weeklyReportClient }) => {
            const response = await weeklyReportClient.createWeeklyReports([weeklyReportData.empty.withoutDate]);
            expect(response.status()).toBe(HTTP_STATUS.OK);

            const body = await response.json();
            expect(body.message).toBe(weeklyReportData.messages.noNewReports);
        });

        test('TC_EMPTY_009 Create report without topic @emptydata @regression @create', async ({ weeklyReportClient }) => {
            const response = await weeklyReportClient.createWeeklyReports([weeklyReportData.empty.withoutTopic]);
            expect(response.status()).toBe(HTTP_STATUS.OK);

            const body = await response.json();
            expect(body.message).toBe(weeklyReportData.messages.noNewReports);
        });

        test('TC_EMPTY_010 Create report without description @emptydata @regression @create', async ({ weeklyReportClient }) => {
            const response = await weeklyReportClient.createWeeklyReports([weeklyReportData.empty.withoutDescription]);
            expect(response.status()).toBe(HTTP_STATUS.OK);

            const body = await response.json();
            expect(body.message).toBe(weeklyReportData.messages.noNewReports);
        });

        test('TC_EMPTY_011 Create report without status @emptydata @regression @create', async ({ weeklyReportClient }) => {
            const response = await weeklyReportClient.createWeeklyReports([weeklyReportData.empty.withoutStatus]);
            expect(response.status()).toBe(HTTP_STATUS.OK);

            const body = await response.json();
            expect(body.message).toBe(weeklyReportData.messages.noNewReports);
        });
    });
});