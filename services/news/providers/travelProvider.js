const createProvider = require("./createProvider");

module.exports = createProvider({
    name: "Travel",

    categories: [
        "travel",
    ],

    rssFeeds: {
  travel: [
    {
      source: "IndiTales",
      url: "https://inditales.com/feed",
    },
    {
      source: "The Planet D",
      url: "https://theplanetd.com/feed",
    },
    {
      source: "Goats On The Road",
      url: "https://goatsontheroad.com/feed",
    },
    {
      source: "Nomadic Matt",
      url: "https://nomadicmatt.com/feed",
    },
    {
      source: "Nomadasaurus",
      url: "https://nomadasaurus.com/feed",
    },
    {
      source: "Breaking Travel News",
      url: "https://feeds.feedburner.com/breakingtravelnews",
    },
  ],
},
});