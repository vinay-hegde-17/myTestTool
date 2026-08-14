const { test, expect } = require('../../fixtures/raisedQueries.fixture');
const { HTTP_STATUS } = require('../../api/constants/raisedQueries.constants');
const raisedQueriesData = require('../../test-data/raisedQueries.json');

test.describe('Raised Query Read & Filter APIs', () => {

    test('TC01 Get unanswered queries with default filter @read @raisedqueries @regression @smoke @sanity', async ({
        raisedQueriesClient
    }) => {

        const response =
            await raisedQueriesClient.getRaisedQueries();

        expect(response.status())
            .toBe(HTTP_STATUS.OK);

        const body =
            await response.json();

        expect(Array.isArray(body))
            .toBeTruthy();

        for (const query of body) {
            expect(
                query.reply === undefined ||
                query.reply === null ||
                query.reply === ''
            ).toBeTruthy();
        }

    });

    test('TC02 Get answered queries with filter=true @read @raisedqueries @regression', async ({
        raisedQueriesClient
    }) => {

        // Seed a guaranteed answered query up front. This test must not rely
        // on another test (e.g. TC23) having already run and replied to a
        // query — with parallel workers, execution order across the file
        // is not guaranteed, so filter=true could legitimately see zero
        // answered records if nothing has replied yet.
        const seedQuery = {
            ...raisedQueriesData.valid.createQuery,
            subject: `TC02 seed query ${Date.now()}`
        };

        const createResponse =
            await raisedQueriesClient.createRaisedQuery(seedQuery);

        expect(createResponse.status())
            .toBe(HTTP_STATUS.CREATED);

        const created =
            await createResponse.json();

        const replyResponse =
            await raisedQueriesClient.updateRaisedQueryReply({
                id: created._id,
                reply: `TC02 seed reply ${Date.now()}`
            });

        expect(replyResponse.status())
            .toBe(HTTP_STATUS.OK);

        const response =
            await raisedQueriesClient.getRaisedQueries(true);

        expect(response.status())
            .toBe(HTTP_STATUS.OK);

        const body =
            await response.json();

        expect(Array.isArray(body))
            .toBeTruthy();

        expect(body.length)
            .toBeGreaterThan(0);

        for (const query of body) {
            expect(query.reply)
                .toBeTruthy();
        }

    });

    // TC03/TC04 originally asserted 204 for "no unanswered" / "no answered" queries.
    // There is no delete/cleanup endpoint on this router, so the seed data
    // (which always contains both answered and unanswered queries once TC01/TC02
    // style records exist) can never be driven to an empty state from these tests.
    // Skipped until a dedicated empty-state fixture/DB is available.
    test.skip('TC03 Get queries when no unanswered queries exist @read @raisedqueries @regression', async ({
        raisedQueriesClient
    }) => {

        const response =
            await raisedQueriesClient.getRaisedQueries(false);

        expect(response.status())
            .toBe(HTTP_STATUS.NO_CONTENT);

    });

    test.skip('TC04 Get queries when no answered queries exist @read @raisedqueries @regression', async ({
        raisedQueriesClient
    }) => {

        const response =
            await raisedQueriesClient.getRaisedQueries(true);

        expect(response.status())
            .toBe(HTTP_STATUS.NO_CONTENT);

    });

    test('TC05 Verify queryType details are populated @read @raisedqueries @regression', async ({
        raisedQueriesClient
    }) => {

        const response =
            await raisedQueriesClient.getRaisedQueries();

        expect(response.status())
            .toBe(HTTP_STATUS.OK);

        const body =
            await response.json();

        expect(Array.isArray(body))
            .toBeTruthy();

        for (const query of body) {

            expect(query.queryTypeId)
                .toBeDefined();

            expect(query.queryTypeId)
                .toHaveProperty('_id');

            expect(query.queryTypeId)
                .toHaveProperty('type');

        }

    });

    test('TC06 Verify raised query response schema @read @raisedqueries @regression', async ({
        raisedQueriesClient
    }) => {

        const response =
            await raisedQueriesClient.getRaisedQueries();

        expect(response.status())
            .toBe(HTTP_STATUS.OK);

        const body =
            await response.json();

        expect(Array.isArray(body))
            .toBeTruthy();

        for (const query of body) {

            expect(query)
                .toHaveProperty('_id');

            expect(query)
                .toHaveProperty('employeeId');

            expect(query)
                .toHaveProperty('queryTypeId');

            expect(query)
                .toHaveProperty('subject');

            expect(query)
                .toHaveProperty('query');

        }

    });
});


