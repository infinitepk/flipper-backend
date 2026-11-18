const createProvider = require("./createProvider");

module.exports = createProvider({
name: "Zee News",

categories: [
"business",
"india",
"world",
"sci-tech",
"sports",
],

rssFeeds: {
"business": [
{
source: "Zee News",
url: "https://zeenews.india.com/rss/business.xml",
},
],


"india": [
  {
    source: "Zee News",
    url: "https://zeenews.india.com/rss/india-national-news.xml",
  },
],

"world": [
  {
    source: "Zee News",
    url: "https://zeenews.india.com/rss/world-news.xml",
  },
],

"sci-tech": [
  {
    source: "Zee News",
    url: "https://zeenews.india.com/rss/technology-news.xml",
  },
],

"sports": [
  {
    source: "Zee News",
    url: "https://zeenews.india.com/rss/sports-news.xml",
  },
],


},
});
