const createProvider = require("./createProvider");

module.exports = createProvider({
    name: "Crime News",
	type: "secondary",

    categories: ["crime"],

    rssFeeds: {
        crime: [
            {
                source: "Live Hindustan Crime",
                url: "https://api.livehindustan.com/feeds/rss/crime/crime-investigation/rssfeed.xml",
            },
            {
                source: "India Crime News",
                url: "https://www.indiacrime.com/feed",
            },
            {
                source: "Navjivan India Crime",
                url: "https://www.navjivanindia.com/stories.rss?section=crime",
            },
        ],
    },
});