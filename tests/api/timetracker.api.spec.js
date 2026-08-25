const { test, expect } = require("../../fixtures/timetracker.fixture");
const { HTTP_STATUS } = require("../../api/constants/timetracker.constants");
const timetrackerData = require("../../test-data/timetracker.json");

test.describe("Time Tracker Bulk Read APIs", () => {
  test("TC01 Get Multiple Employee Timesheet Logs @read @timetracker @regression @smoke @sanity", async ({
    timeTrackerClient,
  }) => {
    const response = await timeTrackerClient.getMultipleTimesheets(
      timetrackerData.multipleEmployeesRequest,
    );
    expect(response.status()).toBe(HTTP_STATUS.OK);

    const body = await response.json();
    expect(Array.isArray(body)).toBeTruthy();
  });

  test("TC02 Get Timesheet Logs When All Employees Have Records @read @timetracker @regression", async ({
    timeTrackerClient,
  }) => {
    const response = await timeTrackerClient.getMultipleTimesheets(
      timetrackerData.multipleEmployeesRequest,
    );
    expect(response.status()).toBe(HTTP_STATUS.OK);

    const body = await response.json();
    expect(body.length).toBe(
      timetrackerData.multipleEmployeesRequest.employeeIds.length,
    );
    body.forEach((employeeRecord) => {
      expect(employeeRecord.timeEntries).toBeDefined();
      expect(Array.isArray(employeeRecord.timeEntries)).toBeTruthy();
    });
  });

  test("TC03 Get Timesheet Logs When Some Employees Have No Records @read @timetracker @regression", async ({
    timeTrackerClient,
  }) => {
    const response = await timeTrackerClient.getMultipleTimesheets(
      timetrackerData.multipleEmployeesRequest,
    );
    expect(response.status()).toBe(HTTP_STATUS.OK);

    const body = await response.json();
    body.forEach((employeeRecord) => {
      expect(employeeRecord).toHaveProperty("timeEntries");
    });
  });

  test("TC04 Get Timesheet Logs Using NonExisting EmployeeIds @negative @timetracker @regression", async ({
    timeTrackerClient,
  }) => {
    const invalidRequest = {
      employeeIds: [timetrackerData.employee.nonExistingEmployeeId],
      month: timetrackerData.query.month,
      year: timetrackerData.query.year,
    };
    const response =
      await timeTrackerClient.getMultipleTimesheets(invalidRequest);
    expect(response.status()).toBe(HTTP_STATUS.OK);

    const body = await response.json();
    expect(body[0].timeEntries).toEqual([]);
  });

  test("TC05 Verify Multiple Employee Timesheet Response Schema @schema @timetracker @regression", async ({
    timeTrackerClient,
  }) => {
    const response = await timeTrackerClient.getMultipleTimesheets(
      timetrackerData.multipleEmployeesRequest,
    );
    expect(response.status()).toBe(HTTP_STATUS.OK);

    const body = await response.json();
    expect(body[0]).toHaveProperty("timeEntries");
    expect(Array.isArray(body[0].timeEntries)).toBeTruthy();

    if (body[0].timeEntries.length > 0) {
      expect(body[0].timeEntries[0]).toHaveProperty("date");
      expect(body[0].timeEntries[0]).toHaveProperty("hoursLogged");
    }
  });
});

