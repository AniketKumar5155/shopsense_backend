const asyncHandler = require("../middlewares/asyncHandler");
const {
  signupService,
  loginService,
  logoutService
} = require("../services/authService");

const signupController = asyncHandler(async (req, res) => {
  const { name, username, email, phone, password, otp } = req.body;

  const { user, token } = await signupService({
    name,
    username,
    email,
    phone,
    password,
    otp,
  });

  res.cookie("refreshToken", token.refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  return res.status(201).json({
    success: true,
    message: "User registered successfully",
    data: user,
    token: {
      accessToken: token.accessToken,
    },
  });
});

const loginController = asyncHandler(async (req, res) => {
  const { identifier, password } = req.body;

  const { user, token } = await loginService({
    identifier,
    password,
  });

  res.cookie("refreshToken", token.refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  return res.status(200).json({
    success: true,
    message: "User logged in successfully",
    data: user,
    token: {
      accessToken: token.accessToken,
    },
  });
});

const logoutController = asyncHandler(async (req, res) => {
  const refreshToken = req.cookies?.refreshToken;

  if (!refreshToken) {
    return res.status(400).json({
      success: false,
      message: "No refresh token provided",
    });
  }

  await logoutService(refreshToken);

  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: true,
    sameSite: "none",
  });

  return res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
});

module.exports = {
  signupController,
  loginController,
  logoutController,
};