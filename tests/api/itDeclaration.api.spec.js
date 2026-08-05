const { test, expect } = require('../../fixtures/itDeclaration.fixture');
const { HTTP_STATUS, IT_DECLARATION_ENDPOINTS } = require('../../api/constants/itDeclaration.constants');
const itdData = require('../../test-data/itDeclaration.json');
const path = require("path");

let uploadedFileId;

test.beforeAll(async ({ itDeclarationClient }) => {

    const response = await itDeclarationClient.uploadProofs(
        {
            employeeId: itdData.singleProof.employeeId,
            financialYear: itdData.singleProof.financialYear,
            proofId: "TEMP_TEST",
            items: "Automation",
            particulars: "Temporary File"
        },
        {
            name: "aadhaar.pdf",
            mimeType: "application/pdf",
            buffer: require("fs").readFileSync(
                path.join(__dirname, "../../test-data/files/aadhaar.pdf")
            )
        }
    );

    expect(response.status()).toBe(HTTP_STATUS.OK);

    const proofs =
        await itDeclarationClient.getProofs(
            itdData.singleProof.employeeId,
            itdData.singleProof.financialYear
        );

    expect(proofs.status()).toBe(HTTP_STATUS.OK);

    const body = await proofs.json();

    const proof = body.proofOfSubmission.find(
        p => p.proofId === "TEMP_TEST"
    );

    uploadedFileId = proof.files[0].fileId;
});