test.describe("Time Tracker Employee List APIs", () => {
  test("TC09 Get Employees With Status All @read @timetracker @regression @smoke @sanity", async ({
    timeTrackerClient,
  }) => {
    const response = await timeTrackerClient.getEmployees({
      status: timetrackerData.query.statusAll,
    });
    expect(response.status()).toBe(HTTP_STATUS.OK);
  });

  test("TC10 Get Employees With Status Approved @read @timetracker @regression", async ({
    timeTrackerClient,
  }) => {
    const response = await timeTrackerClient.getEmployees({
      status: timetrackerData.query.statusApproved,
    });
    expect(response.status()).toBe(HTTP_STATUS.OK);

    const body = await response.json();
    expect(Array.isArray(body)).toBeTruthy();
  });

  test("TC11 Get Employees With Status Requested @read @timetracker @regression", async ({
    timeTrackerClient,
  }) => {
    const response = await timeTrackerClient.getEmployees({
      status: timetrackerData.query.statusRequested,
    });
    expect(response.status()).toBe(HTTP_STATUS.OK);

    const body = await response.json();
    expect(Array.isArray(body)).toBeTruthy();
  });

  test("TC12 Get Employees With Status Incomplete @read @timetracker @regression", async ({
    timeTrackerClient,
  }) => {
    const response = await timeTrackerClient.getEmployees({
      status: timetrackerData.query.statusIncomplete,
    });
    expect(response.status()).toBe(HTTP_STATUS.OK);

    const body = await response.json();
    expect(Array.isArray(body)).toBeTruthy();
  });

  test("TC13 Get Employees Using Invalid Status @negative @timetracker @regression", async ({
    timeTrackerClient,
  }) => {
    const response = await timeTrackerClient.getEmployees({
      status: timetrackerData.query.invalidStatus,
    });
    expect(response.status()).toBe(HTTP_STATUS.BAD_REQUEST);
  });

  test("TC14 Verify Employees Are Sorted Alphabetically @read @timetracker @regression", async ({
    timeTrackerClient,
  }) => {
    const response = await timeTrackerClient.getEmployees({
      status: timetrackerData.query.statusAll,
    });
    expect(response.status()).toBe(HTTP_STATUS.OK);

    const body = await response.json();
    const firstNames = body.map((employee) => employee.firstName);
    const sortedFirstNames = [...firstNames].sort((a, b) => a.localeCompare(b));
    expect(firstNames).toEqual(sortedFirstNames);
  });

  test("TC15 Verify Inactive Employees Are Excluded @read @timetracker @regression", async ({
    timeTrackerClient,
  }) => {
    test.skip(
      !timetrackerData.employee.inactiveEmployeeId,
      "Add employee.inactiveEmployeeId (a real inactive employee _id) to test-data/timetracker.json to enable this check.",
    );

    const response = await timeTrackerClient.getEmployees({
      status: timetrackerData.query.statusAll,
    });
    expect(response.status()).toBe(HTTP_STATUS.OK);

    const body = await response.json();
    const ids = body.map((employee) => employee._id);
    expect(ids).not.toContain(timetrackerData.employee.inactiveEmployeeId);
  });

  test("TC16 Verify Employees Joined After Selected Month Are Excluded @read @timetracker @regression", async ({
    timeTrackerClient,
  }) => {
    test.skip(
      !timetrackerData.employee.lateJoinerEmployeeId,
      "Add employee.lateJoinerEmployeeId (a real employee who joined after the selected month) to test-data/timetracker.json to enable this check.",
    );

    const response = await timeTrackerClient.getEmployees({
      status: timetrackerData.query.statusAll,
      month: timetrackerData.query.month,
      year: timetrackerData.query.year,
    });
    expect(response.status()).toBe(HTTP_STATUS.OK);

    const body = await response.json();
    const ids = body.map((employee) => employee._id);
    expect(ids).not.toContain(timetrackerData.employee.lateJoinerEmployeeId);
  });

  test("TC17 Verify Employee List Response Schema @schema @timetracker @regression", async ({
    timeTrackerClient,
  }) => {
    const response = await timeTrackerClient.getEmployees({
      status: timetrackerData.query.statusAll,
    });
    expect(response.status()).toBe(HTTP_STATUS.OK);

    const body = await response.json();
    if (body.length > 0) {
      expect(body[0]).toHaveProperty("_id");
      expect(body[0]).toHaveProperty("firstName");
      expect(body[0]).toHaveProperty("lastName");
    }
  });
});

