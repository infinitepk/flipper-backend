function buildSummary(article) {
  const excerpt = (article.excerpt || "").trim();
  const content = (article.textContent || "").trim();

  const clean = (text) =>
  text
    .replace(/\s+/g, " ")
    .replace(/\s+\./g, ".")
    .replace(/\s+,/g, ",")
    .replace(/\s+\|/g, " |")

    // Image/photo metadata
    .replace(/\bPhoto Credit\s*:\s*[^|.]+\.?/gi, "")
    .replace(/\bImage Credit\s*:\s*[^|.]+\.?/gi, "")
    .replace(/\bImage used for representational purposes only\.?/gi, "")
    .replace(/\bRepresentational (image|photo)\.?/gi, "")

    // Common byline metadata
    .replace(/\bBy\s+[A-Z][A-Za-z.\s'-]{2,80}(?=\s*[|.]|$)/g, "")

    // Remove leftover separators
    .replace(/\s*\|\s*/g, " ")

    .replace(/\s+/g, " ")
    .trim();

  const summary = clean(excerpt);
  const fullText = clean(content);

  const excerptSentences =
    summary.match(/[^.!?]+[.!?]+/g) || [];

  const contentSentences =
    fullText.match(/[^.!?]+[.!?]+/g) || [];

  const selected = [];
  const seen = new Set();

  // Start with the existing excerpt.
  for (const sentence of excerptSentences) {
    const cleanSentence = sentence.trim();

    if (!cleanSentence) continue;

    const key = cleanSentence.toLowerCase();

    if (!seen.has(key)) {
      selected.push(cleanSentence);
      seen.add(key);
    }
  }

  // Add article sentences until we have enough,
  // but keep the final summary reasonably short.
  for (const sentence of contentSentences) {
    const cleanSentence = sentence.trim();

    if (cleanSentence.length < 40) continue;

    const key = cleanSentence.toLowerCase();

    if (seen.has(key)) continue;

    const candidate = [...selected, cleanSentence].join(" ");

    // Don't exceed roughly 600 characters.
    if (candidate.length > 600) {
      break;
    }

    selected.push(cleanSentence);
    seen.add(key);

    if (selected.length >= 5) {
      break;
    }
  }

  // If we couldn't build a longer summary,
  // return whatever useful text we already have.
  if (selected.length === 0) {
    return summary;
  }

  return selected.join(" ");
}

function formatArticle(article, originalUrl, ogImage = null) {
  if (!article) return null;

  return {
    title: article.title,

    description: buildSummary(article),

    content: article.textContent,

    author: article.byline,

    source: article.siteName,

    publishedAt: article.publishedTime,

    url: originalUrl,

    image: article.image || ogImage || null,

    length: article.length,

    readingTime: Math.ceil((article.length || 0) / 1000),
  };
}


module.exports = {
  formatArticle,
};