test.describe('Query Type APIs', () => {

    test('TC08 Get all query types @read @raisedqueries @regression @smoke @sanity', async ({
        raisedQueriesClient
    }) => {

        const response =
            await raisedQueriesClient.getQueryTypes();

        expect(response.status())
            .toBe(HTTP_STATUS.OK);

        const body =
            await response.json();

        expect(Array.isArray(body))
            .toBeTruthy();

    });

    // No delete/cleanup endpoint exists to empty the query-type collection,
    // so this can't be driven to a true empty state. Skipped.
    test.skip('TC09 Get query types when no records exist @read @raisedqueries @regression', async ({
        raisedQueriesClient
    }) => {

        const response =
            await raisedQueriesClient.getQueryTypes();

        expect(response.status())
            .toBe(HTTP_STATUS.OK);

        const body =
            await response.json();

        expect(body)
            .toEqual([]);

    });

    test('TC10 Verify query type response schema @read @raisedqueries @regression', async ({
        raisedQueriesClient
    }) => {

        const response =
            await raisedQueriesClient.getQueryTypes();

        expect(response.status())
            .toBe(HTTP_STATUS.OK);

        const body =
            await response.json();

        expect(Array.isArray(body))
            .toBeTruthy();

        for (const queryType of body) {

            expect(queryType)
                .toHaveProperty('_id');

            expect(queryType)
                .toHaveProperty('type');

        }

    });
});

test.describe('Employee Query Retrieval APIs', () => {

    test('TC12 Get raised queries for valid employee @read @raisedqueries @regression @smoke @sanity', async ({
        raisedQueriesClient
    }) => {

        const response =
            await raisedQueriesClient.getEmployeeQueries(
                raisedQueriesData.valid.employeeId
            );

        expect(response.status())
            .toBe(HTTP_STATUS.OK);

        const body =
            await response.json();

        expect(Array.isArray(body))
            .toBeTruthy();

        expect(body.length)
            .toBeGreaterThan(0);

        for (const query of body) {
            expect(query.employeeId)
                .toBe(raisedQueriesData.valid.employeeId);
        }

    });

    test('TC13 Get raised queries when employee has no queries @read @raisedqueries @regression', async ({
        raisedQueriesClient
    }) => {

        const response =
            await raisedQueriesClient.getEmployeeQueries(
                raisedQueriesData.valid.employeeWithoutQueries
            );

        expect(response.status())
            .toBe(HTTP_STATUS.NO_CONTENT);

    });

    test('TC14 Get raised queries using invalid employeeId @read @raisedqueries @regression', async ({
        raisedQueriesClient
    }) => {

        const response =
            await raisedQueriesClient.getEmployeeQueries(
                raisedQueriesData.invalid.invalidEmployeeId
            );

        expect(response.status())
            .toBe(HTTP_STATUS.NO_CONTENT);

    });

    test('TC15 Verify populated query type for employee queries @read @raisedqueries @regression', async ({
        raisedQueriesClient
    }) => {

        const response =
            await raisedQueriesClient.getEmployeeQueries(
                raisedQueriesData.valid.employeeId
            );

        expect(response.status())
            .toBe(HTTP_STATUS.OK);

        const body =
            await response.json();

        expect(Array.isArray(body))
            .toBeTruthy();

        expect(body.length)
            .toBeGreaterThan(0);

        for (const query of body) {

            expect(query.queryTypeId)
                .toBeDefined();

            expect(query.queryTypeId)
                .toHaveProperty('_id');

            expect(query.queryTypeId)
                .toHaveProperty('type');

        }

    });

    test('TC16 Verify employee query response schema @read @raisedqueries @regression', async ({
        raisedQueriesClient
    }) => {

        const response =
            await raisedQueriesClient.getEmployeeQueries(
                raisedQueriesData.valid.employeeId
            );

        expect(response.status())
            .toBe(HTTP_STATUS.OK);

        const body =
            await response.json();

        expect(Array.isArray(body))
            .toBeTruthy();

        for (const query of body) {

            expect(query)
                .toHaveProperty('_id');

            expect(query)
                .toHaveProperty('employeeId');

            expect(query)
                .toHaveProperty('queryTypeId');

            expect(query)
                .toHaveProperty('subject');

            expect(query)
                .toHaveProperty('query');

        }

    });
});

