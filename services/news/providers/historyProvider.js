const createProvider = require("./createProvider");

module.exports = createProvider({
    name: "Indian History",

    categories: [
        "history",
    ],

    rssFeeds: {
  history: [
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
        history: "https://www.worldhistory.org/rss2/?lang=en",
    },
  ],
},
});