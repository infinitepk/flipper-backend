const createProvider = require("./createProvider");

module.exports = createProvider({
name: "Sci-Tech",


categories: [
    "sci-tech",
],

rssFeeds: {
    "sci-tech": [
        {
            source: "Popular Science",
            url: "https://www.popsci.com/feed/",
        },
        {
            source: "New Scientist",
            url: "https://www.newscientist.com/feed/",
        },
        {
            source: "Futurism",
            url: "https://futurism.com/feed",
        },
        {
            source: "IFLScience",
            url: "https://www.iflscience.com/rss",
        },
        {
            source: "Inside Science",
            url: "https://www.insidescience.org/rss.xml",
        },
    ],
},


});
