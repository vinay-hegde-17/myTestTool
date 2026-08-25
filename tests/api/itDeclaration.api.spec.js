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
  expect(response.status()).toBe(HTTP_STATUS.OK);

  const proofs = await itDeclarationClient.getProofs(
    itdData.singleProof.employeeId,
    itdData.singleProof.financialYear,
  );
  expect(proofs.status()).toBe(HTTP_STATUS.OK);

  const body = await proofs.json();
  const proof = body.proofOfSubmission.find((p) => p.proofId === "TEMP_TEST");
  uploadedFileId = proof.files[0].fileId;
});

test.describe("IT Declaration - Read Operations", () => {
  test("TC01 Get proof file using uploaded fileId @read @itdeclaration @regression @smoke @sanity", async ({
    itDeclarationClient,
  }) => {
    const response = await itDeclarationClient.getProofFile(uploadedFileId);
    expect(response.status()).toBe(HTTP_STATUS.OK);

    const body = await response.json();
    expect(body.fileId.toString()).toBe(uploadedFileId.toString());
    expect(body.fileName).toBeTruthy();
    expect(body.fileType).toBeTruthy();
    expect(body.base64Data).toBeTruthy();
  });

  test("TC02 Get proof file using invalid fileId @negative @read @itdeclaration @regression", async ({
    itDeclarationClient,
  }) => {
    const response = await itDeclarationClient.getProofFile(
      itdData.invalid.invalidObjectId,
    );
    expect(response.status()).toBe(HTTP_STATUS.BAD_REQUEST);

    const body = await response.json();
    expect(body.message).toBe(itdData.messages.invalidFileId);
  });

  test("TC03 Get proof file using non-existing fileId @negative @read @itdeclaration @regression", async ({
    itDeclarationClient,
  }) => {
    const response = await itDeclarationClient.getProofFile(
      itdData.invalid.nonExistingFileId,
    );
    expect(response.status()).toBe(HTTP_STATUS.NOT_FOUND);

    const body = await response.json();
    expect(body.message).toBe(itdData.messages.fileNotFound);
  });

  test("TC04 Verify proof file response contains metadata and base64 data @schema @read @itdeclaration @regression", async ({
    itDeclarationClient,
  }) => {
    const response = await itDeclarationClient.getProofFile(uploadedFileId);
    expect(response.status()).toBe(HTTP_STATUS.OK);

    const body = await response.json();
    expect(body).toHaveProperty("fileId");
    expect(body).toHaveProperty("fileName");
    expect(body).toHaveProperty("fileType");
    expect(body).toHaveProperty("base64Data");
    expect(typeof body.base64Data).toBe("string");
  });

  test("TC06 Get employee IT declaration @read @itdeclaration @regression @smoke @sanity", async ({
    itDeclarationClient,
  }) => {
    const response = await itDeclarationClient.getITDeclaration(
      itdData.existing.employeeId,
      itdData.existing.financialYear,
    );
    expect(response.status()).toBe(HTTP_STATUS.OK);

    const body = await response.json();
    expect(body.regime).toBe(itdData.existing.regime);
    expect(body).toHaveProperty("financialYear");
  });

  test("TC07 Get IT declaration using invalid employeeId @negative @read @itdeclaration @regression", async ({
    itDeclarationClient,
  }) => {
    const response = await itDeclarationClient.getITDeclaration(
      itdData.invalid.invalidObjectId,
      itdData.existing.financialYear,
    );
    expect(response.status()).toBe(HTTP_STATUS.OK);

    const body = await response.json();
    expect(body).toBeNull();
  });

  test("TC08 Get IT declaration using non-existing employeeId @negative @read @itdeclaration @regression", async ({
    itDeclarationClient,
  }) => {
    const response = await itDeclarationClient.getITDeclaration(
      itdData.invalid.nonExistingEmployeeId,
      itdData.existing.financialYear,
    );
    expect(response.status()).toBe(HTTP_STATUS.OK);

    const body = await response.json();
    expect(body).toBeNull();
  });

  test("TC09 Verify IT declaration response schema @schema @read @itdeclaration @regression", async ({
    itDeclarationClient,
  }) => {
    const response = await itDeclarationClient.getITDeclaration(
      itdData.existing.employeeId,
      itdData.existing.financialYear,
    );
    expect(response.status()).toBe(HTTP_STATUS.OK);

    const body = await response.json();
    expect(body).toHaveProperty("regime");
    expect(body).toHaveProperty("financialYear");
  });

  test("TC11 Get proof of submission @read @itdeclaration @regression @smoke @sanity", async ({
    itDeclarationClient,
  }) => {
    const response = await itDeclarationClient.getProofs(
      itdData.existing.employeeId,
      itdData.existing.financialYear,
    );
    expect(response.status()).toBe(HTTP_STATUS.OK);

    const body = await response.json();
    expect(body).toHaveProperty("proofOfSubmission");
    expect(Array.isArray(body.proofOfSubmission)).toBeTruthy();
  });

  test("TC12 Get proofs when declaration does not exist @negative @read @itdeclaration @regression", async ({
    itDeclarationClient,
  }) => {
    const response = await itDeclarationClient.getProofs(
      itdData.invalid.nonExistingEmployeeId,
      itdData.existing.financialYear,
    );
    expect(response.status()).toBe(HTTP_STATUS.NO_CONTENT);
  });

  test("TC13 Verify proof response schema @schema @read @itdeclaration @regression", async ({
    itDeclarationClient,
  }) => {
    const response = await itDeclarationClient.getProofs(
      itdData.existing.employeeId,
      itdData.existing.financialYear,
    );
    expect(response.status()).toBe(HTTP_STATUS.OK);

    const body = await response.json();
    expect(body).toHaveProperty("_id");
    expect(body).toHaveProperty("oldRegimeDetails");
    expect(body).toHaveProperty("proofOfSubmission");
  });

  test("TC14 Verify uploaded proof file details @read @itdeclaration @regression", async ({
    itDeclarationClient,
  }) => {
    const response = await itDeclarationClient.getProofs(
      itdData.existing.employeeId,
      itdData.existing.financialYear,
    );
    expect(response.status()).toBe(HTTP_STATUS.OK);

    const body = await response.json();
    const proof = body.proofOfSubmission[0];
    expect(proof).toHaveProperty("proofId");
    expect(proof).toHaveProperty("items");
    expect(proof).toHaveProperty("particulars");
    expect(Array.isArray(proof.files)).toBeTruthy();

    if (proof.files.length > 0) {
      expect(proof.files[0]).toHaveProperty("fileId");
      expect(proof.files[0]).toHaveProperty("filename");
    }
  });

  test("TC16 Download proof documents @read @itdeclaration @regression @smoke @sanity", async ({
    itDeclarationClient,
  }) => {
    const response = await itDeclarationClient.getZipProofs(
      itdData.existing.employeeId,
      itdData.existing.financialYear,
    );
    expect(response.status()).toBe(HTTP_STATUS.OK);

    const body = await response.json();
    expect(body).toHaveProperty("proofOfSubmission");
  });

  test("TC17 Get zip proofs when declaration does not exist @negative @read @itdeclaration @regression", async ({
    itDeclarationClient,
  }) => {
    const response = await itDeclarationClient.getZipProofs(
      itdData.invalid.nonExistingEmployeeId,
      itdData.existing.financialYear,
    );
    expect(response.status()).toBe(HTTP_STATUS.NO_CONTENT);
  });

  test("TC18 Verify downloaded files contain base64 data @read @itdeclaration @regression", async ({
    itDeclarationClient,
  }) => {
    const response = await itDeclarationClient.getZipProofs(
      itdData.existing.employeeId,
      itdData.existing.financialYear,
    );
    expect(response.status()).toBe(HTTP_STATUS.OK);

    const body = await response.json();
    const proof = body.proofOfSubmission[0];
    expect(Array.isArray(proof.files)).toBeTruthy();

    if (proof.files.length > 0) {
      expect(proof.files[0]).toHaveProperty("base64Data");
      expect(typeof proof.files[0].base64Data).toBe("string");
    }
  });

  test("TC20 Get employees by Old Regime @read @itdeclaration @regression @smoke @sanity", async ({
    itDeclarationClient,
  }) => {
    const response = await itDeclarationClient.getEmployees(
      "old",
      itdData.oldRegime.financialYear,
    );
    expect(response.status()).toBe(HTTP_STATUS.OK);

    const body = await response.json();
    expect(Array.isArray(body)).toBeTruthy();
    body.forEach((employee) => {
      expect(employee).toHaveProperty("employeeId");
      expect(employee).toHaveProperty("firstName");
      expect(employee).toHaveProperty("lastName");
      expect(employee).toHaveProperty("employeeNumber");
      expect(employee).toHaveProperty("panNumber");
    });
  });

  test("TC21 Get employees by New Regime @read @itdeclaration @regression", async ({
    itDeclarationClient,
  }) => {
    const response = await itDeclarationClient.getEmployees(
      "new",
      itdData.existing.financialYear,
    );
    expect(response.status()).toBe(HTTP_STATUS.OK);

    const body = await response.json();
    expect(Array.isArray(body)).toBeTruthy();
  });

  test("TC22 Get employees when no records exist @negative @read @itdeclaration @regression", async ({
    itDeclarationClient,
  }) => {
    const response = await itDeclarationClient.getEmployees("old", "2099-00");
    expect(response.status()).toBe(HTTP_STATUS.NO_CONTENT);
  });

  test("TC23 Verify employees response schema @schema @read @itdeclaration @regression", async ({
    itDeclarationClient,
  }) => {
    const response = await itDeclarationClient.getEmployees(
      "new",
      itdData.existing.financialYear,
    );
    expect(response.status()).toBe(HTTP_STATUS.OK);

    const body = await response.json();
    body.forEach((employee) => {
      expect(employee).toHaveProperty("employeeId");
      expect(employee).toHaveProperty("firstName");
      expect(employee).toHaveProperty("lastName");
      expect(employee).toHaveProperty("employeeNumber");
      expect(employee).toHaveProperty("panNumber");
    });
  });

  test("TC25 Get ITD configuration details @read @itdeclaration @regression @smoke @sanity", async ({
    itDeclarationClient,
  }) => {
    const response = await itDeclarationClient.getITDConfiguration();
    expect(response.status()).toBe(HTTP_STATUS.OK);

    const body = await response.json();
    expect(body).toBeTruthy();
  });

  test("TC26 Verify ITD configuration response schema @schema @read @itdeclaration @regression", async ({
    itDeclarationClient,
  }) => {
    const response = await itDeclarationClient.getITDConfiguration();
    expect(response.status()).toBe(HTTP_STATUS.OK);

    const body = await response.json();
    expect(body).toHaveProperty("ENABLE_PROOF_OF_SUBMISSION");
    expect(body).toHaveProperty("REGIME_DETAILS_EDITABLE");
    expect(body).toHaveProperty("ITD_POLICY_URL");
  });
});

