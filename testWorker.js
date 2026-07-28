const {
  processPendingArticles,
} = require("./services/news/workers/articleWorker");

async function test() {
  try {
    await processPendingArticles();
  } catch (err) {
    console.error(err);
  }

  process.exit();
}

test();