const createProvider = require("./createProvider");

module.exports = createProvider({
  name: "Smithsonian",

  categories: [
    "history",
  ],

  rssFeeds: {
    history: [
      {
        source: "Smithsonian",
        url: "https://www.smithsonianmag.com/rss/history/",
      },
    ],
  },
});



//https://www.indiatoday.in/education-today/gk-and-current-affairs/history