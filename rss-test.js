const { getGoogleNews } = require("./services/news/rss/googleNewsService");

async function test() {
  try {
    const articles = await getGoogleNews("scitech");

    console.log(`Found ${articles.length} articles\n`);

    articles.forEach((article, index) => {
      console.log(`${index + 1}. ${article.title}`);
      console.log(article.link);
      console.log("---------------------------");
    });


  } catch (error) {
    console.error(error);
  }
}

test();