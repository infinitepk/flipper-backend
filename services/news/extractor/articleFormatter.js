function buildSummary(article) {
  const excerpt = (article.excerpt || "").trim();
  const content = (article.textContent || "").trim();

  const clean = (text) =>
    text
      // Normalize whitespace first
      .replace(/\s+/g, " ")

      // Editorial / publication metadata
      .replace(
        /\bPublished\s*:\s*[A-Z][a-z]+\s*,?\s+[A-Z][a-z]+\s+\d{1,2},\s+\d{4},\s+\d{1,2}:\d{2}\s*(?:\[[A-Z]+\])?/gi,
        " "
      )

      .replace(
        /\bUPDATED\s*:\s*[A-Z][a-z]+\s+\d{1,2},\s+\d{4}\s+\d{1,2}:\d{2}\s*(?:IST|UTC)?/gi,
        " "
      )

      // Location immediately before UPDATED metadata
      .replace(
        /\b(?:New Delhi|Delhi|Mumbai|Chennai|Bengaluru|Bangalore|Hyderabad|Kolkata|Pune|Visakhapatnam)\s*,?\s+UPDATED\s*:/gi,
        " "
      )

      // Editor's notes
      .replace(
        /\bEditor['’]s\s+Note\s*:\s*.*?(?=\.\s+[A-Z][a-z]|\.\s*$)/gi,
        " "
      )

      // Photo / image metadata
      .replace(/\bPhoto\s+Credit\s*:\s*[^|.]+\.?/gi, " ")
      .replace(/\bImage\s+Credit\s*:\s*[^|.]+\.?/gi, " ")
      .replace(
        /\bImage\s+used\s+for\s+representational\s+purposes\s+only\.?/gi,
        " "
      )
      .replace(/\bRepresentational\s+(?:image|photo)\.?/gi, " ")

      // Common article metadata / navigation fragments
      .replace(/\bArticle\s+View\b/gi, " ")
      .replace(/\bView\s+more\s+Images\s+of\s+the\s+Day\s*:?\s*/gi, " ")
      .replace(/\bRead\s+more\b/gi, " ")

      // Common byline metadata
      .replace(
        /\bBy\s+[A-Z][A-Za-z.\s'-]{2,80}(?=\s*[|.]|$)/g,
        " "
      )

      // RSS separators
      .replace(/\s*\|\s*/g, " ")

      // Fix punctuation spacing
      .replace(/\s+\./g, ".")
      .replace(/\s+,/g, ",")
      .replace(/\s+;/g, ";")
      .replace(/\s+:/g, ":")

      // Final whitespace normalization
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

  // Prefer actual article content.
  for (const sentence of contentSentences) {
    const cleanSentence = sentence.trim();

    if (cleanSentence.length < 40) continue;

    const key = cleanSentence
      .toLowerCase()
      .replace(/\s+/g, " ");

    if (seen.has(key)) continue;

    const candidate = [...selected, cleanSentence].join(" ");

    // Flexible summary size.
    if (candidate.length > 900) break;

    selected.push(cleanSentence);
    seen.add(key);

    if (selected.length >= 5) break;
  }

  // Fallback to excerpt.
  if (selected.length < 3) {
    for (const sentence of excerptSentences) {
      const cleanSentence = sentence.trim();

      if (cleanSentence.length < 40) continue;

      const key = cleanSentence
        .toLowerCase()
        .replace(/\s+/g, " ");

      if (seen.has(key)) continue;

      selected.push(cleanSentence);
      seen.add(key);

      if (selected.length >= 5) break;
    }
  }

  // Final fallback.
  if (selected.length === 0) {
    return summary;
  }

  return selected.join(" ");
}


function formatArticle(
  article,
  originalUrl,
  ogImage = null,
  videoUrl = null
) {
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
    video: videoUrl,
    length: article.length,
    readingTime: Math.ceil((article.length || 0) / 1000),
  };
}


module.exports = {
  formatArticle,
};