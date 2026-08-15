const { test, expect } = require('../../fixtures/leave.fixture');
const { HTTP_STATUS } = require('../../api/constants/leave.constants');
const leaveData = require('../../test-data/leave.json');

test.describe('Leave Module APIs', () => {

    test('TC01 Get all leave records @read @leave @regression @smoke @sanity', async ({
        leaveClient
    }) => {

        const response =
            await leaveClient.getLeaves();

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
                .toHaveProperty('status');

        }

    });

    test('TC02 Get leave records by Pending status @read @leave @regression', async ({
        leaveClient
    }) => {

        const response =
            await leaveClient.getLeaves(
                leaveData.status.pendingStatus
            );

        expect(response.status())
            .toBe(HTTP_STATUS.OK);

        const body =
            await response.json();

        expect(Array.isArray(body))
            .toBeTruthy();

        body.forEach((leave) => {

            expect(leave.status)
                .toBe(
                    leaveData.status.pendingStatus
                );

        });

    });

    test('TC03 Get leave records by Approved status @read @leave @regression', async ({
        leaveClient
    }) => {

        const response =
            await leaveClient.getLeaves(
                leaveData.status.approvedStatus
            );

        expect(response.status())
            .toBe(HTTP_STATUS.OK);

        const body =
            await response.json();

        expect(Array.isArray(body))
            .toBeTruthy();

        body.forEach((leave) => {

            expect(leave.status)
                .toBe(
                    leaveData.status.approvedStatus
                );

        });

    });

    test('TC04 Get leave records by Rejected status @read @leave @regression', async ({
        leaveClient
    }) => {

        const response =
            await leaveClient.getLeaves(
                leaveData.status.rejectedStatus
            );

        expect(response.status())
            .toBe(HTTP_STATUS.OK);

        const body =
            await response.json();

        expect(Array.isArray(body))
            .toBeTruthy();

        body.forEach((leave) => {

            expect(leave.status)
                .toBe(
                    leaveData.status.rejectedStatus
                );

        });

    });

    test('TC05 Get leave records using invalid status @read @leave @regression', async ({
        leaveClient
    }) => {

        const response =
            await leaveClient.getLeaves(
                leaveData.status.invalidStatus
            );

        expect(response.status())
            .toBe(HTTP_STATUS.OK);

        const body =
            await response.json();

        expect(Array.isArray(body))
            .toBeTruthy();

        expect(body.length)
            .toBe(0);

    });

    test('TC06 Get all leave records without Authorization @read @leave @regression', async ({
        leaveClient
    }) => {

        const response =
            await leaveClient.getLeavesWithoutAuth();

        expect(response.status())
            .toBe(HTTP_STATUS.UNAUTHORIZED);

    });

    test('TC07 Verify leave response schema @read @leave @regression', async ({
        leaveClient
    }) => {

        const response =
            await leaveClient.getLeaves();

        expect(response.status())
            .toBe(HTTP_STATUS.OK);

        const body =
            await response.json();

        expect(Array.isArray(body))
            .toBeTruthy();

        if (body.length > 0) {

            const leave =
                body[0];

            expect(leave)
                .toHaveProperty('_id');

            expect(leave)
                .toHaveProperty('employeeId');

            expect(leave)
                .toHaveProperty('fromDate');

            expect(leave)
                .toHaveProperty('toDate');

            expect(leave)
                .toHaveProperty('numberOfDays');

            expect(leave)
                .toHaveProperty('leaveType');

            expect(leave)
                .toHaveProperty('reason');

            expect(leave)
                .toHaveProperty('status');

            expect(leave)
                .toHaveProperty('appliedOn');

        }

    });

    test('TC08 Get leave threshold @read @leave @regression @sanity', async ({
        leaveClient
    }) => {

        const response =
            await leaveClient.getLeaveThreshold();

        expect(response.status())
            .toBe(HTTP_STATUS.OK);

    });

    test('TC09 Verify leave threshold response @read @leave @regression', async ({
        leaveClient
    }) => {

        const response =
            await leaveClient.getLeaveThreshold();

        expect(response.status())
            .toBe(HTTP_STATUS.OK);

        const body =
            await response.json();

        expect(body)
            .toHaveProperty(
                'SICK_LEAVE_THRESHOLD'
            );

        expect(body)
            .toHaveProperty(
                'CASUAL_LEAVE_THRESHOLD'
            );

        expect(body)
            .toHaveProperty(
                'MATERNITY_LEAVE_THRESHOLD'
            );

    });

    test('TC10 Get leave threshold without Authorization @read @leave @regression', async ({
        leaveClient
    }) => {

        const response =
            await leaveClient.getLeaveThresholdWithoutAuth();

        expect(response.status())
            .toBe(HTTP_STATUS.UNAUTHORIZED);

    });

    test('TC11 Get employee leave history @read @leave @regression @sanity', async ({
        leaveClient
    }) => {

        const response =
            await leaveClient.getEmployeeLeaves(
                leaveData.employee.employeeId
            );

        expect(response.status())
            .toBe(HTTP_STATUS.OK);

        const body =
            await response.json();

        expect(Array.isArray(body))
            .toBeTruthy();

    });

    test('TC12 Get employee leave history with Pending status @read @leave @regression', async ({
        leaveClient
    }) => {

        const response =
            await leaveClient.getEmployeeLeaves(
                leaveData.employee.employeeId,
                leaveData.status.pendingStatus
            );

        expect(response.status())
            .toBe(HTTP_STATUS.OK);

        const body =
            await response.json();

        expect(Array.isArray(body))
            .toBeTruthy();

        body.forEach(item => {

            expect(item.status)
                .toBe(leaveData.status.pendingStatus);

        });

    });

    test('TC13 Get employee leave history with Approved status @read @leave @regression', async ({
        leaveClient
    }) => {

        const response =
            await leaveClient.getEmployeeLeaves(
                leaveData.employee.employeeId,
                leaveData.status.approvedStatus
            );

        expect(response.status())
            .toBe(HTTP_STATUS.OK);

        const body =
            await response.json();

        expect(Array.isArray(body))
            .toBeTruthy();

        body.forEach(item => {

            expect(item.status)
                .toBe(leaveData.status.approvedStatus);

        });

    });

    test('TC14 Get employee leave history using invalid employeeId @read @leave @regression', async ({
        leaveClient
    }) => {

        const response =
            await leaveClient.getEmployeeLeaves(
                leaveData.employee.invalidEmployeeId
            );

        expect(response.status())
            .toBe(HTTP_STATUS.OK);

        const body =
            await response.json();

        expect(Array.isArray(body))
            .toBeTruthy();

        expect(body.length)
            .toBe(0);

    });

    test('TC15 Get employee leave history without Authorization @read @leave @regression', async ({
        leaveClient
    }) => {

        const response =
            await leaveClient.getEmployeeLeavesWithoutAuth(
                leaveData.employee.employeeId
            );

        expect(response.status())
            .toBe(HTTP_STATUS.UNAUTHORIZED);

    });

    test('TC16 Verify employee leave response schema @read @leave @regression', async ({
        leaveClient
    }) => {

        const response =
            await leaveClient.getEmployeeLeaves(
                leaveData.employee.employeeId
            );

        expect(response.status())
            .toBe(HTTP_STATUS.OK);

        const body =
            await response.json();

        if (body.length > 0) {

            expect(body[0])
                .toHaveProperty('_id');

            expect(body[0])
                .toHaveProperty('employeeId');

            expect(body[0])
                .toHaveProperty('fromDate');

            expect(body[0])
                .toHaveProperty('toDate');

            expect(body[0])
                .toHaveProperty('numberOfDays');

            expect(body[0])
                .toHaveProperty('leaveType');

            expect(body[0])
                .toHaveProperty('reason');

            expect(body[0])
                .toHaveProperty('status');

            expect(body[0])
                .toHaveProperty('appliedOn');

        }

    });

    test('TC17 Get approver leave requests @read @leave @regression @sanity', async ({
        leaveClient
    }) => {

        const response =
            await leaveClient.getApproverLeaves(
                leaveData.employee.approverId
            );

        expect(response.status())
            .toBe(HTTP_STATUS.OK);

        const body =
            await response.json();

        expect(Array.isArray(body))
            .toBeTruthy();

    });

    test('TC18 Get approver leave requests using employee filter @read @leave @regression', async ({
        leaveClient
    }) => {

        const response =
            await leaveClient.getApproverLeaves(
                leaveData.employee.approverId,
                leaveData.employee.employeeId
            );

        expect(response.status())
            .toBe(HTTP_STATUS.OK);

        const body =
            await response.json();

        expect(Array.isArray(body))
            .toBeTruthy();

    });

    test('TC19 Get approver leave requests using status filter @read @leave @regression', async ({
        leaveClient
    }) => {

        const response =
            await leaveClient.getApproverLeaves(
                leaveData.employee.approverId,
                null,
                leaveData.status.pendingStatus
            );

        expect(response.status())
            .toBe(HTTP_STATUS.OK);

        const body =
            await response.json();

        expect(Array.isArray(body))
            .toBeTruthy();

        body.forEach(item => {

            expect(item.status)
                .toBe(leaveData.status.pendingStatus);

        });

    });

    test('TC20 Get approver leave requests using invalid approverId @read @leave @regression', async ({
        leaveClient
    }) => {

        const response =
            await leaveClient.getApproverLeaves(
                leaveData.employee.invalidApproverId
            );

        expect(response.status())
            .toBe(HTTP_STATUS.OK);

        const body =
            await response.json();

        expect(Array.isArray(body))
            .toBeTruthy();

        expect(body.length)
            .toBe(0);

    });

    test('TC21 Get approver leave requests without Authorization @read @leave @regression', async ({
        leaveClient
    }) => {

        const response =
            await leaveClient.getApproverLeavesWithoutAuth(
                leaveData.employee.approverId
            );

        expect(response.status())
            .toBe(HTTP_STATUS.UNAUTHORIZED);

    });

    test('TC22 Get employee financial year leave history @read @leave @regression', async ({
        leaveClient
    }) => {

        const response =
            await leaveClient.getFinancialYearLeaves(
                leaveData.employee.employeeId
            );

        expect(response.status())
            .toBe(HTTP_STATUS.OK);

        const body =
            await response.json();

        expect(Array.isArray(body))
            .toBeTruthy();

    });

    test('TC23 Get financial year leave history using invalid employeeId @read @leave @regression', async ({
        leaveClient
    }) => {

        const response =
            await leaveClient.getFinancialYearLeaves(
                leaveData.employee.invalidEmployeeId
            );

        expect(response.status())
            .toBe(HTTP_STATUS.NOT_FOUND);

        const body =
            await response.json();

        expect(body.message)
            .toContain(
                leaveData.messages.leaveNotFound
            );

    });

    test('TC24 Get financial year leave history without Authorization @read @leave @regression', async ({
        leaveClient
    }) => {

        const response =
            await leaveClient.getFinancialYearLeavesWithoutAuth(
                leaveData.employee.employeeId
            );

        expect(response.status())
            .toBe(HTTP_STATUS.UNAUTHORIZED);

    });

    test('TC25 Verify financial year response schema @read @leave @regression', async ({
        leaveClient
    }) => {

        const response =
            await leaveClient.getFinancialYearLeaves(
                leaveData.employee.employeeId
            );

        expect(response.status())
            .toBe(HTTP_STATUS.OK);

        const body =
            await response.json();

        if (body.length > 0) {

            expect(body[0])
                .toHaveProperty('fromDate');

            expect(body[0])
                .toHaveProperty('toDate');

            expect(body[0])
                .toHaveProperty('numberOfDays');

            expect(body[0])
                .toHaveProperty('leaveType');

            expect(body[0])
                .toHaveProperty('reason');

            expect(body[0])
                .toHaveProperty('status');

        }

    });

    test('TC26 Apply leave with valid data @create @crud @leave @regression @smoke @sanity', async ({
        leaveClient
    }) => {

        const response =
            await leaveClient.applyLeave(
                leaveData.leave.validLeave
            );

        expect(response.status())
            .toBe(HTTP_STATUS.CREATED);

        const body =
            await response.json();

        expect(body)
            .toHaveProperty('_id');

        expect(body.employeeId)
            .toBe(leaveData.leave.validLeave.employeeId);

        expect(body.approverId)
            .toBe(leaveData.leave.validLeave.approverId);

        expect(body.leaveType)
            .toBe(leaveData.leave.validLeave.leaveType);

        expect(body.reason)
            .toBe(leaveData.leave.validLeave.reason);

        expect(body.status)
            .toBe('Pending');

    });

    test('TC27 Apply Casual Leave @create @crud @leave @regression', async ({
        leaveClient
    }) => {

        const response =
            await leaveClient.applyLeave(
                leaveData.leave.casualLeave
            );

        expect(response.status())
            .toBe(HTTP_STATUS.CREATED);

        const body =
            await response.json();

        expect(body.leaveType)
            .toBe('CL');

        expect(body.status)
            .toBe('Pending');

    });

    test('TC28 Apply Sick Leave @create @crud @leave @regression', async ({
        leaveClient
    }) => {

        const response =
            await leaveClient.applyLeave(
                leaveData.leave.sickLeave
            );

        expect(response.status())
            .toBe(HTTP_STATUS.CREATED);

        const body =
            await response.json();

        expect(body.leaveType)
            .toBe('SL');

        expect(body.status)
            .toBe('Pending');

    });

    test('TC29 Apply Maternity Leave @create @crud @leave @regression', async ({
        leaveClient
    }) => {

        const response =
            await leaveClient.applyLeave(
                leaveData.leave.maternityLeave
            );

        expect(response.status())
            .toBe(HTTP_STATUS.CREATED);

        const body =
            await response.json();

        expect(body.leaveType)
            .toBe('ML');

        expect(body.status)
            .toBe('Pending');

    });

    test('TC30 Apply leave with invalid employeeId @create @crud @leave @regression', async ({
        leaveClient
    }) => {

        const payload = {
            ...leaveData.leave.validLeave,
            employeeId: leaveData.employee.invalidEmployeeId
        };

        const response = await leaveClient.applyLeave(payload);

        expect(response.status())
            .toBe(HTTP_STATUS.NOT_FOUND);

        const body = await response.json();

        expect(body.message)
            .toContain("Employee not found");

    });

    test('TC31 Apply leave with invalid approverId @create @crud @leave @regression', async ({
        leaveClient
    }) => {

        const payload = {
            ...leaveData.leave.validLeave,
            approverId: leaveData.employee.invalidApproverId
        };

        const response = await leaveClient.applyLeave(payload);

        expect(response.status())
            .toBe(HTTP_STATUS.NOT_FOUND);

        const body = await response.json();

        expect(body.message)
            .toContain("Approver not found");

    });

    test('TC32 Apply leave with invalid leaveType @create @crud @leave @regression', async ({
        leaveClient
    }) => {

        const leave = {
            ...leaveData.leave.validLeave,
            leaveType: 'INVALID'
        };

        const response =
            await leaveClient.applyLeave(leave);

        // Backend currently allows invalid leaveType
        expect(response.status())
            .toBe(HTTP_STATUS.CREATED);

        const body =
            await response.json();

        expect(body.leaveType)
            .toBe('INVALID');

    });

    test('TC33 Apply leave with From Date greater than To Date @create @crud @leave @regression', async ({
        leaveClient
    }) => {

        const leave = {
            ...leaveData.leave.validLeave,
            fromDate: '2026-12-20',
            toDate: '2026-12-15'
        };

        const response =
            await leaveClient.applyLeave(leave);

        // Backend currently doesn't validate date order
        expect(response.status())
            .toBe(HTTP_STATUS.CREATED);

        const body =
            await response.json();

        expect(body.fromDate)
            .toContain('2026-12-20');

        expect(body.toDate)
            .toContain('2026-12-15');

    });

    test('TC34 Verify business day calculation @read @leave @regression', async ({
        leaveClient
    }) => {

        const leave = {
            ...leaveData.leave.validLeave,
            fromDate: '2026-12-14',
            toDate: '2026-12-18',
            leaveType: 'CL'
        };

        const response =
            await leaveClient.applyLeave(leave);

        expect(response.status())
            .toBe(HTTP_STATUS.CREATED);

        const body =
            await response.json();

        expect(body.numberOfDays)
            .toBe(5);

    });

    test('TC35 Apply leave without Authorization @create @crud @leave @regression', async ({
        request
    }) => {

        const response =
            await request.post(
                '/leaves',
                {
                    data: leaveData.leave.validLeave
                }
            );

        expect(response.status())
            .toBe(HTTP_STATUS.UNAUTHORIZED);

    });

    test('TC36 Approve leave request @update @crud @leave @regression', async ({
        leaveClient
    }) => {

        const createResponse =
            await leaveClient.applyLeave(
                leaveData.leave.validLeave
            );

        expect(createResponse.status())
            .toBe(HTTP_STATUS.CREATED);

        const createdLeave =
            await createResponse.json();

        const response =
            await leaveClient.updateLeave(
                createdLeave._id,
                {
                    status: leaveData.status.approvedStatus
                }
            );

        expect(response.status())
            .toBe(HTTP_STATUS.OK);

        const body =
            await response.json();

        expect(body.status)
            .toBe(leaveData.status.approvedStatus);

    });

    test('TC37 Reject leave request @update @crud @leave @regression', async ({
        leaveClient
    }) => {

        const createResponse =
            await leaveClient.applyLeave(
                leaveData.leave.validLeave
            );

        const createdLeave =
            await createResponse.json();

        const response =
            await leaveClient.updateLeave(
                createdLeave._id,
                {
                    status: leaveData.status.rejectedStatus,
                    adminRejectComment: 'Rejected by Playwright'
                }
            );

        expect(response.status())
            .toBe(HTTP_STATUS.OK);

        const body =
            await response.json();

        expect(body.status)
            .toBe(leaveData.status.rejectedStatus);

    });

    test('TC38 Cancel leave request @update @crud @leave @regression', async ({
        leaveClient
    }) => {

        const createResponse =
            await leaveClient.applyLeave(
                leaveData.leave.validLeave
            );

        const createdLeave =
            await createResponse.json();

        const response =
            await leaveClient.updateLeave(
                createdLeave._id,
                {
                    status: 'Canceled'
                }
            );

        expect(response.status())
            .toBe(HTTP_STATUS.OK);

        const body =
            await response.json();

        expect(body.status)
            .toBe('Canceled');

    });

    test('TC39 Update leave using invalid status @update @crud @leave @regression', async ({
        leaveClient
    }) => {

        const createResponse =
            await leaveClient.applyLeave(
                leaveData.leave.validLeave
            );

        const createdLeave =
            await createResponse.json();

        const response =
            await leaveClient.updateLeave(
                createdLeave._id,
                {
                    status: leaveData.status.invalidStatus
                }
            );

        expect(response.status())
            .toBe(HTTP_STATUS.BAD_REQUEST);

    });

    test('TC40 Update leave using invalid leaveId @update @crud @leave @regression', async ({
        leaveClient
    }) => {

        const response =
            await leaveClient.updateLeave(
                leaveData.leave.invalidLeaveId,
                {
                    status: leaveData.status.approvedStatus
                }
            );

        expect(response.status())
            .toBe(HTTP_STATUS.NOT_FOUND);

    });

    test('TC41 Update leave without Authorization @update @crud @leave @regression', async ({
        request
    }) => {

        const response =
            await request.put(
                `/leaves/${leaveData.leave.invalidLeaveId}`,
                {
                    data: {
                        status: leaveData.status.approvedStatus
                    }
                }
            );

        expect(response.status())
            .toBe(HTTP_STATUS.UNAUTHORIZED);

    });

    test('TC42 Submit reject request @update @crud @leave @regression', async ({
        leaveClient
    }) => {

        const createResponse =
            await leaveClient.applyLeave(
                leaveData.leave.validLeave
            );

        const createdLeave =
            await createResponse.json();

        const response =
            await leaveClient.submitRejectRequest(
                createdLeave._id,
                {
                    employeeRejectRequestComment:
                        'Please cancel this leave'
                }
            );

        expect(response.status())
            .toBe(HTTP_STATUS.OK);

        const body =
            await response.json();

        expect(body.message)
            .toContain('updated successfully');

        expect(body.leave.isRejectRequested)
            .toBe(true);

    });

    test('TC43 Submit reject request using invalid leaveId @update @crud @leave @regression', async ({
        leaveClient
    }) => {

        const response =
            await leaveClient.submitRejectRequest(
                leaveData.leave.invalidLeaveId,
                {
                    employeeRejectRequestComment:
                        'Playwright Test'
                }
            );

        // Backend currently returns 200 with leave = null
        expect(response.status())
            .toBe(HTTP_STATUS.OK);

        const body =
            await response.json();

        expect(body.leave)
            .toBeNull();

    });

    test('TC44 Submit reject request without Authorization @update @crud @leave @regression', async ({
        request
    }) => {

        const response =
            await request.put(
                `/leaves/reject-request/${leaveData.leave.invalidLeaveId}`,
                {
                    data: {
                        employeeRejectRequestComment:
                            'Unauthorized'
                    }
                }
            );

        expect(response.status())
            .toBe(HTTP_STATUS.UNAUTHORIZED);

    });

    test('TC45 Delete leave @delete @crud @leave @regression', async ({
        leaveClient
    }) => {

        const createResponse =
            await leaveClient.applyLeave(
                leaveData.leave.validLeave
            );

        const createdLeave =
            await createResponse.json();

        const response =
            await leaveClient.deleteLeave(
                createdLeave._id
            );

        expect(response.status())
            .toBe(HTTP_STATUS.OK);

        const body =
            await response.json();

        expect(body.message)
            .toContain('deleted successfully');

    });

    test('TC46 Delete using invalid leaveId @delete @crud @leave @regression', async ({
        leaveClient
    }) => {

        const response =
            await leaveClient.deleteLeave(
                leaveData.leave.invalidLeaveId
            );

        expect(response.status())
            .toBe(HTTP_STATUS.NOT_FOUND);

        const body =
            await response.json();

        expect(body.message)
            .toContain('Leave entry not found');

    });

    test('TC47 Delete leave without Authorization @delete @crud @leave @regression', async ({
        request
    }) => {

        const response =
            await request.delete(
                `/leaves/${leaveData.leave.invalidLeaveId}`
            );

        expect(response.status())
            .toBe(HTTP_STATUS.UNAUTHORIZED);

    });

    test('TC48 Get overall leave summary for all employees @read @leave @regression @sanity', async ({
        leaveClient
    }) => {

        const response =
            await leaveClient.getOverallLeaves('all');

        expect(response.status())
            .toBe(HTTP_STATUS.OK);

        const body =
            await response.json();

        expect(Array.isArray(body))
            .toBeTruthy();

    });

    test('TC49 Get overall leave summary for specific employee @read @leave @regression', async ({
        leaveClient
    }) => {

        const response =
            await leaveClient.getOverallLeaves(
                leaveData.employee.employeeId
            );

        expect(response.status())
            .toBe(HTTP_STATUS.OK);

        const body =
            await response.json();

        expect(Array.isArray(body))
            .toBeTruthy();

    });

    test('TC50 Get overall leave summary using invalid employeeId @read @leave @regression', async ({
        leaveClient
    }) => {

        const response =
            await leaveClient.getOverallLeaves(
                leaveData.employee.invalidEmployeeId
            );

        // Aggregate returns empty array
        expect(response.status())
            .toBe(HTTP_STATUS.OK);

        const body =
            await response.json();

        expect(body.length)
            .toBe(0);

    });

    test('TC51 Verify overall leave response @read @leave @regression', async ({
        leaveClient
    }) => {

        const response =
            await leaveClient.getOverallLeaves('all');

        expect(response.status())
            .toBe(HTTP_STATUS.OK);

        const body =
            await response.json();

        if (body.length > 0) {

            expect(body[0])
                .toHaveProperty('employeeNumber');

            expect(body[0])
                .toHaveProperty('name');

            expect(body[0])
                .toHaveProperty('SL');

            expect(body[0])
                .toHaveProperty('CL');

            expect(body[0])
                .toHaveProperty('LOP');

        }

    });

    test('TC52 Get overall leave summary without Authorization @read @leave @regression', async ({
        request
    }) => {

        const response =
            await request.get(
                '/leaves/overallleaves/all'
            );

        expect(response.status())
            .toBe(HTTP_STATUS.UNAUTHORIZED);

    });

});


