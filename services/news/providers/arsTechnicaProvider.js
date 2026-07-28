const createProvider = require("./createProvider");

module.exports = createProvider({
    name: "Ars Technica",

    categories: [
        "scitech",
    ],

    rssFeeds: {
        scitech: "https://feeds.arstechnica.com/arstechnica/index",
    },
});