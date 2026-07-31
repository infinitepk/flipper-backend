
require("dotenv").config();
const { runShortsSync } = require("./services/news/sync/shortsSyncService");

runShortsSync()
  .then(() => {
    console.log("Done");
    process.exit(0);
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });