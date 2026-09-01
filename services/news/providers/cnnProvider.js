const createProvider = require("./createProvider");

module.exports = createProvider({
  name: "CNN",

  categories: [
    "world",
    "business",
    "sports",
    "entertainment",
    "scitech",
  ],

  rssFeeds: {
    world: [
      "http://rss.cnn.com/rss/edition_world.rss",
      "http://rss.cnn.com/rss/edition_africa.rss",
      "http://rss.cnn.com/rss/edition_americas.rss",
      "http://rss.cnn.com/rss/edition_asia.rss",
      "http://rss.cnn.com/rss/edition_europe.rss",
      "http://rss.cnn.com/rss/edition_meast.rss",
    ],

    business: [
      "http://rss.cnn.com/rss/money_latest.rss",
      "http://rss.cnn.com/rss/money_news_international.rss",
    ],

    sports: [
      "http://rss.cnn.com/rss/edition_sport.rss",
      "http://rss.cnn.com/rss/edition_football.rss",
      "http://rss.cnn.com/rss/edition_golf.rss",
      "http://rss.cnn.com/rss/edition_motorsport.rss",
      "http://rss.cnn.com/rss/edition_tennis.rss",
    ],

    entertainment: [
      "http://rss.cnn.com/rss/edition_entertainment.rss",
    ],

    scitech: [
      "http://rss.cnn.com/rss/edition_technology.rss",
      "http://rss.cnn.com/rss/edition_space.rss",
    ],
  },
});
