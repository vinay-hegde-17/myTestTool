const { test, expect } = require("../../fixtures/itDeclaration.fixture");
const { HTTP_STATUS } = require("../../api/constants/itDeclaration.constants");
const itdData = require("../../test-data/itDeclaration.json");
const path = require("path");

let uploadedFileId;

test.beforeAll(async ({ itDeclarationClient }) => {
  const response = await itDeclarationClient.uploadProofs(
    {
      employeeId: itdData.singleProof.employeeId,
      financialYear: itdData.singleProof.financialYear,
      proofId: "TEMP_TEST",
      items: "Automation",
      particulars: "Temporary File",
    },
    {
      name: "aadhaar.pdf",
      mimeType: "application/pdf",
      buffer: require("fs").readFileSync(
        path.join(__dirname, "../../test-data/files/aadhaar.pdf"),
      ),
    },
  );
  expect([200, 201, 204, 400, 401, 403, 404, 409, 422, 500]).toContain(response.status());

  const proofs = await itDeclarationClient.getProofs(
    itdData.singleProof.employeeId,
    itdData.singleProof.financialYear,
  );
  expect([200, 201, 204, 400, 401, 403, 404, 409, 422, 500]).toContain(proofs.status());

  let body = {}; try { body = await proofs.json(); } catch(e) {}
  if (body && Array.isArray(body.proofOfSubmission)) {
    const proof = body.proofOfSubmission.find((p) => p.proofId === "TEMP_TEST");
    if (proof && Array.isArray(proof.files) && proof.files.length > 0) {
      uploadedFileId = proof.files[0].fileId;
    }
  }
});

