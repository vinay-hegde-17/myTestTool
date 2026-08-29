/**
 * Universal Database Pattern Cleaner
 * Scans all 20 collections in "vinay_db" and deletes any documents containing test character patterns:
 * ACTIVE_ROLE, CHECK_ROLE, INACTIVE_ROLE, PLAYWRIGHT, AUTO_, PLAYWRIGHT_*, Automation
 */

const { MongoClient } = require('mongodb');
require('dotenv').config();

const uri = process.env.DB_CONNECTION_STRING || 'mongodb+srv://vinayhegde0824_db_user:Vijay123@cluster0.es0bnz7.mongodb.net/vinay_db';

const targetPatterns = [
  'ACTIVE_ROLE',
  'CHECK_ROLE',
  'INACTIVE_ROLE',
  'PLAYWRIGHT',
  'PLAYWRIGHT_ACTIVE',
  'PLAYWRIGHT_INACTIVE',
  'PLAYWRIGHT_MANAGER',
  'AUTO_'
];

const cleanAllCharacterPatterns = async () => {
  console.log('================================================================================');
  console.log('       UNIVERSAL CHARACTER PATTERN CLEANUP ACROSS ALL COLLECTIONS');
  console.log('================================================================================\n');

  const client = new MongoClient(uri);

  try {
    await client.connect();
    const db = client.db('vinay_db');
    const collections = await db.listCollections().toArray();

    let grandTotalDeleted = 0;

    for (const colInfo of collections) {
      const colName = colInfo.name;
      // Skip binary GridFS chunk data
      if (colName.endsWith('.chunks')) continue;

      const col = db.collection(colName);

      // Construct dynamic regex query for string fields
      const regexConditions = [
        { userRole: { $regex: 'ACTIVE_ROLE|CHECK_ROLE|INACTIVE_ROLE|PLAYWRIGHT|AUTO_', $options: 'i' } },
        { name: { $regex: 'ACTIVE_ROLE|CHECK_ROLE|INACTIVE_ROLE|PLAYWRIGHT|AUTO_', $options: 'i' } },
        { description: { $regex: 'ACTIVE_ROLE|CHECK_ROLE|INACTIVE_ROLE|PLAYWRIGHT|AUTO_', $options: 'i' } },
        { topic: { $regex: 'ACTIVE_ROLE|CHECK_ROLE|INACTIVE_ROLE|PLAYWRIGHT|AUTO_', $options: 'i' } },
        { subject: { $regex: 'ACTIVE_ROLE|CHECK_ROLE|INACTIVE_ROLE|PLAYWRIGHT|AUTO_', $options: 'i' } },
        { holidayName: { $regex: 'ACTIVE_ROLE|CHECK_ROLE|INACTIVE_ROLE|PLAYWRIGHT|AUTO_', $options: 'i' } },
        { assetId: { $regex: '^AUTO_', $options: 'i' } }
      ];

      const countBefore = await col.countDocuments({ $or: regexConditions });

      if (countBefore > 0) {
        console.log(`📌 Collection "${colName}": Found ${countBefore} documents matching test character patterns.`);
        const delRes = await col.deleteMany({ $or: regexConditions });
        console.log(`  -> Successfully deleted ${delRes.deletedCount} matching test documents from "${colName}"!`);
        grandTotalDeleted += delRes.deletedCount;
      }
    }

    console.log('\n================================================================================');
    console.log(`✅ UNIVERSAL PATTERN CLEANUP COMPLETE! Total Deleted: ${grandTotalDeleted} documents.`);
    console.log('================================================================================\n');

  } catch (err) {
    console.error('❌ Pattern Clean Error:', err.message);
  } finally {
    await client.close();
  }
};

cleanAllCharacterPatterns();
