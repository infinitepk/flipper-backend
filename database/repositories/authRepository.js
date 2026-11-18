const pool = require("../db");

// ====================
// User Queries
// ====================

async function createOAuthUser(
  email,
  authProvider,
  providerUserId
) {
  const result = await pool.query(
    `
      INSERT INTO users (
        email,
        auth_provider,
        provider_user_id
      )
      VALUES ($1, $2, $3)
      RETURNING
        id,
        email,
        auth_provider,
        provider_user_id,
        created_at,
        updated_at;
    `,
    [email, authProvider, providerUserId]
  );

  return result.rows[0];
}

async function findUserByProvider(
  authProvider,
  providerUserId
) {
  const result = await pool.query(
    `
      SELECT
        id,
        email,
        auth_provider,
        provider_user_id,
        created_at,
        updated_at
      FROM users
      WHERE auth_provider = $1
        AND provider_user_id = $2;
    `,
    [authProvider, providerUserId]
  );

  return result.rows[0] || null;
}

async function findUserById(id) {
  const result = await pool.query(
    `
      SELECT
        id,
        email,
        auth_provider,
        provider_user_id,
        created_at,
        updated_at
      FROM users
      WHERE id = $1;
    `,
    [id]
  );

  return result.rows[0] || null;
}

// ====================
// Profile Queries
// ====================

async function createProfile(userId, fullName) {
  const result = await pool.query(
    `
      INSERT INTO profiles (
        user_id,
        full_name
      )
      VALUES ($1, $2)
      RETURNING *;
    `,
    [userId, fullName]
  );

  return result.rows[0];
}

async function findProfileByUserId(userId) {
  const result = await pool.query(
    `
      SELECT
        u.id,
        u.email,
        u.auth_provider,
        p.full_name,
        p.gender,
        p.date_of_birth,
        p.mobile_number,
        p.location
      FROM users u
      JOIN profiles p
        ON p.user_id = u.id
      WHERE u.id = $1;
    `,
    [userId]
  );

  return result.rows[0] || null;
}

async function updateProfile(userId, profile) {
  const result = await pool.query(
    `
      UPDATE profiles
      SET
        full_name = $1,
        gender = $2,
        date_of_birth = $3,
        mobile_number = $4,
        location = $5
      WHERE user_id = $6
      RETURNING *;
    `,
    [
      profile.fullName,
      profile.gender || null,
      profile.dateOfBirth || null,
      profile.mobileNumber || null,
      profile.location || null,
      userId,
    ]
  );

  return result.rows[0] || null;
}

module.exports = {
  createOAuthUser,
  findUserByProvider,
  findUserById,
  createProfile,
  findProfileByUserId,
  updateProfile,
};