const Parser = require("rss-parser");

const categoryFeeds = require("./categoryFeeds");
const { parseGoogleRSS } = require("./rssParser");

const parser = new Parser();

async function getGoogleNews(category) {
  const feedUrl = categoryFeeds[category];

  if (!feedUrl) {
    throw new Error(`Category '${category}' not found.`);
  }

  const feed = await parser.parseURL(feedUrl);

  return parseGoogleRSS(feed.items);
}

module.exports = {
  getGoogleNews,
};