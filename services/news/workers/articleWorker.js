
const pLimit = require("p-limit").default;
const limit = pLimit(2);

const {
  findRecentPending,
  updateArticle,
  markFailed,
} = require("../../../database/repositories/articleRepository");

const {
  extractArticle,
} = require("../extractor/articleExtractor");

async function processArticle(article) {
  console.log(`Processing: ${article.title}`);

  try {
    const extracted = await extractArticle(article.article_url);

    if (!extracted) {
      await markFailed(article.id);
      console.log(`✗ Marked as failed: ${article.id}`);
      return false;
    }

    const updated = await updateArticle(article.id, {
      summary: extracted.description,
      content: extracted.content,
      image_url: extracted.image,
      video_url: article.video_url,
      author: extracted.author,
      reading_time: extracted.readingTime,
      status: "completed",
    });

    console.log(`✓ Completed: ${updated.id}`);
    return true;

  } catch (err) {
    await markFailed(article.id);

    console.error(`✗ Failed article ID: ${article.id}`);
    console.error(`Title: ${article.title}`);
    console.error(`URL: ${article.article_url}`);
    console.error(`Error: ${err.message}`);

    return false;
  }
}

async function processPendingArticles() {
  console.log("================================");
  console.log("FLIPPER ARTICLE PROCESSOR");
  console.log("================================");

  const articles = await findRecentPending();

  const batch = articles;

  console.log(`Recent pending articles: ${articles.length}`);
  console.log(`Processing this batch: ${batch.length}`);

  if (batch.length === 0) {
    console.log("No recent pending articles found.");
    return;
  }

  let completed = 0;
  let failed = 0;

  await Promise.all(
    batch.map(article =>
      limit(async () => {
        const result = await processArticle(article);
        if (result) completed++;
        else failed++;
      })
    )
  );

  console.log("================================");
  console.log("PROCESSING SUMMARY");
  console.log(`Selected: ${batch.length}`);
  console.log(`Completed: ${completed}`);
  console.log(`Failed: ${failed}`);
  console.log("================================");
}

module.exports = {
  processPendingArticles,
};
