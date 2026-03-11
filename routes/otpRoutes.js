const express = require('express');
const otpRouter = express.Router();

const {
    sendOtpController,
    verifyOtpController,
} =  require('../controllers/otpController');

otpRouter.post(
    '/send-otp',
    sendOtpController,
);
otpRouter.post(
    '/verify-otp',
    verifyOtpController,
);

module.exports = otpRouter;

