const ProductsModel = require("../models/product.Model"); // Import the Products model for DB interactions
const fs = require("fs"); // To work with the file system (like deleting image files)
const path = require("path"); // For managing file paths
const ExcelJS = require("exceljs"); // For creating Excel files
const { format } = require("date-fns"); // To format date in a specific way
const { writeToPath } = require("fast-csv"); // To write data to CSV files

// Function to get the total count of products from the DB
const getTotalcount = async () => {
  try {
    const total = await ProductsModel.tostalProduct(); // Fetch total count from DB
    return total; // Return the total number of products
  } catch (err) {
    console.log(err, () => console.log("Error in total count")); // If error occurs, log it
  }
};

// =================== Get All Products
const getAllProducts = async (page, sort, search, category) => {
  try {
    // Fetch all products with pagination, sorting, and category filter from DB
    const rows = await ProductsModel.getAllproducts(
      page,
      sort,
      search,
      category
    );
    return rows; // Return the products found
  } catch (error) {
    console.error("Error fetching Products from DB:", error); // Log if error occurs
    throw error; // Throw the error to be handled elsewhere
  }
};

// Function to get a single product by ID
const getProductById = async (id) => {
  try {
    // Fetch product by its ID from DB
    const product = await ProductsModel.getProductById(id);
    return product; // Return the product details
  } catch (error) {
    console.error("Error getting product by ID:", error); // Log error if any
    throw error; // Rethrow error to be handled
  }
};

// =================== Add Product
const postProducts = async (name, price, category_id, imagePaths = []) => {
  try {
    // Add new product to DB
    const result = await ProductsModel.postproducts(name, price, category_id);
    const insertId = result.insertId; // Get the inserted product's ID

    // If images are provided, add them to DB
    if (imagePaths.length > 0) {
      await ProductsModel.InsertProductImage(insertId, imagePaths);
    }

    return { id: insertId, name, price, category_id, images: imagePaths }; // Return the new product details
  } catch (error) {
    console.log("Error in product service:", error); // Log the error
    throw error; // Throw error to be handled
  }
};

// =================== Update Product
const putProducts = async (id, name, price, category_id, imagePaths = []) => {
  try {
    // Check if product exists by ID
    const productExists = await ProductsModel.getProductById(id);
    if (!productExists) {
      throw new Error(`Product with ID ${id} does not exist`); // Throw error if product not found
    }

    // Delete old images from disk if any exist
    if (productExists?.images?.length > 0) {
      productExists.images.forEach((img) => {
        const filePath = path.resolve(img); // Get full path of image
        fs.unlink(filePath, (err) => {
          // Delete image file
          if (err) console.error("Error deleting old image file:", filePath); // Log if deletion fails
        });
      });
    }

    // Update the product details in DB
    await ProductsModel.putproducts(id, name, price, category_id);

    // Delete old product images from DB
    await ProductsModel.deleteProductImages(id);

    // If new images are provided, add them to DB
    if (imagePaths.length > 0) {
      await ProductsModel.InsertProductImage(id, imagePaths);
    }

    return { id, name, price, category_id, images: imagePaths }; // Return the updated product details
  } catch (error) {
    console.log("Error updating product:", error); // Log if any error occurs
    throw error; // Throw the error
  }
};

// =================== Delete Product
const deleteProducts = async (id) => {
  try {
    // Check if product exists
    const product = await ProductsModel.getProductById(id);
    if (!product) {
      return null; // If no product found, return null
    }

    // Delete the images from disk if they exist
    if (product?.images?.length > 0) {
      product.images.forEach((imagePath) => {
        const fullPath = path.resolve(imagePath); // Get the full path of the image
        fs.unlink(fullPath, (err) => {
          // Delete the image file
          if (err) console.error("Error deleting image:", err); // Log any errors during deletion
        });
      });
    }

    // Delete images from DB
    await ProductsModel.deleteProductImages(id);

    // Delete the product from DB
    const result = await ProductsModel.deleteproducts(id);
    return result; // Return the result of the deletion
  } catch (error) {
    console.log("Error in deleteProducts service:", error); // Log errors
    throw error; // Rethrow the error to be handled elsewhere
  }
};

// Function to generate a report of all products in CSV or XLSX format
const generateProductReport = async (formatType = "csv") => {
  try {
    // Get all products to include in the report
    const products = await ProductsModel.getAllProductsForReport();
    const timestamp = format(new Date(), "yyyyMMdd_HHmmss"); // Get current timestamp for report filename

    // Ensure the reports folder exists, create it if it doesn't
    const reportsDir = path.join(__dirname, "../reports");
    if (!fs.existsSync(reportsDir)) {
      fs.mkdirSync(reportsDir, { recursive: true });
    }

    // Create filename for the report
    const fileName = `products_report_${timestamp}.${formatType}`;
    const filePath = path.join(__dirname, `../reports/${fileName}`);

    // If CSV format is selected, write data to CSV file
    if (formatType === "csv") {
      await new Promise((resolve, reject) => {
        writeToPath(filePath, products, { headers: true }) // Write data to CSV
          .on("finish", resolve) // Resolve once writing is complete
          .on("error", reject); // Reject if any error occurs
      });
    }
    // If XLSX format is selected, write data to an Excel file
    else if (formatType === "xlsx") {
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("Products");

      // Define columns for the Excel sheet
      worksheet.columns = [
        { header: "ID", key: "id" },
        { header: "Name", key: "name" },
        { header: "Price", key: "price" },
        { header: "Category", key: "category_name" },
        { header: "Created At", key: "created_at" },
        { header: "Updated At", key: "updated_at" },
      ];

      // Add each product to the worksheet
      products.forEach((product) => {
        worksheet.addRow(product);
      });

      // Write the Excel file to the file system
      await workbook.xlsx.writeFile(filePath);
    }

    return filePath; // Return the path to the generated report
  } catch (error) {
    console.error("Error generating report:", error); // Log if any error occurs
    throw error; // Rethrow the error for further handling
  }
};

// Export functions so they can be used in other parts of the app
module.exports = {
  getAllProducts,
  getProductById,
  postProducts,
  putProducts,
  deleteProducts,
  getTotalcount,
  generateProductReport,
};
