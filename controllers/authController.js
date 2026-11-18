const { generateAuthToken } = require("../utils/authToken");

const {
  createOAuthUser,
  findUserByProvider,
  createProfile,
} = require("../database/repositories/authRepository");

const {
  verifyGoogleIdToken,
} = require("../services/googleAuthService");

// ====================
// Google Sign In
// ====================

async function googleLogin(req, res) {
  try {
    const { idToken } = req.body;

    if (!idToken) {
      return res.status(400).json({
        message: "Google ID token is required",
      });
    }

    const googleUser = await verifyGoogleIdToken(idToken);

    if (!googleUser.email || !googleUser.providerUserId) {
      return res.status(400).json({
        message: "Unable to verify Google account",
      });
    }

    let user = await findUserByProvider(
      "google",
      googleUser.providerUserId
    );

    if (!user) {
      user = await createOAuthUser(
        googleUser.email.toLowerCase(),
        "google",
        googleUser.providerUserId
      );

      await createProfile(
        user.id,
        googleUser.fullName || "Flipper User"
      );
    }

    const token = generateAuthToken(user.id);

    return res.json({
      message: "Google sign in successful",
      token,
      user: {
        id: user.id,
        email: user.email,
        authProvider: user.auth_provider,
      },
    });
  } catch (error) {
    console.error("GOOGLE LOGIN ERROR:", error);

    return res.status(401).json({
      message: "Unable to sign in with Google",
    });
  }
}

module.exports = {
  googleLogin,
};