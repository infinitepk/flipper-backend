const createProvider = require("./createProvider");

module.exports = createProvider({
  name: "TOI",

  categories: [
    "india",
    "world",
    "business",
    "sports",
    "entertainment",
    "scitech",
  ],

  rssFeeds: {
    india: "https://timesofindia.indiatimes.com/rssfeeds/-2128936835.cms",
    world: "https://timesofindia.indiatimes.com/rssfeeds/296589292.cms",
    business: "https://timesofindia.indiatimes.com/rssfeeds/1898055.cms",
    sports: "https://timesofindia.indiatimes.com/rssfeeds/4719148.cms",
    entertainment: "https://timesofindia.indiatimes.com/rssfeeds/1081479906.cms",
    scitech: [
      "https://timesofindia.indiatimes.com/rssfeeds/66949542.cms",
      "https://timesofindia.indiatimes.com/rssfeeds/-2128672765.cms",
    ],
  },
});