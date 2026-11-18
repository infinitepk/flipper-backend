const createProvider = require("./createProvider");

module.exports = createProvider({
    name: "Fox News",

    categories: [
        "world",
        "business",
        "sports",
        "travel",
        "scitech",
    ],

    rssFeeds: {
        world: [
            {
                source: "Fox News World",
                url: "https://moxie.foxnews.com/google-publisher/world.xml",
            },
        ],

        business: [
            {
                source: "Fox Business Latest",
                url: "https://moxie.foxbusiness.com/google-publisher/latest.xml",
            },
            {
                source: "Fox Business Economy",
                url: "https://moxie.foxbusiness.com/google-publisher/economy.xml",
            },
            {
                source: "Fox Business Markets",
                url: "https://moxie.foxbusiness.com/google-publisher/markets.xml",
            },
        ],

        sports: [
            {
                source: "Fox News Sports",
                url: "https://moxie.foxnews.com/google-publisher/sports.xml",
            },
        ],

        travel: [
            {
                source: "Fox News Travel",
                url: "https://moxie.foxnews.com/google-publisher/travel.xml",
            },
        ],

        scitech: [
            {
                source: "Fox News Tech",
                url: "https://moxie.foxnews.com/google-publisher/tech.xml",
            },
            {
                source: "Fox News Science",
                url: "https://moxie.foxnews.com/google-publisher/science.xml",
            },
        ],
    },
});