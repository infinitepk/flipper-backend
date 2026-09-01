const createProvider = require("./createProvider");

module.exports = createProvider({
  name: "Wired",

  categories: [
    "world",
    "business",
    "entertainment",
    "scitech",
  ],

  rssFeeds: {
    world: [
      "https://www.wired.com/feed/category/ideas/latest/rss",
    ],

    business: [
      "https://www.wired.com/feed/category/business/latest/rss",
    ],

    entertainment: [
      "https://www.wired.com/feed/category/culture/latest/rss",
    ],

    scitech: [
      "https://www.wired.com/feed/category/science/latest/rss",
      "https://www.wired.com/feed/category/gear/latest/rss",
      "https://www.wired.com/feed/category/security/latest/rss",
    ],
  },
});