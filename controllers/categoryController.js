const {
    findByCategory,
    countByCategory,
} = require("../database/repositories/articleRepository");
const { isWeatherArticle } = require("../utils/weatherArticleFilter");

async function getCategory(req, res) {

console.log("Category requested:", req.params.name);
    const category = req.params.name.toLowerCase();

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;

const excludeIds = req.query.exclude
    ? req.query.exclude.split(",").map(Number)
    : [];

    let articles = await findByCategory(
    category,
    page,
    limit,
    excludeIds
);
const total = await countByCategory(category);
const hasMore = page * limit < total;

    if (category === "weather") {
        articles = articles.filter(article => isWeatherArticle(article));
    } else {
        articles = articles.filter(article => !isWeatherArticle(article));
    }

console.log("Articles found:", articles.length);
console.log("First article:", articles[0]);

    res.json({
    page,
    limit,
    total,
    hasMore,
    articles,
});
}

module.exports = {
    getCategory,
};