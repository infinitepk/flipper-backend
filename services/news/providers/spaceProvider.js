const createProvider = require("./createProvider");

module.exports = createProvider({
  name: "Space",

  categories: ["space"],

  rssFeeds: {
  space: [
    {
      source: "NASA",
      url: "https://www.nasa.gov/rss/dyn/breaking_news.rss",
    },
    {
      source: "SpaceNews",
      url: "https://spacenews.com/feed/",
    },
    {
      source: "Space.com",
      url: "https://www.space.com/feeds/all",
    },
    {
      source: "Universe Today",
      url: "https://www.universetoday.com/feed/",
    },
    {
      source: "Jatan Space",
      url: "https://jatan.space/feed/",
    },

     {
      source: "NASA Science",
      url: "https://science.nasa.gov/feed/",
    },
    {
      source: "NASA JPL",
      url: "https://www.jpl.nasa.gov/feeds/news/",
    },
    {
      source: "ESA",
      url: "https://www.esa.int/rssfeed/Our_Activities/Space_Engineering_Technology",
    },
    {
      source: "ESA Science",
      url: "https://sci.esa.int/newssyndication/rss/sciweb.xml",
    },
    {
      source: "JAXA",
      url: "https://global.jaxa.jp/press/rss.xml",
    },
  ],
},
});