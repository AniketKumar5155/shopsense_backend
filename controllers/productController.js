const asyncHandler = require("../middlewares/asyncHandler");
const {
    createProductService,
} = require("../services/productService");
const createProductController = asyncHandler(async (req, res) => {
    const {
        name,
        description,
        price,
        discounted_price,
        brand,
        weight,
        stock,
        image_url,
        categories,
    } = req.body;

    const productData = {
        name,
        description,
        price,
        discounted_price,
        brand,
        weight,
        stock,
        image_url,
        categories,
    };

    const productId = await createProductService(productData);

    return res.status(201).json({
        success: true,
        message: "Product created successfully",
        data: productId
    })
});

module.exports = {
    createProductController
}