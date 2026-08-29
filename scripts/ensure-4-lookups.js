const { MongoClient } = require('mongodb');
require('dotenv').config();

const uri = process.env.DB_CONNECTION_STRING || 'mongodb+srv://vinayhegde0824_db_user:Vijay123@cluster0.es0bnz7.mongodb.net/vinay_db';

const ensureFourLookups = async () => {
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db('vinay_db');
    const userRolesCol = db.collection('userRoles');
    const lookupCol = db.collection('moduleUserRoleLookup');

    const coreRoles = await userRolesCol.find({}).toArray();
    console.log(`[userRoles] Core Roles Count: ${coreRoles.length}`);

    // Ensure 1 lookup entry per core role exists in moduleUserRoleLookup
    for (const role of coreRoles) {
      const existing = await lookupCol.findOne({
        $or: [{ userRoleId: role._id }, { userRoleId: String(role._id) }]
      });

      if (!existing) {
        await lookupCol.insertOne({
          userRoleId: role._id,
          allowedModules: ['employee', 'leave', 'asset', 'timetracker'],
          createdAt: new Date()
        });
        console.log(`  -> Added 1 clean lookup mapping for ${role.userRole}`);
      }
    }

    const finalLookups = await lookupCol.find({}).toArray();
    console.log(`\n[moduleUserRoleLookup] Final Total Count: ${finalLookups.length}`);
    finalLookups.forEach((l, idx) => {
      console.log(`  [${idx + 1}] _id: ${l._id}, userRoleId: ${l.userRoleId}`);
    });

  } catch (e) {
    console.error(e);
  } finally {
    await client.close();
  }
};

ensureFourLookups();
