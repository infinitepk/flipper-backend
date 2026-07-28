const createProvider = require("./createProvider");

module.exports = createProvider({
  name: "BBC",

  categories: [
    "world",
    "business",
    "sports",
    "entertainment",
    "scitech",
  ],

  rssFeeds: {
    world: "https://feeds.bbci.co.uk/news/world/rss.xml",
    business: "https://feeds.bbci.co.uk/news/business/rss.xml",
    sports: "https://feeds.bbci.co.uk/sport/rss.xml",
    entertainment: "https://feeds.bbci.co.uk/news/entertainment_and_arts/rss.xml",
    scitech: [
      "https://feeds.bbci.co.uk/news/technology/rss.xml",
      "https://feeds.bbci.co.uk/news/science_and_environment/rss.xml",
    ],
  },
});