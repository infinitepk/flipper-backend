const rules = require("./rules");

function classifyArticle(article) {
    const categories = new Set();

    // Always include the RSS category
    if (article.rss_category) {
        categories.add(article.rss_category.toLowerCase());
    }

    // Combine title and summary
const text = `${article.title || ""} ${article.summary || ""}`.toLowerCase();

const words = text
    .split(/[^a-z0-9-]+/)
    .filter(Boolean);

for (const [category, rule] of Object.entries(rules)) {

    let score = 0;

    for (const [keyword, weight] of Object.entries(rule.keywords)) {

        const lowerKeyword = keyword.toLowerCase();

        let matched = false;

        if (lowerKeyword.includes(" ")) {
            matched = text.includes(lowerKeyword);
        } else {
            matched = words.includes(lowerKeyword);
        }

        if (matched) {
            score += weight;
        }
    }

 // 👇 TEMPORARY DEBUG
    console.log(`${category}: ${score}`);

    if (score >= rule.threshold) {
        categories.add(category);
    }
}

    return [...categories];
}

module.exports = {
    classifyArticle,
};