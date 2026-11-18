const express = require("express");
const router = express.Router();

const {
  googleLogin,
} = require("../controllers/authController");

const { authRateLimiter } = require("../middleware/rateLimitMiddleware");

router.post("/auth/google", authRateLimiter, googleLogin);


module.exports = router;