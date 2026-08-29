/**
 * Database Teardown & Sweep Utility
 * Automatically cleans up temporary test records created during Playwright test runs.
 */

const deleteCreatedTestRecords = async (apiContext, baseUrl, qaToken) => {
  if (!qaToken) {
    console.log('[Teardown] No QA Token available; skipping automated API cleanup.');
    return;
  }

  const headers = {
    Authorization: `Bearer ${qaToken}`,
    'Content-Type': 'application/json'
  };

  console.log('[Teardown] Initiating automated test data sweep...');
  let deletedCount = 0;

  try {
    // 1. Cleanup created Assets matching AUTO_ or [PLAYWRIGHT]
    const assetsRes = await apiContext.get(`${baseUrl}/assets`, { headers });
    if (assetsRes.ok()) {
      const assets = await assetsRes.json();
      const testAssets = assets.filter(
        (a) => a.assetId && (a.assetId.startsWith('AUTO_') || a.assetId.startsWith('AUTO'))
      );

      for (const asset of testAssets) {
        if (asset._id) {
          await apiContext.delete(`${baseUrl}/assets/${asset._id}`, { headers });
          deletedCount++;
        }
      }
    }

    // 2. Cleanup created Holidays matching Automation Holiday or Republic Day
    const holidaysRes = await apiContext.get(`${baseUrl}/holidays`, { headers });
    if (holidaysRes.ok()) {
      const holidays = await holidaysRes.json();
      const testHolidays = holidays.filter(
        (h) => h.holidayName && (h.holidayName.includes('Automation Holiday') || h.holidayName.includes('Republic Day'))
      );

      for (const holiday of testHolidays) {
        if (holiday._id) {
          await apiContext.delete(`${baseUrl}/holidays/${holiday._id}`, { headers });
          deletedCount++;
        }
      }
    }

    console.log(`[Teardown] Sweep complete: Cleaned ${deletedCount} temporary test records.`);
  } catch (err) {
    console.warn('[Teardown] Error during test data sweep:', err.message);
  }
};

module.exports = {
  deleteCreatedTestRecords
};
