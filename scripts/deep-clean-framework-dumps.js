/**
 * Comprehensive Cleanup Script to remove all automated test dumps
 * Cleans up extra test modules, test user roles, test lookups, test asset types/models,
 * test assets, test weekly reports, test raised queries, and test holidays.
 *
 * PRESERVES:
 * - Real 21 core modules
 * - Real 4 core user roles (ADMIN, HR, EMPLOYEE, MANAGER)
 * - Real 21 moduleUserRoleLookup permission records
 * - Real employee Vinay Hegde & manager employee
 * - Valid sample assets, holidays, build versions, and configuration
 */

const { MongoClient, ObjectId } = require('mongodb');
require('dotenv').config();

const uri = process.env.DB_CONNECTION_STRING || process.env.MONGODB_URI;
if (!uri) { throw new Error("DB_CONNECTION_STRING or MONGODB_URI must be provided in .env"); }

// List of 21 Core Real Modules
const REAL_MODULE_IDS = [
  '66e812132803193c4f56ed37', // View Holidays
  '66e811a22803193c4f56ed07', // Apply Leave
  '66e812062803193c4f56ed2b', // Manage Holidays
  '670cb289cea9ea8788d7ac40', // View Weekly Reports
  '66e810beba2a2a56c79e7add', // Modules
  '66e8117d2803193c4f56ecef', // Roles
  '66e811632803193c4f56ece3', // Permissions
  '66fe60e457bb3b25c5b650a2', // My Weekly Report
  '66e811942803193c4f56ecfb', // Manage Timesheets
  '66e811c92803193c4f56ed1f', // My Timesheet Tracker
  '66fe4adcf23b64da2eef4e19', // Assets Management
  '66e811b12803193c4f56ed13', // Leave Approvals
  '66e8244214c94fc54b8964cf', // My Profile
  '672b682172db3a6b8f11d39e', // Dashboard
  '678a03df51c5c2a98e11e321', // ITD Reports
  '677fbe785fe0304e714534b2', // ITDeclaration
  '66e9650e98a629da5a8c56c7', // Employees
  '6a8f15d404ee5302bb1e2480', // Organization Chart
  '6a8f15f104ee5302bb1e2484', // Raise Query
  '6a8f161204ee5302bb1e2488', // All Queries
  '6a8f163e04ee5302bb1e24a2'  // FAQ
].map(id => new ObjectId(id));

// Core 4 Roles
const CORE_ROLE_NAMES = ['ADMIN', 'HR', 'EMPLOYEE', 'MANAGER'];

