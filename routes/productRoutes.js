const express = require('express');
const zodHandler = require('../middlewares/zodHandler');
const { createProductSchema } = require('../validator/productSchema');
const { createProductController } = require('../controllers/productController');
const authMiddleware = require('../middlewares/authMiddleware');
const productRouter = express.Router();


productRouter.post(
    '/product',
    authMiddleware,
    zodHandler(createProductSchema),
    createProductController
);

module.exports = productRouter;