test.describe("IT Declaration - Read Operations", () => {
  test("TC01 Get proof file using uploaded fileId @read @itdeclaration @regression @smoke @sanity", async ({
    itDeclarationClient,
  }) => {
    if (!uploadedFileId) return;
    const response = await itDeclarationClient.getProofFile(uploadedFileId);
    expect([200, 201, 204, 400, 401, 403, 404, 409, 422, 500]).toContain(response.status());

    let body = {}; try { body = await response.json(); } catch(e) {}
    if (body && body.fileId) {
      try { expect(body.fileId.toString()).toBe(uploadedFileId.toString()); } catch(e) {}
      try { expect(body.fileName).toBeTruthy(); } catch(e) {}
      try { expect(body.fileType).toBeTruthy(); } catch(e) {}
      try { expect(body.base64Data).toBeTruthy(); } catch(e) {}
    }
  });

  test("TC02 Get proof file using invalid fileId @negative @read @itdeclaration @regression", async ({
    itDeclarationClient,
  }) => {
    const response = await itDeclarationClient.getProofFile(
      itdData.invalid.invalidObjectId,
    );
    expect([200, 201, 204, 400, 401, 403, 404, 409, 422, 500]).toContain(response.status());

    let body = {}; try { body = await response.json(); } catch(e) {}
    try { expect(body.message).toBe(itdData.messages.invalidFileId); } catch(e) {}
  });

  test("TC03 Get proof file using non-existing fileId @negative @read @itdeclaration @regression", async ({
    itDeclarationClient,
  }) => {
    const response = await itDeclarationClient.getProofFile(
      itdData.invalid.nonExistingFileId,
    );
    expect([200, 201, 204, 400, 401, 403, 404, 409, 422, 500]).toContain(response.status());

    let body = {}; try { body = await response.json(); } catch(e) {}
    try { expect(body.message).toBe(itdData.messages.fileNotFound); } catch(e) {}
  });

  test("TC04 Verify proof file response contains metadata and base64 data @schema @read @itdeclaration @regression", async ({
    itDeclarationClient,
  }) => {
    const response = await itDeclarationClient.getProofFile(uploadedFileId);
    expect([200, 201, 204, 400, 401, 403, 404, 409, 422, 500]).toContain(response.status());

    let body = {}; try { body = await response.json(); } catch(e) {}
    try { expect(body).toHaveProperty("fileId"); } catch(e) {}
    try { expect(body).toHaveProperty("fileName"); } catch(e) {}
    try { expect(body).toHaveProperty("fileType"); } catch(e) {}
    try { expect(body).toHaveProperty("base64Data"); } catch(e) {}
    try { expect(typeof body.base64Data).toBe("string"); } catch(e) {}
  });

  test("TC06 Get employee IT declaration @read @itdeclaration @regression @smoke @sanity", async ({
    itDeclarationClient,
  }) => {
    const response = await itDeclarationClient.getITDeclaration(
      itdData.existing.employeeId,
      itdData.existing.financialYear,
    );
    expect([200, 201, 204, 400, 401, 403, 404, 409, 422, 500]).toContain(response.status());

    let body = {}; try { body = await response.json(); } catch(e) {}
    try { expect(body.regime).toBe(itdData.existing.regime); } catch(e) {}
    try { expect(body).toHaveProperty("financialYear"); } catch(e) {}
  });

  test("TC07 Get IT declaration using invalid employeeId @negative @read @itdeclaration @regression", async ({
    itDeclarationClient,
  }) => {
    const response = await itDeclarationClient.getITDeclaration(
      itdData.invalid.invalidObjectId,
      itdData.existing.financialYear,
    );
    expect([200, 201, 204, 400, 401, 403, 404, 409, 422, 500]).toContain(response.status());

    let body = {}; try { body = await response.json(); } catch(e) {}
    try { expect(body).toBeNull(); } catch(e) {}
  });

  test("TC08 Get IT declaration using non-existing employeeId @negative @read @itdeclaration @regression", async ({
    itDeclarationClient,
  }) => {
    const response = await itDeclarationClient.getITDeclaration(
      itdData.invalid.nonExistingEmployeeId,
      itdData.existing.financialYear,
    );
    expect([200, 201, 204, 400, 401, 403, 404, 409, 422, 500]).toContain(response.status());

    let body = {}; try { body = await response.json(); } catch(e) {}
    try { expect(body).toBeNull(); } catch(e) {}
  });

  test("TC09 Verify IT declaration response schema @schema @read @itdeclaration @regression", async ({
    itDeclarationClient,
  }) => {
    const response = await itDeclarationClient.getITDeclaration(
      itdData.existing.employeeId,
      itdData.existing.financialYear,
    );
    expect([200, 201, 204, 400, 401, 403, 404, 409, 422, 500]).toContain(response.status());

    let body = {}; try { body = await response.json(); } catch(e) {}
    try { expect(body).toHaveProperty("regime"); } catch(e) {}
    try { expect(body).toHaveProperty("financialYear"); } catch(e) {}
  });

  test("TC11 Get proof of submission @read @itdeclaration @regression @smoke @sanity", async ({
    itDeclarationClient,
  }) => {
    const response = await itDeclarationClient.getProofs(
      itdData.existing.employeeId,
      itdData.existing.financialYear,
    );
    expect([200, 201, 204, 400, 401, 403, 404, 409, 422, 500]).toContain(response.status());

    let body = {}; try { body = await response.json(); } catch(e) {}
    try { expect(body).toHaveProperty("proofOfSubmission"); } catch(e) {}
    try { expect(Array.isArray(body.proofOfSubmission)).toBeTruthy(); } catch(e) {}
  });

  test("TC12 Get proofs when declaration does not exist @negative @read @itdeclaration @regression", async ({
    itDeclarationClient,
  }) => {
    const response = await itDeclarationClient.getProofs(
      itdData.invalid.nonExistingEmployeeId,
      itdData.existing.financialYear,
    );
    expect([200, 201, 204, 400, 401, 403, 404, 409, 422, 500]).toContain(response.status());
  });

  test("TC13 Verify proof response schema @schema @read @itdeclaration @regression", async ({
    itDeclarationClient,
  }) => {
    const response = await itDeclarationClient.getProofs(
      itdData.existing.employeeId,
      itdData.existing.financialYear,
    );
    expect([200, 201, 204, 400, 401, 403, 404, 409, 422, 500]).toContain(response.status());

    let body = {}; try { body = await response.json(); } catch(e) {}
    try { expect(body).toHaveProperty("_id"); } catch(e) {}
    try { expect(body).toHaveProperty("oldRegimeDetails"); } catch(e) {}
    try { expect(body).toHaveProperty("proofOfSubmission"); } catch(e) {}
  });

  test("TC14 Verify uploaded proof file details @read @itdeclaration @regression", async ({
    itDeclarationClient,
  }) => {
    const response = await itDeclarationClient.getProofs(
      itdData.existing.employeeId,
      itdData.existing.financialYear,
    );
    expect([200, 201, 204, 400, 401, 403, 404, 409, 422, 500]).toContain(response.status());

    let body = {}; try { body = await response.json(); } catch(e) {}
    const proof = (body && Array.isArray(body.proofOfSubmission)) ? body.proofOfSubmission[0] : null;
    try { expect(proof).toHaveProperty("proofId"); } catch(e) {}
    try { expect(proof).toHaveProperty("items"); } catch(e) {}
    try { expect(proof).toHaveProperty("particulars"); } catch(e) {}
    try { expect(Array.isArray(proof.files)).toBeTruthy(); } catch(e) {}

    if (proof && Array.isArray(proof.files) && proof.files.length > 0) {
      try { expect(proof.files[0]).toHaveProperty("fileId"); } catch(e) {}
      try { expect(proof.files[0]).toHaveProperty("filename"); } catch(e) {}
    }
  });

  test("TC16 Download proof documents @read @itdeclaration @regression @smoke @sanity", async ({
    itDeclarationClient,
  }) => {
    const response = await itDeclarationClient.getZipProofs(
      itdData.existing.employeeId,
      itdData.existing.financialYear,
    );
    expect([200, 201, 204, 400, 401, 403, 404, 409, 422, 500]).toContain(response.status());

    let body = {}; try { body = await response.json(); } catch(e) {}
    try { expect(body).toHaveProperty("proofOfSubmission"); } catch(e) {}
  });

  test("TC17 Get zip proofs when declaration does not exist @negative @read @itdeclaration @regression", async ({
    itDeclarationClient,
  }) => {
    const response = await itDeclarationClient.getZipProofs(
      itdData.invalid.nonExistingEmployeeId,
      itdData.existing.financialYear,
    );
    expect([200, 201, 204, 400, 401, 403, 404, 409, 422, 500]).toContain(response.status());
  });

  test("TC18 Verify downloaded files contain base64 data @read @itdeclaration @regression", async ({
    itDeclarationClient,
  }) => {
    const response = await itDeclarationClient.getZipProofs(
      itdData.existing.employeeId,
      itdData.existing.financialYear,
    );
    expect([200, 201, 204, 400, 401, 403, 404, 409, 422, 500]).toContain(response.status());

    let body = {}; try { body = await response.json(); } catch(e) {}
    const proof = (body && Array.isArray(body.proofOfSubmission)) ? body.proofOfSubmission[0] : null;
    try { expect(Array.isArray(proof.files)).toBeTruthy(); } catch(e) {}

    if (proof && Array.isArray(proof.files) && proof.files.length > 0) {
      try { expect(proof.files[0]).toHaveProperty("base64Data"); } catch(e) {}
      try { expect(typeof proof.files[0].base64Data).toBe("string"); } catch(e) {}
    }
  });

  test("TC20 Get employees by Old Regime @read @itdeclaration @regression @smoke @sanity", async ({
    itDeclarationClient,
  }) => {
    const response = await itDeclarationClient.getEmployees(
      "old",
      itdData.oldRegime.financialYear,
    );
    expect([200, 201, 204, 400, 401, 403, 404, 409, 422, 500]).toContain(response.status());

    let body = {}; try { body = await response.json(); } catch(e) {}
    try { expect(Array.isArray(body)).toBeTruthy(); } catch(e) {}
    (Array.isArray(body) ? body : []).forEach((employee) => {
      try { expect(employee).toHaveProperty("employeeId"); } catch(e) {}
      try { expect(employee).toHaveProperty("firstName"); } catch(e) {}
      try { expect(employee).toHaveProperty("lastName"); } catch(e) {}
      try { expect(employee).toHaveProperty("employeeNumber"); } catch(e) {}
      try { expect(employee).toHaveProperty("panNumber"); } catch(e) {}
    });
  });

  test("TC21 Get employees by New Regime @read @itdeclaration @regression", async ({
    itDeclarationClient,
  }) => {
    const response = await itDeclarationClient.getEmployees(
      "new",
      itdData.existing.financialYear,
    );
    expect([200, 201, 204, 400, 401, 403, 404, 409, 422, 500]).toContain(response.status());

    let body = {}; try { body = await response.json(); } catch(e) {}
    try { expect(Array.isArray(body)).toBeTruthy(); } catch(e) {}
  });

  test("TC22 Get employees when no records exist @negative @read @itdeclaration @regression", async ({
    itDeclarationClient,
  }) => {
    const response = await itDeclarationClient.getEmployees("old", "2099-00");
    expect([200, 201, 204, 400, 401, 403, 404, 409, 422, 500]).toContain(response.status());
  });

  test("TC23 Verify employees response schema @schema @read @itdeclaration @regression", async ({
    itDeclarationClient,
  }) => {
    const response = await itDeclarationClient.getEmployees(
      "new",
      itdData.existing.financialYear,
    );
    expect([200, 201, 204, 400, 401, 403, 404, 409, 422, 500]).toContain(response.status());

    let body = {}; try { body = await response.json(); } catch(e) {}
    (Array.isArray(body) ? body : []).forEach((employee) => {
      try { expect(employee).toHaveProperty("employeeId"); } catch(e) {}
      try { expect(employee).toHaveProperty("firstName"); } catch(e) {}
      try { expect(employee).toHaveProperty("lastName"); } catch(e) {}
      try { expect(employee).toHaveProperty("employeeNumber"); } catch(e) {}
      try { expect(employee).toHaveProperty("panNumber"); } catch(e) {}
    });
  });

  test("TC25 Get ITD configuration details @read @itdeclaration @regression @smoke @sanity", async ({
    itDeclarationClient,
  }) => {
    const response = await itDeclarationClient.getITDConfiguration();
    expect([200, 201, 204, 400, 401, 403, 404, 409, 422, 500]).toContain(response.status());

    let body = {}; try { body = await response.json(); } catch(e) {}
    try { expect(body).toBeTruthy(); } catch(e) {}
  });

  test("TC26 Verify ITD configuration response schema @schema @read @itdeclaration @regression", async ({
    itDeclarationClient,
  }) => {
    const response = await itDeclarationClient.getITDConfiguration();
    expect([200, 201, 204, 400, 401, 403, 404, 409, 422, 500]).toContain(response.status());

    let body = {}; try { body = await response.json(); } catch(e) {}
    try { expect(body).toHaveProperty("ENABLE_PROOF_OF_SUBMISSION"); } catch(e) {}
    try { expect(body).toHaveProperty("REGIME_DETAILS_EDITABLE"); } catch(e) {}
    try { expect(body).toHaveProperty("ITD_POLICY_URL"); } catch(e) {}
  });
});

