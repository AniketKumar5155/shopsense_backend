const pool = require("../config/database");

const createProduct = async (productData) => {
    const connection = await pool.getConnection();

    try{
        const {
            name,
            description,
            price,
            discounted_price,
            brand,
            weight,
            stock,
            image_url,
        } = userData;

        

    }catch(error){
        throw error;
        connection.release();
    }finally{
        connection.release();
    }
}