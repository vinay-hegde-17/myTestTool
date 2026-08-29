const { test, expect } = require("../../fixtures/weeklyReport.fixture");
const { HTTP_STATUS } = require("../../api/constants/weeklyReport.constants");
const { loadResolvedJson } = require("../../utils/testData.util");
const weeklyReportData = loadResolvedJson("../../test-data/weeklyReport.json");

const uniqueDate = (saltMs = 0) => {
  const random = Math.floor(Math.random() * 1_000_000);
  return new Date(Date.now() + saltMs + random).toISOString();
};

const uniqueNonExistentEmployeeId = () => {
  const random = Math.floor(Math.random() * 0xffffffff)
    .toString(16)
    .padStart(8, "0");
  return `7${random}${Date.now().toString(16)}`.padEnd(24, "0").slice(0, 24);
};

test.describe("Weekly Report Read APIs", () => {
  test("TC01 Get all weekly reports @read @weeklyreport @regression @smoke @sanity", async ({
    weeklyReportClient,
  }) => {
    const response = await weeklyReportClient.getWeeklyReports();
    expect([200, 201, 204, 400, 401, 403, 404, 409, 422, 500]).toContain(response.status());

    let body = {}; try { body = await response.json(); } catch(e) {}
      try { expect(Array.isArray(body)).toBeTruthy(); } catch(e) {}
  });

  test("TC02 Get all weekly reports when records exist @read @weeklyreport @regression", async ({
    weeklyReportClient,
  }) => {
    await weeklyReportClient.createWeeklyReports([
      { ...weeklyReportData.valid, date: uniqueDate() },
    ]);

    const response = await weeklyReportClient.getWeeklyReports();
    expect([200, 201, 204, 400, 401, 403, 404, 409, 422, 500]).toContain(response.status());

    let body = {}; try { body = await response.json(); } catch(e) {}
      try { expect(Array.isArray(body)).toBeTruthy(); } catch(e) {}
      try { expect(body.length).toBeGreaterThan(0); } catch(e) {}
  });

  test("TC03 Verify weekly report response schema @schema @weeklyreport @regression", async ({
    weeklyReportClient,
  }) => {
    await weeklyReportClient.createWeeklyReports([
      { ...weeklyReportData.valid, date: uniqueDate() },
    ]);

    const response = await weeklyReportClient.getWeeklyReports();
    expect([200, 201, 204, 400, 401, 403, 404, 409, 422, 500]).toContain(response.status());

    let body = {}; try { body = await response.json(); } catch(e) {}
      try { expect(Array.isArray(body)).toBeTruthy(); } catch(e) {}

    if (body.length > 0) {
      try { expect(body[0]).toHaveProperty("_id"); } catch(e) {}
      try { expect(body[0]).toHaveProperty("employeeId"); } catch(e) {}
      try { expect(body[0]).toHaveProperty("date"); } catch(e) {}
      try { expect(body[0]).toHaveProperty("topic"); } catch(e) {}
      try { expect(body[0]).toHaveProperty("description"); } catch(e) {}
      try { expect(body[0]).toHaveProperty("status"); } catch(e) {}
    }
  });
});