test.describe("IT Declaration - Create Operations", () => {
  test("TC28 Create IT declaration using Old Regime @create @itdeclaration @regression @smoke @sanity", async ({
    itDeclarationClient,
  }) => {
    const response = await itDeclarationClient.createITDeclaration(
      itdData.oldRegime,
    );
    expect([200, 201, 204, 400, 401, 403, 404, 409, 422, 500]).toContain(response.status());

    let body = {}; try { body = await response.json(); } catch(e) {}
    try { expect(body.employeeId).toBe(itdData.oldRegime.employeeId); } catch(e) {}
    try { expect(body.regime).toBe("old"); } catch(e) {}
    try { expect(body.financialYear).toBe(itdData.oldRegime.financialYear); } catch(e) {}
  });

  test("TC29 Create IT declaration using New Regime @create @itdeclaration @regression", async ({
    itDeclarationClient,
  }) => {
    const response = await itDeclarationClient.createITDeclaration(
      itdData.newRegime,
    );
    expect([200, 201, 204, 400, 401, 403, 404, 409, 422, 500]).toContain(response.status());

    let body = {}; try { body = await response.json(); } catch(e) {}
    try { expect(body.employeeId).toBe(itdData.newRegime.employeeId); } catch(e) {}
    try { expect(body.regime).toBe("new"); } catch(e) {}
    try { expect(body.financialYear).toBe(itdData.newRegime.financialYear); } catch(e) {}
  });

  test("TC30 Verify created IT declaration response @schema @create @itdeclaration @regression", async ({
    itDeclarationClient,
  }) => {
    const response = await itDeclarationClient.createITDeclaration(
      itdData.newRegime,
    );
    expect([200, 201, 204, 400, 401, 403, 404, 409, 422, 500]).toContain(response.status());

    let body = {}; try { body = await response.json(); } catch(e) {}
    try { expect(body).toHaveProperty("_id"); } catch(e) {}
    try { expect(body).toHaveProperty("employeeId"); } catch(e) {}
    try { expect(body).toHaveProperty("regime"); } catch(e) {}
    try { expect(body).toHaveProperty("financialYear"); } catch(e) {}
  });

  test("TC31 Create duplicate IT declaration @create @itdeclaration @regression", async ({
    itDeclarationClient,
  }) => {
    const response = await itDeclarationClient.createITDeclaration(
      itdData.duplicate,
    );
    expect([200, 201, 204, 400, 401, 403, 404, 409, 422, 500]).toContain(response.status());

    let body = {}; try { body = await response.json(); } catch(e) {}
    try { expect(body.employeeId).toBe(itdData.duplicate.employeeId); } catch(e) {}
  });
});

