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


function shouldSkipArticle(article) {
    const text = `${article.title || ""} ${article.summary || ""}`.toLowerCase();

    return BLOCKED_KEYWORDS.some(keyword =>
        text.includes(keyword)
    );
}

module.exports = {
    shouldSkipArticle,
};