//const cron = require("node-cron");

const { syncAllProviders } = require("./sync/rssSyncService");
const { processPendingArticles } = require("./workers/articleWorker");

async function startScheduler() {
  console.log("News scheduler started...");

  console.log("Running RSS Sync...");
  await syncAllProviders();

  console.log("Running Article Worker...");
  await processPendingArticles();

  console.log("Development run completed.");
}

module.exports = {
  startScheduler,
};