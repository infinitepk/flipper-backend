const createProvider = require("./createProvider");

module.exports = createProvider({
    name: "TechCrunch",

    categories: [
        "scitech",
    ],

    rssFeeds: {
        scitech: "https://techcrunch.com/feed/",
    },
});