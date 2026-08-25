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

  // Prefer the actual article content.
  for (const sentence of contentSentences) {
    const cleanSentence = sentence.trim();

    if (cleanSentence.length < 40) continue;

    const key = cleanSentence.toLowerCase();

    if (seen.has(key)) continue;

    const candidate = [...selected, cleanSentence].join(" ");

    // Keep the summary reasonably sized.
    if (candidate.length > 900) {
      break;
    }

    selected.push(cleanSentence);
    seen.add(key);

    if (selected.length >= 5) {
      break;
    }
  }

  // Use the original excerpt only if the article content
  // did not provide enough useful sentences.
  if (selected.length < 3) {
    for (const sentence of excerptSentences) {
      const cleanSentence = sentence.trim();

      if (!cleanSentence) continue;

      const key = cleanSentence.toLowerCase();

      if (seen.has(key)) continue;

      selected.push(cleanSentence);
      seen.add(key);

      if (selected.length >= 5) {
        break;
      }
    }
  }

  // Final fallback.
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