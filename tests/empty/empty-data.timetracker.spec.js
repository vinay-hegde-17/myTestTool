const { test, expect } = require('../../fixtures/timetracker.fixture');
const timeTrackerData = require('../../test-data/timetracker.json');
const { HTTP_STATUS } = require('../../api/constants/timetracker.constants');

test.describe('Empty Time Tracker Data Scenarios', () => {

    test.describe('POST /timetracker', () => {

        test('TC_EMPTY_001 Get multiple employee timesheets with empty employeeIds @emptydata', async ({
            timeTrackerClient
        }) => {

            const response =
                await timeTrackerClient.getMultipleTimesheets(
                    timeTrackerData.emptyEmployeeIds
                );

            expect(response.status())
                .toBe(HTTP_STATUS.BAD_REQUEST);

            const body =
                await response.json();

            expect(body.message)
                .toBe('Employee IDs are required.');

        });

        test('TC_EMPTY_002 Get multiple employee timesheets without employeeIds @emptydata', async ({
            timeTrackerClient
        }) => {

            const payload = {
                month: 'August',
                year: '2026'
            };

            const response =
                await timeTrackerClient.getMultipleTimesheets(payload);

            expect(response.status())
                .toBe(HTTP_STATUS.BAD_REQUEST);

            const body =
                await response.json();

            expect(body.message)
                .toBe('Employee IDs are required.');

        });

        test('TC_EMPTY_003 Get multiple employee timesheets without month @emptydata', async ({
            timeTrackerClient
        }) => {

            const payload = {
                employeeIds: [
                    timeTrackerData.employee.validEmployeeId
                ],
                year: '2026'
            };

            const response =
                await timeTrackerClient.getMultipleTimesheets(payload);

            expect(response.status())
                .toBe(HTTP_STATUS.BAD_REQUEST);

            const body =
                await response.json();

            expect(body.message)
                .toBe('Month is required.');

        });

        test('TC_EMPTY_004 Get multiple employee timesheets without year @emptydata', async ({
            timeTrackerClient
        }) => {

            const payload = {
                employeeIds: [
                    timeTrackerData.employee.validEmployeeId
                ],
                month: 'August'
            };

            const response =
                await timeTrackerClient.getMultipleTimesheets(payload);

            expect(response.status())
                .toBe(HTTP_STATUS.BAD_REQUEST);

            const body =
                await response.json();

            expect(body.message)
                .toBe('Year is required.');

        });

        test('TC_EMPTY_005 Get multiple employee timesheets with empty request body @emptydata', async ({
            timeTrackerClient
        }) => {

            const response =
                await timeTrackerClient.getMultipleTimesheets(
                    timeTrackerData.emptyBody
                );

            expect(response.status())
                .toBe(HTTP_STATUS.BAD_REQUEST);

            const body =
                await response.json();

            expect(body.message)
                .toBe('Employee IDs, month and year are required.');

        });

    });

});

test.describe('GET /timetracker/employees', () => {

    test('TC_EMPTY_006 Get employee list without status query @emptydata', async ({
        timeTrackerClient
    }) => {

        const response =
            await timeTrackerClient.getEmployees({
                month: 'August',
                year: '2026'
            });

        expect(response.status())
            .toBe(HTTP_STATUS.BAD_REQUEST);

        const body =
            await response.json();

        expect(body.message)
            .toBe('Status is required.');

    });

    test('TC_EMPTY_007 Get employee list without month query @emptydata', async ({
        timeTrackerClient
    }) => {

        const response =
            await timeTrackerClient.getEmployees({
                status: 'all',
                year: '2026'
            });

        expect(response.status())
            .toBe(HTTP_STATUS.BAD_REQUEST);

        const body =
            await response.json();

        expect(body.message)
            .toBe('Month is required.');

    });

    test('TC_EMPTY_008 Get employee list without year query @emptydata', async ({
        timeTrackerClient
    }) => {

        const response =
            await timeTrackerClient.getEmployees({
                status: 'all',
                month: 'August'
            });

        expect(response.status())
            .toBe(HTTP_STATUS.BAD_REQUEST);

        const body =
            await response.json();

        expect(body.message)
            .toBe('Year is required.');

    });

});

test.describe('GET /timetracker/:employeeId', () => {

    test('TC_EMPTY_009 Get employee timesheet using empty employeeId @emptydata', async ({
        timeTrackerClient
    }) => {

        const response =
            await timeTrackerClient.getEmployeeTimesheet(
                '',
                {
                    month: 'August',
                    year: '2026'
                }
            );

        expect(response.status())
            .toBe(HTTP_STATUS.NOT_FOUND);

    });

    test('TC_EMPTY_010 Get employee timesheet without month query @emptydata', async ({
        timeTrackerClient
    }) => {

        const response =
            await timeTrackerClient.getEmployeeTimesheet(
                timeTrackerData.employee.validEmployeeId,
                {
                    year: '2026'
                }
            );

        expect(response.status())
            .toBe(HTTP_STATUS.BAD_REQUEST);

        const body =
            await response.json();

        expect(body.message)
            .toBe('Month is required.');

    });

});

