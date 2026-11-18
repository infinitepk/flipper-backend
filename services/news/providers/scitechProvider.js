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
            source: "Futurism",
            url: "https://futurism.com/feed",
        },
       
      
    ],
},


});
