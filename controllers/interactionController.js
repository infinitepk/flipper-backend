const interactionRepository = require("../database/repositories/interactionRepository");

function parseArticleId(value) {
  const id = Number(value);
  return Number.isInteger(id) && id > 0 ? id : null;
}

// GET reaction counts for an article
async function getReactionCounts(req, res) {
  try {
    const articleId = parseArticleId(req.params.articleId);

    if (!articleId) {
      return res.status(400).json({ error: "Invalid article ID" });
    }

    const counts = await interactionRepository.getReactionCounts(articleId);

    return res.json({
      articleId,
      likes: counts.likes,
      dislikes: counts.dislikes,
    });
  } catch (error) {
    console.error("Get reaction counts error:", error);
    return res.status(500).json({ error: "Failed to fetch reaction counts" });
  }
}


// GET the current user's reaction for an article
async function getUserReaction(req, res) {
  try {
    const articleId = parseArticleId(req.params.articleId);

    if (!articleId) {
      return res.status(400).json({ error: "Invalid article ID" });
    }

    const userId = req.user.id;

    const reaction = await interactionRepository.getUserReaction(
      articleId,
      userId
    );

    return res.json({
      articleId,
      userReaction: reaction,
    });
  } catch (error) {
    console.error("Get user reaction error:", error);
    return res.status(500).json({
      error: "Failed to fetch user reaction",
    });
  }
}


// ADD or CHANGE a reaction
async function setReaction(req, res) {
  try {
    const articleId = parseArticleId(req.params.articleId);
    const userId = req.user.id;
    const { reaction } = req.body;

    if (!articleId) {
      return res.status(400).json({ error: "Invalid article ID" });
    }

    if (!["like", "dislike"].includes(reaction)) {
      return res.status(400).json({
        error: 'Reaction must be either "like" or "dislike"',
      });
    }

    await interactionRepository.setReaction(articleId, userId, reaction);

    const counts = await interactionRepository.getReactionCounts(articleId);

    return res.json({
      success: true,
      articleId,
      userReaction: reaction,
      likes: counts.likes,
      dislikes: counts.dislikes,
    });
  } catch (error) {
    console.error("Set reaction error:", error);
    return res.status(500).json({ error: "Failed to save reaction" });
  }
}

// REMOVE the current user's reaction
async function removeReaction(req, res) {
  try {
    const articleId = parseArticleId(req.params.articleId);

    if (!articleId) {
      return res.status(400).json({ error: "Invalid article ID" });
    }

    await interactionRepository.removeReaction(articleId, req.user.id);

    const counts = await interactionRepository.getReactionCounts(articleId);

    return res.json({
      success: true,
      articleId,
      userReaction: null,
      likes: counts.likes,
      dislikes: counts.dislikes,
    });
  } catch (error) {
    console.error("Remove reaction error:", error);
    return res.status(500).json({ error: "Failed to remove reaction" });
  }
}


// GET comments for an article
async function getComments(req, res) {
  try {
    const articleId = parseArticleId(req.params.articleId);

    if (!articleId) {
      return res.status(400).json({ error: "Invalid article ID" });
    }

    const requestedLimit = Number.parseInt(req.query.limit, 10);
    const requestedOffset = Number.parseInt(req.query.offset, 10);

    const limit = Number.isInteger(requestedLimit)
      ? Math.min(Math.max(requestedLimit, 1), 50)
      : 30;

    const offset = Number.isInteger(requestedOffset)
      ? Math.max(requestedOffset, 0)
      : 0;

    const requestedSort = req.query.sort;

const allowedSorts = [
  "Most Discussed",
  "Newest",
  "Oldest",
  "Most Upvoted",
  "Most Downvoted",
];

const sort = allowedSorts.includes(requestedSort)
  ? requestedSort
  : "Most Discussed";

const comments = await interactionRepository.getComments(
  articleId,
  limit,
  offset,
  sort
);

    return res.json({
      articleId,
      comments,
      limit,
      offset,
	  sort,
    });
  } catch (error) {
    console.error("Get comments error:", error);
    return res.status(500).json({ error: "Failed to fetch comments" });
  }
}

// ADD a comment
async function addComment(req, res) {
  try {
    const articleId = parseArticleId(req.params.articleId);
    const userId = req.user.id;
    const content =
      typeof req.body.content === "string" ? req.body.content.trim() : "";

    if (!articleId) {
      return res.status(400).json({ error: "Invalid article ID" });
    }

    if (!content || content.length > 2000) {
      return res.status(400).json({
        error: "Comment must contain between 1 and 2000 characters",
      });
    }

    const comment = await interactionRepository.addComment(
      articleId,
      userId,
      content
    );

    return res.status(201).json({
      success: true,
      comment,
    });
  } catch (error) {
    console.error("Add comment error:", error);
    return res.status(500).json({ error: "Failed to add comment" });
  }
}

