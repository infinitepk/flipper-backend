const createProvider = require("./createProvider");

module.exports = createProvider({
  name: "Mid-Day",

  categories: [
    "india",
  ],

  rssFeeds: {
    "india": [
      {
        source: "Mid-Day",
        url: "https://www.mid-day.com/Resources/midday/rss/india-news.xml",
      },
    ],
  },
});