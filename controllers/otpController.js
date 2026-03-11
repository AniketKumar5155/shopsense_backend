const asyncHandler = require("../middlewares/asyncHandler");
const {
    sendOtpService,
    verifyOtpService,
}= require("../services/otpService")

const sendOtpController = asyncHandler(async (req, res) => {
    const { email } = req.body;
    if (!email) throw new Error("Email is required");

    const result = await sendOtpService(email);
    console.log(result);

    return res.status(200).json({
        success: true,
        message: "Otp sent successfully",
        data: result,
    })
});

const verifyOtpController = asyncHandler(async (req, res) => {
    const {
        email,
        otp
    } = req.body;

    if (!email || !otp) throw new Error('Email and OTP are required');

    const result = await verifyOtpService(email, otp);
    console.log(result);

    return res.status(200).json({
        success: true,
        message: 'OTP verified successfully',
        data: result,
    })
});


module.exports = {
    sendOtpController,
    verifyOtpController,
};