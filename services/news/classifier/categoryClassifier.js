const rules = require("./rules");
const natural = require("natural");

const stemmer = natural.PorterStemmer;

// Normalize individual words using the same stemmer for articles and rules.
function stemWords(text) {
    return text
        .toLowerCase()
        .match(/[a-z0-9-]+/g)
        ?.map((word) => stemmer.stem(word)) || [];
}

// Helper to escape regex special characters
function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function classifyArticle(article, options = {}) {
    const categories = new Set();

    // Always include the original RSS category.
    // Include the RSS category by default.
// Dedicated secondary feeds can disable this and rely on rule validation.
if (article.rss_category && options.includeRssCategory !== false) {
    categories.add(article.rss_category.toLowerCase());
}

    // Combine title and summary. Double title to give headline words higher natural priority.
    const title = (article.title || "").toLowerCase();
    const summary = (article.summary || "").toLowerCase();
    const text = `${title} ${summary}`;

    // Negative check string (clean boundary check)
    const cleanText = text.replace(/[^a-z0-9\s-]/g, " ");

    // Stem tokens for exact single-word lookups
    const words = stemWords(text);
    
    // Count stemmed word frequencies to reward genuine thematic density without spam
    const wordCounts = new Map();
    for (const w of words) {
        wordCounts.set(w, (wordCounts.get(w) || 0) + 1);
    }

    for (const [category, rule] of Object.entries(rules)) {
        // 1. Check exclusions (e.g., "hardik pandya" for history, "movie shooting" for crime)
        if (rule.exclude && Array.isArray(rule.exclude)) {
            const hasExclusion = rule.exclude.some((phrase) => {
                const phraseRegex = new RegExp(`\\b${escapeRegExp(phrase.toLowerCase())}\\b`, "i");
                return phraseRegex.test(cleanText);
            });
            if (hasExclusion) continue;
        }

        let score = 0;

        // 2. Evaluate keywords
        for (const [keyword, weight] of Object.entries(rule.keywords)) {
            const lowerKeyword = keyword.toLowerCase().trim();

            if (lowerKeyword.includes(" ") || lowerKeyword.includes("-")) {
                // Multi-word phrase matching with word boundaries
                const phraseRegex = new RegExp(`\\b${escapeRegExp(lowerKeyword)}\\b`, "i");
                if (phraseRegex.test(cleanText)) {
                    score += weight;
                }
            } else {
                // Stem the keyword exactly as we stem article words
                const stemmedKeyword = stemmer.stem(lowerKeyword);
                const count = wordCounts.get(stemmedKeyword) || 0;
                
                if (count > 0) {
                    // Cap repetitive keyword count at 2x max to prevent false-positive runaway
                    const multiplier = Math.min(count, 2);
                    score += weight * multiplier;
                }
            }
        }

        // Keep temporary debugging while testing
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