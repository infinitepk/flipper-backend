const { syncAllProviders } = require("./sync/rssSyncService");
const { processPendingArticles } = require("./workers/articleWorker");

let isRunning = false;

async function runNewsCycle() {
  if (isRunning) {
    console.log("News cycle already running. Skipping this run.");
    return;
  }

  isRunning = true;

  try {
    console.log("=================================");
    console.log("Starting news cycle...");
    console.log("=================================");

    console.log("Running RSS Sync...");
    await syncAllProviders();

    console.log("Running Article Worker...");
    await processPendingArticles();

    console.log("News cycle completed.");
  } catch (error) {
    console.error("News cycle failed:", error.message);
  } finally {
    isRunning = false;
  }
}

async function startScheduler() {
  console.log("News scheduler started...");

  // Run immediately when the server starts
  await runNewsCycle();

  // Run every 30 minutes
  setInterval(() => {
    runNewsCycle();
  }, 30 * 60 * 1000);
}

module.exports = {
  startScheduler,
};