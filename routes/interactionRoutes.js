const express = require("express");
const router = express.Router();

const interactionController = require("../controllers/interactionController");
const { 
  authMiddleware, 
  optionalAuthMiddleware 
} = require("../middleware/authMiddleware");

// ====================
// Article Interactions & Reactions
// ====================

// Public: Fetch article reaction counts
router.get(
  "/article/:articleId/interactions",
  interactionController.getReactionCounts
);

// Protected: Get current user's reaction to an article
router.get(
  "/article/:articleId/reaction",
  authMiddleware,
  interactionController.getUserReaction
);

// Protected: Set or update an article reaction
router.post(
  "/article/:articleId/reaction",
  authMiddleware,
  interactionController.setReaction
);

// Protected: Remove an article reaction
router.delete(
  "/article/:articleId/reaction",
  authMiddleware,
  interactionController.removeReaction
);

// ====================
// Comments
// ====================

// Public: Fetch comments for an article
router.get(
  "/article/:articleId/comments",
  interactionController.getComments
);

// Protected: Add a comment
router.post(
  "/article/:articleId/comments",
  authMiddleware,
  interactionController.addComment
);

// Protected: Delete a comment
router.delete(
  "/comment/:commentId",
  authMiddleware,
  interactionController.deleteComment
);

// ====================
// Comment Reactions
// ====================

// Public / Optional Auth: Get comment reaction counts (and optionally user reaction if authed)
router.get(
  "/comment/:commentId/reactions",
  optionalAuthMiddleware,
  interactionController.getCommentReactionCounts
);

// Protected: Add or update a comment reaction
router.post(
  "/comment/:commentId/reaction",
  authMiddleware,
  interactionController.setCommentReaction
);

// Protected: Remove a comment reaction
router.delete(
  "/comment/:commentId/reaction",
  authMiddleware,
  interactionController.removeCommentReaction
);

// ====================
// Comment Replies
// ====================

// Public / Optional Auth: Get replies for a comment
router.get(
  "/comment/:commentId/replies",
  optionalAuthMiddleware,
  interactionController.getCommentReplies
);

// Protected: Add a reply to a comment
router.post(
  "/comment/:commentId/replies",
  authMiddleware,
  interactionController.addCommentReply
);

// ====================
// Comment Reply Reactions
// ====================

// Public / Optional Auth: Get reply reaction counts
router.get(
  "/reply/:replyId/reactions",
  optionalAuthMiddleware,
  interactionController.getReplyReactionCounts
);

// Protected: Add or update a reply reaction
router.post(
  "/reply/:replyId/reaction",
  authMiddleware,
  interactionController.setReplyReaction
);

// Protected: Remove a reply reaction
router.delete(
  "/reply/:replyId/reaction",
  authMiddleware,
  interactionController.removeReplyReaction
);

router.post(
  "/articles/comment-counts",
  interactionController.getArticleCommentCounts
);

module.exports = router;