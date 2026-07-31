const createProvider = require("./createProvider");

module.exports = createProvider({
  name: "Archaeology Magazine",

  categories: [
    "history",
  ],

  rssFeeds: {
    history: [
      {
        source: "Archaeology Magazine",
        url: "https://archaeology.org/feed/",
      },
    ],
  },
});