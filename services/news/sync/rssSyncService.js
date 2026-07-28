const { getProviders } = require("../providerManager");

const pLimit = require("p-limit").default;

const providerLimit = pLimit(4);

const {
  classifyArticle,
} = require("../classifier/categoryClassifier");

const {
  createArticle,
  findByUrl,
} = require("../../../database/repositories/articleRepository");

const {
  extractImage,
} = require("../extractor/imageExtractor");

const {
  shouldSkipArticle,
} = require("../filters/contentFilter");



async function syncAllProviders() {
  const providers = getProviders();

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

if (existingArticle) {
  console.log(
    `[${provider.name}] Duplicate article skipped: ${articleUrl}`
  );
  continue;
}


console.log("\nArticle URL:", articleUrl);

     

    const imageUrl = await extractImage(item, articleUrl);

console.log("Image:", imageUrl);


    const article = {
  title: item.title,
  summary: null,
  article_url: articleUrl,
  image_url: imageUrl,
  source: item.source,
  rss_category: category,
  published_at: item.publishedAt,
};


if (shouldSkipArticle(article)) {
 console.log(
  `[${provider.name}] Skipped article: ${article.title}`
);
  continue;
}

article.categories = classifyArticle(article);


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