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
    source: "Indian Express",
    url: "https://indianexpress.com/section/lifestyle/art-and-culture/feed/",
  },
  {
    source: "Hindustan Times",
    url: "https://www.hindustantimes.com/feeds/rss/lifestyle/art-culture/rssfeed.xml",
  },
  {
    source: "World History Encyclopedia",
    url: "https://www.worldhistory.org/rss2/?lang=en",
  },
],
},
});