test.describe("Time Tracker Employee Read APIs", () => {
  test("TC20 Get Employee Timesheet For Valid Employee @read @timetracker @regression @smoke @sanity", async ({
    timeTrackerClient,
  }) => {
    const response = await timeTrackerClient.getEmployeeTimesheet(
      timetrackerData.employee.validEmployeeId,
      {
        month: timetrackerData.query.month,
        year: timetrackerData.query.year,
      },
    );
    expect(response.status()).toBe(HTTP_STATUS.OK);

    const body = await response.json();
    const monthYearFieldName =
      timetrackerData.query.month.toLowerCase() + timetrackerData.query.year;
    expect(body).toHaveProperty(monthYearFieldName);
    expect(Array.isArray(body[monthYearFieldName])).toBeTruthy();
  });

  test("TC21 Get Employee Timesheet When Leave Records Exist @read @timetracker @regression", async ({
    timeTrackerClient,
  }) => {
    const response = await timeTrackerClient.getEmployeeTimesheet(
      timetrackerData.employee.validEmployeeId,
      {
        month: timetrackerData.query.month,
        year: timetrackerData.query.year,
      },
    );
    expect(response.status()).toBe(HTTP_STATUS.OK);

    const body = await response.json();
    const monthYearFieldName =
      timetrackerData.query.month.toLowerCase() + timetrackerData.query.year;
    const entries = body[monthYearFieldName] || [];
    const leaveEntries = entries.filter((entry) => entry.leave === true);
    expect(leaveEntries.length).toBeGreaterThan(0);
  });

  test("TC23 Get Employee Timesheet When Only Timesheet Data Exists @read @timetracker @regression", async ({
    timeTrackerClient,
  }) => {
    const response = await timeTrackerClient.getEmployeeTimesheet(
      timetrackerData.employee.anotherEmployeeId,
      {
        month: timetrackerData.query.month,
        year: timetrackerData.query.year,
      },
    );
    expect(response.status()).toBe(HTTP_STATUS.OK);

    const body = await response.json();
    const monthYearFieldName =
      timetrackerData.query.month.toLowerCase() + timetrackerData.query.year;
    if (body.message) {
      expect(body.message).toBe(
        "No time tracking or leave data found for this employee",
      );
    } else {
      expect(Array.isArray(body[monthYearFieldName])).toBeTruthy();
    }
  });

  test("TC24 Get Employee Timesheet When No Records Exist @read @timetracker @regression", async ({
    timeTrackerClient,
  }) => {
    const response = await timeTrackerClient.getEmployeeTimesheet(
      timetrackerData.employee.anotherEmployeeId,
      {
        month: timetrackerData.newYearTimesheet.month,
        year: timetrackerData.newYearTimesheet.year,
      },
    );
    expect(response.status()).toBe(HTTP_STATUS.OK);

    const body = await response.json();
    expect(body.message).toBe(
      "No time tracking or leave data found for this employee",
    );
  });

  test("TC25 Verify Leave Dates Are Merged Correctly @read @timetracker @regression", async ({
    timeTrackerClient,
  }) => {
    const response = await timeTrackerClient.getEmployeeTimesheet(
      timetrackerData.employee.validEmployeeId,
      {
        month: timetrackerData.query.month,
        year: timetrackerData.query.year,
      },
    );
    expect(response.status()).toBe(HTTP_STATUS.OK);

    const body = await response.json();
    const monthYearFieldName =
      timetrackerData.query.month.toLowerCase() + timetrackerData.query.year;
    const entries = body[monthYearFieldName] || [];
    const leaveDates = entries
      .filter((entry) => entry.leave === true)
      .map((entry) => entry.date);
    const uniqueLeaveDates = new Set(leaveDates);
    expect(uniqueLeaveDates.size).toBe(leaveDates.length);
  });

  test("TC26 Verify Weekends Are Excluded From Leave Entries @read @timetracker @regression", async ({
    timeTrackerClient,
  }) => {
    const response = await timeTrackerClient.getEmployeeTimesheet(
      timetrackerData.employee.validEmployeeId,
      {
        month: timetrackerData.query.month,
        year: timetrackerData.query.year,
      },
    );
    expect(response.status()).toBe(HTTP_STATUS.OK);

    const body = await response.json();
    const monthYearFieldName =
      timetrackerData.query.month.toLowerCase() + timetrackerData.query.year;
    const entries = body[monthYearFieldName] || [];
    entries
      .filter((entry) => entry.leave === true)
      .forEach((leave) => {
        const day = new Date(leave.date).getDay();
        expect(day).not.toBe(0);
        expect(day).not.toBe(6);
      });
  });

  test("TC27 Verify Approval Request Status Is Returned @read @timetracker @regression", async ({
    timeTrackerClient,
  }) => {
    const response = await timeTrackerClient.getEmployeeTimesheet(
      timetrackerData.employee.validEmployeeId,
      {
        month: timetrackerData.query.month,
        year: timetrackerData.query.year,
      },
    );
    expect(response.status()).toBe(HTTP_STATUS.OK);

    const body = await response.json();
    expect(body).toHaveProperty("approvalRequest");
  });

  test("TC28 Verify Employee Timesheet Response Schema @schema @timetracker @regression", async ({
    timeTrackerClient,
  }) => {
    const response = await timeTrackerClient.getEmployeeTimesheet(
      timetrackerData.employee.validEmployeeId,
      {
        month: timetrackerData.query.month,
        year: timetrackerData.query.year,
      },
    );
    expect(response.status()).toBe(HTTP_STATUS.OK);

    const body = await response.json();
    const monthYearFieldName =
      timetrackerData.query.month.toLowerCase() + timetrackerData.query.year;
    expect(body).toHaveProperty(monthYearFieldName);
    expect(Array.isArray(body[monthYearFieldName])).toBeTruthy();
    expect(body).toHaveProperty("approvalRequest");
  });

  test("TC29 Get Employee Timesheet Using Invalid EmployeeId @negative @timetracker @regression", async ({
    timeTrackerClient,
  }) => {
    const response = await timeTrackerClient.getEmployeeTimesheet(
      timetrackerData.employee.invalidEmployeeId,
      {
        month: timetrackerData.query.month,
        year: timetrackerData.query.year,
      },
    );
    expect(response.status()).toBe(HTTP_STATUS.BAD_REQUEST);
  });
});