test.describe('Raised Query Creation & Validation APIs', () => {

    test('TC18 Raise new query @create @raisedqueries @regression @smoke @sanity', async ({
        raisedQueriesClient
    }) => {

        const payload = {
            ...raisedQueriesData.valid.createQuery,
            subject: `Playwright Test Query ${Date.now()}`
        };

        const response =
            await raisedQueriesClient.createRaisedQuery(
                payload
            );

        expect(response.status())
            .toBe(HTTP_STATUS.CREATED);

        const body =
            await response.json();

        expect(body)
            .toHaveProperty('_id');

        expect(body.employeeId)
            .toBe(payload.employeeId);

        expect(body.queryTypeId)
            .toBe(payload.queryType);

        expect(body.subject)
            .toBe(payload.subject);

        expect(body.query)
            .toBe(payload.query);

    });

    test('TC19 Raise query with valid query type @create @raisedqueries @regression', async ({
        raisedQueriesClient
    }) => {

        const payload = {
            ...raisedQueriesData.valid.createQuery,
            subject: `Valid Query Type Test ${Date.now()}`
        };

        const response =
            await raisedQueriesClient.createRaisedQuery(
                payload
            );

        expect(response.status())
            .toBe(HTTP_STATUS.CREATED);

        const body =
            await response.json();

        expect(body)
            .toHaveProperty('_id');

        expect(body.queryTypeId)
            .toBe(payload.queryType);

    });

    test('TC20 Raise query using invalid queryTypeId @create @raisedqueries @regression', async ({
        raisedQueriesClient
    }) => {

        const payload = {
            ...raisedQueriesData.valid.createQuery,
            queryType: raisedQueriesData.invalid.invalidQueryTypeId,
            subject: `Invalid Query Type ${Date.now()}`
        };

        const response =
            await raisedQueriesClient.createRaisedQuery(
                payload
            );

        expect(response.status())
            .toBe(HTTP_STATUS.INTERNAL_SERVER_ERROR);

    });

    test('TC21 Raise query using invalid employeeId @create @raisedqueries @regression', async ({
        raisedQueriesClient
    }) => {

        const payload = {
            ...raisedQueriesData.valid.createQuery,
            employeeId: raisedQueriesData.invalid.invalidEmployeeId,
            subject: `Invalid Employee ${Date.now()}`
        };

        const response =
            await raisedQueriesClient.createRaisedQuery(
                payload
            );

        expect(response.status())
            .toBe(HTTP_STATUS.CREATED);

    });
});

test.describe('Raised Query Reply & FAQ Update APIs', () => {

    test('TC23 Reply to raised query @update @raisedqueries @regression @smoke @sanity', async ({
        raisedQueriesClient
    }) => {

        const payload = {
            id: raisedQueriesData.valid.existingQueryId,
            reply: `Playwright reply ${Date.now()}`
        };

        const response =
            await raisedQueriesClient.updateRaisedQueryReply(
                payload
            );

        expect(response.status())
            .toBe(HTTP_STATUS.OK);

        const body =
            await response.json();

        expect(body)
            .toHaveProperty('status', HTTP_STATUS.OK);

        expect(body)
            .toHaveProperty('message');

        expect(body.data)
            .toHaveProperty('_id');

        expect(body.data.reply)
            .toBe(payload.reply);

    });


    test('TC24 Update showInFAQ=true @update @raisedqueries @regression', async ({
        raisedQueriesClient
    }) => {

        const payload = {
            id: raisedQueriesData.valid.existingQueryId,
            showInFAQ: true
        };

        const response =
            await raisedQueriesClient.updateRaisedQueryReply(
                payload
            );

        expect(response.status())
            .toBe(HTTP_STATUS.OK);

        const body =
            await response.json();

        expect(body)
            .toHaveProperty('status', HTTP_STATUS.OK);

        expect(body.data.showInFAQ)
            .toBe(true);

    });


    test('TC25 Update showInFAQ=false @update @raisedqueries @regression', async ({
        raisedQueriesClient
    }) => {

        const payload = {
            id: raisedQueriesData.valid.existingQueryId,
            showInFAQ: false
        };

        const response =
            await raisedQueriesClient.updateRaisedQueryReply(
                payload
            );

        expect(response.status())
            .toBe(HTTP_STATUS.OK);

        const body =
            await response.json();

        expect(body)
            .toHaveProperty('status', HTTP_STATUS.OK);

        expect(body.data.showInFAQ)
            .toBe(false);

    });


    test('TC26 Update reply and FAQ together @update @raisedqueries @regression', async ({
        raisedQueriesClient
    }) => {

        const payload = {
            id: raisedQueriesData.valid.existingQueryId,
            reply: `Updated reply with FAQ ${Date.now()}`,
            showInFAQ: true
        };

        const response =
            await raisedQueriesClient.updateRaisedQueryReply(
                payload
            );

        expect(response.status())
            .toBe(HTTP_STATUS.OK);

        const body =
            await response.json();

        expect(body.data.reply)
            .toBe(payload.reply);

        expect(body.data.showInFAQ)
            .toBe(true);

    });


    test('TC27 Update only reply @update @raisedqueries @regression', async ({
        raisedQueriesClient
    }) => {

        const payload = {
            id: raisedQueriesData.valid.existingQueryId,
            reply: `Reply only update ${Date.now()}`
        };

        const response =
            await raisedQueriesClient.updateRaisedQueryReply(
                payload
            );

        expect(response.status())
            .toBe(HTTP_STATUS.OK);

        const body =
            await response.json();

        expect(body.data.reply)
            .toBe(payload.reply);

    });


    test('TC28 Update only showInFAQ @update @raisedqueries @regression', async ({
        raisedQueriesClient
    }) => {

        const payload = {
            id: raisedQueriesData.valid.existingQueryId,
            showInFAQ: true
        };

        const response =
            await raisedQueriesClient.updateRaisedQueryReply(
                payload
            );

        expect(response.status())
            .toBe(HTTP_STATUS.OK);

        const body =
            await response.json();

        expect(body.data.showInFAQ)
            .toBe(true);

    });


    test('TC29 Update using invalid queryId @update @raisedqueries @regression', async ({
        raisedQueriesClient
    }) => {

        const payload = {
            id: raisedQueriesData.invalid.invalidQueryId,
            reply: 'Invalid query ID test'
        };

        const response =
            await raisedQueriesClient.updateRaisedQueryReply(
                payload
            );

        expect(response.status())
            .toBe(HTTP_STATUS.INTERNAL_SERVER_ERROR);

    });


    test('TC30 Update using non-existing queryId @update @raisedqueries @regression', async ({
        raisedQueriesClient
    }) => {

        const payload = {
            id: raisedQueriesData.invalid.nonExistingQueryId,
            reply: 'Non-existing query test'
        };

        const response =
            await raisedQueriesClient.updateRaisedQueryReply(
                payload
            );

        expect(response.status())
            .toBe(HTTP_STATUS.NOT_FOUND);

        const body =
            await response.json();

        expect(body)
            .toHaveProperty('message', raisedQueriesData.messages.queryNotFound);

    });
});