async function deepCleanFrameworkDumps() {
  console.log('================================================================================');
  console.log('       CAREFUL CLEANUP OF DUMMED TEST MODULES, ROLES & PERMISSIONS');
  console.log('================================================================================\n');

  const client = new MongoClient(uri);

  try {
    await client.connect();
    const db = client.db();

    // 1. CLEAN MODULES
    const moduleCol = db.collection('modules');
    const allModules = await moduleCol.find({}).toArray();
    console.log(`[modules] Total modules found before cleanup: ${allModules.length}`);

    const extraModules = allModules.filter(m => {
      // Keep only real 21 modules by ObjectId match
      const isRealId = REAL_MODULE_IDS.some(rId => rId.equals(m._id));
      if (isRealId) return false;
      // Also filter out any module with Playwright / Dup / Case / Space / timestamp in name
      return true;
    });

    if (extraModules.length > 0) {
      const extraModuleIds = extraModules.map(m => m._id);
      const delModRes = await moduleCol.deleteMany({ _id: { $in: extraModuleIds } });
      console.log(`  🧹 Removed ${delModRes.deletedCount} unwanted dumped test modules.`);
    }
    const finalModulesCount = await moduleCol.countDocuments();
    console.log(`  ✅ [modules] Final clean module count: ${finalModulesCount}\n`);

    // 2. CLEAN USER ROLES
    const userRoleCol = db.collection('userRoles');
    const allRoles = await userRoleCol.find({}).toArray();
    console.log(`[userRoles] Total user roles found before cleanup: ${allRoles.length}`);

    // Identify real core roles
    const preservedRoleIds = [];
    CORE_ROLE_NAMES.forEach(roleName => {
      const match = allRoles.find(r => r.userRole && r.userRole.toUpperCase() === roleName);
      if (match) {
        preservedRoleIds.push(match._id);
      }
    });

    const extraRoles = allRoles.filter(r => !preservedRoleIds.some(pId => pId.equals(r._id)));
    if (extraRoles.length > 0) {
      const extraRoleIds = extraRoles.map(r => r._id);
      const delRolesRes = await userRoleCol.deleteMany({ _id: { $in: extraRoleIds } });
      console.log(`  🧹 Removed ${delRolesRes.deletedCount} unwanted dumped test user roles.`);
    }
    const finalRoles = await userRoleCol.find({}).toArray();
    console.log(`  ✅ [userRoles] Final clean role count: ${finalRoles.length}`);
    finalRoles.forEach(r => console.log(`     - ${r.userRole} (${r._id})`));
    console.log('');

    // 3. CLEAN MODULE USER ROLE LOOKUP (PERMISSIONS)
    const lookupCol = db.collection('moduleUserRoleLookup');
    const allLookups = await lookupCol.find({}).toArray();
    console.log(`[moduleUserRoleLookup] Total lookup permission records found before cleanup: ${allLookups.length}`);

    // Valid lookups must point to a preserved role AND a real module
    const extraLookups = allLookups.filter(l => {
      const isRoleValid = preservedRoleIds.some(pId =>
        pId.equals(new ObjectId(l.userRoleId)) || pId.equals(new ObjectId(l.roleId || l.userRoleId))
      );
      const isModuleValid = REAL_MODULE_IDS.some(mId =>
        mId.equals(new ObjectId(l.moduleId))
      );
      return !isRoleValid || !isModuleValid;
    });

    if (extraLookups.length > 0) {
      const extraLookupIds = extraLookups.map(l => l._id);
      const delLookupRes = await lookupCol.deleteMany({ _id: { $in: extraLookupIds } });
      console.log(`  🧹 Removed ${delLookupRes.deletedCount} stale/dumped permission lookup records.`);
    }
    const finalLookupCount = await lookupCol.countDocuments();
    console.log(`  ✅ [moduleUserRoleLookup] Final clean permission lookup count: ${finalLookupCount}\n`);

    // 4. CLEAN ASSET TYPES & ASSET MODELS
    const assetTypeCol = db.collection('assetTypes');
    const delAssetTypes = await assetTypeCol.deleteMany({
      type: { $regex: '(Playwright|AUTO|\\d{10,})', $options: 'i' }
    });
    if (delAssetTypes.deletedCount > 0) {
      console.log(`  🧹 Removed ${delAssetTypes.deletedCount} unwanted test asset types.`);
    }

    const assetModelCol = db.collection('assetModels');
    const delAssetModels = await assetModelCol.deleteMany({
      model: { $regex: '(Playwright|AUTO|\\d{10,})', $options: 'i' }
    });
    if (delAssetModels.deletedCount > 0) {
      console.log(`  🧹 Removed ${delAssetModels.deletedCount} unwanted test asset models.`);
    }

    // 5. CLEAN ASSETS
    const assetCol = db.collection('assets');
    const delAssets = await assetCol.deleteMany({
      $or: [
        { assetId: { $regex: 'AUTO', $options: 'i' } },
        { description: { $regex: '(Playwright|Test Asset|automation)', $options: 'i' } }
      ]
    });
    if (delAssets.deletedCount > 0) {
      console.log(`  🧹 Removed ${delAssets.deletedCount} test asset records.`);
    }

    // 6. CLEAN RAISED QUERIES & WEEKLY REPORTS
    const queryCol = db.collection('RaisedQueries');
    const delQueries = await queryCol.deleteMany({
      $or: [
        { subject: { $regex: '(Automation|Playwright|Updated subject|\\d{10,})', $options: 'i' } },
        { query: { $regex: '(Playwright|Testing query)', $options: 'i' } }
      ]
    });
    if (delQueries.deletedCount > 0) {
      console.log(`  🧹 Removed ${delQueries.deletedCount} test raised queries.`);
    }

    const weeklyCol = db.collection('weeklyReport');
    const delWeekly = await weeklyCol.deleteMany({
      $or: [
        { topic: { $regex: '(Automation|Playwright|\\d{10,})', $options: 'i' } },
        { description: { $regex: 'Playwright', $options: 'i' } }
      ]
    });
    if (delWeekly.deletedCount > 0) {
      console.log(`  🧹 Removed ${delWeekly.deletedCount} test weekly report records.`);
    }

    console.log('\n================================================================================');
    console.log('🎉 COMPREHENSIVE CLEANUP COMPLETED SUCCESSFULLY!');
    console.log('================================================================================\n');

  } catch (err) {
    console.error('❌ Error during deep cleanup:', err);
  } finally {
    await client.close();
    console.log('[MongoDB] Connection closed.');
  }
}

deepCleanFrameworkDumps();
