const { verifyOtpService } = require("../services/otpService");
const generateToken = require("../utils/generateToken");
const hashData = require("../utils/hashData");
const checkUserExists = require("./checkUserExist");
const pool = require("../config/database");
const verifyHashedData = require("../utils/veryifyHashedData");

const signupService = async (userData) => {

    const connection = await pool.getConnection();

    try {

        const {
            name,
            email,
            username,
            phone,
            password,
            otp
        } = userData;

        const user = await checkUserExists({ email });

        if (user) {
            throw new Error("User already exists. Please login");
        }

        await verifyOtpService(email, otp);

        await connection.beginTransaction();

        const hashedPassword = await hashData(password);

        const [result] = await connection.query(
            `INSERT INTO users (name, email, username, phone, password)
             VALUES (?, ?, ?, ?, ?)`,
            [name, email, username, phone, hashedPassword]
        );

        const userId = result.insertId;

        const payload = {
            userId,
            email,
            username
        };

        const { accessToken, refreshToken } = generateToken(payload);

        const hashedRefreshToken = await hashData(refreshToken);

        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 7);

        await connection.query(
            `INSERT INTO refresh_tokens (user_id, token_hash, expires_at)
             VALUES (?, ?, ?)`,
            [userId, hashedRefreshToken, expiresAt]
        );

        await connection.commit();

        return {
            success: true,
            message: "User registered successfully",
            token: {
                accessToken,
                refreshToken
            },
            user: {
                userId,
                name,
                email,
                phone,
                username
            }
        };

    } catch (error) {

        await connection.rollback();
        throw error;

    } finally {
        connection.release();
    }
};

const loginService = async ({ identifier, password }) => {

    try {

        if (!identifier) {
            throw new Error("Email or Username is required");
        }

        if (!password) {
            throw new Error("Password is required");
        }

        const [users] = await pool.query(
            `SELECT id, name, email, username, phone, password
             FROM users
             WHERE email = ? OR username = ?
             LIMIT 1`,
            [identifier, identifier]
        );

        const user = users[0];

        if (!user) {
            throw new Error("Invalid credentials");
        }

        const isPasswordValid = await verifyHashedData(password, user.password);

        if (!isPasswordValid) {
            throw new Error("Invalid credentials");
        }

        const payload = {
            userId: user.id,
            email: user.email,
            username: user.username
        };

        const { accessToken, refreshToken } = generateToken(payload);

        const hashedRefreshToken = await hashData(refreshToken);

        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + process.env.REFRESH_TOKEN_TTL_DAYS);

        await pool.query(
            `INSERT INTO refresh_tokens (user_id, token_hash, expires_at)
             VALUES (?, ?, ?)`,
            [user.id, hashedRefreshToken, expiresAt]
        );

        return {
            success: true,
            message: "Login successful",
            user: {
                userId: user.id,
                name: user.name,
                email: user.email,
                username: user.username,
                phone: user.phone
            },
            token: {
                accessToken,
                refreshToken
            }
        };

    } catch (error) {
        throw error;
    }
};

const logoutService = async (refreshToken) => {
    try {
        const hashedToken = await hashData(refreshToken);

        await pool.query(
            `UPDATE refresh_tokens
             SET revoked = TRUE, revoked_at = NOW()
             WHERE token_hash = ?`,
            [hashedToken]
        );

        return {
            success: true,
            message: "Logout successful"
        };

    } catch (error) {
        throw error;
    }
};

module.exports = {
    signupService,
    loginService,
    logoutService
};