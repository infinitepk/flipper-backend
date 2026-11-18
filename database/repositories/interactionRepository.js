const pool = require("../db");

// ====================
// Reaction Queries
// ====================

async function getReactionCounts(articleId) {
  const result = await pool.query(
    `SELECT
      COUNT(*) FILTER (WHERE reaction = 'like')::int AS likes,
      COUNT(*) FILTER (WHERE reaction = 'dislike')::int AS dislikes
    FROM article_reactions
    WHERE article_id = $1;`,
    [articleId]
  );

  return result.rows[0];
}

async function getUserReaction(articleId, userId) {
  const result = await pool.query(
    `SELECT reaction
    FROM article_reactions
    WHERE article_id = $1
      AND user_id = $2;`,
    [articleId, userId]
  );

  return result.rows[0]?.reaction ?? null;
}

async function setReaction(articleId, userId, reaction) {
  const result = await pool.query(
    `INSERT INTO article_reactions (article_id, user_id, reaction)
    VALUES ($1, $2, $3)
    ON CONFLICT (article_id, user_id)
    DO UPDATE SET
      reaction = EXCLUDED.reaction,
      updated_at = CURRENT_TIMESTAMP
    RETURNING article_id, user_id, reaction, created_at, updated_at;`,
    [articleId, userId, reaction]
  );

  return result.rows[0];
}

async function removeReaction(articleId, userId) {
  const result = await pool.query(
    `DELETE FROM article_reactions
    WHERE article_id = $1
      AND user_id = $2
    RETURNING id;`,
    [articleId, userId]
  );

  return result.rowCount > 0;
}

// ====================
// Comment Queries
// ====================


  

async function getComments(
  articleId,
  limit = 30,
  offset = 0,
  sort = "Most Discussed"
) {  


const sortOptions = {
  "Most Discussed": "reply_count DESC, c.created_at DESC, c.id DESC",
  "Newest": "c.created_at DESC, c.id DESC",
  "Oldest": "c.created_at ASC, c.id ASC",
  "Most Upvoted": "likes DESC, c.created_at DESC, c.id DESC",
  "Most Downvoted": "dislikes DESC, c.created_at DESC, c.id DESC",
};

const orderBy =
  sortOptions[sort] || sortOptions["Most Discussed"];
  
   const result = await pool.query(
    `SELECT
      c.id,
      c.article_id,
      c.user_id,
      c.content,
      c.created_at,
      c.updated_at,
      p.full_name,

      -- Total replies
      (
        SELECT COUNT(*)::int
        FROM comment_replies cr
        WHERE cr.comment_id = c.id
      ) AS reply_count,

      -- Total likes
      (
        SELECT COUNT(*)::int
        FROM comment_reactions cr
        WHERE cr.comment_id = c.id
          AND cr.reaction = 'like'
      ) AS likes,

      -- Total dislikes
      (
        SELECT COUNT(*)::int
        FROM comment_reactions cr
        WHERE cr.comment_id = c.id
          AND cr.reaction = 'dislike'
      ) AS dislikes

    FROM comments c
    LEFT JOIN profiles p ON p.user_id = c.user_id
    WHERE c.article_id = $1
    ORDER BY ${orderBy}
    LIMIT $2 OFFSET $3;`,
    [articleId, limit, offset]
  );

  return result.rows;
}

async function addComment(articleId, userId, content) {
  const result = await pool.query(
    `INSERT INTO comments (article_id, user_id, content)
    VALUES ($1, $2, $3)
    RETURNING id, article_id, user_id, content, created_at, updated_at;`,
    [articleId, userId, content]
  );

  return result.rows[0];
}

async function deleteComment(commentId, userId) {
  const result = await pool.query(
    `DELETE FROM comments
    WHERE id = $1
      AND user_id = $2
    RETURNING id;`,
    [commentId, userId]
  );

  return result.rowCount > 0;
}

// ====================
// Comment Reaction Queries
// ====================

async function getCommentReactionCounts(commentId) {
  const result = await pool.query(
    `SELECT
      COUNT(*) FILTER (WHERE reaction = 'like')::int AS likes,
      COUNT(*) FILTER (WHERE reaction = 'dislike')::int AS dislikes
    FROM comment_reactions
    WHERE comment_id = $1;`,
    [commentId]
  );

  return result.rows[0];
}

async function getUserCommentReaction(commentId, userId) {
  const result = await pool.query(
    `SELECT reaction
    FROM comment_reactions
    WHERE comment_id = $1
      AND user_id = $2;`,
    [commentId, userId]
  );

  return result.rows[0]?.reaction ?? null;
}

