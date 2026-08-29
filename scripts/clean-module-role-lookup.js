/**
 * Clean moduleUserRoleLookup collection to keep ONLY the 4 core roles:
 * ADMIN, HR, EMPLOYEE, MANAGER.
 */

const { MongoClient, ObjectId } = require('mongodb');
require('dotenv').config();

const uri = process.env.DB_CONNECTION_STRING || 'mongodb+srv://vinayhegde0824_db_user:Vijay123@cluster0.es0bnz7.mongodb.net/vinay_db';

const cleanModuleUserRoleLookup = async () => {
  console.log('================================================================================');
  console.log('       MODULE USER ROLE LOOKUP CLEANUP (CORE ROLES ONLY)');
  console.log('================================================================================\n');

  const client = new MongoClient(uri);

  try {
    await client.connect();
    const db = client.db('vinay_db');

    // 1. Find Core Roles in userRoles collection
    const userRolesCol = db.collection('userRoles');
    const coreRoleNames = ['ADMIN', 'HR', 'EMPLOYEE', 'MANAGER'];

    const coreRoles = await userRolesCol.find({
      userRole: { $in: coreRoleNames }
    }).toArray();

    const coreRoleObjectIds = coreRoles.map((r) => r._id);
    const coreRoleStringIds = coreRoles.map((r) => String(r._id));

    console.log(`[userRoles] Core Roles Found (${coreRoles.length}):`);
    coreRoles.forEach((r) => {
      console.log(`  -> ${r.userRole}: ${r._id}`);
    });

    // 2. Filter moduleUserRoleLookup collection
    const lookupCol = db.collection('moduleUserRoleLookup');
    const totalBefore = await lookupCol.countDocuments();
    console.log(`\n[moduleUserRoleLookup] Total documents before: ${totalBefore}`);

    // Keep records where userRoleId is one of coreRoleObjectIds or coreRoleStringIds
    const keepFilter = {
      $or: [
        { userRoleId: { $in: coreRoleObjectIds } },
        { userRoleId: { $in: coreRoleStringIds } },
        { roleId: { $in: coreRoleObjectIds } },
        { roleId: { $in: coreRoleStringIds } },
        { userRole: { $in: coreRoleNames } }
      ]
    };

    const keepDocs = await lookupCol.find(keepFilter).toArray();
    console.log(`[moduleUserRoleLookup] Preserving ${keepDocs.length} records for core roles (ADMIN, HR, EMPLOYEE, MANAGER).`);

    // Delete records NOT in keepFilter
    const dummyFilter = {
      $and: [
        { userRoleId: { $nin: [...coreRoleObjectIds, ...coreRoleStringIds] } },
        { roleId: { $nin: [...coreRoleObjectIds, ...coreRoleStringIds] } },
        { userRole: { $nin: coreRoleNames } }
      ]
    };

    const dummyDocsCount = await lookupCol.countDocuments(dummyFilter);
    if (dummyDocsCount > 0) {
      const delRes = await lookupCol.deleteMany(dummyFilter);
      console.log(`  -> Successfully deleted ${delRes.deletedCount} test/dummy lookup records!`);
    } else {
      console.log(`  -> All remaining lookup records belong to core roles.`);
    }

    const totalAfter = await lookupCol.countDocuments();
    console.log(`\n[moduleUserRoleLookup] Total documents remaining: ${totalAfter}`);

    console.log('\n================================================================================');
    console.log('✅ MODULE USER ROLE LOOKUP CLEANUP COMPLETE!');
    console.log('================================================================================\n');

  } catch (err) {
    console.error('❌ Lookup Clean Error:', err.message);
  } finally {
    await client.close();
  }
};

cleanModuleUserRoleLookup();
