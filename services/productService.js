const pool = require("../config/database");

const createProductService = async (productData) => {
    const connection = await pool.getConnection();

    try {
        await connection.beginTransaction();
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
        } = productData;

        const [result] = await connection.query(
            `INSERT INTO products_items
            (name, description, price, discounted_price, brand, weight, stock, image_url)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [name, description, price, discounted_price, brand, weight, stock, image_url]
        );

        // creating join table
        const productId = result.insertId;
        if (categories && categories.length > 0) {
            const values = categories.map(categoryId => [productId, categoryId]);

            await connection.query(
                `INSERT INTO products 
                (product_id, category_id)
                VALUES ?`,
                [values]
            );
        }

        await connection.commit();

        return productId;
    } catch (error) {
        connection.release();
        throw error;
    } finally {
        connection.release();
    }
}

module.exports = {
    createProductService
}