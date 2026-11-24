const pool = require("../db");

async function createArticle(article) {
  const query = `
    INSERT INTO articles (
      title,
      summary,
      content,
      article_url,
      image_url,
      video_url,
      source,
      rss_category,
      categories,
      published_at,
      status
    )
    VALUES (
      $1, $2, $3, $4, $5,
      $6, $7, $8, $9, $10, $11
    )
    RETURNING *;
  `;

  const values = [
    article.title,
    article.summary,
    article.content || null,
    article.article_url,
    article.image_url,
    article.video_url || null,
    article.source,
    article.rss_category,
    article.categories,
    article.published_at,
    article.status,
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


async function findRecentPending() {
  const query = `
    WITH recent_dated AS (
      SELECT *
      FROM articles
      WHERE status = 'pending'
        AND published_at IS NOT NULL
        AND published_at >= timezone('UTC', NOW()) - INTERVAL '5 days'
AND published_at <= timezone('UTC', NOW())
    ),

    undated AS (
      SELECT *
      FROM articles
      WHERE status = 'pending'
        AND published_at IS NULL
      ORDER BY created_at DESC
      LIMIT 25
    )

    SELECT *
    FROM recent_dated

    UNION ALL

    SELECT *
    FROM undated

    ORDER BY published_at DESC NULLS LAST, created_at DESC;
  `;

  const result = await pool.query(query);

  return result.rows;
}

async function updateArticle(id, article) {
  const query = `
    UPDATE articles
    SET
      summary = $1,
      content = $2,
      image_url = $3,
      video_url = $4,
      author = $5,
      reading_time = $6,
      status = $7,
      updated_at = (timezone('UTC', NOW()))
    WHERE id = $8
    RETURNING *;
  `;

  const values = [
    article.summary,
    article.content,
    article.image_url,
    article.video_url,
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
      updated_at = timezone('UTC', NOW())
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
            video_url,
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
    article_url,
    image_url,
    video_url,
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


async function countByCategory(category, excludeIds = []) {
    const result = await pool.query(
        `
        SELECT COUNT(*) 
        FROM articles
        WHERE $1 = ANY(categories)
        AND status = 'completed'
        AND (
            cardinality($2::int[]) = 0
            OR NOT (id = ANY($2::int[]))
        )
        `,
        [category, excludeIds]
    );

    return parseInt(result.rows[0].count, 10);
}

async function searchByHeadline(keyword) {
    const result = await pool.query(
        `
        SELECT
            id,
            title,
            summary,
            article_url,
            image_url,
            video_url,
            source,
            categories,
            published_at,
            reading_time
        FROM articles
        WHERE status = 'completed'
        AND title ILIKE '%' || $1 || '%'
        ORDER BY published_at DESC
        LIMIT 50;
        `,
        [keyword]
    );

    return result.rows;
}

// ====================
// Popular Stories
// ====================

async function getPopularStories(limit = 20) {
    const result = await pool.query(
        `
        SELECT
            a.id,
            a.title,
            a.summary,
            a.article_url,
            a.image_url,
            a.video_url,
            a.source,
            a.categories,
            a.published_at,
            a.reading_time,

            COALESCE(r.likes, 0)::int AS likes,
            COALESCE(c.comment_count, 0)::int AS comment_count,

            (
                (
                    COALESCE(r.likes, 0) * 2 +
                    COALESCE(c.comment_count, 0) * 3
                )::numeric
                /
                (
                    1 + GREATEST(
                        EXTRACT(EPOCH FROM (
                            NOW() - COALESCE(a.published_at, NOW())
                        )) / 3600,
                        0
                    ) / 24
                )
            ) AS popularity_score

        FROM articles a

        LEFT JOIN (
            SELECT
                article_id,
                COUNT(*) FILTER (
                    WHERE reaction = 'like'
                ) AS likes
            FROM article_reactions
            GROUP BY article_id
        ) r ON r.article_id = a.id

        LEFT JOIN (
            SELECT
                article_id,
                COUNT(*) AS comment_count
            FROM comments
            GROUP BY article_id
        ) c ON c.article_id = a.id

        WHERE a.status = 'completed'

        ORDER BY popularity_score DESC, a.published_at DESC

        LIMIT $1;
        `,
        [limit]
    );

    return result.rows;
}

// ====================
// Trending Topics
// ====================

// ====================
// Trending Topics
// ====================

async function getTrendingTopics(limit = 10) {
    const result = await pool.query(
        `
        WITH recent_articles AS (
            SELECT id, title, published_at
            FROM articles
            WHERE status = 'completed'
            AND published_at >= NOW() - INTERVAL '48 hours'
            AND published_at <= NOW()
        ),

        words AS (
            SELECT
                a.id AS article_id,
                a.published_at,
                LOWER(w.word) AS word,
                w.position
            FROM recent_articles a
            CROSS JOIN LATERAL regexp_split_to_table(
                a.title,
                '[^[:alnum:]]+'
            ) WITH ORDINALITY AS w(word, position)
        ),

        word_pairs AS (
            SELECT
                article_id,
                published_at,
                word,
                LEAD(word) OVER (
                    PARTITION BY article_id
                    ORDER BY position
                ) AS next_word
            FROM words
        ),

        phrases AS (
            SELECT
                word || ' ' || next_word AS topic,
                article_id,
                published_at
            FROM word_pairs
            WHERE next_word IS NOT NULL

            AND LENGTH(word) >= 3
            AND LENGTH(next_word) >= 3

            AND word ~ '[a-z]'
            AND next_word ~ '[a-z]'

            AND word NOT IN (
                'the', 'and', 'for', 'with', 'from',
                'this', 'that', 'have', 'been', 'will',
                'after', 'before', 'over', 'under', 'into',
                'about', 'their', 'they', 'them', 'what',
                'when', 'where', 'which', 'while', 'also',
                'more', 'than', 'says', 'said', 'amid',
                'here', 'against', 'latest', 'breaking',
                'update', 'updates', 'news', 'report',
                'reports', 'today', 'live'
            )

            AND next_word NOT IN (
                'the', 'and', 'for', 'with', 'from',
                'this', 'that', 'have', 'been', 'will',
                'after', 'before', 'over', 'under', 'into',
                'about', 'their', 'they', 'them', 'what',
                'when', 'where', 'which', 'while', 'also',
                'more', 'than', 'says', 'said', 'amid',
                'here', 'against', 'latest', 'breaking',
                'update', 'updates', 'news', 'report',
                'reports', 'today', 'live'
            )
		
        )

        SELECT
            topic,
            COUNT(DISTINCT article_id)::int AS article_count,
            MAX(published_at) AS latest_article_at

        FROM phrases

GROUP BY topic

HAVING COUNT(DISTINCT article_id) >= 2

AND topic NOT IN (
    'price history',
    'stock price',
    'share price',
    'price highlights',
    'year old'
)

        ORDER BY
            article_count DESC,
            latest_article_at DESC

        LIMIT $1;
        `,
        [limit]
    );

    return result.rows;
}


module.exports = {
    createArticle,
    findByUrl,

    findRecentPending,
    updateArticle,
    markFailed,
    findById,
    findByCategory,
    countByCategory,
	searchByHeadline,
	getPopularStories,
	getTrendingTopics,
};