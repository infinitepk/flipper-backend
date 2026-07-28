const createProvider = require("./createProvider");

module.exports = createProvider({
  name: "The Hindu",

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
      "https://www.thehindu.com/news/national/feeder/default.rss",
    ],

    world: [
      "https://www.thehindu.com/news/international/feeder/default.rss",
    ],

    business: [
      "https://www.thehindu.com/business/feeder/default.rss",
    ],

    sports: [
      "https://www.thehindu.com/sport/feeder/default.rss",
    ],

    entertainment: [
      "https://www.thehindu.com/entertainment/feeder/default.rss",
    ],

    scitech: [
      "https://www.thehindu.com/sci-tech/feeder/default.rss",
    ],
  },
});