async function setCommentReaction(commentId, userId, reaction) {
  const result = await pool.query(
    `INSERT INTO comment_reactions (comment_id, user_id, reaction)
    VALUES ($1, $2, $3)
    ON CONFLICT (comment_id, user_id)
    DO UPDATE SET
      reaction = EXCLUDED.reaction,
      updated_at = CURRENT_TIMESTAMP
    RETURNING comment_id, user_id, reaction;`,
    [commentId, userId, reaction]
  );

  return result.rows[0];
}

async function removeCommentReaction(commentId, userId) {
  const result = await pool.query(
    `DELETE FROM comment_reactions
    WHERE comment_id = $1
      AND user_id = $2
    RETURNING id;`,
    [commentId, userId]
  );

  return result.rowCount > 0;
}

// ====================
// Comment Reply Queries
// ====================

async function getCommentReplies(commentId) {
  const result = await pool.query(
    `SELECT
      cr.id,
      cr.comment_id,
      cr.user_id,
      cr.content,
      cr.created_at,
      cr.updated_at,
      p.full_name
    FROM comment_replies cr
    LEFT JOIN profiles p ON p.user_id = cr.user_id
    WHERE cr.comment_id = $1
    ORDER BY cr.created_at ASC, cr.id ASC;`,
    [commentId]
  );

  return result.rows;
}

async function addCommentReply(commentId, userId, content) {
  const result = await pool.query(
    `WITH inserted AS (
       INSERT INTO comment_replies (comment_id, user_id, content)
       VALUES ($1, $2, $3)
       RETURNING *
     )
     SELECT
       r.id,
       r.comment_id,
       r.user_id,
       r.content,
       r.created_at,
       r.updated_at,
       p.full_name
     FROM inserted r
     LEFT JOIN profiles p ON p.user_id = r.user_id;`,
    [commentId, userId, content]
  );

  return result.rows[0];
}

async function commentExists(commentId) {
  const query = `
    SELECT EXISTS (
      SELECT 1
      FROM comments
      WHERE id = $1
    ) AS exists;
  `;

  const { rows } = await pool.query(query, [commentId]);

  return rows[0].exists;
}

// ====================
// Comment Reply Reaction Queries
// ====================

async function getReplyReactionCounts(replyId) {
  const result = await pool.query(
    `SELECT
      COUNT(*) FILTER (WHERE reaction = 'like')::int AS likes,
      COUNT(*) FILTER (WHERE reaction = 'dislike')::int AS dislikes
    FROM reply_reactions
    WHERE reply_id = $1;`,
    [replyId]
  );

  return result.rows[0];
}

async function getUserReplyReaction(replyId, userId) {
  const result = await pool.query(
    `SELECT reaction
    FROM reply_reactions
    WHERE reply_id = $1
      AND user_id = $2;`,
    [replyId, userId]
  );

  return result.rows[0]?.reaction ?? null;
}

async function setReplyReaction(replyId, userId, reaction) {
  const result = await pool.query(
    `INSERT INTO reply_reactions (reply_id, user_id, reaction)
    VALUES ($1, $2, $3)
    ON CONFLICT (reply_id, user_id)
    DO UPDATE SET
      reaction = EXCLUDED.reaction,
      updated_at = CURRENT_TIMESTAMP
    RETURNING reply_id, user_id, reaction;`,
    [replyId, userId, reaction]
  );

  return result.rows[0];
}

async function removeReplyReaction(replyId, userId) {
  const result = await pool.query(
    `DELETE FROM reply_reactions
    WHERE reply_id = $1
      AND user_id = $2
    RETURNING id;`,
    [replyId, userId]
  );

  return result.rowCount > 0;
}

async function getCommentCounts(articleIds) {
  const result = await pool.query(
    `SELECT
       article_id,
       COUNT(*)::int AS comment_count
     FROM comments
     WHERE article_id = ANY($1::int[])
     GROUP BY article_id;`,
    [articleIds]
  );

  return result.rows;
}

module.exports = {
  getReactionCounts,
  getUserReaction,
  setReaction,
  removeReaction,
  getComments,
  addComment,
  deleteComment,

  // Comment reactions
  getCommentReactionCounts,
  getUserCommentReaction,
  setCommentReaction,
  removeCommentReaction,
  
  // Comment replies
  getCommentReplies,
  addCommentReply,
   commentExists,
   // Comment reply reactions
getReplyReactionCounts,
getUserReplyReaction,
setReplyReaction,
removeReplyReaction,

getCommentCounts,
};