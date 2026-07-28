const { getGoogleNews } = require("./services/news/rss/googleNewsService");

async function test() {
  const articles = await getGoogleNews("scitech");

  console.log(articles[0]);
}

test();