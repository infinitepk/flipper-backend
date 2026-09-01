const createProvider = require("./createProvider");

module.exports = createProvider({
  name: "Times of India",

  categories: [
    "india",
    "world",
    "business",
    "sports",
    "entertainment",
    "scitech",
  ],

  rssFeeds: {
    india: [
      // National News
      {
        source: "TOI India National News",
        url: "https://timesofindia.indiatimes.com/rssfeeds/-2128936835.cms",
      },
      // Metro Cities
      {
        source: "TOI Mumbai",
        url: "https://timesofindia.indiatimes.com/rssfeeds/-2128838597.cms",
      },
      {
        source: "TOI Delhi",
        url: "https://timesofindia.indiatimes.com/rssfeeds/-2128839596.cms",
      },
      {
        source: "TOI Bengaluru",
        url: "https://timesofindia.indiatimes.com/rssfeeds/-2128833038.cms",
      },
      {
        source: "TOI Hyderabad",
        url: "https://timesofindia.indiatimes.com/rssfeeds/-2128816011.cms",
      },
      {
        source: "TOI Chennai",
        url: "https://timesofindia.indiatimes.com/rssfeeds/2950623.cms",
      },
      {
        source: "TOI Kolkata",
        url: "https://timesofindia.indiatimes.com/rssfeeds/-2128838586.cms",
      },
    ],

    world: [
      {
        source: "TOI World News",
        url: "https://timesofindia.indiatimes.com/rssfeeds/296589292.cms",
      },
      {
        source: "TOI NRI News",
        url: "https://timesofindia.indiatimes.com/rssfeeds/7098551.cms",
      },
      {
        source: "TOI Top Stories",
        url: "https://timesofindia.indiatimes.com/rssfeedstopstories.cms",
      },
    ],

    business: [
      {
        source: "TOI Business Main",
        url: "https://timesofindia.indiatimes.com/rssfeeds/1898055.cms",
      },
      {
        source: "TOI India Business",
        url: "https://timesofindia.indiatimes.com/rssfeeds/2147477994.cms",
      },
    ],

    sports: [
      {
        source: "TOI Cricket",
        url: "https://timesofindia.indiatimes.com/rssfeeds/4719148.cms",
      },
      {
        source: "TOI Football",
        url: "https://timesofindia.indiatimes.com/rssfeeds/4719161.cms",
      },
      {
        source: "TOI Tennis",
        url: "https://timesofindia.indiatimes.com/rssfeeds/4719210.cms",
      },
      {
        source: "TOI Hockey",
        url: "https://timesofindia.indiatimes.com/rssfeeds/4719176.cms",
      },
      {
        source: "TOI Other Sports",
        url: "https://timesofindia.indiatimes.com/rssfeeds/54829575.cms",
      },
    ],

    entertainment: [
      {
        source: "TOI Entertainment",
        url: "https://timesofindia.indiatimes.com/rssfeeds/1081479906.cms",
      },
      {
        source: "TOI Bollywood",
        url: "https://timesofindia.indiatimes.com/rssfeeds/2886704.cms",
      },
    ],

    scitech: [
      {
        source: "TOI Technology",
        url: "https://timesofindia.indiatimes.com/rssfeeds/66949542.cms",
      },
      {
        source: "TOI Science & Environment",
        url: "https://timesofindia.indiatimes.com/rssfeeds/-2128672765.cms",
      },
      {
        source: "TOI Infotech",
        url: "https://timesofindia.indiatimes.com/rssfeeds/5880659.cms",
      },
    ],
  },
});