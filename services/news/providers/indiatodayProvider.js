const createProvider = require("./createProvider");

module.exports = createProvider({
  name: "India Today",

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
      "https://www.indiatoday.in/rss/1206578",
      "https://www.indiatoday.in/rss/1206514",
    ],

    world: [
      "https://www.indiatoday.in/rss/1206577",
    ],

    business: [
      "https://www.indiatoday.in/rss/1206574",
    ],

    sports: [
      "https://www.indiatoday.in/rss/1206550",
    ],

    entertainment: [
      "https://www.indiatoday.in/rss/1837848",
      "https://www.indiatoday.in/rss/1206551",
    ],

    scitech: [
      "https://www.indiatoday.in/rss/1206688",
    ],
  },
});