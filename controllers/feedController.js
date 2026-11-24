
const {
    findById,
    findByCategory,
    countByCategory,
    searchByHeadline,
} = require("../database/repositories/articleRepository");


async function getFeed(req, res) {



console.log("FEED API HIT");


const excludeIds = req.query.exclude
    ? req.query.exclude.split(",").map(Number)
    : [];

    const categories = [
    "india",
    "world",
    "business",
    "sports",
    "scitech",
    "entertainment",
];

const batchSize = 30;

    const categoryArticles = {};

     console.log("Connected to database...");

    // Fetch articles for each category
    for (const category of categories) {

        const articles = await findByCategory(
    category,
    1,
    batchSize,
    excludeIds
);

 console.log(category, articles.length);


       categoryArticles[category] = articles;

    }

    // Build the Handpicked feed using a round-robin merge
// so every category gets a chance before repeating.

    const handpicked = [];

    let added = true;

    while (added && handpicked.length < batchSize) {

        added = false;

        for (const category of categories) {

            if (
                categoryArticles[category] &&
                categoryArticles[category].length > 0
            ) {

                const article = categoryArticles[category].shift();

             if (!handpicked.some(item => item.id === article.id)) {
              handpicked.push(article);
                  }

                added = true;
            }
        }
    }

console.log(
    handpicked.map(article => article.categories)
);

    const returnedIds = handpicked.map(article => article.id);

const remainingCounts = await Promise.all(
    categories.map(category =>
        countByCategory(category, [
            ...excludeIds,
            ...returnedIds,
        ])
    )
);

const hasMore = remainingCounts.some(count => count > 0);

res.json({
    articles: handpicked,
    hasMore,
});

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

async function searchArticles(req, res) {
    try {
        const keyword = (req.query.q || "").trim();

        if (!keyword) {
            return res.status(400).json({
                message: "Search keyword is required",
            });
        }

        const articles = await searchByHeadline(keyword);

        return res.json({
            articles,
        });

    } catch (error) {
        console.error("Search API error:", error);

        return res.status(500).json({
            message: "Failed to search articles",
        });
    }
}


module.exports = {
    getFeed,
    getArticle,
	searchArticles,
};