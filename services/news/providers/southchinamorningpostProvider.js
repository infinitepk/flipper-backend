const createProvider = require("./createProvider");

module.exports = createProvider({
  name: "South China Morning Post",

  categories: [
    "world",
    "business",
    "sports",
    "entertainment",
    "scitech",
  ],

  rssFeeds: {
    world: [
      "https://www.scmp.com/rss/91/feed", // China News
      "https://www.scmp.com/rss/92/feed", // Asia News
      "https://www.scmp.com/rss/95/feed", // World News
    ],

    business: [
      "https://www.scmp.com/rss/92/feed", // Business
    ],

    sports: [
      "https://www.scmp.com/rss/95/feed", // Sport
    ],

    entertainment: [
      "https://www.scmp.com/rss/323045/feed", // Culture & Arts
      "https://www.scmp.com/rss/94/feed",     // Lifestyle & Celebs
    ],

    scitech: [
      "https://www.scmp.com/rss/36/feed", // Tech
    ],
  },
});