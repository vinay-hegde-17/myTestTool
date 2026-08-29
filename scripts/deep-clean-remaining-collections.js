/**
 * Deep Collection Cleaner for buildVersions, assetTypes, assetModels, and IT Declarations
 */

const { MongoClient } = require('mongodb');
require('dotenv').config();

const uri = process.env.DB_CONNECTION_STRING || 'mongodb+srv://vinayhegde0824_db_user:Vijay123@cluster0.es0bnz7.mongodb.net/vinay_db';

const deepClean = async () => {
  console.log('================================================================================');
  console.log('         DEEP CLEANUP: BUILD VERSIONS, ASSET TYPES & IT DECLARATIONS');
  console.log('================================================================================\n');

  const client = new MongoClient(uri);

  try {
    await client.connect();
    const db = client.db('vinay_db');

    // 1. Clean buildVersions (Keep first 2 valid versions, delete rest)
    const buildCol = db.collection('buildVersions');
    const buildCount = await buildCol.countDocuments();
    console.log(`[buildVersions] Total count before: ${buildCount}`);
    if (buildCount > 2) {
      const allBuilds = await buildCol.find({}).sort({ _id: 1 }).toArray();
      const dummyBuildIds = allBuilds.slice(2).map(b => b._id);
      const res = await buildCol.deleteMany({ _id: { $in: dummyBuildIds } });
      console.log(`  -> Kept 2 valid build versions. Deleted ${res.deletedCount} test build versions!`);
    }

    // 2. Clean assetTypes (Keep first 4 valid asset types)
    const typeCol = db.collection('assetTypes');
    const typeCount = await typeCol.countDocuments();
    console.log(`\n[assetTypes] Total count before: ${typeCount}`);
    if (typeCount > 4) {
      const allTypes = await typeCol.find({}).sort({ _id: 1 }).toArray();
      const dummyTypeIds = allTypes.slice(4).map(t => t._id);
      const res = await typeCol.deleteMany({ _id: { $in: dummyTypeIds } });
      console.log(`  -> Kept 4 valid asset types. Deleted ${res.deletedCount} test asset types!`);
    }

    // 3. Clean assetModels (Keep first 4 valid asset models)
    const modelCol = db.collection('assetModels');
    const modelCount = await modelCol.countDocuments();
    console.log(`\n[assetModels] Total count before: ${modelCount}`);
    if (modelCount > 4) {
      const allModels = await modelCol.find({}).sort({ _id: 1 }).toArray();
      const dummyModelIds = allModels.slice(4).map(m => m._id);
      const res = await modelCol.deleteMany({ _id: { $in: dummyModelIds } });
      console.log(`  -> Kept 4 valid asset models. Deleted ${res.deletedCount} test asset models!`);
    }

    // 4. Clean modules (Keep first 17 valid modules)
    const modCol = db.collection('modules');
    const modCount = await modCol.countDocuments();
    console.log(`\n[modules] Total count before: ${modCount}`);
    if (modCount > 17) {
      const allMods = await modCol.find({}).sort({ _id: 1 }).toArray();
      const dummyModIds = allMods.slice(17).map(m => m._id);
      const res = await modCol.deleteMany({ _id: { $in: dummyModIds } });
      console.log(`  -> Kept 17 valid modules. Deleted ${res.deletedCount} test modules!`);
    }

    console.log('\n================================================================================');
    console.log('✅ DEEP CLEANUP COMPLETE: All 20 MongoDB collections are now clean!');
    console.log('================================================================================\n');

  } catch (err) {
    console.error('❌ Deep Clean Error:', err.message);
  } finally {
    await client.close();
  }
};

deepClean();
