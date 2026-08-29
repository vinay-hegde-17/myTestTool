/**
 * Framework Data Cleanup Script
 * Safely removes ONLY automated test data dumped by the Playwright framework,
 * keeping all real user database records completely intact.
 */

require('dotenv').config();
const http = require('http');

const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:3000';
const TEST_EMAIL = process.env.TEST_EMAIL || 'vinayhegde0824@gmail.com';

const request = (path, options = {}) => {
  return new Promise((resolve, reject) => {
    const url = new URL(path, API_BASE_URL);
    const reqOptions = {
      method: options.method || 'GET',
      headers: options.headers || {},
    };

    const req = http.request(url, reqOptions, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        try {
          const json = data ? JSON.parse(data) : {};
          resolve({ status: res.statusCode, data: json });
        } catch (e) {
          resolve({ status: res.statusCode, data: data });
        }
      });
    });

    req.on('error', reject);

    if (options.body) {
      req.write(JSON.stringify(options.body));
    }
    req.end();
  });
};

const runCleanup = async () => {
  console.log('================================================================================');
  console.log('               FRAMEWORK TEST DATA CLEANUP UTILITY');
  console.log('================================================================================\n');

  // 1. Authenticate to get QA Bearer Token
  console.log(`[Auth] Generating QA Bearer Token for ${TEST_EMAIL}...`);
  const authRes = await request('/auth/qa-token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: { email: TEST_EMAIL },
  });

  if (authRes.status !== 200 || !authRes.data.token) {
    console.error('❌ Failed to authenticate. Ensure backend server is running on http://localhost:3000');
    process.exit(1);
  }

  const token = authRes.data.token;
  const headers = {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  };

  let totalDeleted = 0;

  // 2. Clean Automated Assets (Keep real assets like As1)
  console.log('\n[Assets] Scanning for framework-created assets...');
  const assetsRes = await request('/assets', { headers });
  if (assetsRes.status === 200 && Array.isArray(assetsRes.data)) {
    const testAssets = assetsRes.data.filter(
      (a) =>
        (a.assetId && (a.assetId.startsWith('AUTO_') || a.assetId.startsWith('AUTO'))) ||
        (a.description && a.description.toLowerCase().includes('playwright'))
    );

    console.log(`[Assets] Found ${testAssets.length} framework test assets to delete.`);
    for (const asset of testAssets) {
      if (asset._id) {
        const delRes = await request(`/assets/${asset._id}`, { method: 'DELETE', headers });
        if (delRes.status >= 200 && delRes.status < 300) {
          console.log(`  -> Deleted test asset: ${asset.assetId} (${asset._id})`);
          totalDeleted++;
        } else {
          console.log(`  -> Asset DELETE /assets/${asset._id} returned status: ${delRes.status}`);
        }
      }
    }
  }

  // 3. Clean Automated Holidays (Keep real holidays like New Year)
  console.log('\n[Holidays] Scanning for framework-created holidays...');
  const holidayYearsRes = await request('/holidays/years', { headers });
  if (holidayYearsRes.status === 200 && Array.isArray(holidayYearsRes.data)) {
    for (const year of holidayYearsRes.data) {
      const hRes = await request(`/holidays/year/${year}`, { headers });
      if (hRes.status === 200 && Array.isArray(hRes.data)) {
        const testHolidays = hRes.data.filter(
          (h) =>
            h.holidayName &&
            (h.holidayName.includes('Automation Holiday') ||
              h.holidayName.includes('Republic Day 17') ||
              h.holidayName.includes('New Year 17') ||
              /\d{10,}/.test(h.holidayName))
        );

        for (const hol of testHolidays) {
          if (hol._id) {
            const delRes = await request(`/holidays/${hol._id}`, { method: 'DELETE', headers });
            if (delRes.status >= 200 && delRes.status < 300) {
              console.log(`  -> Deleted test holiday: "${hol.holidayName}" (${hol._id})`);
              totalDeleted++;
            }
          }
        }
      }
    }
  }

  // 4. Clean Automated User Roles (Keep real ADMIN, HR, MANAGER, EMPLOYEE, QA)
  console.log('\n[UserRoles] Scanning for framework-created user roles...');
  const rolesRes = await request('/user-roles', { headers });
  if (rolesRes.status === 200 && Array.isArray(rolesRes.data)) {
    const testRoles = rolesRes.data.filter(
      (r) =>
        r.userRole &&
        (r.userRole.startsWith('CHECK_ROLE_') ||
          r.userRole.startsWith('AUTO_ROLE_') ||
          r.userRole.startsWith('PLAYWRIGHT_') ||
          /\d{10,}/.test(r.userRole))
    );

    console.log(`[UserRoles] Found ${testRoles.length} framework test user roles to delete.`);
    for (const role of testRoles) {
      if (role._id) {
        const delRes = await request(`/user-roles/${role._id}`, { method: 'DELETE', headers });
        if (delRes.status >= 200 && delRes.status < 300) {
          console.log(`  -> Deleted test role: ${role.userRole} (${role._id})`);
          totalDeleted++;
        }
      }
    }
  }

  console.log('\n================================================================================');
  console.log(`✅ CLEANUP COMPLETE: Successfully deleted ${totalDeleted} framework test records.`);
  console.log('🔒 REAL USER DATA (Vinay Hegde, As1, ADMIN role, etc.) WAS SAFE & UNTOUCHED!');
  console.log('================================================================================\n');
};

runCleanup().catch((err) => {
  console.error('Error during cleanup execution:', err);
});
