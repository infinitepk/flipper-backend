const createProvider = require("./createProvider");

module.exports = createProvider({
  name: "The Print",

  categories: [
    "india",
    "world",
    "scitech",
    "nature",
    "business",
  ],

  rssFeeds: {
    india: [
      "https://theprint.in/category/india/feed/",
    ],

    world: [
      "https://theprint.in/category/world/feed/",
    ],

    scitech: [
      "https://theprint.in/category/tech/feed/",
      "https://theprint.in/category/science/feed/",
    ],

    nature: [
      "https://theprint.in/category/environment/feed/",
    ],

    business: [
      "https://theprint.in/category/economy/feed/",
    ],
  },
});