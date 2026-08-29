const { MongoClient } = require('mongodb');
require('dotenv').config();

const uri = process.env.DB_CONNECTION_STRING;

async function auditData() {
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db();
    const cols = await db.listCollections().toArray();
    console.log(`=== Total Collections in DB: ${cols.length} ===\n`);
    for (const c of cols) {
      const count = await db.collection(c.name).countDocuments();
      const sample = await db.collection(c.name).findOne({});
      console.log(`Collection: "${c.name}" | Count: ${count}`);
      if (sample) {
        console.log(` Sample:`, JSON.stringify(sample).substring(0, 150));
      }
    }
  } catch (e) {
    console.error(e);
  } finally {
    await client.close();
  }
}

auditData();
