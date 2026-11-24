const rules = require("./rules");
const natural = require("natural");

const stemmer = natural.PorterStemmer;

// Lowest article count gets highest priority.
const CATEGORY_PRIORITY = [
    "weather",       // 160
    "history",       // 331
    "crime",         // 334
    "travel",        // 439
    "nature",        // 510
    "space",         // 686
    "entertainment", // 774
    "scitech",       // 873
    "business",      // 930
    "sports",        // 1266
    "india",         // 1692
    "world",         // 1966
];

// Normalize individual words using the same stemmer.
function stemWords(text) {
    return text
        .toLowerCase()
        .match(/[a-z0-9-]+/g)
        ?.map((word) => stemmer.stem(word)) || [];
}

// Escape regex special characters.
function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function classifyArticle(article, options = {}) {
    const categories = new Set();

    // Include original RSS category by default.
    if (
        article.rss_category &&
        options.includeRssCategory !== false
    ) {
        categories.add(article.rss_category.toLowerCase().trim());
    }

    // Combine title and summary.
    const title = (article.title || "").toLowerCase();
    const summary = (article.summary || "").toLowerCase();
    const text = `${title} ${summary}`;

    // Clean text for boundary matching.
    const cleanText = text.replace(/[^a-z0-9\s-]/g, " ");

    // Stem article words.
    const words = stemWords(text);

    // Count word frequencies.
    const wordCounts = new Map();

    for (const word of words) {
        wordCounts.set(
            word,
            (wordCounts.get(word) || 0) + 1
        );
    }

    // Evaluate category rules.
    for (const [category, rule] of Object.entries(rules)) {

        // Check exclusions.
        if (rule.exclude && Array.isArray(rule.exclude)) {
            const hasExclusion = rule.exclude.some((phrase) => {
                const phraseRegex = new RegExp(
                    `\\b${escapeRegExp(phrase.toLowerCase())}\\b`,
                    "i"
                );

                return phraseRegex.test(cleanText);
            });

            if (hasExclusion) continue;
        }

        let score = 0;

        // Evaluate keywords.
        for (const [keyword, weight] of Object.entries(rule.keywords)) {

            const lowerKeyword = keyword.toLowerCase().trim();

            if (
                lowerKeyword.includes(" ") ||
                lowerKeyword.includes("-")
            ) {
                const phraseRegex = new RegExp(
                    `\\b${escapeRegExp(lowerKeyword)}\\b`,
                    "i"
                );

                if (phraseRegex.test(cleanText)) {
                    score += weight;
                }

            } else {
                const stemmedKeyword = stemmer.stem(lowerKeyword);

                const count = wordCounts.get(stemmedKeyword) || 0;

                if (count > 0) {
                    const multiplier = Math.min(count, 2);
                    score += weight * multiplier;
                }
            }
        }

        console.log(`${category}: ${score}`);

        if (score >= rule.threshold) {
            categories.add(category.toLowerCase().trim());
        }
    }

    // Select exactly ONE category using hardcoded priority.
    const matchedCategories = [...categories];

    const selectedCategory = CATEGORY_PRIORITY.find(
        (category) => matchedCategories.includes(category)
    );

    // Fallback for categories not present in the priority list.
    const finalCategory = selectedCategory || matchedCategories[0];

    console.log("Matched categories:", matchedCategories);
    console.log("Final assigned category:", finalCategory);

    return finalCategory ? [finalCategory] : [];
}

module.exports = {
    classifyArticle,
};