const createProvider = require("./createProvider");

module.exports = createProvider({
  name: "New Scientist",

  userAgent: "curl/8.0",

  categories: [
    "scitech",
    "space",
  ],

  rssFeeds: {
    "sci-tech": [
      {
        source: "New Scientist",
        url: "https://www.newscientist.com/feed/",
      },
    ],

    "space": [
      {
        source: "New Scientist",
        url: "https://www.newscientist.com/subject/space/feed/",
      },
    ],
  },
});
