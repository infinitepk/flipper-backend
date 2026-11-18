require("dotenv").config();

const pool = require("./database/db");
const {
    syncAllProviders
} = require("./services/news/sync/rssSyncService");

async function main() {
    console.log("================================");
    console.log("FLIPPER RSS WORKER STARTED");
    console.log("================================");

    try {
        await syncAllProviders();

        console.log("Flipper RSS sync completed successfully.");

    } catch (error) {
        console.error("RSS sync failed:", error);
        process.exitCode = 1;

    } finally {
        await pool.end();
        console.log("Database connection closed.");
    }
}

main();