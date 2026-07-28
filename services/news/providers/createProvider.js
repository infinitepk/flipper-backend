const { fetchArticles } = require("./baseProvider");

function createProvider({ name, categories, rssFeeds }) {
  return {
    name,
    categories,

    async getArticles(category) {
  const feeds = rssFeeds[category];

  if (!feeds) {
    throw new Error(`${name} category '${category}' not found.`);
  }

  let articles = [];

  for (const feed of feeds) {
    const source = typeof feed === "string" ? name : feed.source;
    const rssUrl = typeof feed === "string" ? feed : feed.url;

    const fetched = await fetchArticles({
      source,
      category,
      rssUrl,
    });

    articles.push(...fetched);
  }

  return articles;
},
  };
}

module.exports = createProvider;