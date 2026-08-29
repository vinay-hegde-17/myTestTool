const { MongoClient } = require('mongodb');
require('dotenv').config();

const uri = process.env.DB_CONNECTION_STRING || process.env.MONGODB_URI;
if (!uri) { throw new Error("DB_CONNECTION_STRING or MONGODB_URI must be provided in .env"); }

const inspectLookup = async () => {
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db('vinay_db');
    const lookupCol = db.collection('moduleUserRoleLookup');

    const docs = await lookupCol.find({}).toArray();
    console.log(`=== moduleUserRoleLookup (${docs.length} documents) ===\n`);

    docs.forEach((doc, idx) => {
      console.log(`[${idx + 1}] _id: ${doc._id}, userRoleId: ${doc.userRoleId || doc.roleId}, roleName: ${doc.userRole || doc.roleName || doc.name}`);
    });
  } catch (e) {
    console.error(e);
  } finally {
    await client.close();
  }
};

inspectLookup();
