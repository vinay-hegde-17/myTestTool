/**
 * User Role & Module Lookup Clean Script
 * Ensures userRoles has ONLY 4 documents (ADMIN, HR, EMPLOYEE, MANAGER)
 * and cleans up any extra/automated lookup records in moduleUserRoleLookup.
 */

const { MongoClient, ObjectId } = require('mongodb');
require('dotenv').config();

const uri = process.env.DB_CONNECTION_STRING || 'mongodb+srv://vinayhegde0824_db_user:Vijay123@cluster0.es0bnz7.mongodb.net/vinay_db';

const cleanRolesToFour = async () => {
  console.log('================================================================================');
  console.log('       STRICT CLEANUP: KEEP ONLY 4 CORE ROLES (ADMIN, HR, EMPLOYEE, MANAGER)');
  console.log('================================================================================\n');

  const client = new MongoClient(uri);

  try {
    await client.connect();
    const db = client.db('vinay_db');

    // 1. Audit & Clean userRoles (keep ONLY 4 core roles)
    const userRolesCol = db.collection('userRoles');
    const allRoles = await userRolesCol.find({}).toArray();

    console.log(`[userRoles] Total roles before: ${allRoles.length}`);

    const coreNames = ['ADMIN', 'HR', 'EMPLOYEE', 'MANAGER'];
    const preservedRoles = [];
    const deleteRoleIds = [];

    // Keep first instance of each core role name
    coreNames.forEach((name) => {
      const match = allRoles.find((r) => r.userRole && r.userRole.toUpperCase() === name);
      if (match) {
        preservedRoles.push(match);
      }
    });

    allRoles.forEach((r) => {
      if (!preservedRoles.some((p) => String(p._id) === String(r._id))) {
        deleteRoleIds.push(r._id);
      }
    });

    if (deleteRoleIds.length > 0) {
      const delRolesRes = await userRolesCol.deleteMany({ _id: { $in: deleteRoleIds } });
      console.log(`  -> Deleted ${delRolesRes.deletedCount} extra/automated roles from userRoles.`);
    }

    const currentRoles = await userRolesCol.find({}).toArray();
    console.log(`[userRoles] Preserved exactly ${currentRoles.length} core roles:`);
    currentRoles.forEach((r) => console.log(`   - ${r.userRole}: ${r._id}`));

    // 2. Audit & Clean moduleUserRoleLookup
    const lookupCol = db.collection('moduleUserRoleLookup');
    const preservedRoleIds = currentRoles.map((r) => r._id);
    const preservedRoleStrIds = currentRoles.map((r) => String(r._id));

    // Delete lookups that reference any deleted role IDs or automated test roles
    const dummyLookupFilter = {
      $and: [
        { userRoleId: { $nin: [...preservedRoleIds, ...preservedRoleStrIds] } },
        { roleId: { $nin: [...preservedRoleIds, ...preservedRoleStrIds] } }
      ]
    };

    const dummyCount = await lookupCol.countDocuments(dummyLookupFilter);
    if (dummyCount > 0) {
      const delLookupRes = await lookupCol.deleteMany(dummyLookupFilter);
      console.log(`\n[moduleUserRoleLookup] Deleted ${delLookupRes.deletedCount} automated/stale lookup records.`);
    }

    // If user wants ONLY 4 primary lookup records (1 per role)
    const allLookups = await lookupCol.find({}).toArray();
    console.log(`\n[moduleUserRoleLookup] Current lookups count: ${allLookups.length}`);

    // Select 1 representative lookup per role
    const finalLookupIdsToKeep = [];
    currentRoles.forEach((role) => {
      const match = allLookups.find((l) =>
        String(l.userRoleId) === String(role._id) || String(l.roleId) === String(role._id)
      );
      if (match) {
        finalLookupIdsToKeep.push(match._id);
      }
    });

    // Delete remaining duplicate lookups if total exceeds 4
    if (allLookups.length > 4 && finalLookupIdsToKeep.length > 0) {
      const extraLookups = allLookups.filter((l) => !finalLookupIdsToKeep.some((kId) => String(kId) === String(l._id)));
      const extraIds = extraLookups.map((l) => l._id);
      const delExtraRes = await lookupCol.deleteMany({ _id: { $in: extraIds } });
      console.log(`  -> Removed ${delExtraRes.deletedCount} extra automated lookups, keeping exactly ${finalLookupIdsToKeep.length} core role lookups (1 per role)!`);
    }

    const finalLookupCount = await lookupCol.countDocuments();
    console.log(`\n[moduleUserRoleLookup] Final count: ${finalLookupCount} (1 lookup entry per core role)`);

    console.log('\n================================================================================');
    console.log('✅ STRICT CLEANUP COMPLETE: Preserved ONLY 4 core roles & lookups!');
    console.log('================================================================================\n');

  } catch (err) {
    console.error('❌ Strict Clean Error:', err.message);
  } finally {
    await client.close();
  }
};

cleanRolesToFour();
