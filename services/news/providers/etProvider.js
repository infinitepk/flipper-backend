const createProvider = require("./createProvider");

module.exports = createProvider({
    name: "Economic Times",

    categories: [
        "india",
        "business",
       
    ],

    rssFeeds: {
        india: "https://economictimes.indiatimes.com/rssfeeds/1715249553.cms",

        business: [
            "https://economictimes.indiatimes.com/rssfeeds/1977021501.cms", // Markets
            "https://economictimes.indiatimes.com/rssfeeds/13352306.cms",   // Industry
            "https://economictimes.indiatimes.com/rssfeeds/1373380680.cms", // Economy
        ],

 
    },
});