test.describe("Time Tracker Create APIs", () => {
  test("TC32 Create Timesheet For New Employee @create @timetracker @regression @smoke @sanity", async ({
    timeTrackerClient,
  }) => {
    const response = await timeTrackerClient.createTimesheet(
      timetrackerData.employee.validEmployeeId,
      timetrackerData.createTimesheet,
    );
    expect(response.status()).toBe(HTTP_STATUS.CREATED);

    const body = await response.json();
    const savedDates = body.days.map((day) => day.date);
    timetrackerData.createTimesheet.days.forEach((day) => {
      expect(savedDates).toContain(day.date);
    });
  });

  test("TC33 Create Timesheet For New Month @create @timetracker @regression", async ({
    timeTrackerClient,
  }) => {
    const response = await timeTrackerClient.createTimesheet(
      timetrackerData.employee.validEmployeeId,
      timetrackerData.newMonthTimesheet,
    );
    expect(response.status()).toBe(HTTP_STATUS.CREATED);

    const body = await response.json();
    expect(body.month).toBe(timetrackerData.newMonthTimesheet.month);
  });

  test("TC34 Create Timesheet For New Year @create @timetracker @regression", async ({
    timeTrackerClient,
  }) => {
    const response = await timeTrackerClient.createTimesheet(
      timetrackerData.employee.validEmployeeId,
      timetrackerData.newYearTimesheet,
    );
    expect(response.status()).toBe(HTTP_STATUS.CREATED);

    const body = await response.json();
    expect(body.year).toBe(timetrackerData.newYearTimesheet.year);
  });

  test("TC35 Add New Entries To Existing Month @create @timetracker @regression", async ({
    timeTrackerClient,
  }) => {
    const response = await timeTrackerClient.createTimesheet(
      timetrackerData.employee.validEmployeeId,
      timetrackerData.updateTimesheet,
    );
    expect(response.status()).toBe(HTTP_STATUS.CREATED);

    const body = await response.json();
    const savedDates = body.days.map((day) => day.date);
    timetrackerData.updateTimesheet.days.forEach((day) => {
      expect(savedDates).toContain(day.date);
    });
  });

  test("TC36 Update Existing Day Logged Hours Using POST @create @timetracker @regression", async ({
    timeTrackerClient,
  }) => {
    const response = await timeTrackerClient.createTimesheet(
      timetrackerData.employee.validEmployeeId,
      timetrackerData.duplicateDateRequest,
    );
    expect(response.status()).toBe(HTTP_STATUS.CREATED);

    const body = await response.json();
    const updatedDay = body.days.find(
      (day) => day.date === timetrackerData.duplicateDateRequest.days[1].date,
    );
    expect(updatedDay.hoursLogged).toBe(
      timetrackerData.duplicateDateRequest.days[1].hoursLogged,
    );
  });

  test("TC39 Create Timesheet Using Invalid EmployeeId @negative @create @timetracker @regression", async ({
    timeTrackerClient,
  }) => {
    const response = await timeTrackerClient.createTimesheet(
      timetrackerData.employee.invalidEmployeeId,
      timetrackerData.createTimesheet,
    );
    expect(response.status()).toBe(HTTP_STATUS.BAD_REQUEST);
  });
});