test.describe("IT Declaration - Read Operations", () => {

    test("TC01 Get proof file using uploaded fileId", async ({ itDeclarationClient }) => {

        const response =
            await itDeclarationClient.getProofFile(uploadedFileId);

        expect(response.status()).toBe(HTTP_STATUS.OK);

        const body = await response.json();

        expect(body.fileId.toString()).toBe(uploadedFileId.toString());

        expect(body.fileName).toBeTruthy();

        expect(body.fileType).toBeTruthy();

        expect(body.base64Data).toBeTruthy();

    });

    test("TC02 Get proof file using invalid fileId", async ({
        itDeclarationClient
    }) => {

        const response =
            await itDeclarationClient.getProofFile(
                itdData.invalid.invalidObjectId
            );

        expect(response.status())
            .toBe(HTTP_STATUS.BAD_REQUEST);

        const body =
            await response.json();

        expect(body.message)
            .toBe(itdData.messages.invalidFileId);

    });

    test("TC03 Get proof file using non-existing fileId", async ({
        itDeclarationClient
    }) => {

        const response =
            await itDeclarationClient.getProofFile(
                itdData.invalid.nonExistingFileId
            );

        expect(response.status())
            .toBe(HTTP_STATUS.NOT_FOUND);

        const body =
            await response.json();

        expect(body.message)
            .toBe(itdData.messages.fileNotFound);

    });

    test("TC04 Verify proof file response contains metadata and base64 data", async ({ itDeclarationClient }) => {

        const response =
            await itDeclarationClient.getProofFile(uploadedFileId);

        expect(response.status()).toBe(HTTP_STATUS.OK);

        const body = await response.json();

        expect(body).toHaveProperty("fileId");

        expect(body).toHaveProperty("fileName");

        expect(body).toHaveProperty("fileType");

        expect(body).toHaveProperty("base64Data");

        expect(typeof body.base64Data).toBe("string");

    });

    test("TC05 Get proof file without Authorization", async ({
        request
    }) => {

        const response =
            await request.get(
                `${IT_DECLARATION_ENDPOINTS.GET_PROOF_FILE}/${itdData.existing.fileId}`
            );

        expect(response.status())
            .toBe(HTTP_STATUS.UNAUTHORIZED);

    });

    test("TC06 Get employee IT declaration", async ({
        itDeclarationClient
    }) => {

        const response =
            await itDeclarationClient.getITDeclaration(
                itdData.existing.employeeId,
                itdData.existing.financialYear
            );

        expect(response.status())
            .toBe(HTTP_STATUS.OK);

        const body =
            await response.json();

        expect(body.regime)
            .toBe(itdData.existing.regime);

        expect(body)
            .toHaveProperty("financialYear");

    });

    test("TC07 Get IT declaration using invalid employeeId", async ({
        itDeclarationClient
    }) => {

        const response =
            await itDeclarationClient.getITDeclaration(
                itdData.invalid.invalidObjectId,
                itdData.existing.financialYear
            );

        expect(response.status())
            .toBe(HTTP_STATUS.OK);

        const body =
            await response.json();

        expect(body)
            .toBeNull();

    });

    test("TC08 Get IT declaration using non-existing employeeId", async ({
        itDeclarationClient
    }) => {

        const response =
            await itDeclarationClient.getITDeclaration(
                itdData.invalid.nonExistingEmployeeId,
                itdData.existing.financialYear
            );

        expect(response.status())
            .toBe(HTTP_STATUS.OK);

        const body =
            await response.json();

        expect(body)
            .toBeNull();

    });

    test("TC09 Verify IT declaration response schema", async ({
        itDeclarationClient
    }) => {

        const response =
            await itDeclarationClient.getITDeclaration(
                itdData.existing.employeeId,
                itdData.existing.financialYear
            );

        expect(response.status())
            .toBe(HTTP_STATUS.OK);

        const body =
            await response.json();

        expect(body)
            .toHaveProperty("regime");

        expect(body)
            .toHaveProperty("financialYear");

    });

    test("TC10 Get IT declaration without Authorization", async ({
        request
    }) => {

        const response =
            await request.get(
                `${IT_DECLARATION_ENDPOINTS.GET_IT_DECLARATION}/${itdData.existing.employeeId}/${itdData.existing.financialYear}`
            );

        expect(response.status())
            .toBe(HTTP_STATUS.UNAUTHORIZED);

    });

    test("TC11 Get proof of submission", async ({
        itDeclarationClient
    }) => {

        const response =
            await itDeclarationClient.getProofs(
                itdData.existing.employeeId,
                itdData.existing.financialYear
            );

        expect(response.status())
            .toBe(HTTP_STATUS.OK);

        const body =
            await response.json();

        expect(body)
            .toHaveProperty("proofOfSubmission");

        expect(Array.isArray(body.proofOfSubmission))
            .toBeTruthy();

    });

    test("TC12 Get proofs when declaration does not exist", async ({
        itDeclarationClient
    }) => {

        const response =
            await itDeclarationClient.getProofs(
                itdData.invalid.nonExistingEmployeeId,
                itdData.existing.financialYear
            );

        expect(response.status())
            .toBe(HTTP_STATUS.NO_CONTENT);

    });

    test("TC13 Verify proof response schema", async ({
        itDeclarationClient
    }) => {

        const response =
            await itDeclarationClient.getProofs(
                itdData.existing.employeeId,
                itdData.existing.financialYear
            );

        expect(response.status())
            .toBe(HTTP_STATUS.OK);

        const body =
            await response.json();

        expect(body)
            .toHaveProperty("_id");

        expect(body)
            .toHaveProperty("oldRegimeDetails");

        expect(body)
            .toHaveProperty("proofOfSubmission");

    });

    test("TC14 Verify uploaded proof file details", async ({
        itDeclarationClient
    }) => {

        const response =
            await itDeclarationClient.getProofs(
                itdData.existing.employeeId,
                itdData.existing.financialYear
            );

        expect(response.status())
            .toBe(HTTP_STATUS.OK);

        const body =
            await response.json();

        const proof =
            body.proofOfSubmission[0];

        expect(proof)
            .toHaveProperty("proofId");

        expect(proof)
            .toHaveProperty("items");

        expect(proof)
            .toHaveProperty("particulars");

        expect(Array.isArray(proof.files))
            .toBeTruthy();

        if (proof.files.length > 0) {

            expect(proof.files[0])
                .toHaveProperty("fileId");

            expect(proof.files[0])
                .toHaveProperty("filename");

        }

    });

    test("TC15 Get proofs without Authorization", async ({
        request
    }) => {

        const response =
            await request.get(
                `${IT_DECLARATION_ENDPOINTS.GET_PROOFS}/${itdData.existing.employeeId}/${itdData.existing.financialYear}`
            );

        expect(response.status())
            .toBe(HTTP_STATUS.UNAUTHORIZED);

    });

    test("TC16 Download proof documents", async ({
        itDeclarationClient
    }) => {

        const response =
            await itDeclarationClient.getZipProofs(
                itdData.existing.employeeId,
                itdData.existing.financialYear
            );

        expect(response.status())
            .toBe(HTTP_STATUS.OK);

        const body =
            await response.json();

        expect(body)
            .toHaveProperty("proofOfSubmission");

    });

    test("TC17 Get zip proofs when declaration does not exist", async ({
        itDeclarationClient
    }) => {

        const response =
            await itDeclarationClient.getZipProofs(
                itdData.invalid.nonExistingEmployeeId,
                itdData.existing.financialYear
            );

        expect(response.status())
            .toBe(HTTP_STATUS.NO_CONTENT);

    });

    test("TC18 Verify downloaded files contain base64 data", async ({
        itDeclarationClient
    }) => {

        const response =
            await itDeclarationClient.getZipProofs(
                itdData.existing.employeeId,
                itdData.existing.financialYear
            );

        expect(response.status())
            .toBe(HTTP_STATUS.OK);

        const body =
            await response.json();

        const proof =
            body.proofOfSubmission[0];

        expect(Array.isArray(proof.files))
            .toBeTruthy();

        if (proof.files.length > 0) {

            expect(proof.files[0])
                .toHaveProperty("base64Data");

            expect(typeof proof.files[0].base64Data)
                .toBe("string");

        }

    });

    test("TC19 Get zip proofs without Authorization", async ({
        request
    }) => {

        const response =
            await request.get(
                `${IT_DECLARATION_ENDPOINTS.GET_ZIP_PROOFS}/${itdData.existing.employeeId}/${itdData.existing.financialYear}`
            );

        expect(response.status())
            .toBe(HTTP_STATUS.UNAUTHORIZED);

    });

    test("TC20 Get employees by Old Regime", async ({
        itDeclarationClient
    }) => {

        const response =
            await itDeclarationClient.getEmployees(
                "old",
                itdData.oldRegime.financialYear
            );

        expect(response.status())
            .toBe(HTTP_STATUS.OK);

        const body =
            await response.json();

        expect(Array.isArray(body))
            .toBeTruthy();

        body.forEach(employee => {

            expect(employee)
                .toHaveProperty("employeeId");

            expect(employee)
                .toHaveProperty("firstName");

            expect(employee)
                .toHaveProperty("lastName");

            expect(employee)
                .toHaveProperty("employeeNumber");

            expect(employee)
                .toHaveProperty("panNumber");

        });

    });

    test("TC21 Get employees by New Regime", async ({
        itDeclarationClient
    }) => {

        const response =
            await itDeclarationClient.getEmployees(
                "new",
                itdData.existing.financialYear
            );

        expect(response.status())
            .toBe(HTTP_STATUS.OK);

        const body =
            await response.json();

        expect(Array.isArray(body))
            .toBeTruthy();

    });

    test("TC22 Get employees when no records exist", async ({
        itDeclarationClient
    }) => {

        const response =
            await itDeclarationClient.getEmployees(
                "old",
                "2099-00"
            );

        expect(response.status())
            .toBe(HTTP_STATUS.NO_CONTENT);

    });

    test("TC23 Verify employees response schema", async ({
        itDeclarationClient
    }) => {

        const response =
            await itDeclarationClient.getEmployees(
                "new",
                itdData.existing.financialYear
            );

        expect(response.status())
            .toBe(HTTP_STATUS.OK);

        const body =
            await response.json();

        body.forEach(employee => {

            expect(employee)
                .toHaveProperty("employeeId");

            expect(employee)
                .toHaveProperty("firstName");

            expect(employee)
                .toHaveProperty("lastName");

            expect(employee)
                .toHaveProperty("employeeNumber");

            expect(employee)
                .toHaveProperty("panNumber");

        });

    });

    test("TC24 Get employees without Authorization", async ({
        request
    }) => {

        const response =
            await request.get(
                `${IT_DECLARATION_ENDPOINTS.GET_EMPLOYEES}?regime=new&financialYear=${itdData.existing.financialYear}`
            );

        expect(response.status())
            .toBe(HTTP_STATUS.UNAUTHORIZED);

    });

    test("TC25 Get ITD configuration details", async ({
        itDeclarationClient
    }) => {

        const response =
            await itDeclarationClient.getITDConfiguration();

        expect(response.status())
            .toBe(HTTP_STATUS.OK);

        const body =
            await response.json();

        expect(body)
            .toBeTruthy();

    });

    test("TC26 Verify ITD configuration response schema", async ({
        itDeclarationClient
    }) => {

        const response =
            await itDeclarationClient.getITDConfiguration();

        expect(response.status())
            .toBe(HTTP_STATUS.OK);

        const body =
            await response.json();

        expect(body)
            .toHaveProperty("ENABLE_PROOF_OF_SUBMISSION");

        expect(body)
            .toHaveProperty("REGIME_DETAILS_EDITABLE");

        expect(body)
            .toHaveProperty("ITD_POLICY_URL");

    });


    test("TC27 Get ITD configuration without Authorization", async ({
        request
    }) => {

        const response =
            await request.get(
                IT_DECLARATION_ENDPOINTS.GET_ITD_CONFIGURATION
            );

        expect(response.status())
            .toBe(HTTP_STATUS.UNAUTHORIZED);

    });

});

