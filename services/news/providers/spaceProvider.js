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
      source: "ESA",
      url: "https://www.esa.int/rssfeed/Our_Activities/Space_Engineering_Technology",
    },

    {
  source: "NASA CNEOS",
  url: "https://cneos.jpl.nasa.gov/feed/news.xml",
},
    {
  source: "NASA Technology",
  url: "https://www.nasa.gov/news-release/feed/"
},

{
  source: "Spaceflight",
  url: "https://spaceflightnow.com/feed/"
},

 {
  source: "Planetary Society",
  url: "https://www.planetary.org/rss/articles"
},

{
  source: "EarthSky",
  url: "https://earthsky.org/feed/"
},

  
   
  ],
},
});