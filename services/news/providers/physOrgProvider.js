const createProvider = require("./createProvider");

module.exports = createProvider({
    name: "Phys.org",

    categories: [
        "scitech",
        "space",
        "nature",
    ],

   rssFeeds: {
    scitech: "https://phys.org/rss-feed/physics-news/",
    space: "https://phys.org/rss-feed/space-news/",
    nature: "https://phys.org/rss-feed/earth-news/",
}
});