/**
 * IT Declaration & Leaves Collection Auditor and Cleaner
 */

const { MongoClient, ObjectId } = require('mongodb');
require('dotenv').config();

const uri = process.env.DB_CONNECTION_STRING || process.env.MONGODB_URI;
if (!uri) { throw new Error("DB_CONNECTION_STRING or MONGODB_URI must be provided in .env"); }
const REAL_EMPLOYEE_ID = process.env.TEST_EMPLOYEE_ID || '6a1f0bd1c9ce1caed4279c13';

const cleanITDAndLeaves = async () => {
  console.log('================================================================================');
  console.log('       IT DECLARATION & LEAVES COLLECTION AUDIT & CLEANUP');
  console.log('================================================================================\n');

  const client = new MongoClient(uri);

  try {
    await client.connect();
    const db = client.db('vinay_db');

    // 1. Audit & Clean leaves collection
    const leaveCol = db.collection('leaves');
    const totalLeaves = await leaveCol.countDocuments();
    console.log(`[leaves] Total count before: ${totalLeaves}`);

    // Find leaves belonging to real employee vs test leaves
    const realEmpObjectId = new ObjectId(REAL_EMPLOYEE_ID);
    const realLeaveFilter = {
      $or: [
        { employeeId: realEmpObjectId },
        { employeeId: REAL_EMPLOYEE_ID }
      ]
    };

    const realLeavesCount = await leaveCol.countDocuments(realLeaveFilter);
    console.log(`[leaves] Found ${realLeavesCount} real leave records for employee (${REAL_EMPLOYEE_ID}).`);

    // Delete dummy leaves not associated with real employee or with automation reason
    const dummyLeaveFilter = {
      $or: [
        { reason: { $regex: 'Playwright', $options: 'i' } },
        { reason: { $regex: 'Automation', $options: 'i' } },
        { reason: { $regex: 'test', $options: 'i' } },
        { employeeId: { $ne: realEmpObjectId, $ne: REAL_EMPLOYEE_ID } }
      ]
    };

    const dummyLeavesCount = await leaveCol.countDocuments(dummyLeaveFilter);
    if (dummyLeavesCount > 0) {
      const delLeaves = await leaveCol.deleteMany(dummyLeaveFilter);
      console.log(`  -> Cleaned ${delLeaves.deletedCount} dummy leave records!`);
    }

    // 2. Audit & Clean itDeclaration collection
    const itdCol = db.collection('itDeclaration');
    const totalITD = await itdCol.countDocuments();
    console.log(`\n[itDeclaration] Total count before: ${totalITD}`);

    const realITDFilter = {
      $or: [
        { employeeId: realEmpObjectId },
        { employeeId: REAL_EMPLOYEE_ID }
      ]
    };

    const realITDCount = await itdCol.countDocuments(realITDFilter);
    console.log(`[itDeclaration] Found ${realITDCount} real IT declaration for employee (${REAL_EMPLOYEE_ID}).`);

    // Keep real employee's declaration, delete dummy declarations
    const dummyITDFilter = {
      employeeId: { $ne: realEmpObjectId, $ne: REAL_EMPLOYEE_ID }
    };

    const dummyITDCount = await itdCol.countDocuments(dummyITDFilter);
    if (dummyITDCount > 0) {
      const delITD = await itdCol.deleteMany(dummyITDFilter);
      console.log(`  -> Cleaned ${delITD.deletedCount} dummy IT declaration records!`);
    }

    // 3. Clean GridFS Upload Files (itdFileUploads_2026-27.files and .chunks)
    const filesCol = db.collection('itdFileUploads_2026-27.files');
    const chunksCol = db.collection('itdFileUploads_2026-27.chunks');

    const totalFiles = await filesCol.countDocuments();
    console.log(`\n[itdFileUploads_2026-27.files] Total files count before: ${totalFiles}`);

    // Find real files referenced in real IT declaration
    const realITDDoc = await itdCol.findOne(realITDFilter);
    let realFileIds = [];

    if (realITDDoc && realITDDoc.proofOfSubmission) {
      realITDDoc.proofOfSubmission.forEach(cat => {
        if (cat.files && Array.isArray(cat.files)) {
          cat.files.forEach(f => {
            if (f.fileId) realFileIds.push(new ObjectId(f.fileId));
          });
        }
      });
    }

    console.log(`[itdFileUploads] Preserving ${realFileIds.length} real ITD proof files.`);

    const dummyFileFilter = { _id: { $nin: realFileIds } };
    const dummyFilesCount = await filesCol.countDocuments(dummyFileFilter);

    if (dummyFilesCount > 0) {
      const dummyFiles = await filesCol.find(dummyFileFilter).toArray();
      const dummyFileObjectIds = dummyFiles.map(f => f._id);

      const delFiles = await filesCol.deleteMany(dummyFileFilter);
      const delChunks = await chunksCol.deleteMany({ files_id: { $in: dummyFileObjectIds } });

      console.log(`  -> Cleaned ${delFiles.deletedCount} dummy files and ${delChunks.deletedCount} dummy chunks from GridFS!`);
    }

    console.log('\n================================================================================');
    console.log('✅ IT DECLARATION & LEAVES CLEANUP COMPLETE!');
    console.log('================================================================================\n');

  } catch (err) {
    console.error('❌ ITD & Leaves Clean Error:', err.message);
  } finally {
    await client.close();
  }
};

cleanITDAndLeaves();
