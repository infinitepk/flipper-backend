const createProvider = require("./createProvider");

module.exports = createProvider({
    name: "News18",

    categories: [
        "india",
        "world",
        "business",
        "sports",
        "entertainment",
    ],

    rssFeeds: {
        india: "https://www.news18.com/commonfeeds/v1/eng/rss/india.xml",
        world: "https://www.news18.com/commonfeeds/v1/eng/rss/world.xml",
        business: "https://www.news18.com/commonfeeds/v1/eng/rss/business.xml",
        sports: "https://www.news18.com/commonfeeds/v1/eng/rss/sports.xml",
        entertainment: "https://www.news18.com/commonfeeds/v1/eng/rss/entertainment.xml",
    },
});