const createProvider = require("./createProvider");

module.exports = createProvider({
    name: "The Guardian",

    categories: [
        "world",
        "business",
        "sports",
        "entertainment",
        "scitech",
    ],

    rssFeeds: {
        world: "https://www.theguardian.com/world/rss",
        business: "https://www.theguardian.com/business/rss",
        sports: "https://www.theguardian.com/sport/rss",
        entertainment: "https://www.theguardian.com/culture/rss",
        scitech: "https://www.theguardian.com/science/rss",
        nature: "https://www.theguardian.com/environment/rss",
    },
});