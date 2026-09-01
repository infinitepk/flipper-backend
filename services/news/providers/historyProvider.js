const createProvider = require("./createProvider");

module.exports = createProvider({
    name: "Indian History",

    categories: [
        "history",
    ],

    rssFeeds: {
  history: [
  {
    source: "Smithsonian",
    url: "https://www.smithsonianmag.com/rss/history/",
  },
  {
    source: "History Hit",
    url: "https://www.historyhit.com/feed/",
  },
  {
    source: "Ancient Origins",
    url: "https://feeds.feedburner.com/AncientOrigins",
  },

  {
  source: "UNESCO World Heritage",
  url: "https://whc.unesco.org/en/news/rss",
},
  {
        source: "History Extra",
        url: "https://www.historyextra.com/feed/",
      },
 {
        source: "ARTnews",
        url: "https://www.artnews.com/feed/",
      },
  {
    source: "World History Encyclopedia",
    url: "https://www.worldhistory.org/rss2/?lang=en",
  },
  {
        source: "Hyperallergic",
        url: "https://hyperallergic.com/feed/",
      },

    
      {
        source: "JSTOR Daily",
        url: "https://daily.jstor.org/feed/",
      },

],
},
});