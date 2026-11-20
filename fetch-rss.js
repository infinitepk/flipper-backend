
require("dotenv").config();

const pool = require("./database/db");

const {
    syncAllProviders
} = require("./services/news/sync/rssSyncService");

const {
    processPendingArticles
} = require("./services/news/workers/articleWorker");

async function main() {
    console.log("================================");
    console.log("FLIPPER NEWS WORKER STARTED");
    console.log("================================");

    try {
        // STEP 1: Fetch RSS feeds
        console.log("\n[1/2] Starting RSS synchronization...");

        await syncAllProviders();

        console.log("RSS synchronization completed successfully.");

        // STEP 2: Process pending articles
        console.log("\n[2/2] Starting pending article processing...");

        await processPendingArticles();

        console.log("Article processing completed successfully.");

        console.log("\n================================");
        console.log("FLIPPER WORKER FINISHED");
        console.log("================================");

    } catch (error) {
        console.error("WORKER FAILED:", error);
        process.exitCode = 1;

    } finally {
        await pool.end();
        console.log("Database connection closed.");
    }
}

main();