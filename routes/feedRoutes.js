const express = require("express");

const router = express.Router();

const {
    getFeed,
    getArticle,
} = require("../controllers/feedController");

router.get("/feed", getFeed);

router.get("/article/:id", getArticle);

module.exports = router;