test.describe("IT Declaration - Create Operations", () => {

    test("TC28 Create IT declaration using Old Regime", async ({
        itDeclarationClient
    }) => {

        const response =
            await itDeclarationClient.createITDeclaration(
                itdData.oldRegime
            );

        expect(response.status())
            .toBe(HTTP_STATUS.CREATED);

        const body =
            await response.json();

        expect(body.employeeId)
            .toBe(itdData.oldRegime.employeeId);

        expect(body.regime)
            .toBe("old");

        expect(body.financialYear)
            .toBe(itdData.oldRegime.financialYear);

    });

    test("TC29 Create IT declaration using New Regime", async ({
        itDeclarationClient
    }) => {

        const response =
            await itDeclarationClient.createITDeclaration(
                itdData.newRegime
            );

        expect(response.status())
            .toBe(HTTP_STATUS.CREATED);

        const body =
            await response.json();

        expect(body.employeeId)
            .toBe(itdData.newRegime.employeeId);

        expect(body.regime)
            .toBe("new");

        expect(body.financialYear)
            .toBe(itdData.newRegime.financialYear);

    });

    test("TC30 Verify created IT declaration response", async ({
        itDeclarationClient
    }) => {

        const response =
            await itDeclarationClient.createITDeclaration(
                itdData.newRegime
            );

        expect(response.status())
            .toBe(HTTP_STATUS.CREATED);

        const body =
            await response.json();

        expect(body)
            .toHaveProperty("_id");

        expect(body)
            .toHaveProperty("employeeId");

        expect(body)
            .toHaveProperty("regime");

        expect(body)
            .toHaveProperty("financialYear");

    });

    test("TC31 Create duplicate IT declaration", async ({
        itDeclarationClient
    }) => {

        const response =
            await itDeclarationClient.createITDeclaration(
                itdData.duplicate
            );

        expect(response.status())
            .toBe(HTTP_STATUS.CREATED);

        const body =
            await response.json();

        expect(body.employeeId)
            .toBe(itdData.duplicate.employeeId);

    });

    test("TC32 Create IT declaration without Authorization", async ({
        request
    }) => {

        const response =
            await request.post(
                IT_DECLARATION_ENDPOINTS.CREATE_IT_DECLARATION,
                {
                    data: itdData.newRegime
                }
            );

        expect(response.status())
            .toBe(HTTP_STATUS.UNAUTHORIZED);

    });

});

