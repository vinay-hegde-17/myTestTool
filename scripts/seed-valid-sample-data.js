/**
 * Seed Valid Sample Data across all MongoDB Collections with .env Synchronized IDs
 * Ensures all collections (including weeklyReport, RaisedQueries, itDeclaration, leaves, assets, etc.)
 * have clean, valid sample records linked to TEST_EMPLOYEE_ID (6a1f0bd1c9ce1caed4279c13).
 */

const { MongoClient, ObjectId } = require('mongodb');
require('dotenv').config();

const uri = process.env.DB_CONNECTION_STRING || 'mongodb+srv://vinayhegde0824_db_user:Vijay123@cluster0.es0bnz7.mongodb.net/vinay_db';

const VINAY_EMPLOYEE_ID = new ObjectId('6a1f0bd1c9ce1caed4279c13');
const MANAGER_EMPLOYEE_ID = new ObjectId('6a1f0bd1c9ce1caed4279c14');
const ADMIN_ROLE_ID = new ObjectId('66a77ce670bd6b1f721cc20b');

const ASSET_ID = new ObjectId('6a369484acba6340369d61a0');
const ASSET_TYPE_ID = new ObjectId('6a369460acba6340369d6198');
const ASSET_MODEL_ID = new ObjectId('6a369467acba6340369d619c');

const LEAVE_ID = new ObjectId('6a46902aea79d955be3ce913');
const QUERY_ID = new ObjectId('6a68e26a245f4ee9786ebd9c');
const QUERY_TYPE_ID = new ObjectId('67cfff7d000d3f90fa78a2be');
const CONFIG_ID = new ObjectId('6a47deb0015a0cd13507a53a');
const BUILD_VERSION_ID = new ObjectId('6a7b54c392124802d0544857');