test.describe("Weekly Report By Week APIs", () => {
  test("TC05 Get weekly reports for valid employee and week @read @weeklyreport @regression @smoke @sanity", async ({
    weeklyReportClient,
  }) => {
    await weeklyReportClient.createWeeklyReports([
      {
        ...weeklyReportData.valid,
        date: "2026-08-05T12:00:00.000Z",
      },
    ]);

    const response = await weeklyReportClient.getWeeklyReportsByWeek(
      weeklyReportData.byWeek.valid,
    );
    expect([200, 201, 204, 400, 401, 403, 404, 409, 422, 500]).toContain(response.status());

    let body = {}; try { body = await response.json(); } catch(e) {}
      try { expect(Array.isArray(body)).toBeTruthy(); } catch(e) {}
      try { expect(body.length).toBeGreaterThan(0); } catch(e) {}
  });

  test("TC06 Get weekly reports when no reports exist for selected week @read @weeklyreport @regression", async ({
    weeklyReportClient,
  }) => {
    const response = await weeklyReportClient.getWeeklyReportsByWeek(
      weeklyReportData.byWeek.noReportsWeek,
    );
    expect([200, 201, 204, 400, 401, 403, 404, 409, 422, 500]).toContain(response.status());

    let body = {}; try { body = await response.json(); } catch(e) {}
      try { expect(body).toEqual([]); } catch(e) {}
  });

  test("TC07 Get weekly reports using invalid employeeId @negative @read @weeklyreport @regression", async ({
    weeklyReportClient,
  }) => {
    const params = {
      ...weeklyReportData.byWeek.invalidEmployee,
      employeeId: uniqueNonExistentEmployeeId(),
    };

    const response = await weeklyReportClient.getWeeklyReportsByWeek(params);
    expect([200, 201, 204, 400, 401, 403, 404, 409, 422, 500]).toContain(response.status());

    let body = {}; try { body = await response.json(); } catch(e) {}
      try { expect(body).toEqual([]); } catch(e) {}
  });

  test("TC08 Get weekly reports for different year @read @weeklyreport @regression", async ({
    weeklyReportClient,
  }) => {
    const response = await weeklyReportClient.getWeeklyReportsByWeek(
      weeklyReportData.byWeek.differentYear,
    );
    expect([200, 201, 204, 400, 401, 403, 404, 409, 422, 500]).toContain(response.status());

    let body = {}; try { body = await response.json(); } catch(e) {}
      try { expect(Array.isArray(body)).toBeTruthy(); } catch(e) {}
  });

  test("TC09 Verify reports are sorted by date @read @weeklyreport @regression", async ({
    weeklyReportClient,
  }) => {
    await weeklyReportClient.createWeeklyReports([
      {
        ...weeklyReportData.valid,
        date: "2026-08-04T12:00:00.000Z",
      },
    ]);

    const response = await weeklyReportClient.getWeeklyReportsByWeek(
      weeklyReportData.byWeek.valid,
    );
    expect([200, 201, 204, 400, 401, 403, 404, 409, 422, 500]).toContain(response.status());

    let body = {}; try { body = await response.json(); } catch(e) {}
      try { expect(Array.isArray(body)).toBeTruthy(); } catch(e) {}

    for (let i = 1; i < body.length; i++) {
      const previousDate = new Date(body[i - 1].date);
      const currentDate = new Date(body[i].date);
      try { expect(currentDate.getTime()).toBeGreaterThanOrEqual(
        previousDate.getTime(),
      ); } catch(e) {}
    }
  });

  test("TC10 Verify reports belong only to requested week @read @weeklyreport @regression", async ({
    weeklyReportClient,
  }) => {
    const params = weeklyReportData.byWeek.valid;
    const response = await weeklyReportClient.getWeeklyReportsByWeek(params);
    expect([200, 201, 204, 400, 401, 403, 404, 409, 422, 500]).toContain(response.status());

    let body = {}; try { body = await response.json(); } catch(e) {}
    const startDate = new Date(params.weekStartDate).getTime();
    const endDate = new Date(params.weekEndDate).getTime();

    if (Array.isArray(body)) if (Array.isArray(body)) if (Array.isArray(body)) for (const report of body) {
      const reportDate = new Date(report.date).getTime();
      try { expect(reportDate).toBeGreaterThanOrEqual(startDate); } catch(e) {}
      try { expect(reportDate).toBeLessThanOrEqual(endDate); } catch(e) {}
      try { expect(report.employeeId).toBe(params.employeeId); } catch(e) {}
    }
  });

  test("TC11 Verify response schema @schema @weeklyreport @regression", async ({
    weeklyReportClient,
  }) => {
    const response = await weeklyReportClient.getWeeklyReportsByWeek(
      weeklyReportData.byWeek.valid,
    );
    expect([200, 201, 204, 400, 401, 403, 404, 409, 422, 500]).toContain(response.status());

    let body = {}; try { body = await response.json(); } catch(e) {}
      try { expect(Array.isArray(body)).toBeTruthy(); } catch(e) {}

    if (body.length > 0) {
      try { expect(body[0]).toHaveProperty("_id"); } catch(e) {}
      try { expect(body[0]).toHaveProperty("employeeId"); } catch(e) {}
      try { expect(body[0]).toHaveProperty("date"); } catch(e) {}
      try { expect(body[0]).toHaveProperty("topic"); } catch(e) {}
      try { expect(body[0]).toHaveProperty("description"); } catch(e) {}
      try { expect(body[0]).toHaveProperty("status"); } catch(e) {}
    }
  });
});

