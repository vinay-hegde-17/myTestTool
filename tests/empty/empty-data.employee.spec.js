const { test, expect } = require('../../fixtures/employee.fixture');

const { HTTP_STATUS } = require('../../api/constants/employee.constants');

test('TC001 Get New Joinees Empty @emptydata', async ({
    employeeClient }) => {

    const response =
        await employeeClient.getNewJoinees();

    expect([404, 200])
        .toContain(response.status());

    if (response.status() === 404) {

        const body =
            await response.json();

        expect(body.message)
            .toContain('No newly joined employees');

    }

}
);

test('TC002 Get Long Service Employees Empty @emptydata', async ({
    employeeClient }) => {

    const response =
        await employeeClient.getLongServiceEmployees();

    expect([404, 200])
        .toContain(response.status());

    if (response.status() === 404) {

        const body =
            await response.json();

        expect(body.message)
            .toContain('No long service employees');

    }

}
);

test('TC003 Get Employee List Empty @emptydata', async ({
    employeeClient }) => {

    const response =
        await employeeClient.getEmployees();

    expect(response.status())
        .toBe(HTTP_STATUS.OK);

    const body =
        await response.json();

    expect(body)
        .toEqual([]);

}
);

test('TC004 Get Employees By Role Empty @emptydata', async ({
    employeeClient }) => {

    const response =
        await employeeClient.getEmployeesByRole(
            'NON_EXISTING_ROLE'
        );

    expect([200, 204, 404])
        .toContain(response.status());

}
);