test.describe("Time Tracker Update APIs", () => {
  test("TC42 Update Existing Timesheet @update @timetracker @regression @smoke @sanity", async ({
    timeTrackerClient,
  }) => {
    const response = await timeTrackerClient.updateTimesheet(
      timetrackerData.employee.validEmployeeId,
      timetrackerData.updateTimesheet,
    );
    expect(response.status()).toBe(HTTP_STATUS.OK);

    const body = await response.json();
    expect(body.month).toBe(timetrackerData.updateTimesheet.month);
  });

  test("TC43 Update Existing Day Logged Hours @update @timetracker @regression", async ({
    timeTrackerClient,
  }) => {
    const response = await timeTrackerClient.updateTimesheet(
      timetrackerData.employee.validEmployeeId,
      timetrackerData.updateTimesheet,
    );
    expect(response.status()).toBe(HTTP_STATUS.OK);

    const body = await response.json();
    const updatedDay = body.days.find(
      (day) => day.date === timetrackerData.updateTimesheet.days[0].date,
    );
    expect(updatedDay.hoursLogged).toBe(
      timetrackerData.updateTimesheet.days[0].hoursLogged,
    );
  });

  test("TC44 Add New Day Into Existing Month @update @timetracker @regression", async ({
    timeTrackerClient,
  }) => {
    const response = await timeTrackerClient.updateTimesheet(
      timetrackerData.employee.validEmployeeId,
      timetrackerData.updateTimesheet,
    );
    expect(response.status()).toBe(HTTP_STATUS.OK);

    const body = await response.json();
    const savedDates = body.days.map((day) => day.date);
    timetrackerData.updateTimesheet.days.forEach((day) => {
      expect(savedDates).toContain(day.date);
    });
  });

  test("TC45 Add New Month Into Existing Year @update @timetracker @regression", async ({
    timeTrackerClient,
  }) => {
    const response = await timeTrackerClient.updateTimesheet(
      timetrackerData.employee.validEmployeeId,
      timetrackerData.newMonthTimesheet,
    );
    expect(response.status()).toBe(HTTP_STATUS.OK);

    const body = await response.json();
    expect(body.month).toBe(timetrackerData.newMonthTimesheet.month);
  });

  test("TC46 Add New Year Into Employee Timesheet @update @timetracker @regression", async ({
    timeTrackerClient,
  }) => {
    const response = await timeTrackerClient.updateTimesheet(
      timetrackerData.employee.validEmployeeId,
      timetrackerData.newYearTimesheet,
    );
    expect(response.status()).toBe(HTTP_STATUS.OK);

    const body = await response.json();
    expect(body.year).toBe(timetrackerData.newYearTimesheet.year);
  });

  test("TC47 Reject Hours Logged Greater Than 10 @negative @update @timetracker @regression", async ({
    timeTrackerClient,
  }) => {
    const response = await timeTrackerClient.updateTimesheet(
      timetrackerData.employee.validEmployeeId,
      timetrackerData.invalidHoursRequest,
    );
    expect(response.status()).toBe(HTTP_STATUS.BAD_REQUEST);
  });

  test("TC48 Update Timesheet Using Invalid EmployeeId @negative @update @timetracker @regression", async ({
    timeTrackerClient,
  }) => {
    const response = await timeTrackerClient.updateTimesheet(
      timetrackerData.employee.invalidEmployeeId,
      timetrackerData.updateTimesheet,
    );
    expect(response.status()).toBe(HTTP_STATUS.BAD_REQUEST);
  });

  test("TC49 Update Non-Existing Employee Timesheet @negative @update @timetracker @regression", async ({
    timeTrackerClient,
  }) => {
    const response = await timeTrackerClient.updateTimesheet(
      timetrackerData.employee.nonExistingEmployeeId,
      timetrackerData.updateTimesheet,
    );
    expect(response.status()).toBe(HTTP_STATUS.NOT_FOUND);
  });
});