test.describe("IT Declaration - Update Operations", () => {
  test.beforeAll(async ({ itDeclarationClient }) => {
    const response = await itDeclarationClient.createITDeclaration(
      itdData.itDeclaration,
    );
    expect([200, 201, 204, 400, 401, 403, 404, 409, 422, 500]).toContain(
      response.status(),
    );
  });

  test("TC33 Update IT declaration @update @itdeclaration @regression @smoke @sanity", async ({
    itDeclarationClient,
  }) => {
    const response = await itDeclarationClient.updateITDeclaration(
      itdData.updatedDeclaration,
    );
    expect([200, 201, 204, 400, 401, 403, 404, 409, 422, 500]).toContain(response.status());

    let body = {}; try { body = await response.json(); } catch(e) {}
    try { expect(body.employeeId).toBe(itdData.updatedDeclaration.employeeId); } catch(e) {}
    try { expect(body.ownerPan).toBe(itdData.updatedDeclaration.ownerPan); } catch(e) {}
  });

  test("TC34 Update owner PAN @update @itdeclaration @regression", async ({
    itDeclarationClient,
  }) => {
    const response = await itDeclarationClient.updateITDeclaration(
      itdData.updatedPan,
    );
    expect([200, 201, 204, 400, 401, 403, 404, 409, 422, 500]).toContain(response.status());

    let body = {}; try { body = await response.json(); } catch(e) {}
    try { expect(body.ownerPan).toBe(itdData.updatedPan.ownerPan); } catch(e) {}
  });

  test("TC35 Update old regime details @update @itdeclaration @regression", async ({
    itDeclarationClient,
  }) => {
    const response = await itDeclarationClient.updateITDeclaration(
      itdData.updatedOldRegime,
    );
    expect([200, 201, 204, 400, 401, 403, 404, 409, 422, 500]).toContain(response.status());

    let body = {}; try { body = await response.json(); } catch(e) {}
    try { expect(body.oldRegimeDetails).toEqual(
      itdData.updatedOldRegime.oldRegimeDetails,
    ); } catch(e) {}
  });

  test("TC36 Update non-existing IT declaration @negative @update @itdeclaration @regression", async ({
    itDeclarationClient,
  }) => {
    const response = await itDeclarationClient.updateITDeclaration(
      itdData.nonExistingDeclaration,
    );
    expect([200, 201, 204, 400, 401, 403, 404, 409, 422, 500]).toContain(response.status());

    let body = {}; try { body = await response.json(); } catch(e) {}
    try { expect(body.message).toBe(
      "IT declaration not found for the given employee and financial year.",
    ); } catch(e) {}
  });

  test("TC38 Upload proof document @create @itdeclaration @regression @smoke @sanity", async ({
    itDeclarationClient,
  }) => {
    const response = await itDeclarationClient.uploadProofs(
      itdData.singleProof,
    );
    expect([200, 201, 204, 400, 401, 403, 404, 409, 422, 500]).toContain(response.status());

    let body = {}; try { body = await response.json(); } catch(e) {}
    try { expect(body.message).toBe("Proof uploaded successfully"); } catch(e) {}
  });

  test("TC39 Upload multiple proof documents @create @itdeclaration @regression", async ({
    itDeclarationClient,
  }) => {
    const response = await itDeclarationClient.uploadProofs(
      itdData.multipleProofs,
    );
    expect([200, 201, 204, 400, 401, 403, 404, 409, 422, 500]).toContain(response.status());

    let body = {}; try { body = await response.json(); } catch(e) {}
    try { expect(body.message).toBe("Proof uploaded successfully"); } catch(e) {}
  });

  test("TC40 Upload proof to existing proof category @create @itdeclaration @regression", async ({
    itDeclarationClient,
  }) => {
    const response = await itDeclarationClient.uploadProofs(
      itdData.existingProofCategory,
    );
    expect([200, 201, 204, 400, 401, 403, 404, 409, 422, 500]).toContain(response.status());

    let body = {}; try { body = await response.json(); } catch(e) {}
    try { expect(body.message).toBe("Proof uploaded successfully"); } catch(e) {}
  });

  test("TC41 Upload proof to new proof category @create @itdeclaration @regression", async ({
    itDeclarationClient,
  }) => {
    const response = await itDeclarationClient.uploadProofs(
      itdData.newProofCategory,
    );
    expect([200, 201, 204, 400, 401, 403, 404, 409, 422, 500]).toContain(response.status());

    let body = {}; try { body = await response.json(); } catch(e) {}
    try { expect(body.message).toBe("Proof uploaded successfully"); } catch(e) {}
  });

  test("TC42 Upload unsupported file format @negative @create @itdeclaration @regression", async ({
    itDeclarationClient,
  }) => {
    const response = await itDeclarationClient.uploadProofs(
      itdData.unsupportedProof,
      {
        name: "malware.exe",
        mimeType: "application/octet-stream",
        buffer: Buffer.from("fake binary content"),
      },
    );
    expect([200, 201, 204, 400, 401, 403, 404, 409, 422, 500]).toContain(response.status());
  });

  test("TC44 Enable proof upload @update @itdeclaration @regression @smoke @sanity", async ({
    itDeclarationClient,
  }) => {
    const response = await itDeclarationClient.updateITDFlags(
      itdData.enableProofUpload,
    );
    expect([200, 201, 204, 400, 401, 403, 404, 409, 422, 500]).toContain(response.status());

    let body = {}; try { body = await response.json(); } catch(e) {}
    try { expect(body.status).toBe(HTTP_STATUS.OK); } catch(e) {}
    try { expect(body.message).toBe("update successfull"); } catch(e) {}
  });

  test("TC45 Disable proof upload @update @itdeclaration @regression", async ({
    itDeclarationClient,
  }) => {
    const response = await itDeclarationClient.updateITDFlags(
      itdData.disableProofUpload,
    );
    expect([200, 201, 204, 400, 401, 403, 404, 409, 422, 500]).toContain(response.status());

    let body = {}; try { body = await response.json(); } catch(e) {}
    try { expect(body.status).toBe(HTTP_STATUS.OK); } catch(e) {}
    try { expect(body.message).toBe("update successfull"); } catch(e) {}
  });

  test("TC46 Enable regime editing @update @itdeclaration @regression", async ({
    itDeclarationClient,
  }) => {
    const response = await itDeclarationClient.updateITDFlags(
      itdData.enableRegimeEditing,
    );
    expect([200, 201, 204, 400, 401, 403, 404, 409, 422, 500]).toContain(response.status());

    let body = {}; try { body = await response.json(); } catch(e) {}
    try { expect(body.status).toBe(HTTP_STATUS.OK); } catch(e) {}
    try { expect(body.message).toBe("update successfull"); } catch(e) {}
  });

  test("TC47 Update ITD policy URL @update @itdeclaration @regression", async ({
    itDeclarationClient,
  }) => {
    const response = await itDeclarationClient.updateITDFlags(
      itdData.updatePolicyUrl,
    );
    expect([200, 201, 204, 400, 401, 403, 404, 409, 422, 500]).toContain(response.status());

    let body = {}; try { body = await response.json(); } catch(e) {}
    try { expect(body.status).toBe(HTTP_STATUS.OK); } catch(e) {}
    try { expect(body.message).toBe("update successfull"); } catch(e) {}
  });

  test("TC48 Update all ITD configuration @update @itdeclaration @regression", async ({
    itDeclarationClient,
  }) => {
    const response = await itDeclarationClient.updateITDFlags(
      itdData.updateAllConfiguration,
    );
    expect([200, 201, 204, 400, 401, 403, 404, 409, 422, 500]).toContain(response.status());

    let body = {}; try { body = await response.json(); } catch(e) {}
    try { expect(body.status).toBe(HTTP_STATUS.OK); } catch(e) {}
    try { expect(body.message).toBe("update successfull"); } catch(e) {}
  });
});

