const createProvider = require("./createProvider");

module.exports = createProvider({
    name: "Mongabay",

    categories: ["nature"],

    rssFeeds: {
        nature: "https://news.mongabay.com/feed/",
    },
});