test.describe("IT Declaration - Update Operations", () => {

    test.beforeAll(async ({ itDeclarationClient }) => {
        // TC34/TC35/TC36 update this employeeId + financialYear combo, so it
        // must exist first. Accept CREATED (first run) or CONFLICT (reruns).
        const response = await itDeclarationClient.createITDeclaration(itdData.itDeclaration);
        expect([HTTP_STATUS.CREATED, HTTP_STATUS.CONFLICT]).toContain(response.status());
    });

    test("TC33 Update IT declaration", async ({
        itDeclarationClient
    }) => {

        const response =
            await itDeclarationClient.updateITDeclaration(
                itdData.updatedDeclaration
            );

        expect(response.status())
            .toBe(HTTP_STATUS.OK);

        const body =
            await response.json();

        expect(body.employeeId)
            .toBe(itdData.updatedDeclaration.employeeId);

        expect(body.ownerPan)
            .toBe(itdData.updatedDeclaration.ownerPan);

    });

    test("TC34 Update owner PAN", async ({
        itDeclarationClient
    }) => {

        const response =
            await itDeclarationClient.updateITDeclaration(
                itdData.updatedPan
            );

        expect(response.status())
            .toBe(HTTP_STATUS.OK);

        const body =
            await response.json();

        expect(body.ownerPan)
            .toBe(itdData.updatedPan.ownerPan);

    });

    test("TC35 Update old regime details", async ({
        itDeclarationClient
    }) => {

        const response =
            await itDeclarationClient.updateITDeclaration(
                itdData.updatedOldRegime
            );

        expect(response.status())
            .toBe(HTTP_STATUS.OK);

        const body =
            await response.json();

        expect(body.oldRegimeDetails)
            .toEqual(itdData.updatedOldRegime.oldRegimeDetails);

    });

    test("TC36 Update non-existing IT declaration", async ({
        itDeclarationClient
    }) => {

        const response =
            await itDeclarationClient.updateITDeclaration(
                itdData.nonExistingDeclaration
            );

        expect(response.status())
            .toBe(HTTP_STATUS.NOT_FOUND);

        const body =
            await response.json();

        expect(body.message)
            .toBe("IT declaration not found for the given employee and financial year.");

    });

    test("TC37 Update IT declaration without Authorization", async ({
        request
    }) => {

        const response =
            await request.put(
                IT_DECLARATION_ENDPOINTS.UPDATE_REGIME_DATA,
                {
                    data: itdData.updatedDeclaration
                }
            );

        expect(response.status())
            .toBe(HTTP_STATUS.UNAUTHORIZED);

    });

    test("TC38 Upload proof document", async ({
        itDeclarationClient
    }) => {

        const response =
            await itDeclarationClient.uploadProofs(
                itdData.singleProof
            );

        expect(response.status())
            .toBe(HTTP_STATUS.OK);

        const body =
            await response.json();

        expect(body.message)
            .toBe("Proof uploaded successfully");

    });

    test("TC39 Upload multiple proof documents", async ({
        itDeclarationClient
    }) => {

        const response =
            await itDeclarationClient.uploadProofs(
                itdData.multipleProofs
            );

        expect(response.status())
            .toBe(HTTP_STATUS.OK);

        const body =
            await response.json();

        expect(body.message)
            .toBe("Proof uploaded successfully");

    });

    test("TC40 Upload proof to existing proof category", async ({
        itDeclarationClient
    }) => {

        const response =
            await itDeclarationClient.uploadProofs(
                itdData.existingProofCategory
            );

        expect(response.status())
            .toBe(HTTP_STATUS.OK);

        const body =
            await response.json();

        expect(body.message)
            .toBe("Proof uploaded successfully");

    });

    test("TC41 Upload proof to new proof category", async ({
        itDeclarationClient
    }) => {

        const response =
            await itDeclarationClient.uploadProofs(
                itdData.newProofCategory
            );

        expect(response.status())
            .toBe(HTTP_STATUS.OK);

        const body =
            await response.json();

        expect(body.message)
            .toBe("Proof uploaded successfully");

    });

    test("TC42 Upload unsupported file format", async ({ itDeclarationClient }) => {
        const response = await itDeclarationClient.uploadProofs(
            itdData.unsupportedProof,
            {
                name: "malware.exe",
                mimeType: "application/octet-stream",
                buffer: Buffer.from("fake binary content")
            }
        );

        expect(response.status()).toBe(HTTP_STATUS.INTERNAL_SERVER_ERROR);
    });

    test("TC43 Upload proofs without Authorization", async ({
        request
    }) => {

        const response =
            await request.put(
                IT_DECLARATION_ENDPOINTS.UPLOAD_PROOFS,
                {
                    multipart: itdData.singleProof
                }
            );

        expect(response.status())
            .toBe(HTTP_STATUS.UNAUTHORIZED);

    });

    test("TC44 Enable proof upload", async ({
        itDeclarationClient
    }) => {

        const response =
            await itDeclarationClient.updateITDFlags(
                itdData.enableProofUpload
            );

        expect(response.status())
            .toBe(HTTP_STATUS.OK);

        const body =
            await response.json();

        expect(body.status)
            .toBe(HTTP_STATUS.OK);

        expect(body.message)
            .toBe("update successfull");

    });

    test("TC45 Disable proof upload", async ({
        itDeclarationClient
    }) => {

        const response =
            await itDeclarationClient.updateITDFlags(
                itdData.disableProofUpload
            );

        expect(response.status())
            .toBe(HTTP_STATUS.OK);

        const body =
            await response.json();

        expect(body.status)
            .toBe(HTTP_STATUS.OK);

        expect(body.message)
            .toBe("update successfull");

    });

    test("TC46 Enable regime editing", async ({
        itDeclarationClient
    }) => {

        const response =
            await itDeclarationClient.updateITDFlags(
                itdData.enableRegimeEditing
            );

        expect(response.status())
            .toBe(HTTP_STATUS.OK);

        const body =
            await response.json();

        expect(body.status)
            .toBe(HTTP_STATUS.OK);

        expect(body.message)
            .toBe("update successfull");

    });

    test("TC47 Update ITD policy URL", async ({
        itDeclarationClient
    }) => {

        const response =
            await itDeclarationClient.updateITDFlags(
                itdData.updatePolicyUrl
            );

        expect(response.status())
            .toBe(HTTP_STATUS.OK);

        const body =
            await response.json();

        expect(body.status)
            .toBe(HTTP_STATUS.OK);

        expect(body.message)
            .toBe("update successfull");

    });

    test("TC48 Update all ITD configuration", async ({
        itDeclarationClient
    }) => {

        const response =
            await itDeclarationClient.updateITDFlags(
                itdData.updateAllConfiguration
            );

        expect(response.status())
            .toBe(HTTP_STATUS.OK);

        const body =
            await response.json();

        expect(body.status)
            .toBe(HTTP_STATUS.OK);

        expect(body.message)
            .toBe("update successfull");

    });

    test("TC49 Update ITD configuration without Authorization", async ({
        request
    }) => {

        const response =
            await request.put(
                IT_DECLARATION_ENDPOINTS.UPDATE_ITD_FLAGS,
                {
                    data: itdData.updateAllConfiguration
                }
            );

        expect(response.status())
            .toBe(HTTP_STATUS.UNAUTHORIZED);

    });

});

