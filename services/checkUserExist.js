const pool = require("../config/database");

const checkUserExists = async (identifiers = {}) => {
    try {
        const { id, email, username } = identifiers;

        if (!id && !email && !username) {
            throw new Error("Requires at least one valid identifier");
        }

        const whereClause = [];
        const values = [];

        if (id) {
            whereClause.push("id = ?");
            values.push(id);
        }

        if (email) {
            whereClause.push("email = ?");
            values.push(email);
        }

        if (username) {
            whereClause.push("username = ?");
            values.push(username);
        }

        const query = `
            SELECT 1
            FROM users
            WHERE ${whereClause.join(" OR ")}
            LIMIT 1
        `;

        const [rows] = await pool.query(query, values)

        return rows.length > 0;

    } catch (error) {
        console.error("Error while checking if user exists:", error);
        throw error;
    }
};

module.exports = checkUserExists;