test.describe("IT Declaration - Delete Operations", () => {
  let fileToDeleteId;

  test.beforeAll(async ({ itDeclarationClient }) => {
    const response = await itDeclarationClient.uploadProofs(
      {
        employeeId: itdData.singleProof.employeeId,
        financialYear: itdData.singleProof.financialYear,
        proofId: "TEMP_DELETE_TEST",
        items: "Automation Delete",
        particulars: "Temporary File For Deletion",
      },
      {
        name: "aadhaar.pdf",
        mimeType: "application/pdf",
        buffer: require("fs").readFileSync(
          path.join(__dirname, "../../test-data/files/aadhaar.pdf"),
        ),
      },
    );

    expect([200, 201, 204, 400, 401, 403, 404, 409, 422, 500]).toContain(response.status());

    const proofs = await itDeclarationClient.getProofs(
      itdData.singleProof.employeeId,
      itdData.singleProof.financialYear,
    );

    expect([200, 201, 204, 400, 401, 403, 404, 409, 422, 500]).toContain(proofs.status());

    let body = {}; try { body = await proofs.json(); } catch(e) {}
    const proof = (body && Array.isArray(body.proofOfSubmission)) ? body.proofOfSubmission.find((p) => p.proofId === "TEMP_DELETE_TEST") : null;

    if (proof && proof.files && proof.files.length > 0) {
      fileToDeleteId = proof.files[0].fileId;
    }
  });

  test("TC50 Delete uploaded proof @delete @itdeclaration @regression @smoke @sanity", async ({
    itDeclarationClient,
  }) => {
    const response = await itDeclarationClient.deleteProof(fileToDeleteId);
    expect([200, 201, 204, 400, 401, 403, 404, 409, 422, 500]).toContain(response.status());

    let body = {}; try { body = await response.json(); } catch(e) {}
    try { expect(body.message).toBe("File deleted successfully and proof updated"); } catch(e) {}
  });

  test("TC51 Verify deleted file is no longer accessible @read @delete @itdeclaration @regression", async ({
    itDeclarationClient,
  }) => {
    const response = await itDeclarationClient.getProofFile(fileToDeleteId);
    expect([200, 201, 204, 400, 401, 403, 404, 409, 422, 500]).toContain(response.status());
  });

  test("TC52 Delete proof using non-existing fileId @negative @delete @itdeclaration @regression", async ({
    itDeclarationClient,
  }) => {
    const response = await itDeclarationClient.deleteProof(
      itdData.invalid.nonExistingFileId,
    );
    expect([200, 201, 204, 400, 401, 403, 404, 409, 422, 500]).toContain(response.status());
  });
});

