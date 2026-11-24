const BLOCKED_KEYWORDS = [
  "lottery",
  "winning numbers",
  "jackpot",
  "dear lottery",
  "kerala lottery",
  "sikkim lottery",
  "nagaland lottery",

  "horoscope",
  "astrology",
  "zodiac",
  "numerology",
  "lucky number",
  "Baby names",

  "dream11",
  "fantasy cricket",
  "fantasy football",

  "photo gallery",
  "photos:",
  "in pics",
  "picture gallery",

  "live blog",
  "live updates",
  "quiz",
];

function isEnglishArticle(article) {
  const title = (article.title || "").trim();
  const summary = (article.summary || "").trim();

  if (!title) {
    return false;
  }

  // Reject Hindi text written in Devanagari.
  const hasDevanagari = (text) => /[\u0900-\u097F]/.test(text);

  if (hasDevanagari(title) || hasDevanagari(summary)) {
    return false;
  }

  // Do not use aggressive language detection.
  // RSS providers are responsible for supplying English-language feeds.

  return true;
}

function shouldSkipArticle(article) {
  const text = `${article.title || ""} ${article.summary || ""}`.toLowerCase();

  // Reject non-English content.
  if (!isEnglishArticle(article)) {
    return true;
  }

  // Preserve existing content filters.
  return BLOCKED_KEYWORDS.some((keyword) => text.includes(keyword));
}

module.exports = {
  shouldSkipArticle,
  isEnglishArticle,
};