async function seedData() {
  console.log('================================================================================');
  console.log('       SEEDING SAMPLE DATA WITH SYNCHRONIZED .ENV TEST IDs');
  console.log('================================================================================\n');

  const client = new MongoClient(uri);

  try {
    await client.connect();
    const db = client.db();
    console.log(`[MongoDB] Connected to "${db.databaseName}" database.\n`);

    // 1. EMPLOYEES
    const empCol = db.collection('employees');
    await empCol.updateOne(
      { _id: VINAY_EMPLOYEE_ID },
      {
        $set: {
          firstName: 'Vinay',
          lastName: 'Hegde',
          emailId: 'vinayhegde0824@gmail.com',
          employeeNumber: 'EMP001',
          dateOfJoining: new Date('2024-01-01'),
          activeStatus: true,
          designation: 'Senior Automation Engineer',
          assignedRoleId: ADMIN_ROLE_ID,
          reportingTo: MANAGER_EMPLOYEE_ID,
          gender: 'Male',
          phone: '9876543210',
          bloodGroup: 'O+',
          lastModifiedOn: new Date()
        }
      },
      { upsert: true }
    );

    await empCol.updateOne(
      { _id: MANAGER_EMPLOYEE_ID },
      {
        $set: {
          firstName: 'Test',
          lastName: 'Manager',
          emailId: 'manager.test@example.com',
          employeeNumber: 'EMP002',
          dateOfJoining: new Date('2023-01-01'),
          activeStatus: true,
          designation: 'Engineering Manager',
          assignedRoleId: ADMIN_ROLE_ID,
          gender: 'Male',
          phone: '9876543211',
          lastModifiedOn: new Date()
        }
      },
      { upsert: true }
    );
    console.log('✅ [employees] Seeded Vinay Hegde & Manager employee records.');

    // 2. HOLIDAYS
    const holidayCol = db.collection('holidays');
    const existingHolidaysCount = await holidayCol.countDocuments();
    if (existingHolidaysCount === 0) {
      await holidayCol.insertMany([
        { _id: new ObjectId('6a6e27f62eb13ddee671e3d1'), holidayName: 'New Year', date: new Date('2026-01-01T00:00:00.000Z'), holidayType: 'Public Holiday' },
        { holidayName: 'Republic Day', date: new Date('2026-01-26T00:00:00.000Z'), holidayType: 'National Holiday' },
        { holidayName: 'Independence Day', date: new Date('2026-08-15T00:00:00.000Z'), holidayType: 'National Holiday' },
        { holidayName: 'Gandhi Jayanti', date: new Date('2026-10-02T00:00:00.000Z'), holidayType: 'National Holiday' },
        { holidayName: 'Christmas', date: new Date('2026-12-25T00:00:00.000Z'), holidayType: 'Public Holiday' }
      ]);
    }
    console.log('✅ [holidays] Valid holiday records ready.');

    // 3. TIME TRACKER
    const timeCol = db.collection('timeTracker');
    await timeCol.updateOne(
      { employeeId: '6a1f0bd1c9ce1caed4279c13' },
      {
        $set: {
          employeeId: '6a1f0bd1c9ce1caed4279c13',
          logs: {
            august2026: [
              { date: '2026-08-03', hoursLogged: 9 },
              { date: '2026-08-04', hoursLogged: 8 },
              { date: '2026-08-05', hoursLogged: 8 }
            ]
          },
          approvalRequest: {
            status: 'Submitted',
            requestedOn: new Date('2026-08-05')
          }
        }
      },
      { upsert: true }
    );
    console.log('✅ [timeTracker] Seeded time tracking logs.');

    // 4. LEAVES
    const leaveCol = db.collection('leaves');
    await leaveCol.updateOne(
      { _id: LEAVE_ID },
      {
        $set: {
          employeeId: VINAY_EMPLOYEE_ID,
          fromDate: new Date('2026-08-10'),
          toDate: new Date('2026-08-12'),
          leaveType: 'CL',
          reason: 'Casual leave sample',
          numberOfDays: 3,
          status: 'Pending',
          appliedOn: new Date('2026-08-01')
        }
      },
      { upsert: true }
    );
    console.log('✅ [leaves] Seeded pending leave record (6a46902aea79d955be3ce913).');

    // 5. ASSET TYPES & MODELS & ASSETS
    const assetTypeCol = db.collection('assetTypes');
    await assetTypeCol.updateOne(
      { _id: ASSET_TYPE_ID },
      { $set: { type: 'laptop' } },
      { upsert: true }
    );

    const assetModelCol = db.collection('assetModels');
    await assetModelCol.updateOne(
      { _id: ASSET_MODEL_ID },
      { $set: { model: 'dell' } },
      { upsert: true }
    );

    const assetCol = db.collection('assets');
    await assetCol.updateOne(
      { _id: ASSET_ID },
      {
        $set: {
          assetId: 'As1',
          type: ASSET_TYPE_ID,
          model: ASSET_MODEL_ID,
          description: 'Developer Laptop',
          dateOfPurchase: new Date('2023-06-01'),
          assignedEmployee: VINAY_EMPLOYEE_ID,
          lastModifiedOn: new Date(),
          notInUse: false
        }
      },
      { upsert: true }
    );
    console.log('✅ [assets] Seeded asset (As1) linked to assetType and assetModel.');

    // 6. WEEKLY REPORT
    const weeklyCol = db.collection('weeklyReport');
    const weeklyCount = await weeklyCol.countDocuments();
    if (weeklyCount === 0) {
      await weeklyCol.insertMany([
        {
          _id: new ObjectId('6a776496c1d7fe82ad5d8db1'),
          employeeId: VINAY_EMPLOYEE_ID,
          date: new Date('2026-08-03T00:00:00.000Z'),
          topic: 'Time tracker code',
          description: '<p>Time tracker module successfully automated</p>',
          status: 'Completed'
        },
        {
          employeeId: VINAY_EMPLOYEE_ID,
          date: new Date('2026-08-10T00:00:00.000Z'),
          topic: 'Weekly report module',
          description: '<p>Weekly report API integration completed</p>',
          status: 'In Progress'
        }
      ]);
    }
    console.log('✅ [weeklyReport] Seeded weekly report records.');

    // 7. BUILD VERSIONS
    const buildCol = db.collection('buildVersions');
    await buildCol.updateOne(
      { _id: BUILD_VERSION_ID },
      {
        $set: {
          versionNumber: '1.0.1',
          releaseNotes: 'Deployment release notes',
          status: 'stable',
          createdAt: new Date('2024-11-19T08:26:07.000Z')
        }
      },
      { upsert: true }
    );
    console.log('✅ [buildVersions] Seeded build version record.');

    // 8. IT DECLARATION
    const itdCol = db.collection('itDeclaration');
    await itdCol.updateOne(
      { employeeId: VINAY_EMPLOYEE_ID, financialYear: '2026-27' },
      {
        $set: {
          employeeId: VINAY_EMPLOYEE_ID,
          regime: 'new',
          financialYear: '2026-27',
          ownerPan: 'ABCDE1234F',
          oldRegimeDetails: {
            houseRent: 120000,
            medicalInsurance: 25000,
            homeLoanInterest: 200000
          },
          proofOfSubmission: []
        }
      },
      { upsert: true }
    );
    console.log('✅ [itDeclaration] Seeded IT declaration record for 2026-27.');

    // 9. APP CONFIGURATION
    const configCol = db.collection('appConfiguration');
    await configCol.updateOne(
      { _id: CONFIG_ID },
      {
        $set: {
          SICK_LEAVE_THRESHOLD: 6,
          CASUAL_LEAVE_THRESHOLD: 18,
          MATERNITY_LEAVE_THRESHOLD: 84,
          ENABLE_PROOF_OF_SUBMISSION: true,
          REGIME_DETAILS_EDITABLE: true,
          ITD_POLICY_URL: 'https://example.com/itd-policy.pdf'
        }
      },
      { upsert: true }
    );
    console.log('✅ [appConfiguration] Seeded threshold configuration record.');

    // 10. RAISED QUERY TYPE & QUERIES
    const queryTypeCol = db.collection('RaisedQueryType');
    await queryTypeCol.updateOne(
      { _id: QUERY_TYPE_ID },
      { $set: { type: 'Portal Issue' } },
      { upsert: true }
    );

    const queryCol = db.collection('RaisedQueries');
    await queryCol.updateOne(
      { _id: QUERY_ID },
      {
        $set: {
          employeeId: VINAY_EMPLOYEE_ID,
          queryTypeId: QUERY_TYPE_ID,
          subject: 'Portal login access issue',
          query: 'Unable to reset portal password from profile screen',
          reply: null,
          showInFAQ: false
        }
      },
      { upsert: true }
    );
    console.log('✅ [RaisedQueries] Seeded unanswered query (6a68e26a245f4ee9786ebd9c).');

    console.log('\n================================================================================');
    console.log('🎉 ALL DATA SYNCHRONIZED WITH .ENV TEST IDs SUCCESSFULLY!');
    console.log('================================================================================\n');

  } catch (err) {
    console.error('❌ Error during seeding:', err);
  } finally {
    await client.close();
  }
}

seedData();
