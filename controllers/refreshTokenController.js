const refreshTokenService = require("../services/refreshTokenService");
const asyncHandler = require("../middlewares/asyncHandler");

const refreshTokenController = asyncHandler(async (req, res) => {

    const refreshToken = req.cookies?.refreshToken;

    const { accessToken, refreshToken: newRefreshToken } = await refreshTokenService(refreshToken);

    res.cookie("refreshToken", newRefreshToken, {
        httpOnly: true,
        secure: true,
        samesSite: "none",
        maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
        success: true,
        message: "Tokens rotated successfully",
        token: {
            accessToken,
        },
    });
});

module.exports = refreshTokenController;