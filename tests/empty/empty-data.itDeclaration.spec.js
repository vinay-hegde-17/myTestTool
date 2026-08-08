const { test, expect } = require("../../fixtures/itDeclaration.fixture");
const { HTTP_STATUS } = require("../../api/constants/itDeclaration.constants");

test.describe("Empty IT Declaration Data Scenarios", () => {

    test("TC_EMPTY_001 Create declaration without employeeId @emptydata", async ({
        itDeclarationClient
    }) => {

        const response = await itDeclarationClient.createITDeclaration({
            regime: "old",
            financialYear: "2027-28"
        });

        expect(response.status()).toBe(HTTP_STATUS.BAD_REQUEST);
    });

    test("TC_EMPTY_002 Create declaration without regime @emptydata", async ({
        itDeclarationClient
    }) => {

        const response = await itDeclarationClient.createITDeclaration({
            employeeId: "6a1f0bd1c9ce1caed4279c13",
            financialYear: "2027-28"
        });

        expect(response.status()).toBe(HTTP_STATUS.BAD_REQUEST);
    });

    test("TC_EMPTY_003 Create declaration without financialYear @emptydata", async ({
        itDeclarationClient
    }) => {

        const response = await itDeclarationClient.createITDeclaration({
            employeeId: "6a1f0bd1c9ce1caed4279c13",
            regime: "old"
        });

        expect(response.status()).toBe(HTTP_STATUS.BAD_REQUEST);
    });

    test("TC_EMPTY_004 Create declaration with empty request body @emptydata", async ({
        itDeclarationClient
    }) => {

        const response = await itDeclarationClient.createITDeclaration({});

        expect(response.status()).toBe(HTTP_STATUS.BAD_REQUEST);
    });

    test("TC_EMPTY_005 Update regime with empty request body @emptydata", async ({
        itDeclarationClient
    }) => {

        const response = await itDeclarationClient.updateRegimeData({});

        expect(response.status()).toBe(HTTP_STATUS.BAD_REQUEST);
    });

    test("TC_EMPTY_006 Update regime without employeeId @emptydata", async ({
        itDeclarationClient
    }) => {

        const response = await itDeclarationClient.updateRegimeData({
            financialYear: "2027-28"
        });

        expect(response.status()).toBe(HTTP_STATUS.BAD_REQUEST);
    });

    test("TC_EMPTY_007 Update regime without financialYear @emptydata", async ({
        itDeclarationClient
    }) => {

        const response = await itDeclarationClient.updateRegimeData({
            employeeId: "6a1f0bd1c9ce1caed4279c13"
        });

        expect(response.status()).toBe(HTTP_STATUS.BAD_REQUEST);
    });

    test("TC_EMPTY_008 Upload proofs without employeeId @emptydata", async ({
        itDeclarationClient
    }) => {

        const response = await itDeclarationClient.uploadProofs({
            financialYear: "2027-28"
        });

        expect(response.status()).toBe(HTTP_STATUS.BAD_REQUEST);
    });

    test("TC_EMPTY_009 Upload proofs without financialYear @emptydata", async ({
        itDeclarationClient
    }) => {

        const response = await itDeclarationClient.uploadProofs({
            employeeId: "6a1f0bd1c9ce1caed4279c13"
        });

        expect(response.status()).toBe(HTTP_STATUS.BAD_REQUEST);
    });

    test("TC_EMPTY_010 Upload proofs with empty body @emptydata", async ({
        itDeclarationClient
    }) => {

        const response = await itDeclarationClient.uploadProofs({});

        expect(response.status()).toBe(HTTP_STATUS.BAD_REQUEST);
    });

    test("TC_EMPTY_011 Get employees without regime query parameter @emptydata", async ({
        itDeclarationClient
    }) => {

        const response = await itDeclarationClient.getEmployeesByRegime(
            "",
            "2027-28"
        );

        expect(response.status()).toBe(HTTP_STATUS.NO_CONTENT);
    });

    test("TC_EMPTY_012 Get employees without financialYear query parameter @emptydata", async ({
        itDeclarationClient
    }) => {

        const response = await itDeclarationClient.getEmployeesByRegime(
            "old",
            ""
        );

        expect(response.status()).toBe(HTTP_STATUS.NO_CONTENT);
    });

});