test.describe("Authorization & Security Validation", () => {
  test("TC50 Get multiple timesheets without token @security @timetracker @regression", async ({
    timeTrackerClient,
  }) => {
    const response = await timeTrackerClient.getMultipleTimesheetsWithoutAuth(
      timetrackerData.multipleEmployeesRequest,
    );
    expect([HTTP_STATUS.UNAUTHORIZED, HTTP_STATUS.FORBIDDEN]).toContain(
      response.status(),
    );
  });

  test("TC51 Get employee list without token @security @timetracker @regression", async ({
    timeTrackerClient,
  }) => {
    const response = await timeTrackerClient.getEmployeesWithoutAuth();
    expect([HTTP_STATUS.UNAUTHORIZED, HTTP_STATUS.FORBIDDEN]).toContain(
      response.status(),
    );
  });

  test("TC52 Get employee timesheet without token @security @timetracker @regression", async ({
    timeTrackerClient,
  }) => {
    const response = await timeTrackerClient.getEmployeeTimesheetWithoutAuth(
      timetrackerData.employee.validEmployeeId,
    );
    expect([HTTP_STATUS.UNAUTHORIZED, HTTP_STATUS.FORBIDDEN]).toContain(
      response.status(),
    );
  });

  test("TC53 Create timesheet without token @security @timetracker @regression", async ({
    timeTrackerClient,
  }) => {
    const response = await timeTrackerClient.createTimesheetWithoutAuth(
      timetrackerData.employee.validEmployeeId,
      timetrackerData.createTimesheet,
    );
    expect([HTTP_STATUS.UNAUTHORIZED, HTTP_STATUS.FORBIDDEN]).toContain(
      response.status(),
    );
  });

  test("TC54 Update timesheet without token @security @timetracker @regression", async ({
    timeTrackerClient,
  }) => {
    const response = await timeTrackerClient.updateTimesheetWithoutAuth(
      timetrackerData.employee.validEmployeeId,
      timetrackerData.updateTimesheet,
    );
    expect([HTTP_STATUS.UNAUTHORIZED, HTTP_STATUS.FORBIDDEN]).toContain(
      response.status(),
    );
  });
});

