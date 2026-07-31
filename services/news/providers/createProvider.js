const { fetchArticles } = require("./baseProvider");

function createProvider({ name, categories, rssFeeds }) {
  return {
    name,
    categories,

    async getArticles(category) {

  const feeds = Array.isArray(rssFeeds[category])
  ? rssFeeds[category]
  : [rssFeeds[category]];

  if (!feeds) {
    throw new Error(`${name} category '${category}' not found.`);
  }

  let articles = [];

  for (const feed of feeds) {
  const source = typeof feed === "string" ? name : feed.source;
  const rssUrl = typeof feed === "string" ? feed : feed.url;

  try {
    const fetched = await fetchArticles({
      source,
      category,
      rssUrl,
    });

    articles.push(...fetched);
    console.log(`[${name}] ✓ ${source}: ${fetched.length} articles`);
  } catch (err) {
    console.error(`[${name}] ✗ ${source} failed: ${err.message}`);
  }
}

  return articles;
},
  };
}

module.exports = createProvider;