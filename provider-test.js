const { getArticles } = require("./services/news/providers/ndtvProvider");

(async () => {
  const articles = await getArticles();

  console.log("Articles:", articles.length);
  console.log(articles[0]);
})();