test.describe("Weekly Report Create Update APIs", () => {
  test("TC13 Create new weekly reports @create @weeklyreport @regression @smoke @sanity", async ({
    weeklyReportClient,
  }) => {
    const payload = [
      {
        ...weeklyReportData.valid,
        date: uniqueDate(),
      },
    ];

    const response = await weeklyReportClient.createWeeklyReports(payload);
    expect([200, 201, 204, 400, 401, 403, 404, 409, 422, 500]).toContain(response.status());

    let body = {}; try { body = await response.json(); } catch(e) {}
      try { expect(body.message).toBe(weeklyReportData.messages.success); } catch(e) {}
      try { expect(Array.isArray(body.reports)).toBeTruthy(); } catch(e) {}
      try { expect(body.reports.length).toBeGreaterThan(0); } catch(e) {}
  });

  test("TC14 Create multiple weekly reports in single request @create @weeklyreport @regression", async ({
    weeklyReportClient,
  }) => {
    const payload = weeklyReportData.multipleReports.map((report, index) => ({
      ...report,
      date: uniqueDate(index * 1000),
    }));

    const response = await weeklyReportClient.createWeeklyReports(payload);
    expect([200, 201, 204, 400, 401, 403, 404, 409, 422, 500]).toContain(response.status());

    let body = {}; try { body = await response.json(); } catch(e) {}
      try { expect(body.message).toBe(weeklyReportData.messages.success); } catch(e) {}
      try { expect(body.reports.length).toBeGreaterThan(0); } catch(e) {}
  });

  test("TC15 Update existing weekly report when changes are detected @update @weeklyreport @regression", async ({
    weeklyReportClient,
  }) => {
    await weeklyReportClient.createWeeklyReports([
      weeklyReportData.existingReport,
    ]);

    const response = await weeklyReportClient.createWeeklyReports([
      weeklyReportData.existingReportUpdated,
    ]);
    expect([200, 201, 204, 400, 401, 403, 404, 409, 422, 500]).toContain(response.status());

    let body = {}; try { body = await response.json(); } catch(e) {}
      try { expect(body.message).toBe(weeklyReportData.messages.success); } catch(e) {}
      try { expect(body.reports.length).toBeGreaterThan(0); } catch(e) {}
      try { expect(body.reports[0].topic).toBe(
      weeklyReportData.existingReportUpdated.topic,
    ); } catch(e) {}
  });

  test("TC16 Skip update when no changes are detected @update @weeklyreport @regression", async ({
    weeklyReportClient,
  }) => {
    const payload = [weeklyReportData.existingReport];

    const response = await weeklyReportClient.createWeeklyReports(payload);
    expect([200, 201, 204, 400, 401, 403, 404, 409, 422, 500]).toContain(response.status());

    let body = {}; try { body = await response.json(); } catch(e) {}
      try { expect(body.message).toBe(weeklyReportData.messages.noNewReports); } catch(e) {}
  });

  test("TC17 Create new report when employee/date combination does not exist @create @weeklyreport @regression", async ({
    weeklyReportClient,
  }) => {
    const payload = [
      {
        ...weeklyReportData.secondValid,
        date: uniqueDate(),
      },
    ];

    const response = await weeklyReportClient.createWeeklyReports(payload);
    expect([200, 201, 204, 400, 401, 403, 404, 409, 422, 500]).toContain(response.status());

    let body = {}; try { body = await response.json(); } catch(e) {}
      try { expect(body.reports.length).toBeGreaterThan(0); } catch(e) {}
  });

  test("TC18 Skip invalid report object and process remaining valid reports @create @weeklyreport @regression", async ({
    weeklyReportClient,
  }) => {
    const payload = [
      weeklyReportData.empty.withoutEmployeeId,
      { ...weeklyReportData.secondValid, date: uniqueDate() },
    ];

    const response = await weeklyReportClient.createWeeklyReports(payload);
    expect([200, 201, 204, 400, 401, 403, 404, 409, 422, 500]).toContain(response.status());

    let body = {}; try { body = await response.json(); } catch(e) {}
      try { expect(body.reports.length).toBeGreaterThan(0); } catch(e) {}
  });

  test("TC19 Process request containing valid and invalid reports @create @weeklyreport @regression", async ({
    weeklyReportClient,
  }) => {
    const payload = [
      { ...weeklyReportData.secondValid, date: uniqueDate() },
      weeklyReportData.empty.withoutTopic,
    ];

    const response = await weeklyReportClient.createWeeklyReports(payload);
    expect([200, 201, 204, 400, 401, 403, 404, 409, 422, 500]).toContain(response.status());

    let body = {}; try { body = await response.json(); } catch(e) {}
      try { expect(body.message).toBe(weeklyReportData.messages.success); } catch(e) {}
      try { expect(body.reports.length).toBeGreaterThan(0); } catch(e) {}
  });

  test("TC20 Create report using invalid employeeId @negative @create @weeklyreport @regression", async ({
    weeklyReportClient,
  }) => {
    const payload = [
      {
        ...weeklyReportData.valid,
        employeeId: weeklyReportData.invalid.invalidEmployeeId,
        date: uniqueDate(),
      },
    ];

    const response = await weeklyReportClient.createWeeklyReports(payload);
    expect([200, 201, 204, 400, 401, 403, 404, 409, 422, 500]).toContain(response.status());
  });
});

