const ProductsModel = require("../models/product.Model")
const fs = require("fs");
const path = require("path");


const getTotalcount = async () => {
    try {
        const total = await ProductsModel.tostalProduct();
        return total;

    } catch (err) {
        console.log(err, () => console.log("Error in total count"))
    }
}


// =================== Get All Product
const getAllProducts = async (page) => {
    try {
        const rows = await ProductsModel.getAllproducts(page);
        return rows;
    } catch (error) {
        console.error("Error fetching Products from DB:", error);
        throw error;
    }
};

// =================== Add Product
const postProducts = async (name, price, category_id, imagePaths = []) => {
    try {
        const result = await ProductsModel.postproducts(name, price, category_id)
        const insertId = result.insertId;

        if (imagePaths.length > 0) {
            await ProductsModel.InsertProductImage(insertId, imagePaths)
        }

        return { id: insertId, name, price, category_id, images: imagePaths }

    } catch (error) {
        console.log("Error in product service:", error);
        throw error;
    }
}


// =================== Update Product
const putProducts = async (id, name, price, category_id, imagePaths = []) => {
    try {
        const productExists = await ProductsModel.getProductById(id);
        if (!productExists) {
            throw new Error(`Product with ID ${id} does not exist`);
        }
        // console.log(productExists);

        // 🔥 Delete old image files from disk
        if (productExists?.images?.length > 0) {
            productExists.images.forEach(img => {
                const filePath = path.resolve(img);
                fs.unlink(filePath, err => {
                    if (err) console.error("Error deleting old image file:", filePath);
                });
            });
        }

        await ProductsModel.putproducts(id, name, price, category_id);

        // if (imagePaths.length > 0) {
        //     const oldProduct = await ProductsModel.getProductById(id);

        //     if (oldProduct?.images?.length > 0) {
        //         oldProduct.images.forEach(img => {
        //             const filePath = path.resolve(img);
        //             fs.unlink(filePath, err => {
        //                 if (err) console.error("Error deleting old image:", filePath);
        //             });
        //         });
        //     }
        
        await ProductsModel.deleteProductImages(id);
        if (imagePaths.length > 0) {
            await ProductsModel.InsertProductImage(id, imagePaths);
        }
        return { id, name, price, category_id, images: imagePaths };
    } catch (error) {
        console.log("edit the Products",error);
        throw error;
    }
}


// =================== Delete Product
const deleteProducts = async (id) => {
    try {
        const product = await ProductsModel.getProductById(id);
        if (!product) {
            return null;
        }

        if (product?.images?.length > 0) {
            product.images.forEach(imagePath => {
                const fullPath = path.resolve(imagePath);
                fs.unlink(fullPath, err => {
                    if (err) console.error("Error deleting image:", err);
                });
            });
        }

        await ProductsModel.deleteProductImages(id);
        const result = await ProductsModel.deleteproducts(id);
        return result;

    } catch (error) {
        console.log("Error in deleteProducts service:", error);
        throw error;
    }
};


const TruncateData = async () => {
    try {
        const result = await ProductsModel.TruncateData();
        return result;

    } catch (error) {
        console.log("error in trucate service", error);
        throw error
    }
}


module.exports = {
    getAllProducts,
    postProducts,
    putProducts,
    deleteProducts,
    TruncateData,
    getTotalcount
};
