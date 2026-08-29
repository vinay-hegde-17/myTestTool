/**
 * Collection Existence Checker and Creator
 * Checks if all 16 collections specified in the Mongoose schemas exist in MongoDB.
 * If a collection does not exist, it creates the collection.
 */

const { MongoClient } = require('mongodb');
require('dotenv').config();

const uri = process.env.DB_CONNECTION_STRING || 'mongodb+srv://vinayhegde0824_db_user:Vijay123@cluster0.es0bnz7.mongodb.net/vinay_db';

// List of all 16 collections defined in the Mongoose schema:
const requiredCollections = [
  'employees',
  'userRoles',
  'modules',
  'moduleUserRoleLookup',
  'holidays',
  'timeTracker',
  'leaves',
  'assetTypes',
  'assetModels',
  'assets',
  'weeklyReport',
  'buildVersions',
  'itDeclaration',
  'appConfiguration',
  'RaisedQueries',
  'RaisedQueryType'
];

async function checkAndCreateCollections() {
  console.log('================================================================================');
  console.log('            MONGODB COLLECTION CHECK & CREATION PROCESS');
  console.log('================================================================================\n');

  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('[MongoDB] Connected successfully to Database.');

    const db = client.db();
    console.log(`[MongoDB] Target Database Name: "${db.databaseName}"\n`);

    // Get list of existing collection names
    const existingCollectionObjs = await db.listCollections().toArray();
    const existingCollectionNames = new Set(existingCollectionObjs.map(c => c.name));

    console.log(`[MongoDB] Currently Existing Collections (${existingCollectionNames.size}):`);
    existingCollectionNames.forEach(name => console.log(` - ${name}`));
    console.log('\n--------------------------------------------------------------------------------');
    console.log('                     SCHEMA COLLECTION AUDIT RESULTS');
    console.log('--------------------------------------------------------------------------------\n');

    let createdCount = 0;
    let existingCount = 0;

    for (const colName of requiredCollections) {
      if (existingCollectionNames.has(colName)) {
        console.log(`✅ [EXISTS] Collection "${colName}" already exists.`);
        existingCount++;
      } else {
        console.log(`⚠️  [MISSING] Collection "${colName}" does NOT exist. Creating collection...`);
        await db.createCollection(colName);
        console.log(`✨ [CREATED] Collection "${colName}" successfully created.`);
        createdCount++;
      }
    }

    console.log('\n================================================================================');
    console.log('                                SUMMARY');
    console.log('================================================================================');
    console.log(`Total Required Schema Collections: ${requiredCollections.length}`);
    console.log(`Already Existed:                  ${existingCount}`);
    console.log(`Newly Created:                    ${createdCount}`);

    // Final audit listing
    const finalCollections = await db.listCollections().toArray();
    console.log(`\n[MongoDB] Final Total Collections in "${db.databaseName}": ${finalCollections.length}`);
    console.log('================================================================================\n');

  } catch (err) {
    console.error('❌ Error during collection check & creation:', err);
  } finally {
    await client.close();
    console.log('[MongoDB] Connection closed.');
  }
}

checkAndCreateCollections();
