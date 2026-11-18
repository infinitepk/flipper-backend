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

  while (true) {
    await runNewsCycle();

    console.log(
      "Waiting 30 minutes until next news cycle..."
    );

    await new Promise((resolve) =>
      setTimeout(resolve, 30 * 60 * 1000)
    );
  }
}

module.exports = {
  startScheduler,
};