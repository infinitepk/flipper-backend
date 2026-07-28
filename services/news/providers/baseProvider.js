const Parser = require("rss-parser");

const parser = new Parser();

async function fetchArticles({
  source,
  category,
  rssUrl,
}) {
  const rssUrls = Array.isArray(rssUrl) ? rssUrl : [rssUrl];

  let items = [];

  for (const url of rssUrls) {
    const feed = await parser.parseURL(url);
    items.push(...feed.items);
  }

  // Keep only the newest 50 articles
  items.sort(
    (a, b) => new Date(b.pubDate || 0) - new Date(a.pubDate || 0)
  );

  items = items.slice(0, 50);

  return items.map((item) => ({
    title: item.title,
    article_url: item.link,
    source,
    publishedAt: item.pubDate,
    category,
  }));
}

module.exports = {
  fetchArticles,
};