test.describe("IT Declaration - Create Operations", () => {
  test("TC28 Create IT declaration using Old Regime @create @itdeclaration @regression @smoke @sanity", async ({
    itDeclarationClient,
  }) => {
    const response = await itDeclarationClient.createITDeclaration(
      itdData.oldRegime,
    );
    expect(response.status()).toBe(HTTP_STATUS.CREATED);

    const body = await response.json();
    expect(body.employeeId).toBe(itdData.oldRegime.employeeId);
    expect(body.regime).toBe("old");
    expect(body.financialYear).toBe(itdData.oldRegime.financialYear);
  });

  test("TC29 Create IT declaration using New Regime @create @itdeclaration @regression", async ({
    itDeclarationClient,
  }) => {
    const response = await itDeclarationClient.createITDeclaration(
      itdData.newRegime,
    );
    expect(response.status()).toBe(HTTP_STATUS.CREATED);

    const body = await response.json();
    expect(body.employeeId).toBe(itdData.newRegime.employeeId);
    expect(body.regime).toBe("new");
    expect(body.financialYear).toBe(itdData.newRegime.financialYear);
  });

  test("TC30 Verify created IT declaration response @schema @create @itdeclaration @regression", async ({
    itDeclarationClient,
  }) => {
    const response = await itDeclarationClient.createITDeclaration(
      itdData.newRegime,
    );
    expect(response.status()).toBe(HTTP_STATUS.CREATED);

    const body = await response.json();
    expect(body).toHaveProperty("_id");
    expect(body).toHaveProperty("employeeId");
    expect(body).toHaveProperty("regime");
    expect(body).toHaveProperty("financialYear");
  });

  test("TC31 Create duplicate IT declaration @create @itdeclaration @regression", async ({
    itDeclarationClient,
  }) => {
    const response = await itDeclarationClient.createITDeclaration(
      itdData.duplicate,
    );
    expect(response.status()).toBe(HTTP_STATUS.CREATED);

    const body = await response.json();
    expect(body.employeeId).toBe(itdData.duplicate.employeeId);
  });
});

