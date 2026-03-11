const generateOTP = require("../utils/generateOtp");
const checkUserExists = require("./checkUserExist");
const sendEmail = require("../utils/sendEmail");

const {
    signupOTPToken,
    signupOtpRequestCountToken,
} = require("../constants/redisKeys");

const {
    setCache,
    getCache,
    delCache,
} = require("../utils/redisCache");

const OTP_TTL = 600;

const sendOtpService = async (email) => {

    const userExists = await checkUserExists({ email });

    if (userExists) {
        throw new Error("This email is already linked to another account. Please login");
    }

    let attempts = 0;
    const maxAttempts = 5;

    const maxAttemptKey = signupOtpRequestCountToken(email);
    const currentAttempt = await getCache(maxAttemptKey);

    if (currentAttempt) {
        attempts = parseInt(currentAttempt, 10) || 0;
    }

    if (attempts >= maxAttempts) {
        throw new Error("Maximum OTP requests exceeded. Please try again later.");
    }

    const { otp } = generateOTP();

    await setCache(signupOTPToken(email), otp, OTP_TTL);

    attempts += 1;
    await setCache(maxAttemptKey, attempts, 3600);

    await sendEmail({
        to: email,
        subject: "Your OTP Code",
        text: `Your OTP code is: ${otp}. It will expire in 10 minutes.`,
    });

    return {
        success: true,
        message: "OTP sent successfully",
    };
};

const verifyOtpService = async (email, otp) => {
    if(!email || !otp){
        throw new Error("Both email and otp is required");
    }

    const storedOtp = await getCache(signupOTPToken(email));
    storedOtp ? storedOtp.toString() : null;
    if(!storedOtp){
        throw new Error('OTP has expired or does not exist');
    }
    const isMatch = String(otp.toString()) === String(storedOtp.toString());
    if(!isMatch){
        throw new Error('Invalid Otp');
    }

    delCache(signupOTPToken(email));
    delCache(signupOtpRequestCountToken(email));

    return{
        success: true,
        message: "Otp verified successfully",
    }
}

module.exports = {
    sendOtpService,
    verifyOtpService,
};