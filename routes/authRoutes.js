const express = require('express');
const {
    signupController,
    loginController,
    logoutController,
} =  require('../controllers/authController');
const zodHandler = require("..//middlewares/zodHandler");
const {
    signupSchema,
    loginSchema
} = require("../validator/authSchema");
const authMiddleware = require("../middlewares/authMiddleware")

const authRouter = express.Router();

authRouter.post(
    '/signup',
    zodHandler(signupSchema),
    signupController,
);

authRouter.post(
    '/login',
    zodHandler(loginSchema),
    loginController,
);

authRouter.post(
    '/logout',
    authMiddleware,
    logoutController,
)

module.exports = authRouter;