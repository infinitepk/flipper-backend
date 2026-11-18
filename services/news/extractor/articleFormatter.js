/**
 * Production Article Formatter & News Summarizer
 */

// Common abbreviations to avoid incorrect sentence splitting
const ABBREVIATIONS = new Set([
  "mr", "mrs", "ms", "dr", "prof", "sr", "jr", "vs", "st", "inc", "ltd", "co",
  "corp", "jan", "feb", "mar", "apr", "jun", "jul", "aug", "sep", "sept", "oct",
  "nov", "dec", "gov", "sen", "rep", "vol", "dept", "e.g", "i.e", "approx",
  "u.s", "u.k", "e.u", "a.m", "p.m", "ist", "utc", "est", "pst"
]);

function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * Decodes standard HTML entities before text processing
 */
function decodeHTMLEntities(text = "") {
  return text
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/&nbsp;/gi, " ");
}

/**
 * Calculates token-level Jaccard similarity
 * to catch near-duplicate sentences.
 */
function isSimilar(str1, str2, threshold = 0.70) {
  const wordsA = str1.toLowerCase().match(/\w+/g) || [];
  const wordsB = str2.toLowerCase().match(/\w+/g) || [];

  const setA = new Set(wordsA);
  const setB = new Set(wordsB);

  if (!setA.size || !setB.size) return false;

  const intersection = new Set(
    [...setA].filter((word) => setB.has(word))
  );

  const union = new Set([
    ...setA,
    ...setB
  ]);

  return intersection.size / union.size >= threshold;
}

/**
 * Strips leading publication metadata,
 * full datelines, and timestamps.
 */
function stripTimeAndDatePrefix(text = "") {
  let cleaned = text.trim();

  // 1. Remove full dateline header:
  // "Friday, September 4, 2026, 10:19 "
  cleaned = cleaned.replace(
    /^\s*(?:(?:Mon|Tues|Wednes|Thurs|Fri|Satur|Sun)day|Mon|Tue|Wed|Thu|Fri|Sat|Sun)?,?\s*(?:Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:tember)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?)\s+\d{1,2},?\s+\d{4},?\s*\d{1,2}:\d{2}(?::\d{2})?\s*(?:AM|PM|IST|UTC|EST|PST|GMT)?\s*/i,
    ""
  );

  // 2. Remove reverse dateline header:
  // "10:19 Friday, September 4, 2026 "
  cleaned = cleaned.replace(
    /^\s*\b\d{1,2}:\d{2}(?::\d{2})?\s*(?:AM|PM|IST|UTC|EST|PST|GMT)?\s*,?\s*(?:(?:Mon|Tues|Wednes|Thurs|Fri|Satur|Sun)day|Mon|Tue|Wed|Thu|Fri|Sat|Sun)?,?\s*(?:Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:tember)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?)\s+\d{1,2},?\s+\d{4}\s*/i,
    ""
  );

  // 3. Remove standalone leading time:
  // "23:06 "
  // "10:19 "
  // "05:30 PM: "
  cleaned = cleaned.replace(
    /^\s*(?:[A-Za-z]+,?\s+)?(?:[\s,:-]*)\b\d{1,2}:\d{2}(?::\d{2})?\s*(?:AM|PM|IST|UTC|EST|PST|GMT)?\b\s*[:|-–—]?\s*/i,
    ""
  );

  // 4. Remove leading metadata prefixes:
  // "UPDATED:"
  // "PUBLISHED:"
  cleaned = cleaned.replace(
    /^\s*(?:PUBLISHED|UPDATED)\s*:\s*/i,
    ""
  );

  return cleaned;
}

/**
 * Cleans extracted text by stripping timestamps,
 * datelines, bylines, and noise.
 */
