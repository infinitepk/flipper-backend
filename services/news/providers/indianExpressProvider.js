const createProvider = require("./createProvider");

module.exports = createProvider({
  name: "Indian Express",

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
      "https://indianexpress.com/section/india/feed/",
    ],

    world: [
      "https://indianexpress.com/section/world/feed/",
    ],

    business: [
      "https://indianexpress.com/section/business/feed/",
    ],

    sports: [
      "https://indianexpress.com/section/sports/feed/",
    ],

    entertainment: [
      "https://indianexpress.com/section/entertainment/feed/",
    ],

    scitech: [
      "https://indianexpress.com/section/technology/feed/",
      "https://indianexpress.com/section/technology/science/feed/",
    ],
    travel: [
    "https://indianexpress.com/section/lifestyle/destination-of-the-week/feed/",
  ],

  },
});
