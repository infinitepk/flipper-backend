const createProvider = require("./createProvider");

module.exports = createProvider({
  name: "LatestLY",

  userAgent: "curl/8.0",

  categories: [
    "india",
    "world",
    "entertainment",
    "sports",
    "business",
    "sci-tech",
  ],

  rssFeeds: {
    "india": [
      {
        source: "LatestLY",
        url: "https://www.latestly.com/rss/india.xml",
      },
    ],

    "world": [
      {
        source: "LatestLY",
        url: "https://www.latestly.com/rss/world.xml",
      },
    ],

    "entertainment": [
      {
        source: "LatestLY",
        url: "https://www.latestly.com/rss/entertainment.xml",
      },
    ],

    "sports": [
      {
        source: "LatestLY",
        url: "https://www.latestly.com/rss/sports.xml",
      },
    ],

    "business": [
      {
        source: "LatestLY",
        url: "https://www.latestly.com/rss/business.xml",
      },
    ],

    "sci-tech": [
      {
        source: "LatestLY",
        url: "https://www.latestly.com/rss/technology.xml",
      },
    ],
  },
});