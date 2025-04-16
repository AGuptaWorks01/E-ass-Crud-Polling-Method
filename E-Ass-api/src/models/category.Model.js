const promisePool = require("../utils/dbConnection.Util");

const tostalCategory = async () => {
    const limit = 10;
    const countQuery = `SELECT COUNT(*) AS total FROM categories`;
    const [countResult] = await promisePool.execute(countQuery);
    const totalRecords = countResult[0].total;
    return Math.ceil(totalRecords / limit)

}

const getAllCategory = async (page) => {
    try {
        const limit = "10";
        const offset = (page - 1) * parseInt(limit);

        const [rows] = await promisePool.execute("SELECT * FROM categories LIMIT ? OFFSET ?", [limit, offset.toString()]);
        return rows;
    } catch (error) {
        console.error("Error fetching categories:", error);
        throw error;
    }
};



// Add new category with UUID

const { v4: uuidv4 } = require('uuid'); // Generate UUID
const postCategory = async (name) => {
    const uuid = uuidv4();

    try {
        const [result] = await promisePool.execute("INSERT INTO categories (uuid, name) VALUES (?,?)", [uuid, name])
        return result

    } catch (error) {
        // console.log("Error inserting in categories", error);
        throw error;
        
    }
}

// Update category by ID
const putCategory = async (id, name) => {
    try {

        const [rows] = await promisePool.execute('UPDATE categories SET name = ? WHERE id = ?', [name, id]);

        if (rows.affectedRows === 0) {
            throw new Error('No category found with the provided ID');
        }

        return rows;
    } catch (error) {
        console.log("edit the category", error);
        throw error
    }
}

// Delete category by ID
const deleteCategory = async (id) => {
    try {

        const [rows] = await promisePool.execute("DELETE FROM categories WHERE id = ?", [id]);
        return rows

    } catch (error) {
        console.log("edit the category", error);
        throw error
    }
}

// Truncate category table
const TruncateData = async () => {
    try {

        const result = await promisePool.execute("TRUNCATE TABLE categories");
        return result;

    } catch (error) {
        console.log("error in trucate model", error);
        throw error;
    }
}


module.exports = {
    getAllCategory,
    postCategory,
    putCategory,
    deleteCategory,
    TruncateData,
    tostalCategory
};