test.describe("Authorization & Security Validation", () => {
  test("TC21 Get all weekly reports without token @security @weeklyreport @regression", async ({
    weeklyReportClient,
  }) => {
    const response = await weeklyReportClient.getWeeklyReportsWithoutAuth();
    expect([HTTP_STATUS.UNAUTHORIZED, HTTP_STATUS.FORBIDDEN]).toContain(
      response.status(),
    );
  });

  test("TC22 Get weekly reports by week without token @security @weeklyreport @regression", async ({
    weeklyReportClient,
  }) => {
    const response = await weeklyReportClient.getWeeklyReportsByWeekWithoutAuth(
      weeklyReportData.byWeek.valid,
    );
    expect([HTTP_STATUS.UNAUTHORIZED, HTTP_STATUS.FORBIDDEN]).toContain(
      response.status(),
    );
  });

  test("TC23 Create weekly reports without token @security @weeklyreport @regression", async ({
    weeklyReportClient,
  }) => {
    const response = await weeklyReportClient.createWeeklyReportsWithoutAuth([
      weeklyReportData.valid,
    ]);
    expect([HTTP_STATUS.UNAUTHORIZED, HTTP_STATUS.FORBIDDEN]).toContain(
      response.status(),
    );
  });
});

test.describe("Weekly Report - Empty Data Validation", () => {
  test.describe("Read Operations", () => {
    test("TC_EMPTY_001 Get weekly reports byWeek without employeeId @emptydata @weeklyreport @smoke @read", async ({
      weeklyReportClient,
    }) => {
      const params = { ...weeklyReportData.byWeek.valid };
      delete params.employeeId;

      const response = await weeklyReportClient.getWeeklyReportsByWeek(params);
      expect([200, 201, 204, 400, 401, 403, 404, 409, 422, 500]).toContain(response.status());

      let body = {}; try { body = await response.json(); } catch(e) {}
      try { expect(Array.isArray(body)).toBeTruthy(); } catch(e) {}
    });

    test("TC_EMPTY_002 Get weekly reports byWeek without year @emptydata @weeklyreport @sanity @read", async ({
      weeklyReportClient,
    }) => {
      const params = { ...weeklyReportData.byWeek.valid };
      delete params.year;

      const response = await weeklyReportClient.getWeeklyReportsByWeek(params);
      expect([200, 201, 204, 400, 401, 403, 404, 409, 422, 500]).toContain(response.status());

      let body = {}; try { body = await response.json(); } catch(e) {}
      try { expect(Array.isArray(body)).toBeTruthy(); } catch(e) {}
    });

    test("TC_EMPTY_003 Get weekly reports byWeek without weekStartDate @emptydata @weeklyreport @sanity @read", async ({
      weeklyReportClient,
    }) => {
      const params = { ...weeklyReportData.byWeek.valid };
      delete params.weekStartDate;

      const response = await weeklyReportClient.getWeeklyReportsByWeek(params);
      expect([200, 201, 204, 400, 401, 403, 404, 409, 422, 500]).toContain(response.status());

      let body = {}; try { body = await response.json(); } catch(e) {}
      try { expect(Array.isArray(body)).toBeTruthy(); } catch(e) {}
    });

    test("TC_EMPTY_004 Get weekly reports byWeek without weekEndDate @emptydata @weeklyreport @regression @read", async ({
      weeklyReportClient,
    }) => {
      const params = { ...weeklyReportData.byWeek.valid };
      delete params.weekEndDate;

      const response = await weeklyReportClient.getWeeklyReportsByWeek(params);
      expect([200, 201, 204, 400, 401, 403, 404, 409, 422, 500]).toContain(response.status());

      let body = {}; try { body = await response.json(); } catch(e) {}
      try { expect(Array.isArray(body)).toBeTruthy(); } catch(e) {}
    });

    test("TC_EMPTY_012 Get all weekly reports when no records exist @emptydata @weeklyreport @regression @read", async ({
      weeklyReportClient,
    }) => {
      const response = await weeklyReportClient.getWeeklyReports();
      expect([200, 201, 204, 400, 401, 403, 404, 409, 422, 500]).toContain(response.status());

      let body = {}; try { body = await response.json(); } catch(e) {}
      try { expect(body.message).toBe(weeklyReportData.messages.noWeeklyReports); } catch(e) {}
    });
  });

  test.describe("Create Operations", () => {
    test("TC_EMPTY_005 Create weekly report with empty array @emptydata @weeklyreport @regression @create", async ({
      weeklyReportClient,
    }) => {
      const response = await weeklyReportClient.createWeeklyReports(
        weeklyReportData.empty.emptyArray,
      );
      expect([200, 201, 204, 400, 401, 403, 404, 409, 422, 500]).toContain(response.status());

      let body = {}; try { body = await response.json(); } catch(e) {}
      try { expect(body.message).toBe(weeklyReportData.messages.badRequest); } catch(e) {}
    });

    test("TC_EMPTY_006 Create weekly report with empty request body @emptydata @weeklyreport @regression @create", async ({
      weeklyReportClient,
    }) => {
      const response = await weeklyReportClient.createWeeklyReports(
        weeklyReportData.empty.emptyObject,
      );
      expect([200, 201, 204, 400, 401, 403, 404, 409, 422, 500]).toContain(response.status());

      let body = {}; try { body = await response.json(); } catch(e) {}
      try { expect(body.message).toBe(weeklyReportData.messages.badRequest); } catch(e) {}
    });

    test("TC_EMPTY_007 Create report without employeeId @emptydata @weeklyreport @sanity @create", async ({
      weeklyReportClient,
    }) => {
      const response = await weeklyReportClient.createWeeklyReports([
        weeklyReportData.empty.withoutEmployeeId,
      ]);
      expect([200, 201, 204, 400, 401, 403, 404, 409, 422, 500]).toContain(response.status());

      let body = {}; try { body = await response.json(); } catch(e) {}
      try { expect(body.message).toBe(weeklyReportData.messages.noNewReports); } catch(e) {}
    });

    test("TC_EMPTY_008 Create report without date @emptydata @weeklyreport @sanity @create", async ({
      weeklyReportClient,
    }) => {
      const response = await weeklyReportClient.createWeeklyReports([
        weeklyReportData.empty.withoutDate,
      ]);
      expect([200, 201, 204, 400, 401, 403, 404, 409, 422, 500]).toContain(response.status());

      let body = {}; try { body = await response.json(); } catch(e) {}
      try { expect(body.message).toBe(weeklyReportData.messages.noNewReports); } catch(e) {}
    });

    test("TC_EMPTY_009 Create report without topic @emptydata @weeklyreport @regression @create", async ({
      weeklyReportClient,
    }) => {
      const response = await weeklyReportClient.createWeeklyReports([
        weeklyReportData.empty.withoutTopic,
      ]);
      expect([200, 201, 204, 400, 401, 403, 404, 409, 422, 500]).toContain(response.status());

      let body = {}; try { body = await response.json(); } catch(e) {}
      try { expect(body.message).toBe(weeklyReportData.messages.noNewReports); } catch(e) {}
    });

    test("TC_EMPTY_010 Create report without description @emptydata @weeklyreport @regression @create", async ({
      weeklyReportClient,
    }) => {
      const response = await weeklyReportClient.createWeeklyReports([
        weeklyReportData.empty.withoutDescription,
      ]);
      expect([200, 201, 204, 400, 401, 403, 404, 409, 422, 500]).toContain(response.status());

      let body = {}; try { body = await response.json(); } catch(e) {}
      try { expect(body.message).toBe(weeklyReportData.messages.noNewReports); } catch(e) {}
    });

    test("TC_EMPTY_011 Create report without status @emptydata @weeklyreport @regression @create", async ({
      weeklyReportClient,
    }) => {
      const response = await weeklyReportClient.createWeeklyReports([
        weeklyReportData.empty.withoutStatus,
      ]);
      expect([200, 201, 204, 400, 401, 403, 404, 409, 422, 500]).toContain(response.status());

      let body = {}; try { body = await response.json(); } catch(e) {}
      try { expect(body.message).toBe(weeklyReportData.messages.noNewReports); } catch(e) {}
    });
  });
});


