const promisePool = require("../utils/dbConnection.Util");

const tostalProduct = async () => {
    const limit = 10
    const countQuery = `SELECT COUNT(*) AS total FROM products`;
    const [countResult] = await promisePool.execute(countQuery);
    const totalRecords = countResult[0].total;
    return Math.ceil(totalRecords / limit)
}


const getAllproducts = async (page) => {
    try {
        const limit = "10";
        const offset = (page - 1) * parseInt(limit);
        const [rows] = await promisePool.execute(
            `SELECT 
            p.id, p.name, p.image, p.price,
            p.created_at, p.updated_at, p.category_id ,
            c.name as category_name
            FROM products p
            JOIN categories c ON p.category_id = c.id
            LIMIT ? OFFSET ?`,
            [limit, String(offset)]);
        return rows;
    } catch (error) {
        console.error("Error fetching products:", error);
        throw error;
    }
};


const { v4: uuidv4 } = require('uuid');
const postproducts = async (name, price, category_id) => {
    try {
        const uuid = uuidv4();

        const [result] = await promisePool.execute(
            `INSERT INTO products
            (uuid, name,price,category_id)
            VALUES (?,?,?,?)`, [uuid, name, price, category_id])
        return result

    } catch (error) {
        console.log("Error inserting in products", error);
        throw error;
    }
}


const checkCategoryExists = async (category_id) => {
    const [rows] = await promisePool.execute(
        'SELECT id FROM categories WHERE id = ?',
        [category_id]
    );
    return rows.length > 0;
};


const putproducts = async (id, name, price, category_id) => {
    try {
        const categoryExists = await checkCategoryExists(category_id);
        if (!categoryExists) {
            throw new Error(`Category with ID ${category_id} does not exist`);
        }

        const [rows] = await promisePool.execute(
            'UPDATE products SET name = ?, price = ?, category_id = ? WHERE id = ?',
            [name, price, category_id, id]
        );

        return rows;
    } catch (error) {
        console.log("Error updating product:", error);
        throw error;
    }
}

const deleteproducts = async (id) => {
    try {

        const [rows] = await promisePool.execute("DELETE FROM products WHERE id = ?", [id]);
        return rows

    } catch (error) {
        console.log("edit the products", error);
        throw error
    }
}


const TruncateData = async () => {
    try {

        const result = await promisePool.execute("TRUNCATE TABLE products");
        return result;

    } catch (error) {
        console.log("error in trucate model", error);
        throw error;
    }
}



// Insert-Image
const InsertProductImage = async (productId, imageUrls) => {
    try {
        const Values = imageUrls.map((url) => [productId, url]);
        const [result] = await promisePool.query(
            `INSERT INTO product_images (product_id, image_url) VALUES ?`, [Values]
        );
        return result;
    } catch (error) {
        console.error("Error inserting product images:", error);
        throw error;
    }
}

module.exports = {
    getAllproducts,
    postproducts,
    putproducts,
    deleteproducts,
    TruncateData,
    tostalProduct,
    InsertProductImage
};
