const ProductsModel = require("../models/product.Model")
const fs = require("fs");
const path = require("path");
const ExcelJS = require("exceljs");
const { format } = require("date-fns");
const { writeToPath } = require("fast-csv");


const getTotalcount = async () => {
    try {
        const total = await ProductsModel.tostalProduct();
        return total;

    } catch (err) {
        console.log(err, () => console.log("Error in total count"))
    }
}


// =================== Get All Product
const getAllProducts = async (page, sort, search, category) => {
    try {
        const rows = await ProductsModel.getAllproducts(page, sort, search, category);
        return rows;
    } catch (error) {
        console.error("Error fetching Products from DB:", error);
        throw error;
    }
};


// get a single productById
const getProductById = async (id) => {
    try {
        const product = await ProductsModel.getProductById(id)
        return product;
    } catch (error) {
        console.error("Error getting product by ID:", error);
        throw error;
    }
}

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

        //  Delete old image files from disk
        if (productExists?.images?.length > 0) {
            productExists.images.forEach(img => {
                const filePath = path.resolve(img);
                fs.unlink(filePath, err => {
                    if (err) console.error("Error deleting old image file:", filePath);
                });
            });
        }

        await ProductsModel.putproducts(id, name, price, category_id);

        await ProductsModel.deleteProductImages(id);
        if (imagePaths.length > 0) {
            await ProductsModel.InsertProductImage(id, imagePaths);
        }
        return { id, name, price, category_id, images: imagePaths };
    } catch (error) {
        console.log("edit the Products", error);
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



const generateProductReport = async (formatType = 'csv') => {
    try {
        const products = await ProductsModel.getAllProductsForReport();
        const timestamp = format(new Date(), "yyyyMMdd_HHmmss");
        
        // Ensure the reports folder exists
        const reportsDir = path.join(__dirname, "../reports");
        if (!fs.existsSync(reportsDir)) {
            fs.mkdirSync(reportsDir, { recursive: true });
        }

        const fileName = `products_report_${timestamp}.${formatType}`;
        const filePath = path.join(__dirname, `../reports/${fileName}`);

        if (formatType === 'csv') {
            await new Promise((resolve, reject) => {
                writeToPath(filePath, products, { headers: true })
                    .on("finish", resolve)
                    .on("error", reject);
            });
        } else if (formatType === 'xlsx') {
            const workbook = new ExcelJS.Workbook();
            const worksheet = workbook.addWorksheet("Products");

            worksheet.columns = [
                { header: "ID", key: "id" },
                { header: "Name", key: "name" },
                { header: "Price", key: "price" },
                { header: "Category", key: "category_name" },
                { header: "Created At", key: "created_at" },
                { header: "Updated At", key: "updated_at" }
            ];

            products.forEach(product => {
                worksheet.addRow(product);
            });

            await workbook.xlsx.writeFile(filePath);
        }

        return filePath;
    } catch (error) {
        console.error("Error generating report:", error);
        throw error;
    }
};


module.exports = {
    getAllProducts,
    getProductById,
    postProducts,
    putProducts,
    deleteProducts,
    getTotalcount,
    generateProductReport
};
