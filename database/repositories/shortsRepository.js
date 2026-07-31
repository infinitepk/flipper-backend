const pool = require("../db");

// =======================
// Shorts
// =======================

async function createShort(short) {
  const query = `
    INSERT INTO shorts (
      story_id,
      title,
      synopsis,
      cover_image,
      source,
      published_at
    )
    VALUES ($1,$2,$3,$4,$5,$6)
    ON CONFLICT (story_id)
    DO UPDATE SET
      title = EXCLUDED.title,
      synopsis = EXCLUDED.synopsis,
      cover_image = EXCLUDED.cover_image,
      published_at = EXCLUDED.published_at,
      updated_at = CURRENT_TIMESTAMP
    RETURNING *;
  `;

  const values = [
    short.story_id,
    short.title,
    short.synopsis,
    short.cover_image,
    short.source,
    short.published_at,
  ];

  const result = await pool.query(query, values);

  return result.rows[0];
}

async function findShortByStoryId(storyId) {
  const result = await pool.query(
    `
    SELECT *
    FROM shorts
    WHERE story_id = $1;
    `,
    [storyId]
  );

  return result.rows[0];
}

// =======================
// Short Pages
// =======================

async function deletePagesByStoryId(storyId) {
  await pool.query(
    `
    DELETE FROM short_pages
    WHERE story_id = $1;
    `,
    [storyId]
  );
}

async function createShortPage(page) {
  const result = await pool.query(
    `
    INSERT INTO short_pages (
      story_id,
      page_number,
      title,
      caption,
      image_url
    )
    VALUES ($1,$2,$3,$4,$5)
    RETURNING *;
    `,
    [
      page.story_id,
      page.page_number,
      page.title,
      page.caption,
      page.image_url,
    ]
  );

  return result.rows[0];
}

async function findPagesByStoryId(storyId) {
  const result = await pool.query(
    `
    SELECT *
    FROM short_pages
    WHERE story_id = $1
    ORDER BY page_number;
    `,
    [storyId]
  );

  return result.rows;
}

async function findLatestShorts(limit = 20) {
  const result = await pool.query(
    `
    SELECT *
    FROM shorts
    ORDER BY published_at DESC
    LIMIT $1;
    `,
    [limit]
  );

  return result.rows;
}

module.exports = {
  createShort,
  findShortByStoryId,
  deletePagesByStoryId,
  createShortPage,
  findPagesByStoryId,
  findLatestShorts,
};