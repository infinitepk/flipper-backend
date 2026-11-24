const express = require("express");

const router = express.Router();

const {
    getFeed,
    getArticle,
    searchArticles,
	getPopularFeed,
	getTrendingTopicsFeed,
} = require("../controllers/feedController");

router.get("/feed", getFeed);

router.get("/search", searchArticles);

router.get("/popular", getPopularFeed);
router.get("/trending", getTrendingTopicsFeed);

router.get("/article/:id", getArticle);

module.exports = router;
