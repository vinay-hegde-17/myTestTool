const { test, expect } = require("../../fixtures/itDeclaration.fixture");
const { HTTP_STATUS } = require("../../api/constants/itDeclaration.constants");

test.describe("IT Declaration Module - Empty Data Validation", () => {
    test.describe('Create Operations', () => {
        test("TC_EMPTY_001 Create declaration without employeeId @emptydata @smoke @create", async ({ itDeclarationClient }) => {
            const response = await itDeclarationClient.createITDeclaration({
                regime: "old",
                financialYear: "2027-28"
            });

            expect(response.status()).toBe(HTTP_STATUS.BAD_REQUEST);
        });

        test("TC_EMPTY_002 Create declaration without regime @emptydata @sanity @create", async ({ itDeclarationClient }) => {
            const response = await itDeclarationClient.createITDeclaration({
                employeeId: process.env.TEST_EMPLOYEE_ID || "",
                financialYear: "2027-28"
            });

            expect(response.status()).toBe(HTTP_STATUS.BAD_REQUEST);
        });

        test("TC_EMPTY_003 Create declaration without financialYear @emptydata @sanity @create", async ({ itDeclarationClient }) => {
            const response = await itDeclarationClient.createITDeclaration({
                employeeId: process.env.TEST_EMPLOYEE_ID || "",
                regime: "old"
            });

            expect(response.status()).toBe(HTTP_STATUS.BAD_REQUEST);
        });

        test("TC_EMPTY_004 Create declaration with empty request body @emptydata @regression @create", async ({ itDeclarationClient }) => {
            const response = await itDeclarationClient.createITDeclaration({});
            expect(response.status()).toBe(HTTP_STATUS.BAD_REQUEST);
        });
    });

    test.describe('Update Operations', () => {
        test("TC_EMPTY_005 Update regime with empty request body @emptydata @regression @update", async ({ itDeclarationClient }) => {
            const response = await itDeclarationClient.updateRegimeData({});
            expect(response.status()).toBe(HTTP_STATUS.BAD_REQUEST);
        });

        test("TC_EMPTY_006 Update regime without employeeId @emptydata @sanity @update", async ({ itDeclarationClient }) => {
            const response = await itDeclarationClient.updateRegimeData({
                financialYear: "2027-28"
            });

            expect(response.status()).toBe(HTTP_STATUS.BAD_REQUEST);
        });

        test("TC_EMPTY_007 Update regime without financialYear @emptydata @sanity @update", async ({ itDeclarationClient }) => {
            const response = await itDeclarationClient.updateRegimeData({
                employeeId: process.env.TEST_EMPLOYEE_ID || ""
            });

            expect(response.status()).toBe(HTTP_STATUS.BAD_REQUEST);
        });
    });

    test.describe('Proof Upload Operations', () => {
        test("TC_EMPTY_008 Upload proofs without employeeId @emptydata @sanity @upload", async ({ itDeclarationClient }) => {
            const response = await itDeclarationClient.uploadProofs({
                financialYear: "2027-28"
            });

            expect(response.status()).toBe(HTTP_STATUS.BAD_REQUEST);
        });

        test("TC_EMPTY_009 Upload proofs without financialYear @emptydata @sanity @upload", async ({ itDeclarationClient }) => {
            const response = await itDeclarationClient.uploadProofs({
                employeeId: process.env.TEST_EMPLOYEE_ID || ""
            });

            expect(response.status()).toBe(HTTP_STATUS.BAD_REQUEST);
        });

        test("TC_EMPTY_010 Upload proofs with empty body @emptydata @regression @upload", async ({ itDeclarationClient }) => {
            const response = await itDeclarationClient.uploadProofs({});
            expect(response.status()).toBe(HTTP_STATUS.BAD_REQUEST);
        });
    });

    test.describe('Read Operations', () => {
        test("TC_EMPTY_011 Get employees without regime query parameter @emptydata @regression @read", async ({ itDeclarationClient }) => {
            const response = await itDeclarationClient.getEmployeesByRegime("", "2027-28");
            expect(response.status()).toBe(HTTP_STATUS.NO_CONTENT);
        });

        test("TC_EMPTY_012 Get employees without financialYear query parameter @emptydata @regression @read", async ({ itDeclarationClient }) => {
            const response = await itDeclarationClient.getEmployeesByRegime("old", "");
            expect(response.status()).toBe(HTTP_STATUS.NO_CONTENT);
        });
    });
});