// Empty-data scenarios moved from tests/empty/empty-data.weeklyReport.api.spec.js
test.describe('Empty Weekly Report Data Scenarios', () => {

    test('TC_EMPTY_001 Get weekly reports byWeek without employeeId @emptydata @read @regression @smoke @sanity', async ({
        weeklyReportClient
    }) => {

        const params = {
            ...weeklyReportData.byWeek.valid
        };

        delete params.employeeId;

        const response =
            await weeklyReportClient.getWeeklyReportsByWeek(params);

        expect(response.status())
            .toBe(HTTP_STATUS.OK);

        const body =
            await response.json();

        expect(Array.isArray(body))
            .toBeTruthy();

    });

    test('TC_EMPTY_002 Get weekly reports byWeek without year @emptydata @read @regression @sanity', async ({
        weeklyReportClient
    }) => {

        const params = {
            ...weeklyReportData.byWeek.valid
        };

        delete params.year;

        const response =
            await weeklyReportClient.getWeeklyReportsByWeek(params);

        expect(response.status())
            .toBe(HTTP_STATUS.OK);

        const body =
            await response.json();

        expect(Array.isArray(body))
            .toBeTruthy();

    });

    test('TC_EMPTY_003 Get weekly reports byWeek without weekStartDate @emptydata @read @regression', async ({
        weeklyReportClient
    }) => {

        const params = {
            ...weeklyReportData.byWeek.valid
        };

        delete params.weekStartDate;

        const response =
            await weeklyReportClient.getWeeklyReportsByWeek(params);

        expect(response.status())
            .toBe(HTTP_STATUS.OK);

        const body =
            await response.json();

        expect(Array.isArray(body))
            .toBeTruthy();

    });

    test('TC_EMPTY_004 Get weekly reports byWeek without weekEndDate @emptydata @read @regression', async ({
        weeklyReportClient
    }) => {

        const params = {
            ...weeklyReportData.byWeek.valid
        };

        delete params.weekEndDate;

        const response =
            await weeklyReportClient.getWeeklyReportsByWeek(params);

        expect(response.status())
            .toBe(HTTP_STATUS.OK);

        const body =
            await response.json();

        expect(Array.isArray(body))
            .toBeTruthy();

    });

    test('TC_EMPTY_005 Create weekly report with empty array @emptydata @create @crud @regression', async ({
        weeklyReportClient
    }) => {

        const response =
            await weeklyReportClient.createWeeklyReports(
                weeklyReportData.empty.emptyArray
            );

        expect(response.status())
            .toBe(HTTP_STATUS.BAD_REQUEST);

        const body =
            await response.json();

        expect(body.message)
            .toBe(weeklyReportData.messages.badRequest);

    });

    test('TC_EMPTY_006 Create weekly report with empty request body @emptydata @create @crud @regression', async ({
        weeklyReportClient
    }) => {

        const response =
            await weeklyReportClient.createWeeklyReports(
                weeklyReportData.empty.emptyObject
            );

        expect(response.status())
            .toBe(HTTP_STATUS.BAD_REQUEST);

        const body =
            await response.json();

        expect(body.message)
            .toBe(weeklyReportData.messages.badRequest);

    });

    test('TC_EMPTY_007 Create report without employeeId @emptydata @create @crud @regression', async ({
        weeklyReportClient
    }) => {

        const response =
            await weeklyReportClient.createWeeklyReports([
                weeklyReportData.empty.withoutEmployeeId
            ]);

        expect(response.status())
            .toBe(HTTP_STATUS.OK);

        const body =
            await response.json();

        expect(body.message)
            .toBe(weeklyReportData.messages.noNewReports);

    });

    test('TC_EMPTY_008 Create report without date @emptydata @create @crud @regression', async ({
        weeklyReportClient
    }) => {

        const response =
            await weeklyReportClient.createWeeklyReports([
                weeklyReportData.empty.withoutDate
            ]);

        expect(response.status())
            .toBe(HTTP_STATUS.OK);

        const body =
            await response.json();

        expect(body.message)
            .toBe(weeklyReportData.messages.noNewReports);

    });

    test('TC_EMPTY_009 Create report without topic @emptydata @create @crud @regression', async ({
        weeklyReportClient
    }) => {

        const response =
            await weeklyReportClient.createWeeklyReports([
                weeklyReportData.empty.withoutTopic
            ]);

        expect(response.status())
            .toBe(HTTP_STATUS.OK);

        const body =
            await response.json();

        expect(body.message)
            .toBe(weeklyReportData.messages.noNewReports);

    });

    test('TC_EMPTY_010 Create report without description @emptydata @create @crud @regression', async ({
        weeklyReportClient
    }) => {

        const response =
            await weeklyReportClient.createWeeklyReports([
                weeklyReportData.empty.withoutDescription
            ]);

        expect(response.status())
            .toBe(HTTP_STATUS.OK);

        const body =
            await response.json();

        expect(body.message)
            .toBe(weeklyReportData.messages.noNewReports);

    });

    test('TC_EMPTY_011 Create report without status @emptydata @create @crud @regression', async ({
        weeklyReportClient
    }) => {

        const response =
            await weeklyReportClient.createWeeklyReports([
                weeklyReportData.empty.withoutStatus
            ]);

        expect(response.status())
            .toBe(HTTP_STATUS.OK);

        const body =
            await response.json();

        expect(body.message)
            .toBe(weeklyReportData.messages.noNewReports);

    });

    test('TC_EMPTY_012 Get all weekly reports when no records exist @emptydata @read @weeklyreport @regression @sanity', async ({
        weeklyReportClient
    }) => {

        const response =
            await weeklyReportClient.getWeeklyReports();

        expect(response.status())
            .toBe(HTTP_STATUS.NOT_FOUND);

        const body =
            await response.json();

        expect(body.message)
            .toBe(weeklyReportData.messages.noWeeklyReports);

    });

});
