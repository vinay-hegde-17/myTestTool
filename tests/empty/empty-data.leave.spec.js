const { test, expect } = require('../../fixtures/leave.fixture');

const { HTTP_STATUS } = require('../../api/constants/leave.constants');

const leaveData = require('../../test-data/leave.json');

test.describe('Leave Module Empty Data APIs', () => {

    test('TC_EMPTY_001 Get leave records with empty status @emptydata', async ({
        leaveClient
    }) => {

        const response =
            await leaveClient.getLeaves('');

        expect([HTTP_STATUS.OK, HTTP_STATUS.NOT_FOUND])
            .toContain(response.status());

    });

    test('TC_EMPTY_002 Get employee leave history with empty employeeId @emptydata', async ({
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

    test('TC_EMPTY_003 Get approver leave requests with empty approverId @emptydata', async ({
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

    test('TC_EMPTY_004 Get financial year leave history with empty employeeId @emptydata', async ({
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

    test('TC_EMPTY_005 Apply leave without employeeId @emptydata', async ({
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

    test('TC_EMPTY_006 Apply leave without approverId @emptydata', async ({
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

    test('TC_EMPTY_007 Apply leave without fromDate @emptydata', async ({
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

    test('TC_EMPTY_008 Apply leave without toDate @emptydata', async ({
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

    test('TC_EMPTY_009 Apply leave without leaveType @emptydata', async ({
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

    test('TC_EMPTY_010 Apply leave without reason @emptydata', async ({
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

    test('TC_EMPTY_011 Apply leave with empty request body @emptydata', async ({
        leaveClient
    }) => {

        const response =
            await leaveClient.applyLeave({});

        expect([HTTP_STATUS.CREATED, HTTP_STATUS.BAD_REQUEST, HTTP_STATUS.INTERNAL_SERVER_ERROR])
            .toContain(response.status());

    });

    test('TC_EMPTY_012 Update leave without status @emptydata', async ({
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

    test('TC_EMPTY_013 Update leave with empty request body @emptydata', async ({
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

    test('TC_EMPTY_014 Submit reject request with empty comment @emptydata', async ({
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

    test('TC_EMPTY_015 Submit reject request with empty request body @emptydata', async ({
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

    test('TC_EMPTY_016 Delete leave with empty leaveId @emptydata', async ({
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

    test('TC_EMPTY_017 Get overall leave summary with empty employeeId @emptydata', async ({
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