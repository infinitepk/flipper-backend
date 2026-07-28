const { isWeatherArticle } = require("../utils/weatherArticleFilter");
const {
    findById,
    findByCategory,
} = require("../database/repositories/articleRepository");


async function getFeed(req, res) {



console.log("FEED API HIT");

    const quotas = [
    ["india", 3],
    ["world", 3],
    ["business", 2],
    ["sports", 2],
    ["scitech", 2],
    ["entertainment", 2],
];

    const categoryArticles = {};

     console.log("Connected to database...");

    // Fetch articles for each category
    for (const [category, limit] of quotas) {

        const articles = await findByCategory(category, 1, limit);

 console.log(category, articles.length);


        categoryArticles[category] = articles.filter(article => {

            if (category === "weather")  {
                return isWeatherArticle(article);
            }

            return !isWeatherArticle(article);

        });

    }

    // Build the Handpicked feed using a round-robin merge
// so every category gets a chance before repeating.

    const handpicked = [];

    let added = true;

    while (added) {

        added = false;

        for (const [category] of quotas) {

            if (
                categoryArticles[category] &&
                categoryArticles[category].length > 0
            ) {

                handpicked.push(
                    categoryArticles[category].shift()
                );

                added = true;
            }
        }
    }

console.log(
    handpicked.map(article => article.categories)
);

    res.json(handpicked);

}


async function getArticle(req, res) {
    const { id } = req.params;

    const article = await findById(id);

    if (!article) {
        return res.status(404).json({
            message: "Article not found",
        });
    }

    res.json(article);
}


module.exports = {
    getFeed,
    getArticle,
};