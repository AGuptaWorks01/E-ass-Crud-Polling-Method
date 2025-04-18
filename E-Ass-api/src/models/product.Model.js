const promisePool = require("../utils/dbConnection.Util");

const tostalProduct = async () => {
    const limit = 10
    const countQuery = `SELECT COUNT(*) AS total FROM products`;
    const [countResult] = await promisePool.execute(countQuery);
    const totalRecords = countResult[0].total;
    return Math.ceil(totalRecords / limit)
}


const getAllproducts = async (page, sort = 'asc', search = '', category = '') => {
    try {
        const limit = 10;
        const offset = (page - 1) * limit;

        // Build dynamic WHERE clause
        let whereClause = `WHERE 1=1`;
        const params = [];

        if (search) {
            whereClause += ` AND p.name LIKE ?`;
            params.push(`%${search}%`);
        }

        if (category) {
            whereClause += ` AND c.name LIKE ?`;
            params.push(`%${category}%`);
        }

        const query = `
            SELECT 
                p.id, 
                p.name, 
                p.price,
                p.created_at, 
                p.updated_at, 
                p.category_id,
                c.name AS category_name,
                GROUP_CONCAT(pi.image_url) AS images
            FROM products p
            JOIN categories c ON p.category_id = c.id
            LEFT JOIN product_images pi ON p.id = pi.product_id
            ${whereClause}
            GROUP BY p.id
            ORDER BY p.price ${sort.toUpperCase()}
            LIMIT ? OFFSET ?;
        `;

        params.push(limit, offset);

        const [rows] = await promisePool.query(query, params);

        const productsWithImages = rows.map(product => ({
            ...product,
            images: product.images ? product.images.split(',') : []
        }));

        return productsWithImages;
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


const putproducts = async (id, name, price, category_id, imagePaths = []) => {
    try {
        const categoryExists = await checkCategoryExists(category_id);
        if (!categoryExists) {
            throw new Error(`Category with ID ${category_id} does not exist`);
        }

        // Step 1: Update product data
        await promisePool.execute(
            'UPDATE products SET name = ?, price = ?, category_id = ? WHERE id = ?',
            [name, price, category_id, id]
        );

        // Step 2: Delete old images
        await deleteProductImages(id);

        // Step 3: Insert new images if provided
        if (imagePaths.length > 0) {
            await InsertProductImage(id, imagePaths);
        }

        return {
            id,
            name,
            price,
            category_id,
            images: imagePaths,
        };
    } catch (error) {
        console.log("Error updating product:", error);
        throw error;
    }
};


const deleteproducts = async (id) => {
    try {
        const [rows] = await promisePool.execute(
            `DELETE FROM products WHERE id = ? `, [id]);
        return rows

    } catch (error) {
        console.log("edit the products", error);
        throw error
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


const getProductById = async (id) => {
    const [rows] = await promisePool.query(
        `SELECT 
            p.*, 
            GROUP_CONCAT(pi.image_url) AS images 
        FROM products p 
        LEFT JOIN product_images pi ON p.id = pi.product_id 
        WHERE p.id = ? 
        GROUP BY p.id`,
        [id]
    );

    if (rows.length === 0) return null;

    return {
        ...rows[0],
        images: rows[0].images ? rows[0].images.split(',') : []
    };
};

const deleteProductImages = async (productId) => {
    await promisePool.execute("DELETE FROM product_images WHERE product_id = ?", [productId]);
};



const getAllProductsForReport = async () => {
    try {
        const query = `
            SELECT 
                p.id, 
                p.name, 
                p.price,
                p.created_at, 
                p.updated_at, 
                c.name AS category_name
            FROM products p
            JOIN categories c ON p.category_id = c.id
            ORDER BY p.created_at DESC;
        `;
        const [rows] = await promisePool.query(query);
        return rows;
    } catch (error) {
        console.error("Error fetching products for report:", error);
        throw error;
    }
};



module.exports = {
    getAllproducts,
    postproducts,
    putproducts,
    deleteproducts,
    tostalProduct,
    InsertProductImage,
    deleteProductImages, getProductById,
    getAllProductsForReport,
};
