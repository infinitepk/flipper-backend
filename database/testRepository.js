const { saveArticle } = require("./repositories/articleRepository");

async function test() {
  const article = {
    title: "Flipper Backend Test",
    summary: "Testing repository layer",
    article_url: "https://flipper.test/article-1",
    image_url: null,
    source: "Flipper",
    category: "scitech",
    published_at: new Date(),
  };

  const saved = await saveArticle(article);

  console.log(saved);

  process.exit();
}

test();