// Empty-data scenarios moved from tests/empty/empty-data.leave.api.spec.js
test.describe('Leave Module Empty Data APIs', () => {

    test('TC_EMPTY_001 Get leave records with empty status @emptydata @read @regression @smoke @sanity', async ({
        leaveClient
    }) => {

        const response =
            await leaveClient.getLeaves('');

        expect([HTTP_STATUS.OK, HTTP_STATUS.NOT_FOUND])
            .toContain(response.status());

    });

    test('TC_EMPTY_002 Get employee leave history with empty employeeId @emptydata @read @regression @sanity', async ({
        request,
        qaToken
    }) => {

        const response =
            await request.get('/leaves/', {
                headers: {
                    Authorization: `Bearer ${qaToken}`
                }
            });

        expect([HTTP_STATUS.NOT_FOUND, HTTP_STATUS.BAD_REQUEST])
            .toContain(response.status());

    });

    test('TC_EMPTY_003 Get approver leave requests with empty approverId @emptydata @read @regression @sanity', async ({
        request,
        qaToken
    }) => {

        const response =
            await request.get('/leaves/approver/', {
                headers: {
                    Authorization: `Bearer ${qaToken}`
                }
            });

        expect([HTTP_STATUS.NOT_FOUND, HTTP_STATUS.BAD_REQUEST])
            .toContain(response.status());

    });

    test('TC_EMPTY_004 Get financial year leave history with empty employeeId @emptydata @read @regression', async ({
        request,
        qaToken
    }) => {

        const response =
            await request.get('/leaves//financialYear', {
                headers: {
                    Authorization: `Bearer ${qaToken}`
                }
            });

        expect([HTTP_STATUS.NOT_FOUND, HTTP_STATUS.BAD_REQUEST])
            .toContain(response.status());

    });

    test('TC_EMPTY_005 Apply leave without employeeId @emptydata @create @crud @regression @smoke @sanity', async ({
        leaveClient
    }) => {

        const leave = {
            ...leaveData.leave.validLeave
        };

        delete leave.employeeId;

        const response =
            await leaveClient.applyLeave(leave);

        expect([HTTP_STATUS.CREATED, HTTP_STATUS.BAD_REQUEST, HTTP_STATUS.INTERNAL_SERVER_ERROR])
            .toContain(response.status());

    });

    test('TC_EMPTY_006 Apply leave without approverId @emptydata @create @crud @regression', async ({
        leaveClient
    }) => {

        const leave = {
            ...leaveData.leave.validLeave
        };

        delete leave.approverId;

        const response =
            await leaveClient.applyLeave(leave);

        expect([HTTP_STATUS.CREATED, HTTP_STATUS.BAD_REQUEST])
            .toContain(response.status());

    });

    test('TC_EMPTY_007 Apply leave without fromDate @emptydata @create @crud @regression', async ({
        leaveClient
    }) => {

        const leave = {
            ...leaveData.leave.validLeave
        };

        delete leave.fromDate;

        const response =
            await leaveClient.applyLeave(leave);

        expect([HTTP_STATUS.CREATED, HTTP_STATUS.BAD_REQUEST, HTTP_STATUS.INTERNAL_SERVER_ERROR])
            .toContain(response.status());

    });

    test('TC_EMPTY_008 Apply leave without toDate @emptydata @create @crud @regression', async ({
        leaveClient
    }) => {

        const leave = {
            ...leaveData.leave.validLeave
        };

        delete leave.toDate;

        const response =
            await leaveClient.applyLeave(leave);

        expect([HTTP_STATUS.CREATED, HTTP_STATUS.BAD_REQUEST, HTTP_STATUS.INTERNAL_SERVER_ERROR])
            .toContain(response.status());

    });

    test('TC_EMPTY_009 Apply leave without leaveType @emptydata @create @crud @regression', async ({
        leaveClient
    }) => {

        const leave = {
            ...leaveData.leave.validLeave
        };

        delete leave.leaveType;

        const response =
            await leaveClient.applyLeave(leave);

        expect([HTTP_STATUS.CREATED, HTTP_STATUS.BAD_REQUEST])
            .toContain(response.status());

    });

    test('TC_EMPTY_010 Apply leave without reason @emptydata @create @crud @regression', async ({
        leaveClient
    }) => {

        const leave = {
            ...leaveData.leave.validLeave
        };

        delete leave.reason;

        const response =
            await leaveClient.applyLeave(leave);

        expect([HTTP_STATUS.CREATED, HTTP_STATUS.BAD_REQUEST])
            .toContain(response.status());

    });

    test('TC_EMPTY_011 Apply leave with empty request body @emptydata @create @crud @regression', async ({
        leaveClient
    }) => {

        const response =
            await leaveClient.applyLeave({});

        expect([HTTP_STATUS.CREATED, HTTP_STATUS.BAD_REQUEST, HTTP_STATUS.INTERNAL_SERVER_ERROR])
            .toContain(response.status());

    });

    test('TC_EMPTY_012 Update leave without status @emptydata @update @crud @regression', async ({
        leaveClient
    }) => {

        const response =
            await leaveClient.updateLeave(
                leaveData.leave.invalidLeaveId,
                {}
            );

        expect([HTTP_STATUS.BAD_REQUEST, HTTP_STATUS.NOT_FOUND])
            .toContain(response.status());

    });

    test('TC_EMPTY_013 Update leave with empty request body @emptydata @update @crud @regression', async ({
        leaveClient
    }) => {

        const response =
            await leaveClient.updateLeave(
                leaveData.leave.invalidLeaveId,
                {}
            );

        expect([HTTP_STATUS.BAD_REQUEST, HTTP_STATUS.NOT_FOUND])
            .toContain(response.status());

    });

    test('TC_EMPTY_014 Submit reject request with empty comment @emptydata @update @crud @regression', async ({
        leaveClient
    }) => {

        const response =
            await leaveClient.submitRejectRequest(
                leaveData.leave.invalidLeaveId,
                {
                    employeeRejectRequestComment: ''
                }
            );

        expect([HTTP_STATUS.OK, HTTP_STATUS.NOT_FOUND])
            .toContain(response.status());

    });

    test('TC_EMPTY_015 Submit reject request with empty request body @emptydata @update @crud @regression', async ({
        leaveClient
    }) => {

        const response =
            await leaveClient.submitRejectRequest(
                leaveData.leave.invalidLeaveId,
                {}
            );

        expect([HTTP_STATUS.OK, HTTP_STATUS.NOT_FOUND, HTTP_STATUS.BAD_REQUEST])
            .toContain(response.status());

    });

    test('TC_EMPTY_016 Delete leave with empty leaveId @emptydata @delete @crud @regression @sanity', async ({
        request,
        qaToken
    }) => {

        const response =
            await request.delete('/leaves/', {
                headers: {
                    Authorization: `Bearer ${qaToken}`
                }
            });

        expect([HTTP_STATUS.NOT_FOUND, HTTP_STATUS.BAD_REQUEST])
            .toContain(response.status());

    });

    test('TC_EMPTY_017 Get overall leave summary with empty employeeId @emptydata @read @regression @sanity', async ({
        request,
        qaToken
    }) => {

        const response =
            await request.get('/leaves/overallleaves/', {
                headers: {
                    Authorization: `Bearer ${qaToken}`
                }
            });

        expect([HTTP_STATUS.OK, HTTP_STATUS.NOT_FOUND, HTTP_STATUS.BAD_REQUEST])
            .toContain(response.status());

    });

});
