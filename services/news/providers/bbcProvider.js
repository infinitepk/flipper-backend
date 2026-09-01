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
    world: [
      "https://feeds.bbci.co.uk/news/world/rss.xml",
      "https://feeds.bbci.co.uk/news/world/africa/rss.xml",
      "https://feeds.bbci.co.uk/news/world/asia/rss.xml",
      "https://feeds.bbci.co.uk/news/world/europe/rss.xml",
      "https://feeds.bbci.co.uk/news/world/latin_america/rss.xml",
      "https://feeds.bbci.co.uk/news/world/middle_east/rss.xml",
      "https://feeds.bbci.co.uk/news/world/us_and_canada/rss.xml",
      "https://feeds.bbci.co.uk/news/politics/rss.xml"
    ],

    business: [
      "https://feeds.bbci.co.uk/news/business/rss.xml",
      "https://feeds.bbci.co.uk/news/business/market-data/rss.xml",
    ],

    sports: [
      "https://feeds.bbci.co.uk/sport/rss.xml",
      "https://feeds.bbci.co.uk/sport/football/rss.xml",
      "https://feeds.bbci.co.uk/sport/cricket/rss.xml",
      "https://feeds.bbci.co.uk/sport/tennis/rss.xml",
      "https://feeds.bbci.co.uk/sport/formula1/rss.xml",
      "https://feeds.bbci.co.uk/sport/golf/rss.xml",
    ],

    entertainment: [
      "https://feeds.bbci.co.uk/news/entertainment_and_arts/rss.xml",
    ],

    scitech: [
      "https://feeds.bbci.co.uk/news/technology/rss.xml",
      "https://feeds.bbci.co.uk/news/science_and_environment/rss.xml",
      "https://feeds.bbci.co.uk/news/health/rss.xml",
      "https://feeds.bbci.co.uk/news/education/rss.xml"
    ],
  },
});