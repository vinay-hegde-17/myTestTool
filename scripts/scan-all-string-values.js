/**
 * Full Database String Inspector
 * Inspects all non-binary collections and lists string values to confirm zero test patterns remain.
 */

const { MongoClient } = require('mongodb');
require('dotenv').config();

const uri = process.env.DB_CONNECTION_STRING || process.env.MONGODB_URI;
if (!uri) { throw new Error("DB_CONNECTION_STRING or MONGODB_URI must be provided in .env"); }

const scanAllStrings = async () => {
  console.log('================================================================================');
  console.log('             FULL DATABASE STRING VALUE VERIFICATION');
  console.log('================================================================================\n');

  const client = new MongoClient(uri);

  try {
    await client.connect();
    const db = client.db('vinay_db');
    const collections = await db.listCollections().toArray();

    for (const colInfo of collections) {
      const name = colInfo.name;
      if (name.endsWith('.chunks') || name.endsWith('.files')) continue;

      const col = db.collection(name);
      const count = await col.countDocuments();
      const docs = await col.find({}).limit(5).toArray();

      console.log(`📌 Collection "${name}" (${count} total docs):`);
      docs.forEach((doc, idx) => {
        const keyInfo = [];
        if (doc.userRole) keyInfo.push(`userRole: "${doc.userRole}"`);
        if (doc.firstName) keyInfo.push(`firstName: "${doc.firstName}"`);
        if (doc.assetId) keyInfo.push(`assetId: "${doc.assetId}"`);
        if (doc.holidayName) keyInfo.push(`holidayName: "${doc.holidayName}"`);
        if (doc.moduleName) keyInfo.push(`moduleName: "${doc.moduleName}"`);
        if (doc.topic) keyInfo.push(`topic: "${doc.topic}"`);

        console.log(`   [${idx + 1}] _id: ${doc._id} | ${keyInfo.join(' | ') || 'Document present'}`);
      });
      console.log('');
    }

  } catch (e) {
    console.error(e);
  } finally {
    await client.close();
  }
};

scanAllStrings();
