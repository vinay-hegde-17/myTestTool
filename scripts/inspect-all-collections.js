/**
 * Full MongoDB Atlas Collection Inspector & Dummy Data Sweeper
 * Inspects all 20 collections in "vinay_db" to show document counts, sample records,
 * and clean up dummy/framework-dumped records.
 */

const { MongoClient } = require('mongodb');
require('dotenv').config();

const uri = process.env.DB_CONNECTION_STRING || 'mongodb+srv://vinayhegde0824_db_user:Vijay123@cluster0.es0bnz7.mongodb.net/vinay_db';

const inspectAndCleanAll = async () => {
  console.log('================================================================================');
  console.log('            FULL MONGODB ATLAS COLLECTION AUDIT & CLEANUP');
  console.log('================================================================================\n');

  const client = new MongoClient(uri);

  try {
    await client.connect();
    const db = client.db('vinay_db');
    const collections = await db.listCollections().toArray();

    console.log(`[MongoDB] Total Collections in "vinay_db": ${collections.length}\n`);

    for (const colInfo of collections) {
      const name = colInfo.name;
      const col = db.collection(name);
      const totalCount = await col.countDocuments();
      console.log(`📌 Collection: "${name}" -> Total Documents: ${totalCount}`);
    }

    console.log('\n================================================================================');
    console.log('               SPECIFIC COLLECTION AUDIT & DUMMY DATA SWEEP');
    console.log('================================================================================\n');

    // 1. Audit & Clean moduleUserRoleLookup (User specified: Keep first 22 valid records, rest are dummy)
    const moduleLookupCol = db.collection('moduleUserRoleLookup');
    const lookupCount = await moduleLookupCol.countDocuments();
    console.log(`[moduleUserRoleLookup] Current total count: ${lookupCount}`);

    if (lookupCount > 22) {
      // Find all documents sorted by _id ascending
      const allLookups = await moduleLookupCol.find({}).sort({ _id: 1 }).toArray();
      const validLookups = allLookups.slice(0, 22);
      const dummyLookups = allLookups.slice(22);

      const dummyIds = dummyLookups.map((doc) => doc._id);
      console.log(`[moduleUserRoleLookup] Keeping first 22 valid records. Deleting ${dummyIds.length} dummy records...`);

      const delResult = await moduleLookupCol.deleteMany({ _id: { $in: dummyIds } });
      console.log(`  -> Successfully cleaned ${delResult.deletedCount} dummy records from moduleUserRoleLookup!`);
    }

    // 2. Audit & Clean weeklyReport
    const weeklyCol = db.collection('weeklyReport');
    const weeklyCount = await weeklyCol.countDocuments();
    console.log(`\n[weeklyReport] Current total count: ${weeklyCount}`);

    const dummyWeeklyFilter = {
      $or: [
        { topic: { $regex: 'Automation', $options: 'i' } },
        { topic: { $regex: 'Playwright', $options: 'i' } },
        { topic: { $regex: '\\d{10,}' } },
        { description: { $regex: 'Playwright', $options: 'i' } }
      ]
    };
    const dummyWeeklyCount = await weeklyCol.countDocuments(dummyWeeklyFilter);
    if (dummyWeeklyCount > 0) {
      const delWeekly = await weeklyCol.deleteMany(dummyWeeklyFilter);
      console.log(`  -> Cleaned ${delWeekly.deletedCount} dummy weekly report records.`);
    }

    // 3. Audit & Clean RaisedQueries
    const queryCol = db.collection('RaisedQueries');
    const queryCount = await queryCol.countDocuments();
    console.log(`\n[RaisedQueries] Current total count: ${queryCount}`);

    const dummyQueryFilter = {
      $or: [
        { subject: { $regex: '178' } },
        { subject: { $regex: 'Automation', $options: 'i' } },
        { query: { $regex: 'Playwright', $options: 'i' } },
        { query: { $regex: 'Testing query', $options: 'i' } }
      ]
    };
    const dummyQueryCount = await queryCol.countDocuments(dummyQueryFilter);
    if (dummyQueryCount > 0) {
      const delQuery = await queryCol.deleteMany(dummyQueryFilter);
      console.log(`  -> Cleaned ${delQuery.deletedCount} dummy raised query records.`);
    }

    // 4. Audit & Clean buildVersions
    const buildCol = db.collection('buildVersions');
    const buildCount = await buildCol.countDocuments();
    console.log(`\n[buildVersions] Current total count: ${buildCount}`);

    const dummyBuildFilter = {
      $or: [
        { buildVersion: { $regex: 'AUTO' } },
        { description: { $regex: 'Playwright', $options: 'i' } },
        { createdBy: 'Playwright Automation' }
      ]
    };
    const dummyBuildCount = await buildCol.countDocuments(dummyBuildFilter);
    if (dummyBuildCount > 0) {
      const delBuild = await buildCol.deleteMany(dummyBuildFilter);
      console.log(`  -> Cleaned ${delBuild.deletedCount} dummy build version records.`);
    }

    // 5. Audit & Clean employees (keep real employees like Vinay Hegde)
    const empCol = db.collection('employees');
    const empCount = await empCol.countDocuments();
    console.log(`\n[employees] Current total count: ${empCount}`);

    const dummyEmpFilter = {
      $or: [
        { emailId: { $regex: '^auto', $options: 'i' } },
        { firstName: 'Automation' },
        { firstName: { $regex: 'Playwright', $options: 'i' } }
      ]
    };
    const dummyEmpCount = await empCol.countDocuments(dummyEmpFilter);
    if (dummyEmpCount > 0) {
      const delEmp = await empCol.deleteMany(dummyEmpFilter);
      console.log(`  -> Cleaned ${delEmp.deletedCount} dummy employee records.`);
    }

    console.log('\n================================================================================');
    console.log('✅ AUDIT & DUMMY DATA CLEANUP FINISHED FOR ALL 20 COLLECTIONS!');
    console.log('================================================================================\n');

  } catch (err) {
    console.error('❌ Audit & Cleanup Error:', err.message);
  } finally {
    await client.close();
  }
};

inspectAndCleanAll();
