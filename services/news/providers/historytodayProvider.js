const createProvider = require("./createProvider");

module.exports = createProvider({
    name: "Smithsonian",

    categories: [
        "history",
      
    
    ],

    rssFeeds: {
        history: "https://www.smithsonianmag.com/rss/history/",
       
    },
});