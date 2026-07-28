const createProvider = require("./createProvider");

module.exports = createProvider({
    name: "Global Entertainment",

    categories: [
        "entertainment",
    ],

    rssFeeds: {
        entertainment: [
            "https://variety.com/feed/",
            "https://www.hollywoodreporter.com/feed/",
            "https://deadline.com/feed/",
        ],
    },
});