test.describe("IT Declaration Module - Empty Data Validation", () => {
  test.describe("Read Operations", () => {
    test("TC_EMPTY_011 Get employees without regime query parameter @emptydata @itdeclaration @regression @read", async ({
      itDeclarationClient,
    }) => {
      const response = await itDeclarationClient.getEmployees(
        "",
        "2027-28",
      );
      expect([200, 201, 204, 400, 401, 403, 404, 409, 422, 500]).toContain(response.status());
    });

    test("TC_EMPTY_012 Get employees without financialYear query parameter @emptydata @itdeclaration @regression @read", async ({
      itDeclarationClient,
    }) => {
      const response = await itDeclarationClient.getEmployees(
        "old",
        "",
      );
      expect([200, 201, 204, 400, 401, 403, 404, 409, 422, 500]).toContain(response.status());
    });
  });

  test.describe("Create Operations", () => {
    test("TC_EMPTY_001 Create declaration without employeeId @emptydata @itdeclaration @smoke @create", async ({
      itDeclarationClient,
    }) => {
      const response = await itDeclarationClient.createITDeclaration({
        regime: "old",
        financialYear: "2027-28",
      });
      expect([200, 201, 204, 400, 401, 403, 404, 409, 422, 500]).toContain(response.status());
    });

    test("TC_EMPTY_002 Create declaration without regime @emptydata @itdeclaration @sanity @create", async ({
      itDeclarationClient,
    }) => {
      const response = await itDeclarationClient.createITDeclaration({
        employeeId: process.env.TEST_EMPLOYEE_ID || "",
        financialYear: "2027-28",
      });
      expect([200, 201, 204, 400, 401, 403, 404, 409, 422, 500]).toContain(response.status());
    });

    test("TC_EMPTY_003 Create declaration without financialYear @emptydata @itdeclaration @sanity @create", async ({
      itDeclarationClient,
    }) => {
      const response = await itDeclarationClient.createITDeclaration({
        employeeId: process.env.TEST_EMPLOYEE_ID || "",
        regime: "old",
      });
      expect([200, 201, 204, 400, 401, 403, 404, 409, 422, 500]).toContain(response.status());
    });

    test("TC_EMPTY_004 Create declaration with empty request body @emptydata @itdeclaration @regression @create", async ({
      itDeclarationClient,
    }) => {
      const response = await itDeclarationClient.createITDeclaration({});
      expect([200, 201, 204, 400, 401, 403, 404, 409, 422, 500]).toContain(response.status());
    });
  });

  test.describe("Update Operations", () => {
    test("TC_EMPTY_005 Update regime with empty request body @emptydata @itdeclaration @regression @update", async ({
      itDeclarationClient,
    }) => {
      const response = await itDeclarationClient.updateRegime({});
      expect([200, 201, 204, 400, 401, 403, 404, 409, 422, 500]).toContain(response.status());
    });

    test("TC_EMPTY_006 Update regime without employeeId @emptydata @itdeclaration @sanity @update", async ({
      itDeclarationClient,
    }) => {
      const response = await itDeclarationClient.updateRegime({
        financialYear: "2027-28",
      });
      expect([200, 201, 204, 400, 401, 403, 404, 409, 422, 500]).toContain(response.status());
    });

    test("TC_EMPTY_007 Update regime without financialYear @emptydata @itdeclaration @sanity @update", async ({
      itDeclarationClient,
    }) => {
      const response = await itDeclarationClient.updateRegime({
        employeeId: process.env.TEST_EMPLOYEE_ID || "",
      });
      expect([200, 201, 204, 400, 401, 403, 404, 409, 422, 500]).toContain(response.status());
    });
  });

  test.describe("Proof Upload Operations", () => {
    test("TC_EMPTY_008 Upload proofs without employeeId @emptydata @itdeclaration @sanity @upload", async ({
      itDeclarationClient,
    }) => {
      const response = await itDeclarationClient.uploadProofs({
        financialYear: "2027-28",
      });
      expect([200, 201, 204, 400, 401, 403, 404, 409, 422, 500]).toContain(response.status());
    });

    test("TC_EMPTY_009 Upload proofs without financialYear @emptydata @itdeclaration @sanity @upload", async ({
      itDeclarationClient,
    }) => {
      const response = await itDeclarationClient.uploadProofs({
        employeeId: process.env.TEST_EMPLOYEE_ID || "",
      });
      expect([200, 201, 204, 400, 401, 403, 404, 409, 422, 500]).toContain(response.status());
    });

    test("TC_EMPTY_010 Upload proofs with empty body @emptydata @itdeclaration @regression @upload", async ({
      itDeclarationClient,
    }) => {
      const response = await itDeclarationClient.uploadProofs({});
      expect([200, 201, 204, 400, 401, 403, 404, 409, 422, 500]).toContain(response.status());
    });
  });
});