test.describe('Raised Query Edit APIs', () => {

    test('TC32 Update raised query @update @raisedqueries @regression @smoke @sanity', async ({
        raisedQueriesClient
    }) => {

        const payload = {
            id: raisedQueriesData.valid.existingQueryId,
            queryTypeId: raisedQueriesData.valid.queryTypeId,
            subject: `Updated subject ${Date.now()}`,
            query: `Updated query description ${Date.now()}`
        };

        const response =
            await raisedQueriesClient.updateRaisedQuery(
                payload
            );

        expect(response.status())
            .toBe(HTTP_STATUS.OK);

        const body =
            await response.json();

        expect(body)
            .toHaveProperty('status', HTTP_STATUS.OK);

        expect(body)
            .toHaveProperty('message', raisedQueriesData.messages.updateSuccessfull);

    });


    test('TC33 Update query subject @update @raisedqueries @regression', async ({
        raisedQueriesClient
    }) => {

        const payload = {
            id: raisedQueriesData.valid.existingQueryId,
            queryTypeId: raisedQueriesData.valid.queryTypeId,
            subject: `Updated subject ${Date.now()}`
        };

        const response =
            await raisedQueriesClient.updateRaisedQuery(
                payload
            );

        expect(response.status())
            .toBe(HTTP_STATUS.OK);

        const body =
            await response.json();

        expect(body)
            .toHaveProperty('status', HTTP_STATUS.OK);

        expect(body)
            .toHaveProperty('message', raisedQueriesData.messages.updateSuccessfull);

    });


    test('TC34 Update query description @update @raisedqueries @regression', async ({
        raisedQueriesClient
    }) => {

        const payload = {
            id: raisedQueriesData.valid.existingQueryId,
            queryTypeId: raisedQueriesData.valid.queryTypeId,
            query: `Updated query description ${Date.now()}`
        };

        const response =
            await raisedQueriesClient.updateRaisedQuery(
                payload
            );

        expect(response.status())
            .toBe(HTTP_STATUS.OK);

        const body =
            await response.json();

        expect(body)
            .toHaveProperty('status', HTTP_STATUS.OK);

        expect(body)
            .toHaveProperty('message', raisedQueriesData.messages.updateSuccessfull);

    });


    test('TC35 Update query type @update @raisedqueries @regression', async ({
        raisedQueriesClient
    }) => {

        const payload = {
            id: raisedQueriesData.valid.existingQueryId,
            queryTypeId: raisedQueriesData.valid.secondQueryTypeId,
            subject: `Query type update ${Date.now()}`,
            query: 'Testing query type update'
        };

        const response =
            await raisedQueriesClient.updateRaisedQuery(
                payload
            );

        expect(response.status())
            .toBe(HTTP_STATUS.OK);

        const body =
            await response.json();

        expect(body)
            .toHaveProperty('status', HTTP_STATUS.OK);

        expect(body)
            .toHaveProperty('message', raisedQueriesData.messages.updateSuccessfull);

    });


    test('TC36 Update using invalid queryId @update @raisedqueries @regression', async ({
        raisedQueriesClient
    }) => {

        const payload = {
            id: raisedQueriesData.invalid.invalidQueryId,
            queryTypeId: raisedQueriesData.valid.queryTypeId,
            subject: 'Invalid query ID update',
            query: 'Testing invalid query ID'
        };

        const response =
            await raisedQueriesClient.updateRaisedQuery(
                payload
            );

        expect(response.status())
            .toBe(HTTP_STATUS.INTERNAL_SERVER_ERROR);

    });


    test('TC37 Update using non-existing queryId @update @raisedqueries @regression', async ({
        raisedQueriesClient
    }) => {

        const payload = {
            id: raisedQueriesData.invalid.nonExistingQueryId,
            queryTypeId: raisedQueriesData.valid.queryTypeId,
            subject: 'Non existing query update',
            query: 'Testing non existing query'
        };

        const response =
            await raisedQueriesClient.updateRaisedQuery(
                payload
            );

        expect(response.status())
            .toBe(HTTP_STATUS.NOT_FOUND);

        const body =
            await response.json();

        expect(body)
            .toHaveProperty('message', raisedQueriesData.messages.queryNotFound);

    });
});

