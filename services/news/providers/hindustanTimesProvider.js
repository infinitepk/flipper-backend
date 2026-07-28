const createProvider = require("./createProvider");

module.exports = createProvider({
    name: "Hindustan Times",

    categories: [
        "india",
        "world",
        "business",
        "sports",
        "entertainment",
        "scitech",
    ],

    rssFeeds: {
  india:
    "https://www.hindustantimes.com/feeds/rss/india-news/rssfeed.xml",

  world:
    "https://www.hindustantimes.com/feeds/rss/world-news/rssfeed.xml",

  business:
    "https://www.hindustantimes.com/feeds/rss/business/rssfeed.xml",

  sports:
    "https://www.hindustantimes.com/feeds/rss/sports/rssfeed.xml",

  entertainment:
    "https://www.hindustantimes.com/feeds/rss/entertainment/rssfeed.xml",

  scitech:
    "https://www.hindustantimes.com/feeds/rss/science/rssfeed.xml",
}
});