// DELETE the current user's own comment
async function deleteComment(req, res) {
  try {
    const commentId = Number(req.params.commentId);

    if (!Number.isSafeInteger(commentId) || commentId <= 0) {
      return res.status(400).json({ error: "Invalid comment ID" });
    }

    const deleted = await interactionRepository.deleteComment(
      commentId,
      req.user.id
    );

    if (!deleted) {
      return res.status(404).json({
        error: "Comment not found or you cannot delete it",
      });
    }

    return res.json({ success: true });
  } catch (error) {
    console.error("Delete comment error:", error);
    return res.status(500).json({ error: "Failed to delete comment" });
  }
}

// GET reaction counts and current user's reaction for a comment
async function getCommentReactionCounts(req, res) {
  try {
    const commentId = Number(req.params.commentId);

    if (!Number.isSafeInteger(commentId) || commentId <= 0) {
      return res.status(400).json({ error: "Invalid comment ID" });
    }

    const counts =
      await interactionRepository.getCommentReactionCounts(commentId);

    let userReaction = null;

    if (req.user?.id) {
      userReaction =
        await interactionRepository.getUserCommentReaction(
          commentId,
          req.user.id
        );
    }

    return res.json({
      commentId,
      likes: counts.likes,
      dislikes: counts.dislikes,
      userReaction,
    });
  } catch (error) {
    console.error("Get comment reaction counts error:", error);
    return res.status(500).json({
      error: "Failed to fetch comment reaction counts",
    });
  }
}


// ADD or CHANGE a comment reaction
async function setCommentReaction(req, res) {
  try {
    const commentId = Number(req.params.commentId);
    const userId = req.user.id;
    const { reaction } = req.body;

    if (!Number.isSafeInteger(commentId) || commentId <= 0) {
      return res.status(400).json({ error: "Invalid comment ID" });
    }

    if (!["like", "dislike"].includes(reaction)) {
      return res.status(400).json({
        error: 'Reaction must be either "like" or "dislike"',
      });
    }

    await interactionRepository.setCommentReaction(
      commentId,
      userId,
      reaction
    );

    const counts =
      await interactionRepository.getCommentReactionCounts(commentId);

    return res.json({
      success: true,
      commentId,
      userReaction: reaction,
      likes: counts.likes,
      dislikes: counts.dislikes,
    });
  } catch (error) {
    console.error("Set comment reaction error:", error);
    return res.status(500).json({
      error: "Failed to save comment reaction",
    });
  }
}


// REMOVE the current user's comment reaction
async function removeCommentReaction(req, res) {
  try {
    const commentId = Number(req.params.commentId);

    if (!Number.isSafeInteger(commentId) || commentId <= 0) {
      return res.status(400).json({ error: "Invalid comment ID" });
    }

    await interactionRepository.removeCommentReaction(
      commentId,
      req.user.id
    );

    const counts =
      await interactionRepository.getCommentReactionCounts(commentId);

    return res.json({
      success: true,
      commentId,
      userReaction: null,
      likes: counts.likes,
      dislikes: counts.dislikes,
    });
  } catch (error) {
    console.error("Remove comment reaction error:", error);
    return res.status(500).json({
      error: "Failed to remove comment reaction",
    });
  }
}

// GET replies for a comment
async function getCommentReplies(req, res) {
  try {
    const commentId = Number(req.params.commentId);

    if (!Number.isSafeInteger(commentId) || commentId <= 0) {
      return res.status(400).json({ error: "Invalid comment ID" });
    }

    const replies = await interactionRepository.getCommentReplies(commentId);

    return res.json({
      commentId,
      count: replies.length,
      replies,
    });
  } catch (error) {
    console.error("Get comment replies error:", error);
    return res.status(500).json({ error: "Failed to fetch replies" });
  }
}

