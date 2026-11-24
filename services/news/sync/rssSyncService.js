const { getProviders } = require("../providerManager");

const pLimit = require("p-limit").default;

const providerLimit = pLimit(3);

const {
  classifyArticle,
} = require("../classifier/categoryClassifier");

const {
  createArticle,
  findByUrl,
} = require("../../../database/repositories/articleRepository");

const {
  shouldSkipArticle,
} = require("../filters/contentFilter");



async function syncAllProviders() {
  const providers = getProviders();

for (const provider of providers) {
  console.log(
    `[DEBUG] ${provider.name} categories:`,
    provider.categories
  );
}

  console.log(`Starting sync for ${providers.length} provider(s)...`);

  await Promise.all(
  providers.map((provider) =>
    providerLimit(async () => {
      console.log(`\n========== ${provider.name} ==========`);

      for (const category of provider.categories) {
        try {
          await syncCategory(provider, category);
        } catch (error) {
          console.error(
            `[${provider.name}] Category "${category}" failed: ${error.message}`
          );
        }
      }
    })
  )
);

console.log("\nAll providers synced successfully.");

}

async function syncCategory(provider = null, category = null) {


  console.log(`\n[${provider.name}] Syncing category: ${category}`);

  const rssArticles = await provider.getArticles(category);

  console.log(
  `[${provider.name}] Found ${rssArticles.length} RSS articles`
);

  let inserted = 0;

 for (const item of rssArticles) {
  const articleUrl = item.article_url;


const existingArticle = await findByUrl(articleUrl);


console.log("\nArticle URL:", articleUrl);


const article = {
  title: item.title,
  summary: item.summary || existingArticle?.summary || null,
  article_url: articleUrl,
  image_url: item.image_url || null,
  video_url: item.video_url || null,
  source: item.source,
  rss_category: category,
  published_at: item.publishedAt,
  status: "pending",
};


// ========================================
// ARTICLE FRESHNESS FILTER (5 DAYS)
// ========================================

if (article.published_at) {
  const publishedDate = new Date(article.published_at);

  // Reject invalid publication dates
  if (Number.isNaN(publishedDate.getTime())) {
    console.log(
      `[${provider.name}] Rejected: invalid publication date: ${article.title}`
    );
    continue;
  }

  const ageInMs = Date.now() - publishedDate.getTime();
  const fiveDaysInMs = 5 * 24 * 60 * 60 * 1000;

  // Reject articles older than 5 days
  if (ageInMs > fiveDaysInMs) {
    console.log(
      `[${provider.name}] Rejected: older than 5 days: ${article.title}`
    );
    continue;
  }

  // Reject future-dated articles
  if (ageInMs < 0) {
    console.log(
      `[${provider.name}] Rejected: future-dated article: ${article.title}`
    );
    continue;
  }
} else {
  console.log(
    `[${provider.name}] Missing publication date. Allowing fallback: ${article.title}`
  );
}


if (shouldSkipArticle(article)) {
 console.log(
  `[${provider.name}] Skipped article: ${article.title}`
);
  continue;
}

// Classify the article according to its provider type.
const isSecondaryProvider = provider.type === "secondary";

article.categories = isSecondaryProvider
  ? classifyArticle(article, { includeRssCategory: false })
  : classifyArticle(article);

// Dedicated secondary feeds must pass their category's rules.
const targetCategory = category.toLowerCase();

if (
  isSecondaryProvider &&
  !article.categories.includes(targetCategory)
) {
  console.log(
    `[${provider.name}] Rejected: article does not qualify for ${targetCategory}: ${article.title}`
  );
  continue;
}



// If the article already exists, keep its existing category.


if (existingArticle) {
  console.log(
    `[${provider.name}] Article already exists. Keeping its category:`,
    existingArticle.categories
  );

  continue;
}


console.log("\n==========================");
console.log("Title:", article.title);
console.log("RSS Category:", article.rss_category);
console.log("Flipper Categories:", article.categories);
console.log("==========================");




console.log(article);


await createArticle(article);

    inserted++;
  }

  console.log(
  `[${provider.name}] Finished. Processed ${inserted} articles.`
);
}

module.exports = {
  syncAllProviders,
  syncCategory,
};