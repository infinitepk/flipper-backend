const createProvider = require("./createProvider");

module.exports = createProvider({
    name: "CNBC",

    categories: [
        "business",
    ],

    rssFeeds: {
        business: "https://www.cnbc.com/id/100003114/device/rss/rss.html",
    },
});