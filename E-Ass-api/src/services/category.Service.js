const categoryModel = require("../models/category.Model"); // Import category model to interact with the database

// Function to get the total number of categories (for pagination)
const getTotalcount = async () => {
  try {
    // Fetch total category count from the model
    const total = await categoryModel.tostalCategory();
    return total; // Return the total count
  } catch (err) {
    console.log(err, () => console.log("Error in total count")); // Log error if something goes wrong
  }
};

// Function to get all categories with pagination support
const getAllCategory = async (page) => {
  try {
    // Fetch categories from the model based on the page number
    const rows = await categoryModel.getAllCategory(page);
    return rows; // Return the list of categories
  } catch (error) {
    console.error("Error fetching categories from DB:", error); // Log error if something goes wrong
    throw error; // Rethrow error to be handled by the controller
  }
};

// Function to create a new category
const postCategory = async (name) => {
  try {
    // Attempt to create a new category by calling the model function
    const result = await categoryModel.postCategory(name);
    if (!result) {
      return "Data is invalid"; // If no result, return an error message
    }
    return result; // Return the created category data
  } catch (error) {
    // If the category already exists (duplicate entry), throw a specific error
    if (error.code === "ER_DUP_ENTRY") {
      throw { status: 400, message: "Category with this name already exists." };
    }
    // Catch and throw any other database-related errors
    throw {
      status: 500,
      message: "Database error while creating category",
      error,
    };
  }
};

// Function to update a category by ID
const putCategory = async (id, name) => {
  try {
    // Attempt to update the category in the database
    const result = await categoryModel.putCategory(id, name);
    if (!result) {
      return "Data is invalid"; // If no result, return an error message
    }
    return result; // Return the updated category data
  } catch (error) {
    console.log("Error editing the category:", error); // Log error if update fails
    throw error; // Rethrow error for further handling
  }
};

// Function to delete a category by ID
const deleteCategory = async (id) => {
  try {
    // Attempt to delete the category from the database
    const result = await categoryModel.deleteCategory(id);
    if (!result) {
      return "Data is invalid"; // If no result, return an error message
    }
    return result; // Return success message after deletion
  } catch (error) {
    console.log("Error deleting the category:", error); // Log error if deletion fails
    throw error; // Rethrow error for further handling
  }
};

// Export the functions for use in other parts of the application
module.exports = {
  getAllCategory,
  postCategory,
  putCategory,
  deleteCategory,
  getTotalcount,
};
