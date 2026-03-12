const pool = require("../config/database");
const generateToken = require("../utils/generateToken");
const cryptoData = require("../utils/crypto");
const JWT = require("jsonwebtoken");

const refreshTokensService = async (refreshToken) => {
    if (!refreshToken) {
        throw new Error("No refresh token provided");
    }

    const hashedRefreshToken = cryptoData(refreshToken);

    const query = `
        SELECT user_id, expires_at, revoked
        FROM refresh_tokens
        WHERE token_hash = ?
        LIMIT 1
    `;

    const [rows] = await pool.query(query, [hashedRefreshToken]);

    if (rows.length === 0) {
        throw new Error("Invalid refresh token");
    }

    const storedToken = rows[0];

    if (storedToken.revoked) {
        throw new Error("Refresh token revoked");
    }

    if (new Date(storedToken.expires_at) <= new Date()) {
        throw new Error("Refresh token expired");
    }

    const decoded = JWT.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET
    );

    const [users] = await pool.query(
        `SELECT id, email, username, role
         FROM users
         WHERE id = ?
         LIMIT 1`,
        [decoded.userId]
    );

    if (users.length === 0) {
        throw new Error("User not found");
    }

    const user = users[0];

    const payload = {
        userId: user.id,
        email: user.email,
        username: user.username,
        role: user.role,
    };

    const { accessToken, refreshToken: newRefreshToken } = generateToken(payload);

    await pool.query(
        `UPDATE refresh_tokens
         SET revoked = TRUE, revoked_at = NOW()
         WHERE token_hash = ?`,
        [hashedRefreshToken]
    );

    const newHashedRefreshToken = cryptoData(newRefreshToken);

    await pool.query(
        `INSERT INTO refresh_tokens (user_id, token_hash, expires_at)
         VALUES (?, ?, DATE_ADD(NOW(), INTERVAL ? DAY))`,
        [user.id, newHashedRefreshToken, process.env.REFRESH_TOKEN_TTL_DAYS]
    );

    return {
        accessToken,
        refreshToken: newRefreshToken,
    };
};

module.exports = refreshTokensService;