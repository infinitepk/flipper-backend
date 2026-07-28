const createProvider = require("./createProvider");

module.exports = createProvider({
    name: "ScienceDaily",

    categories: [
        "scitech",
        "nature",
        "space",
    ],

    rssFeeds: {
        scitech: "https://www.sciencedaily.com/rss/top/technology.xml",
        nature: "https://www.sciencedaily.com/rss/top/environment.xml",
        space: "https://www.sciencedaily.com/rss/top/science.xml",
    },
});
