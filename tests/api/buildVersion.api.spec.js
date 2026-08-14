const { test, expect } = require('../../fixtures/buildVersion.fixture');
const { HTTP_STATUS } = require('../../api/constants/buildVersion.constants');
const buildVersionData = require('../../test-data/buildVersion.json');

test.describe('Build Version Create APIs', () => {

    test('TC01 Create next build version @create @buildversion @regression @smoke @sanity',
        async ({ buildVersionClient }) => {

            const response =
                await buildVersionClient.create();

            expect(response.status())
                .toBe(HTTP_STATUS.CREATED);

            const body =
                await response.json();

            expect(body)
                .toHaveProperty('message');

            expect(body)
                .toHaveProperty('version');

            expect(body.version)
                .toMatch(
                    new RegExp(
                        buildVersionData.expected.versionPattern
                    )
                );
        });


    test('TC02 Verify patch version is incremented @create @buildversion @regression',
        async ({ buildVersionClient }) => {

            const latestResponse =
                await buildVersionClient.getLatest();

            expect(latestResponse.status())
                .toBe(HTTP_STATUS.OK);

            const latestBody =
                await latestResponse.json();

            const previousVersion =
                latestBody.versionNumber;

            const versionParts =
                previousVersion.split('.').map(Number);

            const expectedPatchVersion =
                `${versionParts[0]}.${versionParts[1]}.${versionParts[2] + 1}`;

            const createResponse =
                await buildVersionClient.create();

            expect(createResponse.status())
                .toBe(HTTP_STATUS.CREATED);

            const createBody =
                await createResponse.json();

            expect(createBody.version)
                .toBe(expectedPatchVersion);
        });


});

test.describe('Build Version Read APIs', () => {

    test('TC04 Get latest build version @read @buildversion @regression @smoke @sanity',
        async ({ buildVersionClient }) => {

            const response =
                await buildVersionClient.getLatest();

            expect(response.status())
                .toBe(HTTP_STATUS.OK);

            const body =
                await response.json();

            expect(body)
                .toHaveProperty('versionNumber');

            expect(typeof body.versionNumber)
                .toBe('string');
        });


    test('TC05 Get latest version when records exist @read @buildversion @regression',
        async ({ buildVersionClient }) => {

            const createResponse =
                await buildVersionClient.create();

            expect(createResponse.status())
                .toBe(HTTP_STATUS.CREATED);

            const createBody =
                await createResponse.json();

            const response =
                await buildVersionClient.getLatest();

            expect(response.status())
                .toBe(HTTP_STATUS.OK);

            const body =
                await response.json();

            expect(body.versionNumber)
                .toBe(createBody.version);
        });


    test('TC06 Verify latest version is returned @read @buildversion @regression',
        async ({ buildVersionClient }) => {

            const createResponse =
                await buildVersionClient.create();

            expect(createResponse.status())
                .toBe(HTTP_STATUS.CREATED);

            const createBody =
                await createResponse.json();

            const response =
                await buildVersionClient.getLatest();

            expect(response.status())
                .toBe(HTTP_STATUS.OK);

            const body =
                await response.json();

            expect(body.versionNumber)
                .toBe(createBody.version);
        });


    test('TC07 Verify response schema @read @buildversion @regression',
        async ({ buildVersionClient }) => {

            const response =
                await buildVersionClient.getLatest();

            expect(response.status())
                .toBe(HTTP_STATUS.OK);

            const body =
                await response.json();

            expect(body)
                .toHaveProperty('versionNumber');

            expect(typeof body.versionNumber)
                .toBe('string');

            expect(body.versionNumber)
                .toMatch(
                    new RegExp(
                        buildVersionData.expected.versionPattern
                    )
                );
        });


});