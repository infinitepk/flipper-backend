
const LanguageDetect = require("languagedetect");

const lngDetector = new LanguageDetect();

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

  const hasDevanagari = (text) => /[\u0900-\u097F]/.test(text);

  // Reject titles containing Hindi text.
  if (hasDevanagari(title)) {
    return false;
  }

  // Reject titles that are clearly non-English.
  if (title.length >= 30) {
    const titleLanguage = lngDetector.detect(title, 1);

    if (
      titleLanguage.length > 0 &&
      titleLanguage[0][0] !== "english"
    ) {
      return false;
    }
  }

  // Check the RSS description independently.
  if (summary.length >= 30) {
    if (hasDevanagari(summary)) {
      return false;
    }

    const summaryLanguage = lngDetector.detect(summary, 1);

    if (
      summaryLanguage.length > 0 &&
      summaryLanguage[0][0] !== "english"
    ) {
      return false;
    }
  }

  // Require enough text to make a reasonable language decision.
  if (title.length < 30 && summary.length < 30) {
    return false;
  }

  return true;
}

function shouldSkipArticle(article) {
  const text = `${article.title || ""} ${article.summary || ""}`.toLowerCase();

  // Reject non-English articles.
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

