const { test, expect } = require('../../fixtures/weeklyReport.fixture');
const { HTTP_STATUS } = require('../../api/constants/weeklyReport.constants');
const weeklyReportData = require('../../test-data/weeklyReport.json');

const uniqueDate = (saltMs = 0) => {
    const random = Math.floor(Math.random() * 1_000_000);
    return new Date(Date.now() + saltMs + random).toISOString();
};

const uniqueNonExistentEmployeeId = () => {
    const random = Math.floor(Math.random() * 0xffffffff).toString(16).padStart(8, '0');
    return `7${random}${Date.now().toString(16)}`.padEnd(24, '0').slice(0, 24);
};

test.describe('Weekly Report Read APIs', () => {

    test('TC01 Get all weekly reports @read @weeklyreport @regression @smoke @sanity', async ({
        weeklyReportClient
    }) => {

        const response =
            await weeklyReportClient.getWeeklyReports();

        expect(response.status())
            .toBe(HTTP_STATUS.OK);

        const body =
            await response.json();

        expect(Array.isArray(body))
            .toBeTruthy();

    });

    test('TC02 Get all weekly reports when records exist @read @weeklyreport @regression', async ({
        weeklyReportClient
    }) => {

        // Ensure at least one record exists regardless of run order/history.
        await weeklyReportClient.createWeeklyReports([
            { ...weeklyReportData.valid, date: uniqueDate() }
        ]);

        const response =
            await weeklyReportClient.getWeeklyReports();

        expect(response.status())
            .toBe(HTTP_STATUS.OK);

        const body =
            await response.json();

        expect(Array.isArray(body))
            .toBeTruthy();

        expect(body.length)
            .toBeGreaterThan(0);

    });

    test('TC03 Verify weekly report response schema @read @weeklyreport @regression', async ({
        weeklyReportClient
    }) => {

        await weeklyReportClient.createWeeklyReports([
            { ...weeklyReportData.valid, date: uniqueDate() }
        ]);

        const response =
            await weeklyReportClient.getWeeklyReports();

        expect(response.status())
            .toBe(HTTP_STATUS.OK);

        const body =
            await response.json();

        expect(Array.isArray(body))
            .toBeTruthy();

        if (body.length > 0) {

            expect(body[0])
                .toHaveProperty('_id');

            expect(body[0])
                .toHaveProperty('employeeId');

            expect(body[0])
                .toHaveProperty('date');

            expect(body[0])
                .toHaveProperty('topic');

            expect(body[0])
                .toHaveProperty('description');

            expect(body[0])
                .toHaveProperty('status');

        }

    });

    test('TC04 Get all weekly reports without Authorization @read @weeklyreport @regression', async ({
        weeklyReportClient
    }) => {

        const response =
            await weeklyReportClient.getWeeklyReportsWithoutAuth();

        expect(response.status())
            .toBe(HTTP_STATUS.UNAUTHORIZED);

    });

});


