const { syncCategory } = require("./services/news/sync/rssSyncService");

async function test() {
  try {
    await syncCategory("scitech");
    console.log("Sync complete!");
  } catch (err) {
    console.error(err);
  }

  process.exit();
}

test();