// ADD a reply to a comment
async function addCommentReply(req, res) {
  try {
    const commentId = Number(req.params.commentId);
    const userId = req.user.id;
    const content =
      typeof req.body.content === "string" ? req.body.content.trim() : "";

    if (!Number.isSafeInteger(commentId) || commentId <= 0) {
      return res.status(400).json({ error: "Invalid comment ID" });
    }

    if (!content || content.length > 2000) {
      return res.status(400).json({
        error: "Reply must contain between 1 and 2000 characters",
      });
    }

    const exists = await interactionRepository.commentExists(commentId);

    if (!exists) {
      return res.status(404).json({ error: "Comment not found" });
    }

    const reply = await interactionRepository.addCommentReply(
      commentId,
      userId,
      content
    );

    return res.status(201).json({
      success: true,
      reply,
    });
  } catch (error) {
    console.error("Add comment reply error:", error);
    return res.status(500).json({ error: "Failed to add reply" });
  }
}

// GET reaction counts and current user's reaction for a reply
async function getReplyReactionCounts(req, res) {
  try {
    const replyId = Number(req.params.replyId);

    if (!Number.isSafeInteger(replyId) || replyId <= 0) {
      return res.status(400).json({ error: "Invalid reply ID" });
    }

    const counts =
      await interactionRepository.getReplyReactionCounts(replyId);

    let userReaction = null;

    if (req.user?.id) {
      userReaction =
        await interactionRepository.getUserReplyReaction(
          replyId,
          req.user.id
        );
    }

    return res.json({
      replyId,
      likes: counts.likes,
      dislikes: counts.dislikes,
      userReaction,
    });
  } catch (error) {
    console.error("Get reply reaction counts error:", error);
    return res.status(500).json({
      error: "Failed to fetch reply reaction counts",
    });
  }
}


// ADD or CHANGE a reply reaction
async function setReplyReaction(req, res) {
  try {
    const replyId = Number(req.params.replyId);
    const userId = req.user.id;
    const { reaction } = req.body;

    if (!Number.isSafeInteger(replyId) || replyId <= 0) {
      return res.status(400).json({ error: "Invalid reply ID" });
    }

    if (!["like", "dislike"].includes(reaction)) {
      return res.status(400).json({
        error: 'Reaction must be either "like" or "dislike"',
      });
    }

    await interactionRepository.setReplyReaction(
      replyId,
      userId,
      reaction
    );

    const counts =
      await interactionRepository.getReplyReactionCounts(replyId);

    return res.json({
      success: true,
      replyId,
      userReaction: reaction,
      likes: counts.likes,
      dislikes: counts.dislikes,
    });
  } catch (error) {
    console.error("Set reply reaction error:", error);
    return res.status(500).json({
      error: "Failed to save reply reaction",
    });
  }
}


// REMOVE the current user's reply reaction
async function removeReplyReaction(req, res) {
  try {
    const replyId = Number(req.params.replyId);

    if (!Number.isSafeInteger(replyId) || replyId <= 0) {
      return res.status(400).json({ error: "Invalid reply ID" });
    }

    await interactionRepository.removeReplyReaction(
      replyId,
      req.user.id
    );

    const counts =
      await interactionRepository.getReplyReactionCounts(replyId);

    return res.json({
      success: true,
      replyId,
      userReaction: null,
      likes: counts.likes,
      dislikes: counts.dislikes,
    });
  } catch (error) {
    console.error("Remove reply reaction error:", error);
    return res.status(500).json({
      error: "Failed to remove reply reaction",
    });
  }
}

async function getArticleCommentCounts(req, res) {
  try {
    const { articleIds } = req.body;

    if (
      !Array.isArray(articleIds) ||
      articleIds.length === 0 ||
      articleIds.length > 50
    ) {
      return res.status(400).json({
        error: "Provide between 1 and 50 article IDs",
      });
    }

    const ids = [...new Set(articleIds.map(Number))];

    if (ids.some(id => !Number.isSafeInteger(id) || id <= 0)) {
      return res.status(400).json({
        error: "Invalid article IDs",
      });
    }

    const rows = await interactionRepository.getCommentCounts(ids);

    const counts = {};

    ids.forEach(id => {
      counts[id] = 0;
    });

    rows.forEach(row => {
      counts[row.article_id] = row.comment_count;
    });

    return res.json({ counts });

  } catch (error) {
    console.error("Get article comment counts error:", error);

    return res.status(500).json({
      error: "Failed to fetch comment counts",
    });
  }
}


module.exports = {
  getReactionCounts,
  getUserReaction,
  setReaction,
  removeReaction,
  getComments,
  addComment,
  deleteComment,
  getCommentReactionCounts,
  setCommentReaction,
  removeCommentReaction,
  getCommentReplies,
addCommentReply,
getReplyReactionCounts,
setReplyReaction,
removeReplyReaction,
getArticleCommentCounts,
};

