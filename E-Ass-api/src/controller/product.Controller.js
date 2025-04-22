const ProductsSevice = require("../services/product.Service"); // Importing the ProductsService for handling product operations
const fs = require("fs"); // File system module for handling file operations
const path = require("path"); // Path module to handle file paths, used in image deletion

// Get list of products with optional filters (page, sort, search, category)
const getProducts = async (req, res) => {
    try {
        // Parsing query parameters
        const page = parseInt(req.query.page) || 1; // Default page to 1 if not provided
        const sort = req.query.sort || 'asc';  // Default sorting order to 'asc' if not provided
        const search = req.query.search || ''; // Default search term to empty string if not provided
        const category = req.query.category || ''; // Default category to empty string if not provided

        // Validate sort parameter to be either 'asc' or 'desc'
        if (sort !== 'asc' && sort !== 'desc') {
            return res.status(400).json({ message: "Invalid sort value. Use 'asc' or 'desc'." });
        }

        // Fetch products and total count from the service
        const Products = await ProductsSevice.getAllProducts(page, sort, search, category);
        const totalCount = await ProductsSevice.getTotalcount(); // Fetch total count for pagination

        // Return error if no products are found
        if (!Products || Products.length === 0) {
            return res.status(404).json({ message: "No Products found" });
        }

        // Return the list of products and metadata like total count and current page
        res.status(200).json({
            Products,
            totalCount,
            currentPage: page
        });
    } catch (error) {
        console.error("Error in getProducts:", error);
        res.status(500).json({ message: "Error fetching Products", error: error.message });
    }
};

// Insert a new product with images
const InsertProducts = async (req, res) => {
    try {
        // Destructuring necessary fields from the request body
        const { name, price, category_id } = req.body;
        const files = req.files || []; // Files uploaded with the request (images)
        const imagePaths = files.map(file => file.path.replace(/\\/g, '/')); // Format file paths for the images

        // Return error if required fields are missing
        if (!name || !price || !category_id) {
            return res.status(400).json({
                message: "Missing required fields: name, price, category_id",
            });
        }

        // Insert product using the service layer
        const result = await ProductsSevice.postProducts(name, price, category_id, imagePaths);

        // Return success response with the created product details
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
};

// Edit an existing product
const EditProducts = async (req, res) => {
    try {
        // Extract product details from the request body and URL params
        const { name, price, category_id } = req.body;
        const id = req.params.id;

        // Return error if any required field is missing
        if (!id || !name || !price || !category_id) {
            return res.status(400).json({ message: "Incorrect data provided" });
        }

        // Handle image uploads (replace paths)
        const files = req.files || [];
        const imagePaths = files.map(file => file.path.replace(/\\/g, '/'));

        // Update product using the service layer
        const result = await ProductsSevice.putProducts(id, name, price, category_id, imagePaths);

        // Return success response with updated product details
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
};

// Delete a product and its associated images
const DeleteProducts = async (req, res) => {
    try {
        const id = req.params.id;

        // Return error if product ID is missing
        if (!id) {
            return res.status(400).json({ message: "Incorrect data provided" });
        }

        // Fetch the product data to get associated images
        const products = await ProductsSevice.deleteProducts(id);
        if (!products) {
            return res.status(404).json({ message: "Product not found" });
        }

        // Delete associated images from the disk
        const imagePaths = products.images || []; // Get the list of image paths associated with the product
        imagePaths.forEach(imagePath => {
            const fullPath = path.resolve(imagePath); // Resolve the full path of the image file
            fs.unlink(fullPath, err => {
                if (err) console.error("Error deleting image:", err);
            });
        });

        // Delete product record from the database
        await ProductsSevice.deleteProducts(id);

        // Return success response
        return res.status(200).json({
            message: "Product and images deleted successfully",
            data: {
                deleted: true,
                productId: id
            }
        });

    } catch (error) {
        console.error("Error in delete category in controller", error);
        return res.status(500).json({
            message: "Internal server error",
            error: error.message
        });
    }
};

// Fetch a product by its ID
const getProductById = async (req, res) => {
    try {
        const id = req.params.id;
        if (!id) {
            return res.status(400).json({ message: "Product ID is required" });
        }

        // Fetch the product from the service layer
        const product = await ProductsSevice.getProductById(id);

        // Return error if product is not found
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        // Return the product data
        res.status(200).json(product);
    } catch (error) {
        console.error("Error fetching product by ID:", error);
        res.status(500).json({
            message: "Internal server error",
            error: error.message
        });
    }
};

// Generate and download a product report (CSV or XLSX format)
const downloadProductReport = async (req, res) => {
    try {
        const { format } = req.query;
        const validFormats = ['csv', 'xlsx'];

        // Validate the requested format
        if (!validFormats.includes(format)) {
            return res.status(400).json({ message: "Invalid format. Use 'csv' or 'xlsx'." });
        }

        // Generate the product report
        const filePath = await ProductsSevice.generateProductReport(format);

        // Send the file for download
        res.download(filePath, err => {
            if (err) {
                console.error("Error sending file:", err);
                res.status(500).json({ message: "Error downloading file" });
            }

            // Cleanup temporary report file after sending
            setTimeout(() => {
                fs.unlink(filePath, err => {
                    if (err) console.error("Error deleting temp report file:", err);
                });
            }, 100000); // Cleanup delay (in ms)
        });

    } catch (error) {
        console.error("Error downloading report:", error);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

// Export the controller methods for use in routes
module.exports = {
    getProducts,
    getProductById,
    InsertProducts,
    EditProducts,
    DeleteProducts,
    downloadProductReport
};
