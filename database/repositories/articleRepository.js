const pool = require("../db");

async function createArticle(article) {
  const query = `
  INSERT INTO articles (
    title,
    summary,
    article_url,
    image_url,
    source,
    rss_category,
    categories,
    published_at
  )
  VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
  ON CONFLICT (article_url)
  DO NOTHING
  RETURNING *;
`;

  const values = [
  article.title,
  article.summary,
  article.article_url,
  article.image_url,
  article.source,
  article.rss_category,
  article.categories,
  article.published_at,
];

  const result = await pool.query(query, values);

  return result.rows[0];
}

async function findByUrl(articleUrl) {
  const query = `
    SELECT *
    FROM articles
    WHERE article_url = $1;
  `;

  const result = await pool.query(query, [articleUrl]);

  return result.rows[0];
}
async function findPending(limit = 10) {
  const query = `
    SELECT *
    FROM articles
    WHERE status = 'pending'
    ORDER BY published_at DESC
    LIMIT $1;
  `;

  const result = await pool.query(query, [limit]);

  return result.rows;
}

async function updateArticle(id, article) {
  const query = `
    UPDATE articles
    SET
      summary = $1,
      content = $2,
      image_url = $3,
      author = $4,
      reading_time = $5,
      status = $6,
      updated_at = CURRENT_TIMESTAMP
    WHERE id = $7
    RETURNING *;
  `;

  const values = [
    article.summary,
    article.content,
    article.image_url,
    article.author,
    article.reading_time,
    article.status,
    id,
  ];

  const result = await pool.query(query, values);

  return result.rows[0];
}

async function markFailed(id) {
  const query = `
    UPDATE articles
    SET
      status = 'failed',
      updated_at = CURRENT_TIMESTAMP
    WHERE id = $1
    RETURNING *;
  `;

  const result = await pool.query(query, [id]);

  return result.rows[0];
}


// ====================
// Article Queries
// ====================

async function findById(id) {
    const result = await pool.query(
        `
        SELECT
            id,
            title,
            summary,
            content,
            image_url,
            author,
            source,
            rss_category,
            categories,
            article_url,
            published_at,
            reading_time
        FROM articles
        WHERE id = $1
        AND status = 'completed'
        `,
        [id]
    );

    return result.rows[0] || null;
}


// ====================
// Feed Queries
// ====================

async function findByCategory(
    category,
    page = 1,
    limit = 20,
    excludeIds = []
) {

    const offset = (page - 1) * limit;

    console.log("excludeIds:", excludeIds);
    console.log("isArray:", Array.isArray(excludeIds));

    const result = await pool.query(
        `
        SELECT
    id,
    title,
    summary,
    image_url,
    source,
    rss_category,
     categories,
    published_at,
    reading_time
FROM articles
WHERE $1 = ANY(categories)
AND status = 'completed'
AND (
    cardinality($4::int[]) = 0
    OR NOT (id = ANY($4::int[]))
)
ORDER BY published_at DESC
LIMIT $2
OFFSET $3;
        `,
        [category, limit, offset, excludeIds]
    );

    return result.rows;
}


async function countByCategory(category) {
    const result = await pool.query(
        `
        SELECT COUNT(*) AS total
        FROM articles
        WHERE $1 = ANY(categories)
        AND status = 'completed'
        `,
        [category]
    );

    return parseInt(result.rows[0].total);
}


module.exports = {
    createArticle,
    findByUrl,
    findPending,
    updateArticle,
    markFailed,
    findById,
    findByCategory,
    countByCategory,
};