test.describe('FAQ Read & Validation APIs', () => {

    test('TC39 Get FAQ queries @read @raisedqueries @faq @regression @smoke @sanity', async ({
        raisedQueriesClient
    }) => {

        const response =
            await raisedQueriesClient.getFAQQueries();

        expect(response.status())
            .toBe(HTTP_STATUS.OK);

        const body =
            await response.json();

        expect(Array.isArray(body))
            .toBeTruthy();

        expect(body.length)
            .toBeGreaterThan(0);

    });


    // No delete/cleanup endpoint exists to guarantee showInFAQ is false on
    // every record, so this can't be reliably driven to an empty state. Skipped.
    test.skip('TC40 Get FAQ when no records exist @read @raisedqueries @faq @regression', async ({
        raisedQueriesClient
    }) => {

        const response =
            await raisedQueriesClient.getFAQQueries();

        expect(response.status())
            .toBe(HTTP_STATUS.NO_CONTENT);

    });


    test('TC41 Verify only FAQ-enabled queries are returned @read @raisedqueries @faq @regression', async ({
        raisedQueriesClient
    }) => {

        const response =
            await raisedQueriesClient.getFAQQueries();

        expect(response.status())
            .toBe(HTTP_STATUS.OK);

        const body =
            await response.json();

        expect(Array.isArray(body))
            .toBeTruthy();

        expect(body.length)
            .toBeGreaterThan(0);

        for (const faq of body) {

            expect(faq)
                .toHaveProperty('query');

            expect(faq)
                .toHaveProperty('reply');

        }

    });


    test('TC42 Verify query and reply fields only @read @raisedqueries @faq @regression', async ({
        raisedQueriesClient
    }) => {

        const response =
            await raisedQueriesClient.getFAQQueries();

        expect(response.status())
            .toBe(HTTP_STATUS.OK);

        const body =
            await response.json();

        expect(Array.isArray(body))
            .toBeTruthy();

        for (const faq of body) {

            expect(Object.keys(faq))
                .toEqual(
                    expect.arrayContaining([
                        'query',
                        'reply'
                    ])
                );

            expect(Object.keys(faq))
                .not
                .toContain('_id');

        }

    });


    test('TC43 Verify FAQ response schema @read @raisedqueries @faq @regression', async ({
        raisedQueriesClient
    }) => {

        const response =
            await raisedQueriesClient.getFAQQueries();

        expect(response.status())
            .toBe(HTTP_STATUS.OK);

        const body =
            await response.json();

        expect(Array.isArray(body))
            .toBeTruthy();

        for (const faq of body) {

            expect(faq)
                .toHaveProperty('query');

            expect(faq)
                .toHaveProperty('reply');

            expect(typeof faq.query)
                .toBe('string');

            expect(typeof faq.reply)
                .toBe('string');

        }

    });
});