test.describe('Weekly Report By Week APIs', () => {

    test('TC05 Get weekly reports for valid employee and week @read @weeklyreport @regression @smoke @sanity', async ({
        weeklyReportClient
    }) => {

        // Seed a report inside the target week so this test doesn't depend
        // on data created by earlier tests/runs.
        await weeklyReportClient.createWeeklyReports([{
            ...weeklyReportData.valid,
            date: '2026-08-05T12:00:00.000Z' // inside byWeek.valid range
        }]);

        const response =
            await weeklyReportClient.getWeeklyReportsByWeek(
                weeklyReportData.byWeek.valid
            );

        expect(response.status())
            .toBe(HTTP_STATUS.OK);

        const body =
            await response.json();

        expect(Array.isArray(body))
            .toBeTruthy();

        expect(body.length)
            .toBeGreaterThan(0);

    });

    test('TC06 Get weekly reports when no reports exist for selected week @read @weeklyreport @regression', async ({
        weeklyReportClient
    }) => {

        const response =
            await weeklyReportClient.getWeeklyReportsByWeek(
                weeklyReportData.byWeek.noReportsWeek
            );

        expect(response.status())
            .toBe(HTTP_STATUS.OK);

        const body =
            await response.json();

        expect(body)
            .toEqual([]);

    });

    // Fixed: use a dedicated employeeId that is NEVER used by any create
    // test, so it can't be "poisoned" by TC20 (or anything else) running
    // first. Keep this id out of test-data.json's create fixtures entirely.
    test('TC07 Get weekly reports using invalid employeeId @read @weeklyreport @regression', async ({
        weeklyReportClient
    }) => {

        const params = {
            ...weeklyReportData.byWeek.invalidEmployee,
            employeeId: uniqueNonExistentEmployeeId()
        };

        const response =
            await weeklyReportClient.getWeeklyReportsByWeek(params);

        expect(response.status())
            .toBe(HTTP_STATUS.OK);

        const body =
            await response.json();

        expect(body)
            .toEqual([]);

    });

    test('TC08 Get weekly reports for different year @read @weeklyreport @regression', async ({
        weeklyReportClient
    }) => {

        const response =
            await weeklyReportClient.getWeeklyReportsByWeek(
                weeklyReportData.byWeek.differentYear
            );

        expect(response.status())
            .toBe(HTTP_STATUS.OK);

        const body =
            await response.json();

        expect(Array.isArray(body))
            .toBeTruthy();

    });

    test('TC09 Verify reports are sorted by date @read @weeklyreport @regression', async ({
        weeklyReportClient
    }) => {

        await weeklyReportClient.createWeeklyReports([{
            ...weeklyReportData.valid,
            date: '2026-08-04T12:00:00.000Z'
        }]);

        const response =
            await weeklyReportClient.getWeeklyReportsByWeek(
                weeklyReportData.byWeek.valid
            );

        expect(response.status())
            .toBe(HTTP_STATUS.OK);

        const body =
            await response.json();

        expect(Array.isArray(body))
            .toBeTruthy();

        for (let i = 1; i < body.length; i++) {

            const previousDate =
                new Date(body[i - 1].date);

            const currentDate =
                new Date(body[i].date);

            expect(currentDate.getTime())
                .toBeGreaterThanOrEqual(previousDate.getTime());

        }

    });

    test('TC10 Verify reports belong only to requested week @read @weeklyreport @regression', async ({
        weeklyReportClient
    }) => {

        const params =
            weeklyReportData.byWeek.valid;

        const response =
            await weeklyReportClient.getWeeklyReportsByWeek(params);

        expect(response.status())
            .toBe(HTTP_STATUS.OK);

        const body =
            await response.json();

        const startDate =
            new Date(params.weekStartDate).getTime();

        const endDate =
            new Date(params.weekEndDate).getTime();

        for (const report of body) {

            const reportDate =
                new Date(report.date).getTime();

            expect(reportDate)
                .toBeGreaterThanOrEqual(startDate);

            expect(reportDate)
                .toBeLessThanOrEqual(endDate);

            expect(report.employeeId)
                .toBe(params.employeeId);

        }

    });

    test('TC11 Verify response schema @read @weeklyreport @regression', async ({
        weeklyReportClient
    }) => {

        const response =
            await weeklyReportClient.getWeeklyReportsByWeek(
                weeklyReportData.byWeek.valid
            );

        expect(response.status())
            .toBe(HTTP_STATUS.OK);

        const body =
            await response.json();

        expect(Array.isArray(body))
            .toBeTruthy();

        if (body.length > 0) {

            expect(body[0])
                .toHaveProperty('_id');

            expect(body[0])
                .toHaveProperty('employeeId');

            expect(body[0])
                .toHaveProperty('date');

            expect(body[0])
                .toHaveProperty('topic');

            expect(body[0])
                .toHaveProperty('description');

            expect(body[0])
                .toHaveProperty('status');

        }

    });

    test('TC12 Get weekly reports without Authorization @read @weeklyreport @regression', async ({
        weeklyReportClient
    }) => {

        const response =
            await weeklyReportClient.getWeeklyReportsByWeekWithoutAuth(
                weeklyReportData.byWeek.valid
            );

        expect(response.status())
            .toBe(HTTP_STATUS.UNAUTHORIZED);

    });

});


