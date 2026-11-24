const express = require("express");

const router = express.Router();

const {
    getFeed,
    getArticle,
    searchArticles,
} = require("../controllers/feedController");

router.get("/feed", getFeed);

router.get("/search", searchArticles);

router.get("/article/:id", getArticle);

module.exports = router;
