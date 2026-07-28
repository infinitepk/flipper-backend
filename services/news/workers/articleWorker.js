const pLimit = require("p-limit").default;
const limit = pLimit(4);

const {
  findPending,
  updateArticle,
  markFailed,
} = require("../../../database/repositories/articleRepository");

const {
  extractArticle,
} = require("../extractor/articleExtractor");


///seperate funtion

async function processArticle(article) {
  console.log(`Processing: ${article.title}`);

  try {
    const extracted = await extractArticle(article.article_url);

    if (!extracted) {
      await markFailed(article.id);
      console.log(`✗ Marked as failed: ${article.id}`);
      return;
    }

    const updated = await updateArticle(article.id, {
      summary: extracted.description,
      content: extracted.content,
      image_url: extracted.image,
      author: extracted.author,
      reading_time: extracted.readingTime,
      status: "completed",
    });

    console.log(`✓ Completed: ${updated.id}`);
  } catch (err) {
    await markFailed(article.id);
    console.error(`✗ Failed: ${err.message}`);
  }
}





async function processPendingArticles() {



  while (true) {
    const articles = await findPending(10);

    if (articles.length === 0) {
      console.log("No pending articles left.");
      break;
    }

    await Promise.all(
  articles.map(article =>
    limit(() => processArticle(article))
  )
);
  } // <-- closes while
} // <-- closes function

module.exports = {
  processPendingArticles,
};