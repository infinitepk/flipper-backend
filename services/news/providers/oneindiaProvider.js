const createProvider = require("./createProvider");

module.exports = createProvider({
  name: "Oneindia",

  categories: [
    "india",
    "world",
    "business",
    "sports",
    "entertainment",
    "scitech",
  ],

  rssFeeds: {
    india: [
      "https://www.oneindia.com/rss/news-india-fb.xml",
    ],

    world: [
      "https://www.oneindia.com/rss/news-international-fb.xml",
    ],

    business: [
      "https://www.oneindia.com/rss/news-business-fb.xml",
    ],

    sports: [
      "https://www.oneindia.com/rss/news-sports-fb.xml",
    ],

    entertainment: [
      "https://www.oneindia.com/rss/news-entertainment-fb.xml",
    ],
  },
});