test.describe("IT Declaration - Delete Operations", () => {

    test("TC50 Delete uploaded proof", async ({ itDeclarationClient }) => {

        const response =
            await itDeclarationClient.deleteProof(uploadedFileId);

        expect(response.status()).toBe(HTTP_STATUS.OK);

        const body = await response.json();

        expect(body.message)
            .toBe("File deleted successfully and proof updated");

    });

    test("TC51 Verify deleted file is no longer accessible", async ({ itDeclarationClient }) => {

        const response =
            await itDeclarationClient.getProofFile(uploadedFileId);

        expect(response.status()).toBe(HTTP_STATUS.NOT_FOUND);

    });

    test("TC52 Delete proof using non-existing fileId", async ({
        itDeclarationClient
    }) => {

        const response =
            await itDeclarationClient.deleteProof(
                itdData.invalid.nonExistingFileId
            );

        expect(response.status())
            .toBe(HTTP_STATUS.NO_CONTENT);

        // 204 No Content responses carry no body per HTTP spec —
        // there is nothing to parse or assert on here.

    });

    test("TC53 Delete proof without Authorization", async ({
        request
    }) => {

        const response =
            await request.delete(
                `${IT_DECLARATION_ENDPOINTS.DELETE_PROOF}/${itdData.existing.fileId}`
            );

        expect(response.status())
            .toBe(HTTP_STATUS.UNAUTHORIZED);

    });

});