test.describe('Weekly Report Create Update APIs', () => {

    test('TC13 Create new weekly reports @create @weeklyreport @regression @smoke @sanity', async ({
        weeklyReportClient
    }) => {

        const payload = [{
            ...weeklyReportData.valid,
            date: uniqueDate()
        }];

        const response =
            await weeklyReportClient.createWeeklyReports(payload);

        expect(response.status())
            .toBe(HTTP_STATUS.CREATED);

        const body =
            await response.json();

        expect(body.message)
            .toBe(weeklyReportData.messages.success);

        expect(Array.isArray(body.reports))
            .toBeTruthy();

        expect(body.reports.length)
            .toBeGreaterThan(0);

    });

    test('TC14 Create multiple weekly reports in single request @create @weeklyreport @regression', async ({
        weeklyReportClient
    }) => {

        const payload = weeklyReportData.multipleReports.map(
            (report, index) => ({
                ...report,
                date: uniqueDate(index * 1000)
            })
        );

        const response =
            await weeklyReportClient.createWeeklyReports(payload);

        expect(response.status())
            .toBe(HTTP_STATUS.CREATED);

        const body =
            await response.json();

        expect(body.message)
            .toBe(weeklyReportData.messages.success);

        expect(body.reports.length)
            .toBeGreaterThan(0);

    });

    // Fixed: seed the baseline record INSIDE this test (idempotent create),
    // so TC15 never depends on whether TC16 already ran and mutated it.
    test('TC15 Update existing weekly report when changes are detected @update @weeklyreport @regression', async ({
        weeklyReportClient
    }) => {

        // Re-assert the known baseline so the "before" state is deterministic.
        await weeklyReportClient.createWeeklyReports([
            weeklyReportData.existingReport
        ]);

        const response =
            await weeklyReportClient.createWeeklyReports([
                weeklyReportData.existingReportUpdated
            ]);

        expect(response.status())
            .toBe(HTTP_STATUS.CREATED);

        const body =
            await response.json();

        expect(body.message)
            .toBe(weeklyReportData.messages.success);

        expect(body.reports.length)
            .toBeGreaterThan(0);

        expect(body.reports[0].topic)
            .toBe(weeklyReportData.existingReportUpdated.topic);

    });

    test('TC16 Skip update when no changes are detected @update @weeklyreport @regression', async ({
        weeklyReportClient
    }) => {

        const payload = [
            weeklyReportData.existingReport
        ];

        const response =
            await weeklyReportClient.createWeeklyReports(payload);

        expect(response.status())
            .toBe(HTTP_STATUS.OK);

        const body =
            await response.json();

        expect(body.message)
            .toBe(weeklyReportData.messages.noNewReports);

    });

    test('TC17 Create new report when employee/date combination does not exist @create @weeklyreport @regression', async ({
        weeklyReportClient
    }) => {

        const payload = [{
            ...weeklyReportData.secondValid,
            date: uniqueDate()
        }];

        const response =
            await weeklyReportClient.createWeeklyReports(payload);

        expect(response.status())
            .toBe(HTTP_STATUS.CREATED);

        const body =
            await response.json();

        expect(body.reports.length)
            .toBeGreaterThan(0);

    });

    test('TC18 Skip invalid report object and process remaining valid reports @create @weeklyreport @regression', async ({
        weeklyReportClient
    }) => {

        const payload = [
            weeklyReportData.empty.withoutEmployeeId,
            { ...weeklyReportData.secondValid, date: uniqueDate() }
        ];

        const response =
            await weeklyReportClient.createWeeklyReports(payload);

        expect(response.status())
            .toBe(HTTP_STATUS.CREATED);

        const body =
            await response.json();

        expect(body.reports.length)
            .toBeGreaterThan(0);

    });

    test('TC19 Process request containing valid and invalid reports @create @weeklyreport @regression', async ({
        weeklyReportClient
    }) => {

        const payload = [
            { ...weeklyReportData.secondValid, date: uniqueDate() },
            weeklyReportData.empty.withoutTopic
        ];

        const response =
            await weeklyReportClient.createWeeklyReports(payload);

        expect(response.status())
            .toBe(HTTP_STATUS.CREATED);

        const body =
            await response.json();

        expect(body.message)
            .toBe(weeklyReportData.messages.success);

        expect(body.reports.length)
            .toBeGreaterThan(0);

    });

    test('TC20 Create report using invalid employeeId @create @weeklyreport @regression', async ({
        weeklyReportClient
    }) => {

        const payload = [
            {
                ...weeklyReportData.valid,
                employeeId: weeklyReportData.invalid.invalidEmployeeId,
                date: uniqueDate()
            }
        ];

        const response =
            await weeklyReportClient.createWeeklyReports(payload);

        expect(response.status())
            .toBe(HTTP_STATUS.CREATED);

    });

    test('TC21 Create weekly reports without Authorization @create @weeklyreport @regression', async ({
        weeklyReportClient
    }) => {

        const response =
            await weeklyReportClient.createWeeklyReportsWithoutAuth([
                weeklyReportData.valid
            ]);

        expect(response.status())
            .toBe(HTTP_STATUS.UNAUTHORIZED);

    });

});
