const { MongoClient, ObjectId } = require('mongodb');
require('dotenv').config();

const uri = process.env.DB_CONNECTION_STRING || 'mongodb+srv://vinayhegde0824_db_user:Vijay123@cluster0.es0bnz7.mongodb.net/vinay_db';

const keepExactFour = async () => {
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db('vinay_db');
    const lookupCol = db.collection('moduleUserRoleLookup');

    const exactIdsToKeep = [
      new ObjectId('6a1f0f54c9ce1caed4279c59'), // ADMIN
      new ObjectId('6a8e630bce5c33a15ee9d160'), // MANAGER
      new ObjectId('6a8e630bce5c33a15ee9d161'), // EMPLOYEE
      new ObjectId('6a8e630cce5c33a15ee9d162')  // HR
    ];

    const delRes = await lookupCol.deleteMany({
      _id: { $nin: exactIdsToKeep }
    });

    console.log(`[moduleUserRoleLookup] Successfully deleted ${delRes.deletedCount} duplicate/automated lookup records.`);

    const remaining = await lookupCol.find({}).toArray();
    console.log(`\n[moduleUserRoleLookup] Remaining Documents (${remaining.length}):`);
    remaining.forEach((doc, idx) => {
      console.log(`  [${idx + 1}] _id: ${doc._id}, userRoleId: ${doc.userRoleId}`);
    });

  } catch (e) {
    console.error(e);
  } finally {
    await client.close();
  }
};

keepExactFour();