test.describe('GET /timetracker/:employeeId', () => {

    test('TC_EMPTY_011 Get employee timesheet without year query @emptydata', async ({
        timeTrackerClient
    }) => {

        const response =
            await timeTrackerClient.getEmployeeTimesheet(
                timeTrackerData.employee.validEmployeeId,
                {
                    month: 'August'
                }
            );

        expect(response.status())
            .toBe(HTTP_STATUS.BAD_REQUEST);

        const body =
            await response.json();

        expect(body.message)
            .toBe('Year is required.');

    });

});

test.describe('POST /timetracker/:employeeId', () => {

    test('TC_EMPTY_012 Create timesheet without year @emptydata', async ({
        timeTrackerClient
    }) => {

        const response =
            await timeTrackerClient.createTimesheet(
                timeTrackerData.employee.validEmployeeId,
                timeTrackerData.missingYear
            );

        expect(response.status())
            .toBe(HTTP_STATUS.BAD_REQUEST);

        const body =
            await response.json();

        expect(body.message)
            .toBe('Year is required.');

    });

    test('TC_EMPTY_013 Create timesheet without month @emptydata', async ({
        timeTrackerClient
    }) => {

        const response =
            await timeTrackerClient.createTimesheet(
                timeTrackerData.employee.validEmployeeId,
                timeTrackerData.missingMonth
            );

        expect(response.status())
            .toBe(HTTP_STATUS.BAD_REQUEST);

        const body =
            await response.json();

        expect(body.message)
            .toBe('Month is required.');

    });

    test('TC_EMPTY_014 Create timesheet without days @emptydata', async ({
        timeTrackerClient
    }) => {

        const response =
            await timeTrackerClient.createTimesheet(
                timeTrackerData.employee.validEmployeeId,
                timeTrackerData.missingDays
            );

        expect(response.status())
            .toBe(HTTP_STATUS.BAD_REQUEST);

        const body =
            await response.json();

        expect(body.message)
            .toBe('Days are required.');

    });

    test('TC_EMPTY_015 Create timesheet with empty days array @emptydata', async ({
        timeTrackerClient
    }) => {

        const response =
            await timeTrackerClient.createTimesheet(
                timeTrackerData.employee.validEmployeeId,
                timeTrackerData.emptyDays
            );

        expect(response.status())
            .toBe(HTTP_STATUS.BAD_REQUEST);

        const body =
            await response.json();

        expect(body.message)
            .toBe('Days cannot be empty.');

    });

    test('TC_EMPTY_016 Create timesheet with empty request body @emptydata', async ({
        timeTrackerClient
    }) => {

        const response =
            await timeTrackerClient.createTimesheet(
                timeTrackerData.employee.validEmployeeId,
                timeTrackerData.emptyBody
            );

        expect(response.status())
            .toBe(HTTP_STATUS.BAD_REQUEST);

        const body =
            await response.json();

        expect(body.message)
            .toBe('Month, year and days are required.');

    });

});

test.describe('PUT /timetracker/:employeeId', () => {

    test('TC_EMPTY_017 Update timesheet without year @emptydata', async ({
        timeTrackerClient
    }) => {

        const response =
            await timeTrackerClient.updateTimesheet(
                timeTrackerData.employee.validEmployeeId,
                timeTrackerData.missingYear
            );

        expect(response.status())
            .toBe(HTTP_STATUS.BAD_REQUEST);

        const body =
            await response.json();

        expect(body.message)
            .toBe('Year is required.');

    });

    test('TC_EMPTY_018 Update timesheet without month @emptydata', async ({
        timeTrackerClient
    }) => {

        const response =
            await timeTrackerClient.updateTimesheet(
                timeTrackerData.employee.validEmployeeId,
                timeTrackerData.missingMonth
            );

        expect(response.status())
            .toBe(HTTP_STATUS.BAD_REQUEST);

        const body =
            await response.json();

        expect(body.message)
            .toBe('Month is required.');

    });

    test('TC_EMPTY_019 Update timesheet without days @emptydata', async ({
        timeTrackerClient
    }) => {

        const response =
            await timeTrackerClient.updateTimesheet(
                timeTrackerData.employee.validEmployeeId,
                timeTrackerData.missingDays
            );

        expect(response.status())
            .toBe(HTTP_STATUS.BAD_REQUEST);

        const body =
            await response.json();

        expect(body.message)
            .toBe('Days are required.');

    });

    test('TC_EMPTY_020 Update timesheet with empty days array @emptydata', async ({
        timeTrackerClient
    }) => {

        const response =
            await timeTrackerClient.updateTimesheet(
                timeTrackerData.employee.validEmployeeId,
                timeTrackerData.emptyDays
            );

        expect(response.status())
            .toBe(HTTP_STATUS.BAD_REQUEST);

        const body =
            await response.json();

        expect(body.message)
            .toBe('Days cannot be empty.');

    });

    test('TC_EMPTY_021 Update timesheet with empty request body @emptydata', async ({
        timeTrackerClient
    }) => {

        const response =
            await timeTrackerClient.updateTimesheet(
                timeTrackerData.employee.validEmployeeId,
                timeTrackerData.emptyBody
            );

        expect(response.status())
            .toBe(HTTP_STATUS.BAD_REQUEST);

        const body =
            await response.json();

        expect(body.message)
            .toBe('Month, year and days are required.');

    });

});