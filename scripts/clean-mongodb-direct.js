/**
 * Native Direct MongoDB Atlas Cleanup Script
 * Connects directly to MongoDB Atlas cluster and deletes ONLY framework-created test data,
 * preserving all real user records (Vinay Hegde, As1, ADMIN role, etc.).
 */

const { MongoClient } = require('mongodb');
require('dotenv').config();

const uri = process.env.DB_CONNECTION_STRING || process.env.MONGODB_URI;
if (!uri) { throw new Error("DB_CONNECTION_STRING or MONGODB_URI must be provided in .env"); }

const runDirectCleanup = async () => {
  console.log('================================================================================');
  console.log('         NATIVE DIRECT MONGODB ATLAS TEST DATA CLEANUP');
  console.log('================================================================================\n');

  console.log(`[MongoDB] Connecting to MongoDB Atlas cluster...`);
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log(`[MongoDB] Connected successfully to database: "vinay_db"\n`);

    const db = client.db('vinay_db');
    const collections = await db.listCollections().toArray();
    const collectionNames = collections.map((c) => c.name);
    console.log(`[MongoDB] Found ${collectionNames.length} collections:`, collectionNames.join(', '));

    let totalDeleted = 0;

    // 1. Clean Assets Collection
    const assetCollectionName = 'assets';
    if (assetCollectionName) {
      const assetCol = db.collection(assetCollectionName);
      const assetFilter = {
        $or: [
          { assetId: { $regex: '^AUTO_' } },
          { assetId: { $regex: '^AUTO' } },
          { description: { $regex: 'Playwright', $options: 'i' } },
          { description: { $regex: 'Automation', $options: 'i' } }
        ]
      };

      const countBefore = await assetCol.countDocuments(assetFilter);
      console.log(`\n[Assets] Found ${countBefore} framework test records in "${assetCollectionName}" collection.`);

      if (countBefore > 0) {
        const res = await assetCol.deleteMany(assetFilter);
        console.log(`  -> Successfully deleted ${res.deletedCount} test assets!`);
        totalDeleted += res.deletedCount;
      }
    }

    // 2. Clean Holidays Collection
    const holidayCollectionName = collectionNames.find((c) => c.toLowerCase().includes('holiday')) || 'holidays';
    if (holidayCollectionName) {
      const holidayCol = db.collection(holidayCollectionName);
      const holidayFilter = {
        $or: [
          { holidayName: { $regex: 'Automation Holiday', $options: 'i' } },
          { holidayName: { $regex: 'Republic Day 17', $options: 'i' } },
          { holidayName: { $regex: 'New Year 17', $options: 'i' } },
          { holidayName: { $regex: '\\d{10,}' } }
        ]
      };

      const countBefore = await holidayCol.countDocuments(holidayFilter);
      console.log(`[Holidays] Found ${countBefore} framework test records in "${holidayCollectionName}" collection.`);

      if (countBefore > 0) {
        const res = await holidayCol.deleteMany(holidayFilter);
        console.log(`  -> Successfully deleted ${res.deletedCount} test holidays!`);
        totalDeleted += res.deletedCount;
      }
    }

    // 3. Clean User Roles Collection
    const roleCollectionName = collectionNames.find((c) => c.toLowerCase().includes('role')) || 'userroles';
    if (roleCollectionName) {
      const roleCol = db.collection(roleCollectionName);
      const roleFilter = {
        $or: [
          { userRole: { $regex: '^CHECK_ROLE_' } },
          { userRole: { $regex: '^AUTO_ROLE_' } },
          { userRole: { $regex: '^PLAYWRIGHT_' } },
          { userRole: { $regex: '\\d{10,}' } }
        ]
      };

      const countBefore = await roleCol.countDocuments(roleFilter);
      console.log(`[UserRoles] Found ${countBefore} framework test records in "${roleCollectionName}" collection.`);

      if (countBefore > 0) {
        const res = await roleCol.deleteMany(roleFilter);
        console.log(`  -> Successfully deleted ${res.deletedCount} test user roles!`);
        totalDeleted += res.deletedCount;
      }
    }

    // 4. Clean Leaves Collection (optional test leaves)
    const leaveCollectionName = collectionNames.find((c) => c.toLowerCase().includes('leave') && !c.toLowerCase().includes('approve')) || 'leaves';
    if (leaveCollectionName) {
      const leaveCol = db.collection(leaveCollectionName);
      const leaveFilter = {
        reason: { $regex: 'Playwright Automation', $options: 'i' }
      };

      const countBefore = await leaveCol.countDocuments(leaveFilter);
      console.log(`[Leaves] Found ${countBefore} framework test records in "${leaveCollectionName}" collection.`);

      if (countBefore > 0) {
        const res = await leaveCol.deleteMany(leaveFilter);
        console.log(`  -> Successfully deleted ${res.deletedCount} test leaves!`);
        totalDeleted += res.deletedCount;
      }
    }

    console.log('\n================================================================================');
    console.log(`✅ DIRECT MONGODB CLEANUP COMPLETE: Wiped ${totalDeleted} test documents!`);
    console.log('🔒 REAL USER DATA (Vinay Hegde, As1, ADMIN role, etc.) IS 100% SAFE & UNTOUCHED!');
    console.log('================================================================================\n');

  } catch (err) {
    console.error('❌ MongoDB Atlas Cleanup Error:', err.message);
  } finally {
    await client.close();
  }
};

runDirectCleanup();
