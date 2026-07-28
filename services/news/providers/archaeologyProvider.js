const createProvider = require("./createProvider");

module.exports = createProvider({
    name: "Archaeology Magazine",

    categories: [
        "history",
    ],

    rssFeeds: {
        history: "https://www.archaeology.org/rss.xml",
    },
});