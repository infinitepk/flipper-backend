const createProvider = require("./createProvider");

module.exports = createProvider({
  name: "The New York Times",

  categories: [
    "india",
    "world",
    "scitech",
    "nature",
    "business",
  ],

  rssFeeds: {
    india: [
      "https://rss.nytimes.com/services/xml/rss/nyt/AsiaPacific.xml",
    ],

    world: [
      "https://rss.nytimes.com/services/xml/rss/nyt/World.xml",
      "https://rss.nytimes.com/services/xml/rss/nyt/InternationalHome.xml",
    ],

    scitech: [
      "https://rss.nytimes.com/services/xml/rss/nyt/Technology.xml",
    ],

    nature: [
      "https://rss.nytimes.com/services/xml/rss/nyt/Science.xml",
      "https://rss.nytimes.com/services/xml/rss/nyt/Climate.xml",
    ],

    business: [
      "https://rss.nytimes.com/services/xml/rss/nyt/Business.xml",
      "https://rss.nytimes.com/services/xml/rss/nyt/Economy.xml",
    ],
  },
});