function cleanText(text = "", byline = "") {
  let result = decodeHTMLEntities(text).trim();

  if (!result) return "";

  // 1. Normalize linebreaks and whitespace
  result = result
    .replace(/[\r\n\t]+/g, " ")
    .replace(/\s+/g, " ");

  // 2. Normalize spaces accidentally inserted inside
  // decimal numbers.
  //
  // Examples:
  // "27. 07"        -> "27.07"
  // "₹27. 07"       -> "₹27.07"
  // "Rs 101. 10"    -> "Rs 101.10"
  // "138. 75 crore" -> "138.75 crore"
  result = result.replace(
    /(\d+)\.\s+(\d+)/g,
    "$1.$2"
  );

  // 3. Remove dynamic extracted byline from start
  if (byline && byline.trim()) {
    const escapedByline = escapeRegExp(byline.trim());

    result = result.replace(
      new RegExp(
        `^\\s*(?:By|Written by|Reported by)?\\s*${escapedByline}\\s*[:|-]?\\s*`,
        "i"
      ),
      ""
    );
  }

  // 4. Remove generic leading byline patterns
  result = result.replace(
    /^\s*(?:By|Written\s+by|Reported\s+by|Reporting\s+by)\s+[A-Z][A-Za-zÀ-ÿ.'’-]*(?:\s+[A-Z][A-Za-zÀ-ÿ.'’-]*){0,8}\s*(?=[A-Z"“‘])/,
    ""
  );

  // 5. Strip leading timestamp/dateline prefixes
  result = stripTimeAndDatePrefix(result);

  // 6. Remove standalone timezone markers in brackets
  result = result.replace(
    /\[\s*(?:IST|UTC|EST|PST|GMT)\s*\]/gi,
    " "
  );

  // 7. Remove news location datelines
  // Examples:
  // "KARNAL:"
  // "NEW DELHI —"
  // "WASHINGTON (AP) -"
  result = result.replace(
    /^\s*(?:[A-Z\s]{2,25})\s*(?:\([A-Z\s]+\))?\s*[-–—:]\s*/,
    ""
  );

  // 8. Remove editor notes, photo credits,
  // and copyright markers
  result = result.replace(
    /\bEditor['’]s\s+Note\s*:\s*.*?(?=\.\s+[A-Z]|\.\s*$)/gi,
    " "
  );

  result = result.replace(
    /\b(?:Photo|Image|Picture)\s*(?:Credit|Courtesy|Source)\s*:\s*[^|.]+\.?/gi,
    " "
  );

  result = result.replace(
    /\b(?:Getty\s+Images?|Reuters|AP\s+Photo|Associated\s+Press)(?:\s*\/\s*[^|.]+)?/gi,
    " "
  );

  result = result.replace(
    /©\s*(?:Getty\s+Images?|Reuters|AP|Associated\s+Press)[^|.]*/gi,
    " "
  );

  result = result.replace(
    /\b(?:Representational\s+image|Image\s+used\s+for\s+representational\s+purposes\s+only)\.?/gi,
    " "
  );

  // 9. Strip website navigation clutter
  result = result.replace(
    /\b(?:Article\s+View|View\s+more\s+Images\s+of\s+the\s+Day|Read\s+more|Click\s+here|Subscribe\s+now|Follow\s+us)\b:?/gi,
    " "
  );

  result = result.replace(
    /\s*\|\s*/g,
    " "
  );

  // 10. Clean dangling/incomplete currency tails
  // Do NOT invent missing units or words.
  result = result.replace(
    /\s*(?:Rs\.?|₹|INR|USD|\$)\s*\d+\s*\.\s*$/gi,
    "."
  );

  // 11. Clean residual leading punctuation artifacts
  result = result.replace(
    /^[\s,;:\-–—]+/,
    ""
  );

  // 12. Fix spacing around punctuation
  result = result.replace(
    /\s+([.,;:!?])/g,
    "$1"
  );

  return result
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Splits text into sentences safely.
 *
 * Important:
 * A decimal such as:
 * "27.07 crore"
 *
 * must NOT become:
 * "27."
 * "07 crore"
 */
function getSentences(text) {
  if (!text) return [];

  const rawSegments = text.split(
    /(?<=[!?])\s+(?=[A-Z0-9"“'‘])|(?<=\.)\s+(?=[A-Z"“'‘])/g
  );

  const sentences = [];

  for (let i = 0; i < rawSegments.length; i++) {
    const segment = rawSegments[i].trim();

    if (!segment) continue;

    const words = segment.split(/\s+/);

    const lastWord = words[words.length - 1]
      .replace(/[^\w.]/g, "")
      .toLowerCase();

    const cleanLastWord = lastWord.replace(
      /\.$/,
      ""
    );

    // Check known abbreviations
    if (
      ABBREVIATIONS.has(cleanLastWord) &&
      i < rawSegments.length - 1
    ) {
      rawSegments[i + 1] =
        segment + " " + rawSegments[i + 1];
    } else {
      sentences.push(segment);
    }
  }

  return sentences;
}

/**
 * Rejects low-quality, incomplete,
 * or truncated sentences.
 */
function isLowQualitySentence(sentence) {
  const text = sentence.trim();

  // Length limits
  if (text.length < 35 || text.length > 400) {
    return true;
  }

  // Metadata / image credits
  if (
    /\b(?:Getty\s+Images?|Photo\s+Credit|Image\s+Credit|Photo\s+Courtesy|Image\s+Courtesy)\b/i.test(
      text
    )
  ) {
    return true;
  }

  // Navigation
  if (
    /^(?:Read\s+more|Article\s+View|View\s+more|Click\s+here|Subscribe\s+now|Follow\s+us)\b/i.test(
      text
    )
  ) {
    return true;
  }

  // Reject truncated currency values.
  //
  // Examples:
  // "The film earned ₹190."
  // "Revenue reached Rs 27."
  //
  // We reject the sentence instead of guessing
  // what the missing unit/value was.
  if (
    /(?:Rs\.?|₹|INR|USD|\$)\s*\d+(?:\.\d*)?\s*\.$/i.test(
      text
    )
  ) {
    return true;
  }

  // Reject dangling prepositions/conjunctions
  if (
    /\b(?:to|from|at|by|of|and|or|but|because|while|although|with|without)\.$/i.test(
      text
    )
  ) {
    return true;
  }

  return false;
}

/**
 * Constructs a clean news summary
 * selecting up to maxSentences.
 *
 * Default: 11 complete sentences.
 */
function buildSummary(article, maxSentences = 11) {
  if (!article) return "";

  const cleanExcerpt = cleanText(
    article.excerpt || "",
    article.byline || ""
  );

  const cleanContent = cleanText(
    article.textContent || "",
    article.byline || ""
  );

  const contentSentences =
    getSentences(cleanContent);

  const excerptSentences =
    getSentences(cleanExcerpt);

  const selected = [];

  function addSentence(sentence) {
    const cleanSentence =
      stripTimeAndDatePrefix(sentence.trim());

    if (!cleanSentence) return;

    if (isLowQualitySentence(cleanSentence)) {
      return;
    }

    // Exact duplicate check
    const exactDuplicate = selected.some(
      (existing) =>
        existing
          .toLowerCase()
          .replace(/\s+/g, " ") ===
        cleanSentence
          .toLowerCase()
          .replace(/\s+/g, " ")
    );

    if (exactDuplicate) {
      return;
    }

    // Fuzzy duplicate check
    const fuzzyDuplicate = selected.some(
      (existing) =>
        isSimilar(existing, cleanSentence)
    );

    if (fuzzyDuplicate) {
      return;
    }

    selected.push(cleanSentence);
  }

  // First priority: primary article content
  for (const sentence of contentSentences) {
    if (selected.length >= maxSentences) {
      break;
    }

    addSentence(sentence);
  }

  // Second priority: RSS excerpt
  if (selected.length < 10) {
    for (const sentence of excerptSentences) {
      if (selected.length >= maxSentences) {
        break;
      }

      addSentence(sentence);
    }
  }

  // If nothing survived, return cleaned excerpt
  if (selected.length === 0) {
    return cleanExcerpt;
  }

  return selected.join(" ");
}

/**
 * Main module function.
 */
function formatArticle(
  article,
  originalUrl,
  ogImage = null,
  videoUrl = null
) {
  if (!article) return null;

  const content = article.textContent
    ? cleanText(
        article.textContent,
        article.byline
      )
    : "";

  const wordCount = content
    ? content.split(/\s+/).length
    : 0;

  const readingTime = Math.max(
    1,
    Math.ceil(wordCount / 200)
  );

  return {
    title: article.title
      ? decodeHTMLEntities(article.title.trim())
      : "",

    description: buildSummary(
      article,
      11
    ),

    content,

    author: article.byline
      ? decodeHTMLEntities(article.byline.trim())
      : null,

    source: article.siteName || null,

    publishedAt:
      article.publishedTime || null,

    url: originalUrl || null,

    image:
      article.image ||
      ogImage ||
      null,

    video:
      videoUrl ||
      null,

    wordCount,

    readingTimeMinutes: readingTime
  };
}

module.exports = {
  formatArticle,
  buildSummary,
  cleanText
};