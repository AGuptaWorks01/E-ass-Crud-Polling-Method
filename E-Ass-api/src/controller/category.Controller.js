// Importing the category service that handles database operations related to categories
const categorySevice = require("../services/category.Service");

// Function to get all categories with pagination
const getcategories = async (req, res) => {
    try {
        // Get the 'page' query parameter from the request (default to 1 if not provided)
        const page = parseInt(req.query.page) || 1;

        // Check if the page number is valid
        if (page < 1) {
            return res.status(400).json({ message: "Invalid page number" });
        }

        // Fetch the categories based on the current page number
        const categories = await categorySevice.getAllCategory(page);

        // Fetch the total count of categories for pagination purposes
        const totalCount = await categorySevice.getTotalcount();

        // Check if no categories were found
        if (!categories || categories.length === 0) {
            return res.status(404).json({ message: "No categories found" });
        }

        // Return the categories with pagination info
        res.status(200).json({
            categories,
            totalCount,
            currentPage: page,
        });
    } catch (error) {
        // Log the error for debugging purposes
        console.error("Error in getcategories:", error);

        // Return a 500 error if something goes wrong
        res.status(500).json({ message: "Error fetching categories", error: error.message });
    }
}

// Function to insert a new category
const InsertCategory = async (req, res) => {
    try {
        // Get the category name from the request body
        const { name } = req.body;

        // Check if the category name is provided
        if (!name) {
            return res.status(400).json({
                message: "Category name not found"
            });
        }

        // Call the category service to insert the category into the database
        const Insertcategory = await categorySevice.postCategory(name);

        // Check if the insertion failed
        if (!Insertcategory || !Insertcategory.affectedRows) {
            return res.status(500).json({
                message: "Failed to create category",
            });
        }

        // Return success message with the created category data
        return res.status(200).json({
            message: "Category created successfully",
            data: Insertcategory
        });

    } catch (error) {
        // Catch any errors and log them for debugging
        // console.error("Error in insert category", error);

        // Return the appropriate error status and message
        const statusCode = error.status || 500;
        return res.status(statusCode).json({
            message: error.message || "Internal Server Error",
        });
    }
}

// Function to edit an existing category
const EditCategory = async (req, res) => {
    try {
        // Get the category name from the request body and category ID from the URL params
        const { name } = req.body;
        const id = req.params.id;

        // Check if both the category name and ID are provided
        if (!id || !name) {
            return res.status(400).json({ message: "Incorrect data is provided" });
        }

        // Call the category service to update the category with the given ID and name
        const result = await categorySevice.putCategory(id, name);

        // Check if the update operation failed (no rows affected)
        if (!result || result.affectedRows === 0) {
            return res.status(404).json({ message: "Category not found or update failed" });
        }

        // Return success message with the updated category data
        console.log(id, name);
        return res.status(200).json({
            message: "Category updated successfully",
            data: result
        });

    } catch (error) {
        // Log the error for debugging purposes
        console.log("Error editing category", error);

        // Return a 500 error if something goes wrong
        res.status(500).json({ message: "Error updating category", error: error.message });
    }
}

// Function to delete an existing category
const DeleteCategory = async (req, res) => {
    try {
        // Get the category ID from the URL params
        const id = req.params.id;

        // Check if the category ID is provided
        if (!id) {
            return res.status(400).json({ message: "Incorrect data is provided" });
        }

        // Call the category service to delete the category with the given ID
        const result = await categorySevice.deleteCategory(id);

        // Check if the deletion failed (no rows affected)
        if (!result || result.affectedRows === 0) {
            return res.status(404).json({ message: "Category not found or delete failed" });
        }

        // Return success message with the deleted category data
        return res.status(200).json({
            message: "Category deleted successfully",
            data: result
        });

    } catch (error) {
        // Log the error for debugging purposes
        console.log("Error in delete category in controller", error);

        // Return a 500 error if something goes wrong
        res.status(500).json({ message: "Error deleting category", error: error.message });
    }
}

// Export the functions to be used in routes
module.exports = {
    getcategories,
    InsertCategory,
    EditCategory,
    DeleteCategory,
};
