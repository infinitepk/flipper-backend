const createProvider = require("./createProvider");

module.exports = createProvider({
name: "Free Press Journal",

categories: [
    "india",
],

rssFeeds: {
    india: "https://www.freepressjournal.in/stories.rss",
},


});

