const createProvider = require("./createProvider");

module.exports = createProvider({
    name: "DW",

    categories: [
        "world",
        "business",
        "scitech",
    ],

    rssFeeds: {
        world: "https://rss.dw.com/rdf/rss-en-all",
        business: "https://rss.dw.com/rdf/rss-en-business",
        scitech: "https://rss.dw.com/rdf/rss-en-science",
    },
});