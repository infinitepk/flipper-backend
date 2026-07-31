createProvider = require("./createProvider");

module.exports = createProvider({
    name: "Nature",

    categories: [
        "nature",
    ],

    rssFeeds: {
  nature: [
  {
  source: "Mongabay",
  url: "https://news.mongabay.com/feed/",
},
{
  source: "Yale Environment 360",
  url: "https://e360.yale.edu/feed.xml",
},

{
  source: "Earth.org",
  url: "https://earth.org/feed/",
},
{
  source: "UNEP",
  url: "https://www.unep.org/rss.xml",
},
{
  source: "Carbon Brief",
  url: "https://www.carbonbrief.org/feed/",
},
{
  source: "The Hindu - Environment",
  url: "https://www.thehindu.com/sci-tech/energy-and-environment/feeder/default.rss",
},
{
  source: "Mongabay India",
  url: "https://india.mongabay.com/feed",
},
{
  source: "Greenpeace India",
  url: "https://www.greenpeace.org/india/en/feed/",
},
{
  source: "EFI",
  url: "https://efiblog.org/feed/",
},
{
  source: "Give - Environment",
  url: "https://give.do/blog/category/environment-2/feed/",
},
{
  source: "Delhi Greens",
  url: "https://delhigreens.com/feed/",
},


],
},
});