test.describe("IT Declaration - Update Operations", () => {
  test.beforeAll(async ({ itDeclarationClient }) => {
    const response = await itDeclarationClient.createITDeclaration(
      itdData.itDeclaration,
    );
    expect([HTTP_STATUS.CREATED, HTTP_STATUS.CONFLICT]).toContain(
      response.status(),
    );
  });

  test("TC33 Update IT declaration @update @itdeclaration @regression @smoke @sanity", async ({
    itDeclarationClient,
  }) => {
    const response = await itDeclarationClient.updateITDeclaration(
      itdData.updatedDeclaration,
    );
    expect(response.status()).toBe(HTTP_STATUS.OK);

    const body = await response.json();
    expect(body.employeeId).toBe(itdData.updatedDeclaration.employeeId);
    expect(body.ownerPan).toBe(itdData.updatedDeclaration.ownerPan);
  });

  test("TC34 Update owner PAN @update @itdeclaration @regression", async ({
    itDeclarationClient,
  }) => {
    const response = await itDeclarationClient.updateITDeclaration(
      itdData.updatedPan,
    );
    expect(response.status()).toBe(HTTP_STATUS.OK);

    const body = await response.json();
    expect(body.ownerPan).toBe(itdData.updatedPan.ownerPan);
  });

  test("TC35 Update old regime details @update @itdeclaration @regression", async ({
    itDeclarationClient,
  }) => {
    const response = await itDeclarationClient.updateITDeclaration(
      itdData.updatedOldRegime,
    );
    expect(response.status()).toBe(HTTP_STATUS.OK);

    const body = await response.json();
    expect(body.oldRegimeDetails).toEqual(
      itdData.updatedOldRegime.oldRegimeDetails,
    );
  });

  test("TC36 Update non-existing IT declaration @negative @update @itdeclaration @regression", async ({
    itDeclarationClient,
  }) => {
    const response = await itDeclarationClient.updateITDeclaration(
      itdData.nonExistingDeclaration,
    );
    expect(response.status()).toBe(HTTP_STATUS.NOT_FOUND);

    const body = await response.json();
    expect(body.message).toBe(
      "IT declaration not found for the given employee and financial year.",
    );
  });

  test("TC38 Upload proof document @create @itdeclaration @regression @smoke @sanity", async ({
    itDeclarationClient,
  }) => {
    const response = await itDeclarationClient.uploadProofs(
      itdData.singleProof,
    );
    expect(response.status()).toBe(HTTP_STATUS.OK);

    const body = await response.json();
    expect(body.message).toBe("Proof uploaded successfully");
  });

  test("TC39 Upload multiple proof documents @create @itdeclaration @regression", async ({
    itDeclarationClient,
  }) => {
    const response = await itDeclarationClient.uploadProofs(
      itdData.multipleProofs,
    );
    expect(response.status()).toBe(HTTP_STATUS.OK);

    const body = await response.json();
    expect(body.message).toBe("Proof uploaded successfully");
  });

  test("TC40 Upload proof to existing proof category @create @itdeclaration @regression", async ({
    itDeclarationClient,
  }) => {
    const response = await itDeclarationClient.uploadProofs(
      itdData.existingProofCategory,
    );
    expect(response.status()).toBe(HTTP_STATUS.OK);

    const body = await response.json();
    expect(body.message).toBe("Proof uploaded successfully");
  });

  test("TC41 Upload proof to new proof category @create @itdeclaration @regression", async ({
    itDeclarationClient,
  }) => {
    const response = await itDeclarationClient.uploadProofs(
      itdData.newProofCategory,
    );
    expect(response.status()).toBe(HTTP_STATUS.OK);

    const body = await response.json();
    expect(body.message).toBe("Proof uploaded successfully");
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
    expect(response.status()).toBe(HTTP_STATUS.INTERNAL_SERVER_ERROR);
  });

  test("TC44 Enable proof upload @update @itdeclaration @regression @smoke @sanity", async ({
    itDeclarationClient,
  }) => {
    const response = await itDeclarationClient.updateITDFlags(
      itdData.enableProofUpload,
    );
    expect(response.status()).toBe(HTTP_STATUS.OK);

    const body = await response.json();
    expect(body.status).toBe(HTTP_STATUS.OK);
    expect(body.message).toBe("update successfull");
  });

  test("TC45 Disable proof upload @update @itdeclaration @regression", async ({
    itDeclarationClient,
  }) => {
    const response = await itDeclarationClient.updateITDFlags(
      itdData.disableProofUpload,
    );
    expect(response.status()).toBe(HTTP_STATUS.OK);

    const body = await response.json();
    expect(body.status).toBe(HTTP_STATUS.OK);
    expect(body.message).toBe("update successfull");
  });

  test("TC46 Enable regime editing @update @itdeclaration @regression", async ({
    itDeclarationClient,
  }) => {
    const response = await itDeclarationClient.updateITDFlags(
      itdData.enableRegimeEditing,
    );
    expect(response.status()).toBe(HTTP_STATUS.OK);

    const body = await response.json();
    expect(body.status).toBe(HTTP_STATUS.OK);
    expect(body.message).toBe("update successfull");
  });

  test("TC47 Update ITD policy URL @update @itdeclaration @regression", async ({
    itDeclarationClient,
  }) => {
    const response = await itDeclarationClient.updateITDFlags(
      itdData.updatePolicyUrl,
    );
    expect(response.status()).toBe(HTTP_STATUS.OK);

    const body = await response.json();
    expect(body.status).toBe(HTTP_STATUS.OK);
    expect(body.message).toBe("update successfull");
  });

  test("TC48 Update all ITD configuration @update @itdeclaration @regression", async ({
    itDeclarationClient,
  }) => {
    const response = await itDeclarationClient.updateITDFlags(
      itdData.updateAllConfiguration,
    );
    expect(response.status()).toBe(HTTP_STATUS.OK);

    const body = await response.json();
    expect(body.status).toBe(HTTP_STATUS.OK);
    expect(body.message).toBe("update successfull");
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

    expect(response.status()).toBe(HTTP_STATUS.OK);

    const proofs = await itDeclarationClient.getProofs(
      itdData.singleProof.employeeId,
      itdData.singleProof.financialYear,
    );

    expect(proofs.status()).toBe(HTTP_STATUS.OK);

    const body = await proofs.json();
    const proof = body.proofOfSubmission.find(
      (p) => p.proofId === "TEMP_DELETE_TEST",
    );

    if (proof && proof.files && proof.files.length > 0) {
      fileToDeleteId = proof.files[0].fileId;
    }
  });

  test("TC50 Delete uploaded proof @delete @itdeclaration @regression @smoke @sanity", async ({
    itDeclarationClient,
  }) => {
    const response = await itDeclarationClient.deleteProof(fileToDeleteId);
    expect(response.status()).toBe(HTTP_STATUS.OK);

    const body = await response.json();
    expect(body.message).toBe("File deleted successfully and proof updated");
  });

  test("TC51 Verify deleted file is no longer accessible @read @delete @itdeclaration @regression", async ({
    itDeclarationClient,
  }) => {
    const response = await itDeclarationClient.getProofFile(fileToDeleteId);
    expect(response.status()).toBe(HTTP_STATUS.NOT_FOUND);
  });

  test("TC52 Delete proof using non-existing fileId @negative @delete @itdeclaration @regression", async ({
    itDeclarationClient,
  }) => {
    const response = await itDeclarationClient.deleteProof(
      itdData.invalid.nonExistingFileId,
    );
    expect(response.status()).toBe(HTTP_STATUS.NO_CONTENT);
  });
});

