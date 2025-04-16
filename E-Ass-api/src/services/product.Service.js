const ProductsModel = require("../models/product.Model")

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
const putProducts = async (id, name, price, category_id) => {
    try {

        const result = await ProductsModel.putproducts(id, name, price, category_id);
        if (!result) {
            return "Data is invalid";
        }
        return result

    } catch (error) {
        console.log("edit the Products", result);
        throw error;
    }
}


// =================== Delete Product
const deleteProducts = async (id) => {
    try {

        const result = await ProductsModel.deleteproducts(id);
        if (!result) {
            return "Data is invalid";
        }
        return result

    } catch (error) {
        console.log("edit the Products", result);
        throw error;
    }
}


const TruncateData = async () => {
    try {

        const result = await ProductsModel.TruncateData();
        return result;

    } catch (error) {
        console.log("error in trucate service", error);
        throw error
    }
}



// Insert-Image
// const InsertProductImage = async (productId, imageUrls) => {
//     try {
//         const Values = imageUrls.map((url) => [productId, url]);
//         const [result] = await 
//     } catch (error) {

//     }
// }

module.exports = {
    getAllProducts,
    postProducts,
    putProducts,
    deleteProducts,
    TruncateData,
    getTotalcount
};
