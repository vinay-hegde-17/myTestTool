const { test, expect } = require('../../fixtures/raisedQueries.fixture');
const { HTTP_STATUS } = require('../../api/constants/raisedQueries.constants');
const raisedQueriesData = require('../../test-data/raisedQueries.json');

test.describe('Raised Queries Empty Data APIs', () => {

    test('TC_EMPTY_001 Raise query without employeeId @emptydata @raisedqueries', async ({
        raisedQueriesClient
    }) => {

        const response =
            await raisedQueriesClient.createRaisedQuery(
                raisedQueriesData.empty.withoutEmployeeId
            );

        expect(response.status())
            .toBe(HTTP_STATUS.INTERNAL_SERVER_ERROR);

    });

    test('TC_EMPTY_002 Raise query without queryType @emptydata @raisedqueries', async ({
        raisedQueriesClient
    }) => {

        const response =
            await raisedQueriesClient.createRaisedQuery(
                raisedQueriesData.empty.withoutQueryType
            );

        expect(response.status())
            .toBe(HTTP_STATUS.INTERNAL_SERVER_ERROR);

    });

    test('TC_EMPTY_003 Raise query without subject @emptydata @raisedqueries', async ({
        raisedQueriesClient
    }) => {

        const response =
            await raisedQueriesClient.createRaisedQuery(
                raisedQueriesData.empty.withoutSubject
            );

        expect(response.status())
            .toBe(HTTP_STATUS.CREATED);

    });

    test('TC_EMPTY_004 Raise query without query @emptydata @raisedqueries', async ({
        raisedQueriesClient
    }) => {

        const response =
            await raisedQueriesClient.createRaisedQuery(
                raisedQueriesData.empty.withoutQuery
            );

        expect(response.status())
            .toBe(HTTP_STATUS.CREATED);

    });

    test('TC_EMPTY_005 Raise query with empty request body @emptydata @raisedqueries', async ({
        raisedQueriesClient
    }) => {

        const response =
            await raisedQueriesClient.createRaisedQuery(
                raisedQueriesData.empty.emptyObject
            );

        expect(response.status())
            .toBe(HTTP_STATUS.INTERNAL_SERVER_ERROR);

    });

    test('TC_EMPTY_006 Update reply without id @emptydata @raisedqueries', async ({
        raisedQueriesClient
    }) => {

        const response =
            await raisedQueriesClient.updateRaisedQueryReply(
                raisedQueriesData.empty.updateWithoutId
            );

        expect(response.status())
            .toBe(HTTP_STATUS.BAD_REQUEST);

        const body =
            await response.json();

        expect(body.message)
            .toBe(raisedQueriesData.messages.queryIdRequired);

    });

    test('TC_EMPTY_007 Update reply with empty request body @emptydata @raisedqueries', async ({
        raisedQueriesClient
    }) => {

        const response =
            await raisedQueriesClient.updateRaisedQueryReply(
                raisedQueriesData.empty.updateEmptyObject
            );

        expect(response.status())
            .toBe(HTTP_STATUS.BAD_REQUEST);

        const body =
            await response.json();

        expect(body.message)
            .toBe(raisedQueriesData.messages.queryIdRequired);

    });

    test('TC_EMPTY_008 Update raised query without id @emptydata @raisedqueries', async ({
        raisedQueriesClient
    }) => {

        const response =
            await raisedQueriesClient.updateRaisedQuery(
                raisedQueriesData.empty.updateRaisedQueryWithoutId
            );

        expect(response.status())
            .toBe(HTTP_STATUS.BAD_REQUEST);

        const body =
            await response.json();

        expect(body.message)
            .toBe(raisedQueriesData.messages.idRequired);

    });

    test('TC_EMPTY_009 Update raised query without subject @emptydata @raisedqueries', async ({
        raisedQueriesClient
    }) => {

        const response =
            await raisedQueriesClient.updateRaisedQuery(
                raisedQueriesData.empty.updateRaisedQueryWithoutSubject
            );

        expect(response.status())
            .toBe(HTTP_STATUS.OK);

    });

    test('TC_EMPTY_010 Update raised query without query @emptydata @raisedqueries', async ({
        raisedQueriesClient
    }) => {

        const response =
            await raisedQueriesClient.updateRaisedQuery(
                raisedQueriesData.empty.updateRaisedQueryWithoutQuery
            );

        expect(response.status())
            .toBe(HTTP_STATUS.OK);

    });

    test('TC_EMPTY_011 Update raised query with empty request body @emptydata @raisedqueries', async ({
        raisedQueriesClient
    }) => {

        const response =
            await raisedQueriesClient.updateRaisedQuery(
                raisedQueriesData.empty.updateEmptyObject
            );

        expect(response.status())
            .toBe(HTTP_STATUS.BAD_REQUEST);

        const body =
            await response.json();

        expect(body.message)
            .toBe(raisedQueriesData.messages.idRequired);

    });

    test('TC_EMPTY_012 Get employee queries using empty employeeId @emptydata @raisedqueries', async ({
        raisedQueriesClient
    }) => {

        const response =
            await raisedQueriesClient.getEmployeeQueries('');

        expect(response.status())
            .toBe(HTTP_STATUS.OK);

        const body =
            await response.json();

        expect(Array.isArray(body))
            .toBeTruthy();

    });

});