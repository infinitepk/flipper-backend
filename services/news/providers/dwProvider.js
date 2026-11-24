const createProvider = require("./createProvider");

module.exports = createProvider({
    name: "DW",

    categories: [
        "world",
        "scitech",
    ],

    rssFeeds: {
        world: "https://rss.dw.com/rdf/rss-en-all",
      
        scitech: "https://rss.dw.com/rdf/rss-en-science",
    },
});