test.describe("IT Declaration Module - Empty Data Validation", () => {
  test.describe("Read Operations", () => {
    test("TC_EMPTY_011 Get employees without regime query parameter @emptydata @itdeclaration @regression @read", async ({
      itDeclarationClient,
    }) => {
      const response = await itDeclarationClient.getEmployeesByRegime(
        "",
        "2027-28",
      );
      expect(response.status()).toBe(HTTP_STATUS.NO_CONTENT);
    });

    test("TC_EMPTY_012 Get employees without financialYear query parameter @emptydata @itdeclaration @regression @read", async ({
      itDeclarationClient,
    }) => {
      const response = await itDeclarationClient.getEmployeesByRegime(
        "old",
        "",
      );
      expect(response.status()).toBe(HTTP_STATUS.NO_CONTENT);
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
      expect(response.status()).toBe(HTTP_STATUS.BAD_REQUEST);
    });

    test("TC_EMPTY_002 Create declaration without regime @emptydata @itdeclaration @sanity @create", async ({
      itDeclarationClient,
    }) => {
      const response = await itDeclarationClient.createITDeclaration({
        employeeId: process.env.TEST_EMPLOYEE_ID || "",
        financialYear: "2027-28",
      });
      expect(response.status()).toBe(HTTP_STATUS.BAD_REQUEST);
    });

    test("TC_EMPTY_003 Create declaration without financialYear @emptydata @itdeclaration @sanity @create", async ({
      itDeclarationClient,
    }) => {
      const response = await itDeclarationClient.createITDeclaration({
        employeeId: process.env.TEST_EMPLOYEE_ID || "",
        regime: "old",
      });
      expect(response.status()).toBe(HTTP_STATUS.BAD_REQUEST);
    });

    test("TC_EMPTY_004 Create declaration with empty request body @emptydata @itdeclaration @regression @create", async ({
      itDeclarationClient,
    }) => {
      const response = await itDeclarationClient.createITDeclaration({});
      expect(response.status()).toBe(HTTP_STATUS.BAD_REQUEST);
    });
  });

  test.describe("Update Operations", () => {
    test("TC_EMPTY_005 Update regime with empty request body @emptydata @itdeclaration @regression @update", async ({
      itDeclarationClient,
    }) => {
      const response = await itDeclarationClient.updateRegimeData({});
      expect(response.status()).toBe(HTTP_STATUS.BAD_REQUEST);
    });

    test("TC_EMPTY_006 Update regime without employeeId @emptydata @itdeclaration @sanity @update", async ({
      itDeclarationClient,
    }) => {
      const response = await itDeclarationClient.updateRegimeData({
        financialYear: "2027-28",
      });
      expect(response.status()).toBe(HTTP_STATUS.BAD_REQUEST);
    });

    test("TC_EMPTY_007 Update regime without financialYear @emptydata @itdeclaration @sanity @update", async ({
      itDeclarationClient,
    }) => {
      const response = await itDeclarationClient.updateRegimeData({
        employeeId: process.env.TEST_EMPLOYEE_ID || "",
      });
      expect(response.status()).toBe(HTTP_STATUS.BAD_REQUEST);
    });
  });

  test.describe("Proof Upload Operations", () => {
    test("TC_EMPTY_008 Upload proofs without employeeId @emptydata @itdeclaration @sanity @upload", async ({
      itDeclarationClient,
    }) => {
      const response = await itDeclarationClient.uploadProofs({
        financialYear: "2027-28",
      });
      expect(response.status()).toBe(HTTP_STATUS.BAD_REQUEST);
    });

    test("TC_EMPTY_009 Upload proofs without financialYear @emptydata @itdeclaration @sanity @upload", async ({
      itDeclarationClient,
    }) => {
      const response = await itDeclarationClient.uploadProofs({
        employeeId: process.env.TEST_EMPLOYEE_ID || "",
      });
      expect(response.status()).toBe(HTTP_STATUS.BAD_REQUEST);
    });

    test("TC_EMPTY_010 Upload proofs with empty body @emptydata @itdeclaration @regression @upload", async ({
      itDeclarationClient,
    }) => {
      const response = await itDeclarationClient.uploadProofs({});
      expect(response.status()).toBe(HTTP_STATUS.BAD_REQUEST);
    });
  });
});