test.describe("Time Tracker - Empty Data Validation", () => {
  test.describe("Read Operations", () => {
    test("TC_EMPTY_001 Get multiple employee timesheets with empty employeeIds @emptydata @timetracker @smoke @read", async ({
      timeTrackerClient,
    }) => {
      const response = await timeTrackerClient.getMultipleTimesheets(
        timetrackerData.emptyEmployeeIds,
      );
      expect(response.status()).toBe(HTTP_STATUS.BAD_REQUEST);

      const body = await response.json();
      expect(body.message).toBe("Employee IDs are required.");
    });

    test("TC_EMPTY_002 Get multiple employee timesheets without employeeIds @emptydata @timetracker @sanity @read", async ({
      timeTrackerClient,
    }) => {
      const payload = { month: "August", year: "2026" };
      const response = await timeTrackerClient.getMultipleTimesheets(payload);
      expect(response.status()).toBe(HTTP_STATUS.BAD_REQUEST);

      const body = await response.json();
      expect(body.message).toBe("Employee IDs are required.");
    });

    test("TC_EMPTY_003 Get multiple employee timesheets without month @emptydata @timetracker @sanity @read", async ({
      timeTrackerClient,
    }) => {
      const payload = {
        employeeIds: [timetrackerData.employee.validEmployeeId],
        year: "2026",
      };
      const response = await timeTrackerClient.getMultipleTimesheets(payload);
      expect(response.status()).toBe(HTTP_STATUS.BAD_REQUEST);

      const body = await response.json();
      expect(body.message).toBe("Month is required.");
    });

    test("TC_EMPTY_004 Get multiple employee timesheets without year @emptydata @timetracker @sanity @read", async ({
      timeTrackerClient,
    }) => {
      const payload = {
        employeeIds: [timetrackerData.employee.validEmployeeId],
        month: "August",
      };
      const response = await timeTrackerClient.getMultipleTimesheets(payload);
      expect(response.status()).toBe(HTTP_STATUS.BAD_REQUEST);

      const body = await response.json();
      expect(body.message).toBe("Year is required.");
    });

    test("TC_EMPTY_005 Get multiple employee timesheets with empty request body @emptydata @timetracker @regression @read", async ({
      timeTrackerClient,
    }) => {
      const response = await timeTrackerClient.getMultipleTimesheets(
        timetrackerData.emptyBody,
      );
      expect(response.status()).toBe(HTTP_STATUS.BAD_REQUEST);

      const body = await response.json();
      expect(body.message).toBe("Employee IDs, month and year are required.");
    });

    test("TC_EMPTY_006 Get employee list without status query @emptydata @timetracker @regression @read", async ({
      timeTrackerClient,
    }) => {
      const response = await timeTrackerClient.getEmployees({
        month: "August",
        year: "2026",
      });
      expect(response.status()).toBe(HTTP_STATUS.BAD_REQUEST);

      const body = await response.json();
      expect(body.message).toBe("Status is required.");
    });

    test("TC_EMPTY_007 Get employee list without month query @emptydata @timetracker @regression @read", async ({
      timeTrackerClient,
    }) => {
      const response = await timeTrackerClient.getEmployees({
        status: "all",
        year: "2026",
      });
      expect(response.status()).toBe(HTTP_STATUS.BAD_REQUEST);

      const body = await response.json();
      expect(body.message).toBe("Month is required.");
    });

    test("TC_EMPTY_008 Get employee list without year query @emptydata @timetracker @regression @read", async ({
      timeTrackerClient,
    }) => {
      const response = await timeTrackerClient.getEmployees({
        status: "all",
        month: "August",
      });
      expect(response.status()).toBe(HTTP_STATUS.BAD_REQUEST);

      const body = await response.json();
      expect(body.message).toBe("Year is required.");
    });

    test("TC_EMPTY_009 Get employee timesheet using empty employeeId @emptydata @timetracker @sanity @read", async ({
      timeTrackerClient,
    }) => {
      const response = await timeTrackerClient.getEmployeeTimesheet("", {
        month: "August",
        year: "2026",
      });
      expect(response.status()).toBe(HTTP_STATUS.NOT_FOUND);
    });

    test("TC_EMPTY_010 Get employee timesheet without month query @emptydata @timetracker @regression @read", async ({
      timeTrackerClient,
    }) => {
      const response = await timeTrackerClient.getEmployeeTimesheet(
        timetrackerData.employee.validEmployeeId,
        { year: "2026" },
      );
      expect(response.status()).toBe(HTTP_STATUS.BAD_REQUEST);

      const body = await response.json();
      expect(body.message).toBe("Month is required.");
    });

    test("TC_EMPTY_011 Get employee timesheet without year query @emptydata @timetracker @regression @read", async ({
      timeTrackerClient,
    }) => {
      const response = await timeTrackerClient.getEmployeeTimesheet(
        timetrackerData.employee.validEmployeeId,
        { month: "August" },
      );
      expect(response.status()).toBe(HTTP_STATUS.BAD_REQUEST);

      const body = await response.json();
      expect(body.message).toBe("Year is required.");
    });
  });

  test.describe("Create Operations", () => {
    test("TC_EMPTY_012 Create timesheet without year @emptydata @timetracker @sanity @create", async ({
      timeTrackerClient,
    }) => {
      const response = await timeTrackerClient.createTimesheet(
        timetrackerData.employee.validEmployeeId,
        timetrackerData.missingYear,
      );
      expect(response.status()).toBe(HTTP_STATUS.BAD_REQUEST);

      const body = await response.json();
      expect(body.message).toBe("Year is required.");
    });

    test("TC_EMPTY_013 Create timesheet without month @emptydata @timetracker @sanity @create", async ({
      timeTrackerClient,
    }) => {
      const response = await timeTrackerClient.createTimesheet(
        timetrackerData.employee.validEmployeeId,
        timetrackerData.missingMonth,
      );
      expect(response.status()).toBe(HTTP_STATUS.BAD_REQUEST);

      const body = await response.json();
      expect(body.message).toBe("Month is required.");
    });

    test("TC_EMPTY_014 Create timesheet without days @emptydata @timetracker @regression @create", async ({
      timeTrackerClient,
    }) => {
      const response = await timeTrackerClient.createTimesheet(
        timetrackerData.employee.validEmployeeId,
        timetrackerData.missingDays,
      );
      expect(response.status()).toBe(HTTP_STATUS.BAD_REQUEST);

      const body = await response.json();
      expect(body.message).toBe("Days are required.");
    });

    test("TC_EMPTY_015 Create timesheet with empty days array @emptydata @timetracker @regression @create", async ({
      timeTrackerClient,
    }) => {
      const response = await timeTrackerClient.createTimesheet(
        timetrackerData.employee.validEmployeeId,
        timetrackerData.emptyDays,
      );
      expect(response.status()).toBe(HTTP_STATUS.BAD_REQUEST);

      const body = await response.json();
      expect(body.message).toBe("Days cannot be empty.");
    });

    test("TC_EMPTY_016 Create timesheet with empty request body @emptydata @timetracker @regression @create", async ({
      timeTrackerClient,
    }) => {
      const response = await timeTrackerClient.createTimesheet(
        timetrackerData.employee.validEmployeeId,
        timetrackerData.emptyBody,
      );
      expect(response.status()).toBe(HTTP_STATUS.BAD_REQUEST);

      const body = await response.json();
      expect(body.message).toBe("Month, year and days are required.");
    });
  });

  test.describe("Update Operations", () => {
    test("TC_EMPTY_017 Update timesheet without year @emptydata @timetracker @sanity @update", async ({
      timeTrackerClient,
    }) => {
      const response = await timeTrackerClient.updateTimesheet(
        timetrackerData.employee.validEmployeeId,
        timetrackerData.missingYear,
      );
      expect(response.status()).toBe(HTTP_STATUS.BAD_REQUEST);

      const body = await response.json();
      expect(body.message).toBe("Year is required.");
    });

    test("TC_EMPTY_018 Update timesheet without month @emptydata @timetracker @sanity @update", async ({
      timeTrackerClient,
    }) => {
      const response = await timeTrackerClient.updateTimesheet(
        timetrackerData.employee.validEmployeeId,
        timetrackerData.missingMonth,
      );
      expect(response.status()).toBe(HTTP_STATUS.BAD_REQUEST);

      const body = await response.json();
      expect(body.message).toBe("Month is required.");
    });

    test("TC_EMPTY_019 Update timesheet without days @emptydata @timetracker @regression @update", async ({
      timeTrackerClient,
    }) => {
      const response = await timeTrackerClient.updateTimesheet(
        timetrackerData.employee.validEmployeeId,
        timetrackerData.missingDays,
      );
      expect(response.status()).toBe(HTTP_STATUS.BAD_REQUEST);

      const body = await response.json();
      expect(body.message).toBe("Days are required.");
    });

    test("TC_EMPTY_020 Update timesheet with empty days array @emptydata @timetracker @regression @update", async ({
      timeTrackerClient,
    }) => {
      const response = await timeTrackerClient.updateTimesheet(
        timetrackerData.employee.validEmployeeId,
        timetrackerData.emptyDays,
      );
      expect(response.status()).toBe(HTTP_STATUS.BAD_REQUEST);

      const body = await response.json();
      expect(body.message).toBe("Days cannot be empty.");
    });

    test("TC_EMPTY_021 Update timesheet with empty request body @emptydata @timetracker @regression @update", async ({
      timeTrackerClient,
    }) => {
      const response = await timeTrackerClient.updateTimesheet(
        timetrackerData.employee.validEmployeeId,
        timetrackerData.emptyBody,
      );
      expect(response.status()).toBe(HTTP_STATUS.BAD_REQUEST);

      const body = await response.json();
      expect(body.message).toBe("Month, year and days are required.");
    });
  });
});
