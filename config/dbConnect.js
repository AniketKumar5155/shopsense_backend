const pool = require("./database");

const checkDbConnection = async () => {
    try {
        const connection = await pool.getConnection();
        console.log("✅ Database connected successfully! ✅");
        connection.release();
    } catch (error) {
        console.error("❌ Database connection failed! ❌");
        console.error(error);
    }
};

module.exports = checkDbConnection;