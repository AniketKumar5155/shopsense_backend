const express = require('express');
const refreshTokenRouter = express.Router();
const refreshTokenController = require("../controllers/refreshTokenController");


refreshTokenRouter.post(
    '/refresh',
    refreshTokenController,
);

module.exports = refreshTokenRouter;

