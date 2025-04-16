const categorySevice = require("../services/category.Service");

const getcategories = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        if (page < 1) {
            return res.status(400).json({ message: "Invalid page number" });
        }

        const categories = await categorySevice.getAllCategory(page);
        const totalCount = await categorySevice.getTotalcount();

        if (!categories || categories.length === 0) {
            return res.status(404).json({ message: "No categories found" });
        }

        res.status(200).json({
            categories,
            totalCount,
            currentPage: page,
        });
    } catch (error) {
        console.error("Error in getcategories:", error);
        res.status(500).json({ message: "Error fetching categories", error: error.message });
    }
}


const InsertCategory = async (req, res) => {
    try {
        const { name } = req.body
        if (!name) {
            return res.status(400).json({
                message: "category name not found"
            });
        }

        const Insertcategory = await categorySevice.postCategory(name);

        if (!Insertcategory || !Insertcategory.affectedRows) {
            return res.status(500).json({
                message: "Failed to create category",
            });
        }

        return res.status(200).json({
            message: "Category created successfully",
            data: Insertcategory
        });

    } catch (error) {
        // console.error("Error in insert category", error);

        const statusCode = error.status || 500;
        return res.status(statusCode).json({
            message: error.message || "Internal Server Error",
        });
    }
}



const EditCategory = async (req, res) => {
    try {

        const { name } = req.body;
        const id = req.params.id
        if (!id || !name) {
            return res.status(400).json({ message: "In correct data is provided" });
        }
        const result = await categorySevice.putCategory(id, name);
        if (!result || result.affectedRows === 0) {
            return res.status(404).json({ message: "Category not found or update failed" });
        }

        console.log(id, name)
        return res.status(200).json({
            message: "Category updated successfully",
            data: result
        });


    } catch (error) {
        console.log("Error editing category", error);
        res.status(500).json({ message: "Error updating category", error: error.message });
    }
}


const DeleteCategory = async (req, res) => {
    try {

        const id = req.params.id;
        if (!id) {
            return res.status(400).json({ message: "Incorrect data is provided" });
        }

        const result = await categorySevice.deleteCategory(id);

        if (!result || result.affectedRows === 0) {
            return res.status(404).json({ message: "Category not found or delete failed" });
        }

        return res.status(200).json({
            message: "Category deleted successfully",
            data: result
        });

    } catch (error) {
        console.log("Error in delete category in controller", error);
        res.status(500).json({ message: "Error deleting category", error: error.message });
    }
}


const TruncateData = async (req, res) => {
    try {

        const result = await categorySevice.TruncateData();
        return res.status(200).json({
            message: "All categories have been successfully removed.",
            data: result
        })

    } catch (error) {
        console.log("Error in truncate controller", error);
        res.status(500).json({ message: "Error truncating categories", error: error.message });
    }
}


module.exports = {
    getcategories,
    InsertCategory,
    EditCategory,
    DeleteCategory,
    TruncateData,
}