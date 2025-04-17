const ProductsSevice = require("../services/product.Service");

const getProducts = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;

        const Products = await ProductsSevice.getAllProducts(page);
        const totalCount = await ProductsSevice.getTotalcount();

        if (!Products || Products.length === 0) {
            return res.status(404).json({ message: "No Products found" });
        }

        res.status(200).json({
            Products,
            totalCount,
            currentPage: page,
        });
    } catch (error) {
        console.error("Error in getProducts:", error);
        res.status(500).json({ message: "Error fetching Products", error: error.message });
    }
}


const InsertProducts = async (req, res) => {
    try {
        const { name, price, category_id } = req.body
        const files = req.files || [];
        const imagePaths = files.map(file => file.path.replace(/\\/g, '/'));
        console.log("Path is ", imagePaths);

        if (!name || !price || !category_id) {
            return res.status(400).json({
                message: "Missing required fields: name, price, category_id",
            });
        }
        // const imagePaths = req.files ? req.files.map(file => file.path) : [];
        // console.log("imagepaths", imagePaths);


        const result = await ProductsSevice.postProducts(name, price, category_id, imagePaths);
        console.log(result);
        return res.status(201).json({
            message: "Product created successfully",
            data: result,
        });

    } catch (error) {
        console.error("Error in insert Products", error);
        return res.status(error.status || 500).json({
            message: error.message || "Internal Server Error",
            error: error.error || null,
        });
    }
}

const EditProducts = async (req, res) => {
    try {
        const { name, price, category_id } = req.body;
        const id = req.params.id

        if (!id || !name || !price || !category_id) {
            return res.status(400).json({ message: "Incorrect data provided" });
        }

        // ========== Replacing image path 
        const files = req.files || [];
        const imagePaths = files.map(file =>
            file.path.replace(/\\/g, '/')
        );

        const result = await ProductsSevice.putProducts(id, name, price, category_id, imagePaths);
        return res.status(200).json({
            message: "Product updated successfully",
            data: result,
        });


    } catch (error) {
        console.log("Edit Products in controller");
        return res.status(500).json({
            message: "Error updating product",
            error: error.message,
        });
    }
}


const DeleteProducts = async (req, res) => {
    try {
        const id = req.params.id;
        if (!id) {
            return res.status(400).json({ message: "Incorrect data provided" });
        }

        const products = await ProductsSevice.deleteProducts(id);
        if (!products) {
            return res.status(404).json({ message: "Product not found" });
        }

        // Delete associated images from disk
        const imagePaths = products.images || [];
        imagePaths.forEach(imagePath => {
            const fullPath = path.resolve(imagePath);
            fs.unlink(fullPath, err => {
                if (err) console.error("Error deleting image:", err);
            });
        });

        // Step 3: Delete product from DB
        await ProductsSevice.deleteProducts(id);
        return res.status(200).json({
            message: "Product and images deleted successfully",
            data: {
                deleted: true,
                productId: id
            }
        });

    } catch (error) {
        console.error("error in delete category in controller", error);
        return res.status(500).json({
            message: "Internal server error",
            error: error.message
        });
    }
}


const TruncateData = async (req, res) => {
    try {
        const result = await ProductsSevice.TruncateData();
        return res.status(200).json(result)

    } catch (error) {
        console.log("error in truncate controller", error);
        throw error
    }
}


module.exports = {
    getProducts,
    InsertProducts,
    EditProducts,
    DeleteProducts,
    TruncateData,
}