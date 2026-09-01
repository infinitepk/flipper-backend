const createProvider = require("./createProvider");

module.exports = createProvider({
  name: "Al Jazeera",

  categories: [
    "world",
    "business",
    "sports",
    "entertainment",
    "scitech",
  ],

  rssFeeds: {
    world: [
      "https://www.aljazeera.com/xml/rss/all.xml",
    ],
  },
});