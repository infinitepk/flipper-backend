const {
  findProfileByUserId,
  updateProfile: updateProfileData,
} = require("../database/repositories/authRepository");


// ====================
// Get Profile
// ====================

async function getProfile(req, res) {
  try {
    const profile = await findProfileByUserId(req.user.id);

    if (!profile) {
      return res.status(404).json({
        message: "Profile not found",
      });
    }

    res.json(profile);
  } catch (error) {
    console.error("GET PROFILE ERROR:", error);

    res.status(500).json({
      message: "Unable to get profile",
    });
  }
}

async function updateProfile(req, res) {
  try {
    const {
      fullName,
      gender,
      dateOfBirth,
      mobileNumber,
      location,
    } = req.body;

    if (!fullName || !fullName.trim()) {
      return res.status(400).json({
        message: "Full name is required",
      });
    }

    const profile = await updateProfileData(req.user.id, {
      fullName: fullName.trim(),
      gender,
      dateOfBirth,
      mobileNumber,
      location,
    });

    if (!profile) {
      return res.status(404).json({
        message: "Profile not found",
      });
    }

    res.json({
      message: "Profile updated successfully",
      profile,
    });
  } catch (error) {
    console.error("UPDATE PROFILE ERROR:", error);

    res.status(500).json({
      message: "Unable to update profile",
    });
  }
}


module.exports = {
  getProfile,
  updateProfile,
};